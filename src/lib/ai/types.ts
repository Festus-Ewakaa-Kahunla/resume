import type { Resume } from "@/types/resume";

export const AI_PROVIDERS = ["anthropic", "openai", "gemini", "deepseek"] as const;
export type AiProviderName = (typeof AI_PROVIDERS)[number];

export const AI_FEATURES = [
  "parse-resume",
  "improve-bullet",
  "tailor-resume",
  "ats-score",
  "generate-section",
] as const;
export type AiFeature = (typeof AI_FEATURES)[number];

export interface AiModelConfig {
  modelId: string;
  displayName: string;
  maxOutputTokens: number;
  supportsStreaming: boolean;
}

export interface AiProviderConfig {
  name: AiProviderName;
  displayName: string;
  apiKeyEnvVar: string;
  baseUrl: string;
  models: Record<AiFeature, AiModelConfig>;
  maxRetries: number;
  timeoutMs: number;
}

export interface AiProviderRawResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  finishReason: string;
}

export interface StreamChunk {
  type: "text-delta" | "usage" | "error" | "done";
  content?: string;
  inputTokens?: number;
  outputTokens?: number;
  error?: string;
}

export interface AiProvider {
  readonly name: AiProviderName;
  readonly displayName: string;
  isAvailable(): boolean;
  complete(
    feature: AiFeature,
    systemPrompt: string,
    userPrompt: string
  ): Promise<AiProviderRawResponse>;
  stream(
    feature: AiFeature,
    systemPrompt: string,
    userPrompt: string
  ): AsyncGenerator<StreamChunk>;
}

// Feature-specific response types

export interface ImproveBulletSuggestion {
  improved: string;
  rationale: string;
}

export interface ImproveBulletResponse {
  suggestions: ImproveBulletSuggestion[];
}

export interface ResumeChange {
  section: string;
  field: string;
  original: string;
  modified: string;
  reason: string;
}

export interface TailorResumeResponse {
  tailoredResume: Resume;
  changes: ResumeChange[];
  keywordsAdded: string[];
  keywordsAlreadyPresent: string[];
}

export interface AtsScoreResponse {
  overallScore: number;
  sections: Record<string, number>;
}

export interface ParseResumeResponse {
  resume: Resume;
}
