"use client";

import { useAiFeature } from "@/hooks/use-ai-feature";
import { StreamingText } from "@/components/ai/streaming-text";
import { Button } from "@/components/ui/button";
import type { ImproveBulletResponse } from "@/lib/ai/types";
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface BulletImproverDialogProps {
  bulletPoint: string;
  context: { jobTitle?: string; company?: string };
  onSelect: (improved: string) => void;
  onClose: () => void;
}

export function BulletImproverDialog({
  bulletPoint,
  context,
  onSelect,
  onClose,
}: BulletImproverDialogProps) {
  const { execute, isLoading, streamedText, data, error, abort } =
    useAiFeature<ImproveBulletResponse>();

  const handleImprove = () => {
    execute("/api/ai/improve-bullet", {
      bulletPoint,
      context,
      numberOfSuggestions: 3,
    });
  };

  const hasResults = data?.suggestions && data.suggestions.length > 0;
  const showStreaming = isLoading && !hasResults;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative mx-4 flex max-h-[80vh] w-full max-w-lg flex-col rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-sky-500" />
            <h2 className="text-sm font-medium text-white">Improve with AI</h2>
          </div>
          <button
            onClick={() => {
              abort();
              onClose();
            }}
            className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
            <p className="text-xs text-zinc-500">Original</p>
            <p className="mt-1 text-sm text-zinc-300">{bulletPoint}</p>
          </div>

          {!hasResults && !isLoading && !error && (
            <div className="flex justify-center py-6">
              <Button onClick={handleImprove} size="md">
                <span className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4" />
                  Generate Suggestions
                </span>
              </Button>
            </div>
          )}

          {showStreaming && <StreamingText text={streamedText} isStreaming />}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleImprove}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {hasResults && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-zinc-500">
                Select a suggestion
              </p>
              {data.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelect(suggestion.improved)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-left transition-colors hover:border-sky-500/50 hover:bg-zinc-800"
                >
                  <p className="text-sm text-white">{suggestion.improved}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {suggestion.rationale}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
