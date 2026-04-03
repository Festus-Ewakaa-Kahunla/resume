import { getProviderWithFallback } from "@/lib/ai/provider-registry";
import {
  GENERATE_SECTION_SYSTEM_PROMPT,
  buildGenerateSectionUserPrompt,
} from "@/lib/ai/prompts/generate-section";
import type { SectionTarget } from "@/lib/ai/prompts/generate-section";
import { serializeResumeForPrompt } from "@/lib/ai/resume-serializer";
import type { AiProviderName, StreamChunk } from "@/lib/ai/types";
import type { Resume } from "@/types/resume";

export async function POST(request: Request) {
  try {
    const {
      resume,
      target,
      jobDescription,
      userInstruction,
      provider: preferredProvider,
      apiKeys,
    } = (await request.json()) as {
      resume: Resume;
      target: SectionTarget;
      jobDescription?: string;
      userInstruction?: string;
      provider?: AiProviderName;
      apiKeys?: Partial<Record<AiProviderName, string>>;
    };

    if (!resume || !target) {
      return new Response(
        JSON.stringify({ error: "resume and target are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const provider = getProviderWithFallback(preferredProvider ?? "gemini", apiKeys ?? {});
    const resumeText = serializeResumeForPrompt(resume);
    const userPrompt = buildGenerateSectionUserPrompt(
      resumeText,
      target,
      jobDescription,
      userInstruction
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of provider.stream(
            "generate-section",
            GENERATE_SECTION_SYSTEM_PROMPT,
            userPrompt
          )) {
            const data = `data: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          controller.close();
        } catch (error) {
          const errorChunk: StreamChunk = {
            type: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
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
