"use client";

import { Form } from "@/components/resume-form/form";
import { BulletListIconButton } from "@/components/resume-form/form/icon-button";
import { BulletListTextarea } from "@/components/resume-form/form/input-group";
import { useResumeStore } from "@/stores/resume-store";
import { useSettingsStore } from "@/stores/settings-store";

export const CustomForm = () => {
  const custom = useResumeStore((state) => state.resume.custom);
  const changeCustom = useResumeStore((state) => state.changeCustom);
  const showBulletPoints = useSettingsStore(
    (state) => state.settings.showBulletPoints.custom
  );
  const changeShowBulletPoints = useSettingsStore(
    (state) => state.changeShowBulletPoints
  );

  const { descriptions } = custom;
  const form = "custom";

  const handleCustomChange = (_field: "descriptions", value: string[]) => {
    changeCustom(value);
  };

  const handleShowBulletPoints = (value: boolean) => {
    changeShowBulletPoints(form, value);
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Custom Textbox"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={descriptions}
            onChange={handleCustomChange}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[7.7rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={handleShowBulletPoints}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};
