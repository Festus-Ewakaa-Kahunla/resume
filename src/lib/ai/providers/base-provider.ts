import type {
  AiFeature,
  AiImageInput,
  AiModelConfig,
  AiProvider,
  AiProviderConfig,
  AiProviderName,
  AiProviderRawResponse,
  StreamChunk,
} from "@/lib/ai/types";
import {
  AiAuthenticationError,
  AiError,
  AiRateLimitError,
} from "@/lib/ai/errors";

export abstract class BaseAiProvider implements AiProvider {
  readonly name: AiProviderName;
  readonly displayName: string;
  protected readonly config: AiProviderConfig;

  private readonly apiKeyOverride?: string;

  constructor(config: AiProviderConfig, apiKeyOverride?: string) {
    this.config = config;
    this.name = config.name;
    this.displayName = config.displayName;
    this.apiKeyOverride = apiKeyOverride;
  }

  isAvailable(): boolean {
    if (this.apiKeyOverride && this.apiKeyOverride.length > 0) return true;
    return typeof process.env[this.config.apiKeyEnvVar] === "string"
      && process.env[this.config.apiKeyEnvVar]!.length > 0;
  }

  protected getApiKey(): string {
    const key = this.apiKeyOverride || process.env[this.config.apiKeyEnvVar];
    if (!key) {
      throw new AiAuthenticationError(this.name);
    }
    return key;
  }

  protected getModelConfig(feature: AiFeature): AiModelConfig {
    return this.config.models[feature];
  }

  async complete(
    feature: AiFeature,
    systemPrompt: string,
    userPrompt: string,
    image?: AiImageInput
  ): Promise<AiProviderRawResponse> {
    let lastError: AiError | undefined;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await this.executeComplete(feature, systemPrompt, userPrompt, image);
      } catch (error) {
        if (error instanceof AiAuthenticationError) {
          throw error;
        }

        if (error instanceof AiRateLimitError) {
          lastError = error;
          if (attempt < this.config.maxRetries) {
            await this.sleep(error.retryAfterMs);
            continue;
          }
          throw error;
        }

        if (error instanceof AiError) {
          lastError = error;
          if (!error.retryable || attempt >= this.config.maxRetries) {
            throw error;
          }
          const backoffMs = Math.min(1000 * Math.pow(2, attempt), 16000);
          await this.sleep(backoffMs);
          continue;
        }

        throw error;
      }
    }

    throw lastError ?? new AiError(
      "Max retries exceeded",
      this.name,
      undefined,
      false
    );
  }

  async *stream(
    feature: AiFeature,
    systemPrompt: string,
    userPrompt: string
  ): AsyncGenerator<StreamChunk> {
    yield* this.executeStream(feature, systemPrompt, userPrompt);
  }

  protected abstract executeComplete(
    feature: AiFeature,
    systemPrompt: string,
    userPrompt: string,
    image?: AiImageInput
  ): Promise<AiProviderRawResponse>;

  protected abstract executeStream(
    feature: AiFeature,
    systemPrompt: string,
    userPrompt: string
  ): AsyncGenerator<StreamChunk>;

  protected createAbortController(): { controller: AbortController; clearTimeout: () => void } {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.config.timeoutMs);
    return { controller, clearTimeout: () => clearTimeout(id) };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
