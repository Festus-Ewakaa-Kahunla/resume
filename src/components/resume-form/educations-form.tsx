"use client";

import { useCallback } from "react";
import { Form, FormSection } from "@/components/resume-form/form";
import {
  BulletListTextarea,
  FormInput,
} from "@/components/resume-form/form/input-group";
import { BulletListIconButton } from "@/components/resume-form/form/icon-button";
import { AiWriteButton } from "@/components/resume-form/form/ai-write-button";
import type { CreateHandleChangeArgsWithDescriptions } from "@/components/resume-form/types";
import { useResumeStore } from "@/stores/resume-store";
import { useSettingsStore } from "@/stores/settings-store";
import type { ResumeEducation } from "@/types/resume";

export const EducationsForm = () => {
  const educations = useResumeStore((state) => state.resume.educations);
  const changeEducations = useResumeStore((state) => state.changeEducations);
  const showBulletPoints = useSettingsStore(
    (state) => state.settings.showBulletPoints.educations
  );
  const changeShowBulletPoints = useSettingsStore(
    (state) => state.changeShowBulletPoints
  );

  const showDelete = educations.length > 1;
  const form = "educations";

  return (
    <Form form={form} addButtonText="Add School">
      {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
        const handleEducationChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeEducation>
        ) => {
          changeEducations({ idx, field, value } as Parameters<typeof changeEducations>[0]);
        };

        const handleShowBulletPoints = (value: boolean) => {
          changeShowBulletPoints(form, value);
        };

        const handleAiGenerated = (content: string | string[]) => {
          const bullets = Array.isArray(content) ? content : [content];
          changeEducations({ idx, field: "descriptions", value: bullets });
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== educations.length - 1;

        return (
          <FormSection
            key={idx}
            form="educations"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
          >
            <FormInput
              label="School"
              labelClassName="col-span-4"
              name="school"
              placeholder="Cornell University"
              value={school}
              onChange={handleEducationChange}
            />
            <FormInput
              label="Date"
              labelClassName="col-span-2"
              name="date"
              placeholder="May 2018"
              value={date}
              onChange={handleEducationChange}
            />
            <FormInput
              label="Degree & Major"
              labelClassName="col-span-4"
              name="degree"
              placeholder="Bachelor of Science in Computer Engineering"
              value={degree}
              onChange={handleEducationChange}
            />
            <FormInput
              label="GPA"
              labelClassName="col-span-2"
              name="gpa"
              placeholder="3.81"
              value={gpa}
              onChange={handleEducationChange}
            />
            <div className="relative col-span-full">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-400">
                  Additional Information (Optional)
                </span>
                <BulletListIconButton
                  showBulletPoints={showBulletPoints}
                  onClick={handleShowBulletPoints}
                />
                <div className="ml-auto">
                  <AiWriteButton
                    target={{ section: "education", field: "descriptions", idx }}
                    onGenerated={handleAiGenerated}
                  />
                </div>
              </div>
              <BulletListTextarea
                label=""
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Free paragraph space to list out additional activities, courses, awards etc"
                value={descriptions}
                onChange={handleEducationChange}
                showBulletPoints={showBulletPoints}
              />
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
