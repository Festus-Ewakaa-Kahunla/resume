export type ShowForm =
  | "workExperiences"
  | "educations"
  | "projects"
  | "publications"
  | "skills"
  | "custom";

export type FormWithBulletPoints = Exclude<ShowForm, "workExperiences">;

export type TypographyElement =
  | "name"
  | "sectionHeading"
  | "subtitle"
  | "detail"
  | "body"
  | "date";

export interface TypographyOverride {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: "normal" | "bold";
}

export interface ResumeSettings {
  fontFamily: string;
  fontSize: string;
  typography: Partial<Record<TypographyElement, TypographyOverride>>;
  formToShow: Record<ShowForm, boolean>;
  formToHeading: Record<ShowForm, string>;
  formsOrder: ShowForm[];
  showBulletPoints: Record<FormWithBulletPoints, boolean>;
}

export const DEFAULT_FONT_FAMILY = "Roboto";
export const DEFAULT_FONT_SIZE = "10.5";

export const initialSettings: ResumeSettings = {
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  typography: {
    name: { fontSize: "22", fontWeight: "bold" },
    sectionHeading: { fontSize: "12", fontWeight: "bold" },
    subtitle: { fontSize: "11", fontWeight: "bold" },
    detail: { fontSize: "10.5" },
    body: { fontSize: "10.5" },
    date: { fontSize: "10" },
  },
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    publications: false,
    skills: true,
    custom: false,
  },
  formToHeading: {
    workExperiences: "EXPERIENCE",
    educations: "EDUCATION",
    projects: "PROJECTS",
    publications: "PUBLICATIONS",
    skills: "SKILLS",
    custom: "LEADERSHIP & ACTIVITIES",
  },
  formsOrder: [
    "educations",
    "skills",
    "workExperiences",
    "projects",
    "publications",
    "custom",
  ],
  showBulletPoints: {
    educations: true,
    projects: true,
    publications: true,
    skills: true,
    custom: true,
  },
};
