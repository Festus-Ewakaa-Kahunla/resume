"use client";

import { useCallback } from "react";
import { Form, FormSection } from "@/components/resume-form/form";
import {
  FormInput,
  BulletListTextarea,
} from "@/components/resume-form/form/input-group";
import { AiWriteButton } from "@/components/resume-form/form/ai-write-button";
import type { CreateHandleChangeArgsWithDescriptions } from "@/components/resume-form/types";
import { useResumeStore } from "@/stores/resume-store";
import type { ResumeProject } from "@/types/resume";

export const ProjectsForm = () => {
  const projects = useResumeStore((state) => state.resume.projects);
  const changeProjects = useResumeStore((state) => state.changeProjects);

  const showDelete = projects.length > 1;

  return (
    <Form form="projects" addButtonText="Add Project">
      {projects.map(({ project, date, descriptions }, idx) => {
        const handleProjectChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeProject>
        ) => {
          changeProjects({ idx, field, value } as Parameters<typeof changeProjects>[0]);
        };

        const handleAiGenerated = (content: string | string[]) => {
          const bullets = Array.isArray(content) ? content : [content];
          changeProjects({ idx, field: "descriptions", value: bullets });
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
          >
            <FormInput
              name="project"
              label="Project Name"
              placeholder="My Project"
              value={project}
              onChange={handleProjectChange}
              labelClassName="col-span-4"
            />
            <FormInput
              name="date"
              label="Date"
              placeholder="Winter 2022"
              value={date}
              onChange={handleProjectChange}
              labelClassName="col-span-2"
            />
            <div className="col-span-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">Description</span>
                <AiWriteButton
                  target={{ section: "project", field: "descriptions", idx }}
                  onGenerated={handleAiGenerated}
                />
              </div>
              <BulletListTextarea
                label=""
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleProjectChange}
              />
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
