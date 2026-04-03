import { getProviderWithFallback } from "@/lib/ai/provider-registry";
import {
  TAILOR_RESUME_SYSTEM_PROMPT,
  buildTailorResumeUserPrompt,
} from "@/lib/ai/prompts/tailor-resume";
import type { AiProviderName, StreamChunk } from "@/lib/ai/types";

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

    const userPrompt = buildTailorResumeUserPrompt(resume, jobDescription);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of provider.stream(
            "tailor-resume",
            TAILOR_RESUME_SYSTEM_PROMPT,
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
