import { PROVIDER_CONFIGS } from "@/lib/ai/config";
import { OpenAiCompatibleProvider } from "./openai-compatible";

export class DeepSeekProvider extends OpenAiCompatibleProvider {
  constructor(apiKeyOverride?: string) {
    super(PROVIDER_CONFIGS.deepseek, apiKeyOverride);
  }
}
