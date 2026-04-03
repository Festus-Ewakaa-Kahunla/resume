import type { Resume } from "@/types/resume";
import { serializeResumeForPrompt } from "../resume-serializer";

export const ATS_SCORE_SYSTEM_PROMPT = `You are an ATS analyst. Score how well a resume matches a job description.

Return scores as numbers from 0 to 100.

Scoring criteria:
- overallScore: weighted average of keyword match (40%), skills alignment (25%), experience relevance (20%), completeness (15%)
- sections: score each resume section individually (e.g. "Work Experience", "Skills", "Education", "Summary")

Respond ONLY with valid JSON (no markdown, no code blocks, no explanation):
{
  "overallScore": number,
  "sections": {
    "Summary": number,
    "Work Experience": number,
    "Skills": number,
    "Education": number
  }
}

Only include sections that exist in the resume.`;

export function buildAtsScoreUserPrompt(
  resume: Resume,
  jobDescription: string
): string {
  return `## RESUME\n${serializeResumeForPrompt(resume)}\n\n## JOB DESCRIPTION\n${jobDescription}\n\nReturn JSON only.`;
}
