import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Resume,
  ResumeProfile,
  ResumeWorkExperience,
  ResumeEducation,
  ResumeProject,
  FeaturedSkill,
} from "@/types/resume";
import type { ShowForm } from "@/types/settings";

export const initialProfile: ResumeProfile = {
  name: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  url: "",
};

export const initialWorkExperience: ResumeWorkExperience = {
  company: "",
  jobTitle: "",
  date: "",
  descriptions: [],
};

export const initialEducation: ResumeEducation = {
  school: "",
  degree: "",
  gpa: "",
  date: "",
  descriptions: [],
};

export const initialProject: ResumeProject = {
  project: "",
  date: "",
  descriptions: [],
};

export const initialFeaturedSkill: FeaturedSkill = { skill: "", rating: 4 };

export const initialResumeState: Resume = {
  profile: initialProfile,
  workExperiences: [structuredClone(initialWorkExperience)],
  educations: [structuredClone(initialEducation)],
  projects: [structuredClone(initialProject)],
  skills: {
    featuredSkills: Array.from({ length: 6 }, () => ({ ...initialFeaturedSkill })),
    descriptions: [],
  },
  custom: { descriptions: [] },
};

type SectionChangePayload<T> = {
  idx: number;
} & (
  | { field: Exclude<keyof T, "descriptions">; value: string }
  | { field: "descriptions"; value: string[] }
);

interface ResumeStore {
  resume: Resume;

  changeProfile: (field: keyof ResumeProfile, value: string) => void;
  changeWorkExperiences: (payload: SectionChangePayload<ResumeWorkExperience>) => void;
  changeEducations: (payload: SectionChangePayload<ResumeEducation>) => void;
  changeProjects: (payload: SectionChangePayload<ResumeProject>) => void;
  changeSkills: (
    payload:
      | { field: "descriptions"; value: string[] }
      | { field: "featuredSkills"; idx: number; skill: string; rating: number }
  ) => void;
  changeCustom: (value: string[]) => void;
  addSection: (form: ShowForm) => void;
  moveSection: (form: ShowForm, idx: number, direction: "up" | "down") => void;
  deleteSection: (form: ShowForm, idx: number) => void;
  setResume: (resume: Resume) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    immer((set) => ({
      resume: initialResumeState,

      changeProfile: (field, value) =>
        set((state) => {
          state.resume.profile[field] = value;
        }),

      changeWorkExperiences: ({ idx, field, value }) =>
        set((state) => {
          const item = state.resume.workExperiences[idx];
          if (field === "descriptions") {
            item.descriptions = value as string[];
          } else {
            (item[field as Exclude<keyof ResumeWorkExperience, "descriptions">] as string) =
              value as string;
          }
        }),

      changeEducations: ({ idx, field, value }) =>
        set((state) => {
          const item = state.resume.educations[idx];
          if (field === "descriptions") {
            item.descriptions = value as string[];
          } else {
            (item[field as Exclude<keyof ResumeEducation, "descriptions">] as string) =
              value as string;
          }
        }),

      changeProjects: ({ idx, field, value }) =>
        set((state) => {
          const item = state.resume.projects[idx];
          if (field === "descriptions") {
            item.descriptions = value as string[];
          } else {
            (item[field as Exclude<keyof ResumeProject, "descriptions">] as string) =
              value as string;
          }
        }),

      changeSkills: (payload) =>
        set((state) => {
          if (payload.field === "descriptions") {
            state.resume.skills.descriptions = payload.value;
          } else {
            const { idx, skill, rating } = payload;
            state.resume.skills.featuredSkills[idx] = { skill, rating };
          }
        }),

      changeCustom: (value) =>
        set((state) => {
          state.resume.custom.descriptions = value;
        }),

      addSection: (form) =>
        set((state) => {
          switch (form) {
            case "workExperiences":
              state.resume.workExperiences.push(structuredClone(initialWorkExperience));
              break;
            case "educations":
              state.resume.educations.push(structuredClone(initialEducation));
              break;
            case "projects":
              state.resume.projects.push(structuredClone(initialProject));
              break;
          }
        }),

      moveSection: (form, idx, direction) =>
        set((state) => {
          if (form === "skills" || form === "custom") return;

          const items = state.resume[form];
          const targetIdx = direction === "up" ? idx - 1 : idx + 1;

          if (targetIdx < 0 || targetIdx >= items.length) return;

          const temp = items[idx];
          items[idx] = items[targetIdx];
          items[targetIdx] = temp;
        }),

      deleteSection: (form, idx) =>
        set((state) => {
          if (form === "skills" || form === "custom") return;
          const items = state.resume[form];
          if (idx < 0 || idx >= items.length || items.length <= 1) return;
          items.splice(idx, 1);
        }),

      setResume: (resume) =>
        set((state) => {
          state.resume = resume;
        }),
    })),
    {
      name: "resume-data",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ resume: state.resume }),
      version: 1,
    }
  )
);
