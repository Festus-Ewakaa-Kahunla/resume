import type { Resume } from "@/types/resume";

export function serializeResumeForPrompt(resume: Resume): string {
  const sections: string[] = [];

  const { profile } = resume;
  sections.push(
    [
      "## PROFILE",
      `Name: ${profile.name}`,
      `Email: ${profile.email}`,
      `Phone: ${profile.phone}`,
      `Location: ${profile.location}`,
      `URL: ${profile.url}`,
      `Summary: ${profile.summary}`,
    ].join("\n")
  );

  if (resume.workExperiences.length > 0) {
    const items = resume.workExperiences.map((we) => {
      const bullets = we.descriptions.map((d) => `  - ${d}`).join("\n");
      return `Company: ${we.company}\nJob Title: ${we.jobTitle}\nDate: ${we.date}\n${bullets}`;
    });
    sections.push(`## WORK EXPERIENCE\n${items.join("\n\n")}`);
  }

  if (resume.educations.length > 0) {
    const items = resume.educations.map((ed) => {
      const bullets = ed.descriptions.map((d) => `  - ${d}`).join("\n");
      return `School: ${ed.school}\nDegree: ${ed.degree}\nGPA: ${ed.gpa}\nDate: ${ed.date}\n${bullets}`;
    });
    sections.push(`## EDUCATION\n${items.join("\n\n")}`);
  }

  if (resume.projects.length > 0) {
    const items = resume.projects.map((proj) => {
      const bullets = proj.descriptions.map((d) => `  - ${d}`).join("\n");
      return `Project: ${proj.project}\nDate: ${proj.date}\n${bullets}`;
    });
    sections.push(`## PROJECTS\n${items.join("\n\n")}`);
  }

  if (resume.publications && resume.publications.length > 0) {
    const items = resume.publications
      .filter((pub) => pub.title || pub.authors || pub.venue)
      .map((pub) => {
        const bullets = pub.descriptions.map((d) => `  - ${d}`).join("\n");
        return `Title: ${pub.title}\nAuthors: ${pub.authors}\nVenue: ${pub.venue}\nDate: ${pub.date}\nURL: ${pub.url}\n${bullets}`;
      });
    if (items.length > 0) {
      sections.push(`## PUBLICATIONS\n${items.join("\n\n")}`);
    }
  }

  if (
    resume.skills.featuredSkills.some((s) => s.skill) ||
    resume.skills.descriptions.length > 0
  ) {
    const parts: string[] = [];
    const featured = resume.skills.featuredSkills
      .filter((s) => s.skill.trim())
      .map((s) => `${s.skill} (${s.rating}/4)`)
      .join(", ");
    if (featured) parts.push(`Featured: ${featured}`);
    if (resume.skills.descriptions.length > 0) {
      parts.push(resume.skills.descriptions.map((d) => `  - ${d}`).join("\n"));
    }
    sections.push(`## SKILLS\n${parts.join("\n")}`);
  }

  return sections.join("\n\n---\n\n");
}

export function serializeResumeAsJson(resume: Resume): string {
  return JSON.stringify(resume, null, 2);
}
