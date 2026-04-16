import { PROVIDER_CONFIGS } from "@/lib/ai/config";
import { OpenAiCompatibleProvider } from "./openai-compatible";

export class OpenAiProvider extends OpenAiCompatibleProvider {
  constructor(apiKeyOverride?: string) {
    super(PROVIDER_CONFIGS.openai, apiKeyOverride);
  }

  protected override supportsVision(): boolean {
    return true;
  }
}
