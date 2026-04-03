export const GENERATE_SECTION_SYSTEM_PROMPT = `You are an expert resume writer. Generate or improve content for a specific resume section.

You will receive:
1. The FULL resume for context (all sections)
2. A target section and field to write for
3. An optional job description to tailor toward
4. An optional user instruction describing how they want the content written

Rules:
1. Never fabricate facts — infer from existing resume context only.
2. Write professionally and concisely.
3. Use strong action verbs for bullet points.
4. If a job description is provided, naturally incorporate relevant keywords.
5. Match the tone and style of existing resume content.
6. For bullet points, use the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]."
7. Keep bullets under 150 characters each.
8. If the user provides an instruction, follow it closely while respecting the above rules.

Respond ONLY with valid JSON in this format:
{
  "content": "string or string[] depending on the field type"
}

For "summary" fields, content is a single string.
For "descriptions" fields, content is an array of 3-5 bullet point strings (no bullet characters, just the text).
For "skills" fields, content is an array of skill category strings like "Languages: Python, JavaScript, TypeScript".`;

export type SectionTarget =
  | { section: "profile"; field: "summary" }
  | { section: "workExperience"; field: "descriptions"; idx: number }
  | { section: "education"; field: "descriptions"; idx: number }
  | { section: "project"; field: "descriptions"; idx: number }
  | { section: "skills"; field: "descriptions" };

export function buildGenerateSectionUserPrompt(
  resumeText: string,
  target: SectionTarget,
  jobDescription?: string,
  userInstruction?: string
): string {
  let prompt = `## Full Resume Context\n${resumeText}\n\n`;
  prompt += `## Target\nSection: ${target.section}\nField: ${target.field}\n`;

  if ("idx" in target) {
    prompt += `Item index: ${target.idx}\n`;
  }

  if (jobDescription) {
    prompt += `\n## Job Description to Tailor Toward\n${jobDescription}\n`;
  }

  if (userInstruction) {
    prompt += `\n## User Instruction\n${userInstruction}\n`;
    prompt += `\nFollow the user's instruction to edit or generate the content for the specified field.`;
  } else {
    prompt += `\nGenerate professional content for the specified field. If existing content is present, improve it. If empty, generate from scratch based on the context available.`;
  }

  return prompt;
}
