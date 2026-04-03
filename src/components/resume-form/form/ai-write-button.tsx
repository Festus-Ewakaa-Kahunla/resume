"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useAiFeature } from "@/hooks/use-ai-feature";
import { useResumeStore } from "@/stores/resume-store";
import { useJobDescriptionStore } from "@/stores/job-description-store";
import type { SectionTarget } from "@/lib/ai/prompts/generate-section";

interface AiWriteButtonProps {
  target: SectionTarget;
  onGenerated: (content: string | string[]) => void;
}

export function AiWriteButton({ target, onGenerated }: AiWriteButtonProps) {
  const [mode, setMode] = useState<"closed" | "menu" | "prompt">("closed");
  const [promptText, setPromptText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resume = useResumeStore((s) => s.resume);
  const jobDescription = useJobDescriptionStore((s) => s.jobDescription);
  const { execute, isLoading, abort } = useAiFeature<{ content: string | string[] }>({
    onComplete: () => {},
  });

  useEffect(() => {
    if (mode === "closed") return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!isLoading) setMode("closed");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mode, isLoading]);

  useEffect(() => {
    if (mode === "prompt") inputRef.current?.focus();
  }, [mode]);

  const runAi = useCallback(
    async (instruction?: string) => {
      const result = await execute("/api/ai/generate-section", {
        resume,
        target,
        jobDescription: jobDescription || undefined,
        userInstruction: instruction || undefined,
      });

      if (result?.content) {
        onGenerated(result.content);
      }
      setMode("closed");
      setPromptText("");
    },
    [resume, target, jobDescription, execute, onGenerated]
  );

  const handleGenerate = useCallback(() => {
    setMode("closed");
    runAi();
  }, [runAi]);

  const handleEditSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!promptText.trim()) return;
      setMode("closed");
      runAi(promptText.trim());
    },
    [promptText, runAi]
  );

  if (isLoading) {
    return (
      <button
        type="button"
        onClick={abort}
        className="rounded p-1 animate-pulse text-sky-400 hover:bg-zinc-800"
      >
        <SparklesIcon className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setMode(mode === "closed" ? "menu" : "closed")}
        className="rounded p-1 text-zinc-600 transition-all hover:bg-zinc-800 hover:text-sky-400"
        title="AI assist"
      >
        <SparklesIcon className="h-3.5 w-3.5" />
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl transition-all duration-150 ${
          mode === "menu"
            ? "pointer-events-auto scale-100 opacity-100"
            : mode === "prompt"
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {mode === "menu" && (
          <>
            <button
              type="button"
              onClick={handleGenerate}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <SparklesIcon className="h-3.5 w-3.5 text-sky-400" />
              Generate
            </button>
            <button
              type="button"
              onClick={() => setMode("prompt")}
              className="flex w-full items-center gap-2 border-t border-zinc-800 px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <svg className="h-3.5 w-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              Edit with prompt
            </button>
          </>
        )}

        {mode === "prompt" && (
          <form onSubmit={handleEditSubmit} className="p-2">
            <p className="mb-1.5 text-[10px] text-zinc-500">
              Tell AI how to write this section
            </p>
            <input
              ref={inputRef}
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder='e.g. "make it more technical"'
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:border-sky-500 focus:outline-none"
            />
            <div className="mt-1.5 flex justify-end gap-1">
              <button
                type="button"
                onClick={() => setMode("menu")}
                className="rounded px-2 py-1 text-[10px] text-zinc-500 hover:text-zinc-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!promptText.trim()}
                className="rounded bg-sky-600 px-2 py-1 text-[10px] font-medium text-white transition-colors hover:bg-sky-500 disabled:opacity-40"
              >
                Go
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
