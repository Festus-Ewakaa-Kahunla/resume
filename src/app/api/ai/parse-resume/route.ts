import { NextResponse } from "next/server";
import { getProviderWithFallback } from "@/lib/ai/provider-registry";
import {
  PARSE_RESUME_SYSTEM_PROMPT,
  buildParseResumeUserPrompt,
} from "@/lib/ai/prompts/parse-resume";
import { parseJsonResponse } from "@/lib/ai/response-parsers";
import type { AiImageInput, AiProviderName } from "@/lib/ai/types";
import type { Resume } from "@/types/resume";

const VISION_INSTRUCTION =
  "Read the attached resume image and extract all structured data exactly as specified.";

export async function POST(request: Request) {
  try {
    const {
      rawText,
      image,
      provider: preferredProvider,
      apiKeys,
    } = await request.json();

    const hasText = typeof rawText === "string" && rawText.trim().length > 0;
    const hasImage =
      image &&
      typeof image.base64 === "string" &&
      typeof image.mimeType === "string";

    if (!hasText && !hasImage) {
      return NextResponse.json(
        { error: "rawText or image is required" },
        { status: 400 }
      );
    }

    const provider = getProviderWithFallback(
      (preferredProvider as AiProviderName) ?? "gemini",
      apiKeys ?? {}
    );

    const userPrompt = hasText
      ? buildParseResumeUserPrompt(rawText)
      : VISION_INSTRUCTION;

    const imageInput: AiImageInput | undefined = hasImage
      ? { mimeType: image.mimeType, base64: image.base64 }
      : undefined;

    const response = await provider.complete(
      "parse-resume",
      PARSE_RESUME_SYSTEM_PROMPT,
      userPrompt,
      imageInput
    );

    const resume = parseJsonResponse<Resume>(response.text, provider.name);

    if (!Array.isArray(resume.publications)) {
      resume.publications = [];
    }

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
