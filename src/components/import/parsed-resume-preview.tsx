"use client";

import type { Resume } from "@/types/resume";

interface ParsedResumePreviewProps {
  resume: Resume;
}

export function ParsedResumePreview({ resume }: ParsedResumePreviewProps) {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <Section title="Profile">
        <Field label="Name" value={resume.profile.name} />
        <Field label="Email" value={resume.profile.email} />
        <Field label="Phone" value={resume.profile.phone} />
        <Field label="Location" value={resume.profile.location} />
        <Field label="URL" value={resume.profile.url} />
        {resume.profile.summary && (
          <Field label="Summary" value={resume.profile.summary} />
        )}
      </Section>

      {resume.workExperiences.length > 0 && (
        <Section title="Work Experience">
          {resume.workExperiences.map((exp, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="text-sm text-white">
                {exp.jobTitle}
                {exp.company && (
                  <span className="text-zinc-500"> at {exp.company}</span>
                )}
              </p>
              {exp.date && (
                <p className="text-xs text-zinc-600">{exp.date}</p>
              )}
              {exp.descriptions.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {exp.descriptions.map((desc, j) => (
                    <li key={j} className="text-xs text-zinc-400">
                      &bull; {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.educations.length > 0 && (
        <Section title="Education">
          {resume.educations.map((edu, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="text-sm text-white">{edu.school}</p>
              <p className="text-xs text-zinc-400">
                {edu.degree}
                {edu.gpa && ` - GPA: ${edu.gpa}`}
              </p>
              {edu.date && (
                <p className="text-xs text-zinc-600">{edu.date}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.projects.length > 0 && (
        <Section title="Projects">
          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="text-sm text-white">{proj.project}</p>
              {proj.descriptions.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {proj.descriptions.map((desc, j) => (
                    <li key={j} className="text-xs text-zinc-400">
                      &bull; {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.publications && resume.publications.length > 0 && (
        <Section title="Publications">
          {resume.publications
            .filter((pub) => pub.title || pub.authors)
            .map((pub, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <p className="text-sm text-white">{pub.title}</p>
                {(pub.authors || pub.venue) && (
                  <p className="text-xs text-zinc-400">
                    {[pub.authors, pub.venue].filter(Boolean).join(" — ")}
                  </p>
                )}
                {pub.date && (
                  <p className="text-xs text-zinc-600">{pub.date}</p>
                )}
              </div>
            ))}
        </Section>
      )}

      {resume.skills.descriptions.length > 0 && (
        <Section title="Skills">
          {resume.skills.descriptions.map((desc, i) => (
            <p key={i} className="text-xs text-zinc-400">
              &bull; {desc}
            </p>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p className="text-xs">
      <span className="text-zinc-600">{label}: </span>
      <span className="text-zinc-300">{value}</span>
    </p>
  );
}
