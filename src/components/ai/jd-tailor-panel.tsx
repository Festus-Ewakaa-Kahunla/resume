"use client";

import { useAiFeature } from "@/hooks/use-ai-feature";
import { StreamingText } from "@/components/ai/streaming-text";
import { Button } from "@/components/ui/button";
import type { Resume } from "@/types/resume";
import type { TailorResumeResponse } from "@/lib/ai/types";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface JdTailorPanelProps {
  resume: Resume;
  jobDescription: string;
  onApply: (tailoredResume: Resume) => void;
}

export function JdTailorPanel({ resume, jobDescription, onApply }: JdTailorPanelProps) {
  const { execute, isLoading, streamedText, data, error } =
    useAiFeature<TailorResumeResponse>();

  const handleTailor = () => {
    execute("/api/ai/tailor-resume", { resume, jobDescription });
  };

  const handleApply = () => {
    if (data?.tailoredResume) {
      onApply(data.tailoredResume);
    }
  };

  const showStreaming = isLoading && !data;

  return (
    <div className="space-y-4">
      {!data && !isLoading && !error && (
        <Button
          onClick={handleTailor}
          disabled={!jobDescription.trim()}
          size="md"
        >
          Tailor Resume
        </Button>
      )}

      {showStreaming && <StreamingText text={streamedText} isStreaming />}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTailor}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {data && (
        <div className="space-y-5">
          {data.changes.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-zinc-500">
                Changes ({data.changes.length})
              </p>
              {data.changes.map((change, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
                >
                  <p className="text-xs text-zinc-500">
                    {change.section} &middot; {change.field}
                  </p>
                  <div className="mt-2 flex items-start gap-2">
                    <p className="flex-1 rounded bg-red-500/10 px-2 py-1 text-xs text-red-400 line-through">
                      {change.original}
                    </p>
                    <ArrowRightIcon className="mt-1 h-3 w-3 shrink-0 text-zinc-600" />
                    <p className="flex-1 rounded bg-green-500/10 px-2 py-1 text-xs text-green-400">
                      {change.modified}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">{change.reason}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-6">
            {data.keywordsAdded.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500">
                  Keywords Added
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.keywordsAdded.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-md border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs text-green-400"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.keywordsAlreadyPresent.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500">
                  Already Present
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.keywordsAlreadyPresent.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border-t border-zinc-800 pt-4">
            <Button onClick={handleApply} size="md">
              Apply Changes
            </Button>
            <Button variant="secondary" size="sm" onClick={handleTailor}>
              Re-tailor
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
