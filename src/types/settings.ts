export type ShowForm =
  | "workExperiences"
  | "educations"
  | "projects"
  | "skills"
  | "custom";

export type FormWithBulletPoints = Exclude<ShowForm, "workExperiences">;

export type TypographyElement =
  | "name"
  | "sectionHeading"
  | "subtitle"
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
    name: { fontSize: "16", fontWeight: "bold" },
    sectionHeading: { fontSize: "11", fontWeight: "bold" },
    subtitle: { fontSize: "10.5", fontWeight: "bold" },
    body: { fontSize: "10.5" },
    date: { fontSize: "10" },
  },
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
  formToHeading: {
    workExperiences: "WORK EXPERIENCE",
    educations: "EDUCATION",
    projects: "PROJECT",
    skills: "SKILLS",
    custom: "CUSTOM SECTION",
  },
  formsOrder: ["workExperiences", "educations", "projects", "skills", "custom"],
  showBulletPoints: {
    educations: true,
    projects: true,
    skills: true,
    custom: true,
  },
};
