export const DEFAULT_RETRY_AFTER_MS = 60_000;

export class AiError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly statusCode?: number,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = "AiError";
  }
}

export class AiRateLimitError extends AiError {
  constructor(
    provider: string,
    public readonly retryAfterMs: number
  ) {
    super(`Rate limit exceeded for ${provider}`, provider, 429, true);
    this.name = "AiRateLimitError";
  }
}

export class AiAuthenticationError extends AiError {
  constructor(provider: string) {
    super(`Authentication failed for ${provider}`, provider, 401, false);
    this.name = "AiAuthenticationError";
  }
}

export class AiResponseParseError extends AiError {
  constructor(
    provider: string,
    public readonly rawResponse: string
  ) {
    super(`Failed to parse response from ${provider}`, provider, undefined, true);
    this.name = "AiResponseParseError";
  }
}
