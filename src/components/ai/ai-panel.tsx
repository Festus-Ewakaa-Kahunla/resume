"use client";

import { useResumeStore } from "@/stores/resume-store";
import { useJobDescriptionStore } from "@/stores/job-description-store";
import { AtsScoreCard } from "@/components/ai/ats-score-card";
import { JdTailorPanel } from "@/components/ai/jd-tailor-panel";
import type { Resume } from "@/types/resume";

export function AiPanel() {
  const jobDescription = useJobDescriptionStore((s) => s.jobDescription);
  const setJobDescription = useJobDescriptionStore((s) => s.setJobDescription);
  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);

  const handleApplyTailored = (tailoredResume: Resume) => {
    setResume(tailoredResume);
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-900">
      <div className="p-5 space-y-5">
        {/* Job Description — always visible at top */}
        <div>
          <label
            htmlFor="jd-textarea"
            className="mb-1.5 block text-xs font-medium text-zinc-500"
          >
            Job Description
          </label>
          <textarea
            id="jd-textarea"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={4}
            className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
        </div>

        {/* Tailor Resume */}
        <JdTailorPanel
          resume={resume}
          jobDescription={jobDescription}
          onApply={handleApplyTailored}
        />

        {/* ATS Score */}
        <div className="border-t border-zinc-800 pt-4">
          <AtsScoreCard resume={resume} jobDescription={jobDescription} />
        </div>
      </div>
    </div>
  );
}
