"use client";

import { useState, useCallback, useRef } from "react";
import { useApiKeysStore } from "@/stores/api-keys-store";

interface UseAiFeatureOptions {
  onComplete?: (fullText: string) => void;
}

export function useAiFeature<T = unknown>(options: UseAiFeatureOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      abortRef.current?.abort();

      setIsLoading(true);
      setStreamedText("");
      setData(null);
      setError(null);

      abortRef.current = new AbortController();

      try {
        const { apiKeys, activeProvider } = useApiKeysStore.getState();
        const filteredKeys = Object.fromEntries(
          Object.entries(apiKeys).filter(([, v]) => v && v.trim().length > 0)
        );

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            apiKeys: filteredKeys,
            provider: body.provider ?? activeProvider,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const text = await response.text();
          let message = "Request failed";
          try {
            const err = JSON.parse(text);
            message = err.error || message;
          } catch {
            if (text) message = text;
          }
          throw new Error(message);
        }

        const contentType = response.headers.get("content-type") ?? "";

        // Non-streaming JSON response (e.g., parse-resume)
        if (contentType.includes("application/json")) {
          const json = await response.json();
          setData(json as T);
          setIsLoading(false);
          return json as T;
        }

        // SSE streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6);
            if (!jsonStr.trim()) continue;

            try {
              const chunk = JSON.parse(jsonStr);

              if (chunk.type === "text-delta" && chunk.content) {
                accumulated += chunk.content;
                setStreamedText(accumulated);
              } else if (chunk.type === "error") {
                setError(chunk.error);
              } else if (chunk.type === "done") {
                options.onComplete?.(accumulated);
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        // Try to parse the accumulated text as JSON for the final result
        const parsed = extractJson<T>(accumulated);
        if (parsed) {
          setData(parsed);
          setIsLoading(false);
          return parsed;
        }

        setError("Failed to parse AI response. Please try again.");
        setIsLoading(false);
        return null;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return null;
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        setIsLoading(false);
        return null;
      }
    },
    [options]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  return { execute, isLoading, streamedText, data, error, abort };
}

function extractJson<T>(text: string): T | null {
  // Strategy 1: Try parsing the whole text directly
  try {
    return JSON.parse(text.trim()) as T;
  } catch {}

  // Strategy 2: Extract from markdown code block (greedy to catch full JSON)
  const codeBlockMatch = text.match(/```(?:json)?\s*\n([\s\S]*)\n\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {}
  }

  // Strategy 3: Find the first { and last } to extract the JSON object
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1)) as T;
    } catch {}
  }

  // Strategy 4: Find the first [ and last ] for arrays
  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(text.slice(firstBracket, lastBracket + 1)) as T;
    } catch {}
  }

  return null;
}
