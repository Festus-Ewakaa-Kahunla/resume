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
import type { ResumeWorkExperience } from "@/types/resume";

export const WorkExperiencesForm = () => {
  const workExperiences = useResumeStore(
    (state) => state.resume.workExperiences
  );
  const changeWorkExperiences = useResumeStore(
    (state) => state.changeWorkExperiences
  );

  const showDelete = workExperiences.length > 1;

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          changeWorkExperiences({ idx, field, value } as Parameters<typeof changeWorkExperiences>[0]);
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        return (
          <WorkExperienceItem
            key={idx}
            idx={idx}
            company={company}
            jobTitle={jobTitle}
            date={date}
            descriptions={descriptions}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            onChange={handleWorkExperienceChange}
            onChangeDescriptions={changeWorkExperiences}
          />
        );
      })}
    </Form>
  );
};

function WorkExperienceItem({
  idx,
  company,
  jobTitle,
  date,
  descriptions,
  showMoveUp,
  showMoveDown,
  showDelete,
  onChange,
  onChangeDescriptions,
}: {
  idx: number;
  company: string;
  jobTitle: string;
  date: string;
  descriptions: string[];
  showMoveUp: boolean;
  showMoveDown: boolean;
  showDelete: boolean;
  onChange: (...args: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>) => void;
  onChangeDescriptions: (payload: { idx: number; field: "descriptions"; value: string[] }) => void;
}) {
  const handleAiGenerated = useCallback(
    (content: string | string[]) => {
      const bullets = Array.isArray(content) ? content : [content];
      onChangeDescriptions({ idx, field: "descriptions", value: bullets });
    },
    [idx, onChangeDescriptions]
  );

  return (
    <FormSection
      form="workExperiences"
      idx={idx}
      showMoveUp={showMoveUp}
      showMoveDown={showMoveDown}
      showDelete={showDelete}
    >
      <FormInput
        label="Company"
        labelClassName="col-span-full"
        name="company"
        placeholder="Khan Academy"
        value={company}
        onChange={onChange}
      />
      <FormInput
        label="Job Title"
        labelClassName="col-span-4"
        name="jobTitle"
        placeholder="Software Engineer"
        value={jobTitle}
        onChange={onChange}
      />
      <FormInput
        label="Date"
        labelClassName="col-span-2"
        name="date"
        placeholder="Jun 2022 - Present"
        value={date}
        onChange={onChange}
      />
      <div className="col-span-full">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-400">Description</span>
          <AiWriteButton
            target={{ section: "workExperience", field: "descriptions", idx }}
            onGenerated={handleAiGenerated}
          />
        </div>
        <BulletListTextarea
          label=""
          labelClassName="col-span-full"
          name="descriptions"
          placeholder="Bullet points"
          value={descriptions}
          onChange={onChange}
        />
      </div>
    </FormSection>
  );
}
