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
import { PROVIDER_CONFIGS } from "@/lib/ai/config";
import { BaseAiProvider } from "./base-provider";

export class AnthropicProvider extends BaseAiProvider {
  constructor(apiKeyOverride?: string) {
    super(PROVIDER_CONFIGS.anthropic, apiKeyOverride);
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

    const userContent = image
      ? [
          {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: image.mimeType,
              data: image.base64,
            },
          },
          { type: "text" as const, text: userPrompt },
        ]
      : userPrompt;

    try {
    const response = await fetch(
      `${this.config.baseUrl}/v1/messages`,
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }],
          max_tokens: modelConfig.maxOutputTokens,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      await this.handleHttpError(response);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";

    return {
      text,
      inputTokens: data.usage?.input_tokens ?? 0,
      outputTokens: data.usage?.output_tokens ?? 0,
      model: modelConfig.modelId,
      finishReason: data.stop_reason ?? "unknown",
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
      `${this.config.baseUrl}/v1/messages`,
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
          max_tokens: modelConfig.maxOutputTokens,
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
    let inputTokens = 0;
    let outputTokens = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let currentEvent = "";

        for (const line of lines) {
          const trimmed = line.trim();

          if (trimmed.startsWith("event: ")) {
            currentEvent = trimmed.slice(7);
            continue;
          }

          if (!trimmed.startsWith("data: ")) continue;

          const payload = trimmed.slice(6);

          try {
            const parsed = JSON.parse(payload);

            if (currentEvent === "content_block_delta") {
              const text = parsed.delta?.text;
              if (text) {
                yield { type: "text-delta", content: text };
              }
            }

            if (currentEvent === "message_start" && parsed.message?.usage) {
              inputTokens = parsed.message.usage.input_tokens ?? inputTokens;
            }

            if (currentEvent === "message_delta") {
              if (parsed.usage) {
                outputTokens = parsed.usage.output_tokens ?? outputTokens;
              }
            }

            if (currentEvent === "message_stop") {
              yield {
                type: "usage",
                inputTokens,
                outputTokens,
              };
              yield { type: "done" };
              return;
            }
          } catch {
            // Skip malformed JSON lines in the stream
          }

          currentEvent = "";
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
