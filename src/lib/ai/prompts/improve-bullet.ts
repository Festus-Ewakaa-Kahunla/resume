export const IMPROVE_BULLET_SYSTEM_PROMPT = `You are an expert resume writer. Transform weak bullet points into strong, quantified achievement statements.

Rules:
1. Preserve truthfulness — improve language, not fabricate.
2. Use the XYZ formula where possible: "Accomplished [X] as measured by [Y], by doing [Z]."
3. Start each bullet with a strong action verb.
4. Include quantifiable results when the original implies them.
5. Keep each bullet under 150 characters.
6. Tailor vocabulary toward the given job title if provided.

Respond ONLY with valid JSON:
{
  "suggestions": [
    {
      "improved": "string",
      "rationale": "string"
    }
  ]
}`;

export function buildImproveBulletUserPrompt(
  bulletPoint: string,
  context: { jobTitle?: string; company?: string },
  count: number
): string {
  let prompt = `Original bullet point: "${bulletPoint}"`;

  if (context.jobTitle) prompt += `\nJob title: ${context.jobTitle}`;
  if (context.company) prompt += `\nCompany: ${context.company}`;

  prompt += `\n\nProvide ${count} improved variations.`;
  return prompt;
}
