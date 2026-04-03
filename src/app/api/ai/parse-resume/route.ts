import { NextResponse } from "next/server";
import { getProviderWithFallback } from "@/lib/ai/provider-registry";
import {
  PARSE_RESUME_SYSTEM_PROMPT,
  buildParseResumeUserPrompt,
} from "@/lib/ai/prompts/parse-resume";
import { parseJsonResponse } from "@/lib/ai/response-parsers";
import type { AiProviderName } from "@/lib/ai/types";
import type { Resume } from "@/types/resume";

export async function POST(request: Request) {
  try {
    const { rawText, provider: preferredProvider, apiKeys } = await request.json();

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { error: "rawText is required" },
        { status: 400 }
      );
    }

    const provider = getProviderWithFallback(
      (preferredProvider as AiProviderName) ?? "gemini",
      apiKeys ?? {}
    );

    const response = await provider.complete(
      "parse-resume",
      PARSE_RESUME_SYSTEM_PROMPT,
      buildParseResumeUserPrompt(rawText)
    );

    const resume = parseJsonResponse<Resume>(response.text, provider.name);

    return NextResponse.json({
      resume,
      provider: provider.name,
      tokens: {
        input: response.inputTokens,
        output: response.outputTokens,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
