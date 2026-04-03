import type {
  AiFeature,
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

export class GeminiProvider extends BaseAiProvider {
  constructor(apiKeyOverride?: string) {
    super(PROVIDER_CONFIGS.gemini, apiKeyOverride);
  }

  protected async executeComplete(
    feature: AiFeature,
    systemPrompt: string,
    userPrompt: string
  ): Promise<AiProviderRawResponse> {
    const modelConfig = this.getModelConfig(feature);
    const apiKey = this.getApiKey();
    const { controller, clearTimeout } = this.createAbortController();

    try {
    const url = `${this.config.baseUrl}/models/${modelConfig.modelId}:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: modelConfig.maxOutputTokens,
          temperature: 0.3,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      await this.handleHttpError(response);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return {
      text,
      inputTokens: data.usageMetadata?.promptTokenCount ?? 0,
      outputTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
      model: modelConfig.modelId,
      finishReason: data.candidates?.[0]?.finishReason ?? "unknown",
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

    const url = `${this.config.baseUrl}/models/${modelConfig.modelId}:streamGenerateContent?alt=sse`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: modelConfig.maxOutputTokens,
          temperature: 0.3,
        },
      }),
      signal: controller.signal,
    });

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

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          const payload = trimmed.slice(6);

          try {
            const parsed = JSON.parse(payload);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
              yield { type: "text-delta", content: text };
            }

            if (parsed.usageMetadata) {
              inputTokens = parsed.usageMetadata.promptTokenCount ?? inputTokens;
              outputTokens = parsed.usageMetadata.candidatesTokenCount ?? outputTokens;
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

    yield {
      type: "usage",
      inputTokens,
      outputTokens,
    };
    yield { type: "done" };
  }

  private async handleHttpError(response: Response): Promise<never> {
    if (response.status === 401 || response.status === 403) {
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
