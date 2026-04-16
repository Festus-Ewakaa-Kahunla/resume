"use client";

import { useSettingsStore } from "@/stores/settings-store";
import { ProfileForm } from "@/components/resume-form/profile-form";
import { WorkExperiencesForm } from "@/components/resume-form/work-experiences-form";
import { EducationsForm } from "@/components/resume-form/educations-form";
import { ProjectsForm } from "@/components/resume-form/projects-form";
import { PublicationsForm } from "@/components/resume-form/publications-form";
import { SkillsForm } from "@/components/resume-form/skills-form";
import { CustomForm } from "@/components/resume-form/custom-form";
import { SettingsForm } from "@/components/resume-form/settings-form";
import type { ShowForm } from "@/types/settings";

const formTypeToComponent: { [type in ShowForm]: () => React.JSX.Element } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  publications: PublicationsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

export const ResumeForm = () => {
  const formsOrder = useSettingsStore((state) => state.settings.formsOrder);

  return (
    <section className="flex flex-col gap-8 px-6 py-8">
      <ProfileForm />
      {formsOrder.map((form) => {
        const Component = formTypeToComponent[form];
        return <Component key={form} />;
      })}
      <SettingsForm />
    </section>
  );
};
