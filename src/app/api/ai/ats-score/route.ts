import { getProviderWithFallback } from "@/lib/ai/provider-registry";
import {
  ATS_SCORE_SYSTEM_PROMPT,
  buildAtsScoreUserPrompt,
} from "@/lib/ai/prompts/ats-scorer";
import { parseJsonResponse } from "@/lib/ai/response-parsers";
import type { AiProviderName } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const { resume, jobDescription, provider: preferredProvider, apiKeys } =
      await request.json();

    if (!resume || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "resume and jobDescription are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const provider = getProviderWithFallback(
      (preferredProvider as AiProviderName) ?? "gemini",
      apiKeys ?? {}
    );

    const userPrompt = buildAtsScoreUserPrompt(resume, jobDescription);

    const result = await provider.complete(
      "ats-score",
      ATS_SCORE_SYSTEM_PROMPT,
      userPrompt
    );

    const parsed = parseJsonResponse(result.text, provider.name);

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
