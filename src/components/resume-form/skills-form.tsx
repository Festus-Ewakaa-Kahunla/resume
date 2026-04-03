"use client";

import { useCallback } from "react";
import { Form } from "@/components/resume-form/form";
import { BulletListTextarea } from "@/components/resume-form/form/input-group";
import { BulletListIconButton } from "@/components/resume-form/form/icon-button";
import { AiWriteButton } from "@/components/resume-form/form/ai-write-button";
import { useResumeStore } from "@/stores/resume-store";
import { useSettingsStore } from "@/stores/settings-store";

export const SkillsForm = () => {
  const descriptions = useResumeStore(
    (state) => state.resume.skills.descriptions
  );
  const changeSkills = useResumeStore((state) => state.changeSkills);
  const showBulletPoints = useSettingsStore(
    (state) => state.settings.showBulletPoints.skills
  );
  const changeShowBulletPoints = useSettingsStore(
    (state) => state.changeShowBulletPoints
  );

  const handleSkillsChange = (field: "descriptions", value: string[]) => {
    changeSkills({ field, value });
  };

  const handleShowBulletPoints = (value: boolean) => {
    changeShowBulletPoints("skills", value);
  };

  const handleAiGenerated = useCallback(
    (content: string | string[]) => {
      const bullets = Array.isArray(content) ? content : [content];
      changeSkills({ field: "descriptions", value: bullets });
    },
    [changeSkills]
  );

  return (
    <Form form="skills">
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-400">Skills List</span>
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={handleShowBulletPoints}
            />
            <div className="ml-auto">
              <AiWriteButton
                target={{ section: "skills", field: "descriptions" }}
                onGenerated={handleAiGenerated}
              />
            </div>
          </div>
          <BulletListTextarea
            label=""
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={descriptions}
            onChange={handleSkillsChange}
            showBulletPoints={showBulletPoints}
          />
        </div>
      </div>
    </Form>
  );
};
