import type {
  AiFeature,
  AiImageInput,
  AiProviderRawResponse,
  StreamChunk,
} from "@/lib/ai/types";
import {
  AiAuthenticationError,
  AiError,
  AiRateLimitError,
  DEFAULT_RETRY_AFTER_MS,
} from "@/lib/ai/errors";
import { BaseAiProvider } from "./base-provider";

export abstract class OpenAiCompatibleProvider extends BaseAiProvider {
  /** Whether this provider's models can accept image input. */
  protected supportsVision(): boolean {
    return false;
  }

  protected async executeComplete(
    feature: AiFeature,
    systemPrompt: string,
    userPrompt: string,
    image?: AiImageInput
  ): Promise<AiProviderRawResponse> {
    const modelConfig = this.getModelConfig(feature);
    const apiKey = this.getApiKey();
    const { controller, clearTimeout } = this.createAbortController();

    if (image && !this.supportsVision()) {
      throw new AiError(
        `${this.displayName} does not support image input. Switch to Gemini, Claude, or GPT-4o for vision.`,
        this.name,
        undefined,
        false
      );
    }

    const userMessageContent =
      image && this.supportsVision()
        ? [
            {
              type: "image_url" as const,
              image_url: {
                url: `data:${image.mimeType};base64,${image.base64}`,
              },
            },
            { type: "text" as const, text: userPrompt },
          ]
        : userPrompt;

    try {
    const response = await fetch(
      `${this.config.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessageContent },
          ],
          max_tokens: modelConfig.maxOutputTokens,
          temperature: 0.7,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      await this.handleHttpError(response);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    return {
      text: content,
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0,
      model: modelConfig.modelId,
      finishReason: data.choices?.[0]?.finish_reason ?? "unknown",
    };
    } finally {
      clearTimeout();
    }
  }

  protected async *executeStream(
    feature: AiFeature,
    systemPrompt: string,
    userPrompt: string
  ): AsyncGenerator<StreamChunk> {
    const modelConfig = this.getModelConfig(feature);
    const apiKey = this.getApiKey();
    const { controller, clearTimeout } = this.createAbortController();

    const response = await fetch(
      `${this.config.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: modelConfig.maxOutputTokens,
          temperature: 0.7,
          stream: true,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      await this.handleHttpError(response);
    }

    if (!response.body) {
      throw new AiError(
        "Response body is null",
        this.name,
        undefined,
        true
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const payload = trimmed.slice(6);
          if (payload === "[DONE]") {
            yield {
              type: "usage",
              inputTokens: totalInputTokens,
              outputTokens: totalOutputTokens,
            };
            yield { type: "done" };
            return;
          }

          try {
            const parsed = JSON.parse(payload);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              yield { type: "text-delta", content: deltaContent };
            }

            if (parsed.usage) {
              totalInputTokens = parsed.usage.prompt_tokens ?? totalInputTokens;
              totalOutputTokens = parsed.usage.completion_tokens ?? totalOutputTokens;
            }
          } catch {
            // Skip malformed JSON lines in the stream
          }
        }
      }
    } finally {
      reader.releaseLock();
      clearTimeout();
    }

    yield { type: "done" };
  }

  private async handleHttpError(response: Response): Promise<never> {
    if (response.status === 401) {
      throw new AiAuthenticationError(this.name);
    }

    if (response.status === 429) {
      const retryAfterHeader = response.headers.get("retry-after");
      const retryAfterMs = retryAfterHeader
        ? parseInt(retryAfterHeader, 10) * 1000
        : DEFAULT_RETRY_AFTER_MS;
      throw new AiRateLimitError(this.name, retryAfterMs);
    }

    const body = await response.text().catch(() => "Unknown error");
    throw new AiError(
      `HTTP ${response.status}: ${body}`,
      this.name,
      response.status,
      response.status >= 500
    );
  }
}
