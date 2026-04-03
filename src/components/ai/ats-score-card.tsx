"use client";

import { useAiFeature } from "@/hooks/use-ai-feature";
import { Button } from "@/components/ui/button";
import type { Resume } from "@/types/resume";
import type { AtsScoreResponse } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

interface AtsScoreCardProps {
  resume: Resume;
  jobDescription: string;
}

function scoreColor(score: number): string {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className={cn("text-xs font-medium tabular-nums", scoreColor(score))}>
          {Math.round(score)}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-800">
        <div
          className={cn("h-1.5 rounded-full transition-all duration-500", scoreBg(score))}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function AtsScoreCard({ resume, jobDescription }: AtsScoreCardProps) {
  const { execute, isLoading, data, error } =
    useAiFeature<AtsScoreResponse>();

  const handleCheck = () => {
    execute("/api/ai/ats-score", { resume, jobDescription });
  };

  return (
    <div className="space-y-4">
      {!data && !isLoading && !error && (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-center text-sm text-zinc-500">
            Check how well your resume matches the job description.
          </p>
          <Button
            onClick={handleCheck}
            disabled={!jobDescription.trim()}
            size="md"
          >
            Check ATS Score
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
          <span className="ml-3 text-sm text-zinc-400">Analyzing...</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCheck}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {data && (
        <div className="space-y-5">
          {/* Overall Score */}
          <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <span
              className={cn(
                "text-4xl font-bold tabular-nums",
                scoreColor(data.overallScore)
              )}
            >
              {Math.round(data.overallScore)}
            </span>
            <div>
              <p className="text-sm font-medium text-white">ATS Score</p>
              <p className="text-xs text-zinc-500">out of 100</p>
            </div>
          </div>

          {/* Section Scores */}
          <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-xs font-medium text-zinc-500">Sections</p>
            {Object.entries(data.sections).map(([section, score]) => (
              <ScoreBar key={section} label={section} score={score} />
            ))}
          </div>

          <Button variant="secondary" size="sm" onClick={handleCheck} className="w-full">
            Re-check
          </Button>
        </div>
      )}
    </div>
  );
}
