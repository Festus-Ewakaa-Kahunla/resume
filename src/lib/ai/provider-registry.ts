import type { AiProvider, AiProviderName } from "./types";
import { PROVIDER_CONFIGS } from "./config";
import { AnthropicProvider } from "./providers/anthropic-provider";
import { OpenAiProvider } from "./providers/openai-provider";
import { GeminiProvider } from "./providers/gemini-provider";
import { DeepSeekProvider } from "./providers/deepseek-provider";

type ApiKeyMap = Partial<Record<AiProviderName, string>>;

const constructors: Record<AiProviderName, new (apiKey?: string) => AiProvider> = {
  anthropic: AnthropicProvider,
  openai: OpenAiProvider,
  gemini: GeminiProvider,
  deepseek: DeepSeekProvider,
};

export function getProvider(name: AiProviderName, apiKey?: string): AiProvider {
  const Constructor = constructors[name];
  return new Constructor(apiKey);
}

const DEFAULT_FALLBACK_ORDER: AiProviderName[] = [
  "gemini",
  "deepseek",
  "anthropic",
  "openai",
];

export function getProviderWithFallback(
  preferred: AiProviderName,
  apiKeys: ApiKeyMap = {}
): AiProvider {
  const preferredProvider = getProvider(preferred, apiKeys[preferred]);
  if (preferredProvider.isAvailable()) {
    return preferredProvider;
  }

  for (const name of DEFAULT_FALLBACK_ORDER) {
    if (name === preferred) continue;
    const provider = getProvider(name, apiKeys[name]);
    if (provider.isAvailable()) {
      return provider;
    }
  }

  throw new Error(
    "No AI provider available. Add an API key in Settings."
  );
}
