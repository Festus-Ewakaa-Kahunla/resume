"use client";

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
}

export function StreamingText({ text, isStreaming }: StreamingTextProps) {
  if (!text && !isStreaming) return null;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-zinc-300">
        {text}
        {isStreaming && (
          <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-sky-500" />
        )}
      </pre>
    </div>
  );
}
