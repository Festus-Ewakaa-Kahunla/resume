import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface JobDescriptionStore {
  jobDescription: string;
  setJobDescription: (jd: string) => void;
}

export const useJobDescriptionStore = create<JobDescriptionStore>()(
  persist(
    (set) => ({
      jobDescription: "",
      setJobDescription: (jobDescription) => set({ jobDescription }),
    }),
    {
      name: "resume-jd",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
