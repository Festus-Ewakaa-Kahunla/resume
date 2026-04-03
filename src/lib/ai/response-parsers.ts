import { AiResponseParseError } from "./errors";

function extractJson(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) return fenceMatch[1].trim();
  return text.trim();
}

export function parseJsonResponse<T>(
  text: string,
  providerName: string
): T {
  const jsonStr = extractJson(text);

  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    throw new AiResponseParseError(providerName, text);
  }
}
