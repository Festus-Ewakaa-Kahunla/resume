import type { AiProviderConfig, AiProviderName } from "./types";

export const PROVIDER_CONFIGS: Record<AiProviderName, AiProviderConfig> = {
  anthropic: {
    name: "anthropic",
    displayName: "Claude (Anthropic)",
    apiKeyEnvVar: "ANTHROPIC_API_KEY",
    baseUrl: "https://api.anthropic.com",
    models: {
      "parse-resume": {
        modelId: "claude-sonnet-4-20250514",
        displayName: "Claude Sonnet 4",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "improve-bullet": {
        modelId: "claude-sonnet-4-20250514",
        displayName: "Claude Sonnet 4",
        maxOutputTokens: 2048,
        supportsStreaming: true,
      },
      "tailor-resume": {
        modelId: "claude-sonnet-4-20250514",
        displayName: "Claude Sonnet 4",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "ats-score": {
        modelId: "claude-sonnet-4-20250514",
        displayName: "Claude Sonnet 4",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "generate-section": {
        modelId: "claude-sonnet-4-20250514",
        displayName: "Claude Sonnet 4",
        maxOutputTokens: 2048,
        supportsStreaming: true,
      },
    },
    maxRetries: 2,
    timeoutMs: 30000,
  },
  openai: {
    name: "openai",
    displayName: "GPT (OpenAI)",
    apiKeyEnvVar: "OPENAI_API_KEY",
    baseUrl: "https://api.openai.com/v1",
    models: {
      "parse-resume": {
        modelId: "gpt-4o",
        displayName: "GPT-4o",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "improve-bullet": {
        modelId: "gpt-4o",
        displayName: "GPT-4o",
        maxOutputTokens: 2048,
        supportsStreaming: true,
      },
      "tailor-resume": {
        modelId: "gpt-4o",
        displayName: "GPT-4o",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "ats-score": {
        modelId: "gpt-4o",
        displayName: "GPT-4o",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "generate-section": {
        modelId: "gpt-4o",
        displayName: "GPT-4o",
        maxOutputTokens: 2048,
        supportsStreaming: true,
      },
    },
    maxRetries: 2,
    timeoutMs: 30000,
  },
  gemini: {
    name: "gemini",
    displayName: "Gemini (Google)",
    apiKeyEnvVar: "GEMINI_API_KEY",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    models: {
      "parse-resume": {
        modelId: "gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "improve-bullet": {
        modelId: "gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        maxOutputTokens: 2048,
        supportsStreaming: true,
      },
      "tailor-resume": {
        modelId: "gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "ats-score": {
        modelId: "gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        maxOutputTokens: 8192,
        supportsStreaming: true,
      },
      "generate-section": {
        modelId: "gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        maxOutputTokens: 2048,
        supportsStreaming: true,
      },
    },
    maxRetries: 0,
    timeoutMs: 60000,
  },
  deepseek: {
    name: "deepseek",
    displayName: "DeepSeek",
    apiKeyEnvVar: "DEEPSEEK_API_KEY",
    baseUrl: "https://api.deepseek.com",
    models: {
      "parse-resume": {
        modelId: "deepseek-chat",
        displayName: "DeepSeek Chat",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "improve-bullet": {
        modelId: "deepseek-chat",
        displayName: "DeepSeek Chat",
        maxOutputTokens: 2048,
        supportsStreaming: true,
      },
      "tailor-resume": {
        modelId: "deepseek-chat",
        displayName: "DeepSeek Chat",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "ats-score": {
        modelId: "deepseek-chat",
        displayName: "DeepSeek Chat",
        maxOutputTokens: 4096,
        supportsStreaming: true,
      },
      "generate-section": {
        modelId: "deepseek-chat",
        displayName: "DeepSeek Chat",
        maxOutputTokens: 2048,
        supportsStreaming: true,
      },
    },
    maxRetries: 0,
    timeoutMs: 60000,
  },
};
