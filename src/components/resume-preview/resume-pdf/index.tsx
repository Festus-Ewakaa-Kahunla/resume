import type { JSX } from "react";
import { Page, View, Document } from "@react-pdf/renderer";
import { styles, spacing } from "@/components/resume-preview/resume-pdf/styles";
import { PdfProfile } from "@/components/resume-preview/resume-pdf/pdf-profile";
import { PdfWorkExperience } from "@/components/resume-preview/resume-pdf/pdf-work-experience";
import { PdfEducation } from "@/components/resume-preview/resume-pdf/pdf-education";
import { PdfProject } from "@/components/resume-preview/resume-pdf/pdf-project";
import { PdfPublications } from "@/components/resume-preview/resume-pdf/pdf-publications";
import { PdfSkills } from "@/components/resume-preview/resume-pdf/pdf-skills";
import { PdfCustom } from "@/components/resume-preview/resume-pdf/pdf-custom";
import { SuppressPdfWarnings } from "@/components/resume-preview/resume-pdf/common/suppress-pdf-warnings";
import type { ResumeSettings, ShowForm, TypographyOverride } from "@/types/settings";
import type { Resume } from "@/types/resume";

interface PdfDocumentProps {
  resume: Resume;
  settings: ResumeSettings;
  isPDF?: boolean;
}

function resolveTypography(
  settings: ResumeSettings,
  element?: keyof ResumeSettings["typography"]
): { fontFamily: string; fontSize: string; fontWeight: "normal" | "bold" } {
  const override: TypographyOverride | undefined = element
    ? settings.typography?.[element]
    : undefined;
  return {
    fontFamily: override?.fontFamily ?? settings.fontFamily,
    fontSize: override?.fontSize ?? settings.fontSize,
    fontWeight: override?.fontWeight ?? "normal",
  };
}

export const PdfDocument = ({
  resume,
  settings,
  isPDF = false,
}: PdfDocumentProps) => {
  const {
    profile,
    workExperiences,
    educations,
    projects,
    publications,
    skills,
    custom,
  } = resume;
  const { name } = profile;
  const { formToHeading, formToShow, formsOrder, showBulletPoints } = settings;

  const nameTypo = resolveTypography(settings, "name");
  const headingTypo = resolveTypography(settings, "sectionHeading");
  const subtitleTypo = resolveTypography(settings, "subtitle");
  const detailTypo = resolveTypography(settings, "detail");
  const bodyTypo = resolveTypography(settings, "body");
  const dateTypo = resolveTypography(settings, "date");

  const detailStyle = {
    fontSize: detailTypo.fontSize + "pt",
    fontFamily: detailTypo.fontFamily,
  };

  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <PdfWorkExperience
        heading={formToHeading["workExperiences"]}
        headingStyle={{ fontSize: headingTypo.fontSize + "pt", fontFamily: headingTypo.fontFamily }}
        subtitleStyle={{ fontSize: subtitleTypo.fontSize + "pt", fontWeight: subtitleTypo.fontWeight, fontFamily: subtitleTypo.fontFamily }}
        detailStyle={detailStyle}
        bodyStyle={{ fontSize: bodyTypo.fontSize + "pt", fontFamily: bodyTypo.fontFamily }}
        dateStyle={{ fontSize: dateTypo.fontSize + "pt", fontFamily: dateTypo.fontFamily }}
        workExperiences={workExperiences}
      />
    ),
    educations: () => (
      <PdfEducation
        heading={formToHeading["educations"]}
        headingStyle={{ fontSize: headingTypo.fontSize + "pt", fontFamily: headingTypo.fontFamily }}
        subtitleStyle={{ fontSize: subtitleTypo.fontSize + "pt", fontWeight: subtitleTypo.fontWeight, fontFamily: subtitleTypo.fontFamily }}
        detailStyle={detailStyle}
        bodyStyle={{ fontSize: bodyTypo.fontSize + "pt", fontFamily: bodyTypo.fontFamily }}
        dateStyle={{ fontSize: dateTypo.fontSize + "pt", fontFamily: dateTypo.fontFamily }}
        educations={educations}
        showBulletPoints={showBulletPoints["educations"]}
      />
    ),
    projects: () => (
      <PdfProject
        heading={formToHeading["projects"]}
        headingStyle={{ fontSize: headingTypo.fontSize + "pt", fontFamily: headingTypo.fontFamily }}
        subtitleStyle={{ fontSize: subtitleTypo.fontSize + "pt", fontWeight: subtitleTypo.fontWeight, fontFamily: subtitleTypo.fontFamily }}
        bodyStyle={{ fontSize: bodyTypo.fontSize + "pt", fontFamily: bodyTypo.fontFamily }}
        dateStyle={{ fontSize: dateTypo.fontSize + "pt", fontFamily: dateTypo.fontFamily }}
        projects={projects}
      />
    ),
    publications: () => (
      <PdfPublications
        heading={formToHeading["publications"]}
        headingStyle={{ fontSize: headingTypo.fontSize + "pt", fontFamily: headingTypo.fontFamily }}
        subtitleStyle={{ fontSize: subtitleTypo.fontSize + "pt", fontWeight: subtitleTypo.fontWeight, fontFamily: subtitleTypo.fontFamily }}
        bodyStyle={{ fontSize: bodyTypo.fontSize + "pt", fontFamily: bodyTypo.fontFamily }}
        dateStyle={{ fontSize: dateTypo.fontSize + "pt", fontFamily: dateTypo.fontFamily }}
        publications={publications}
        isPDF={isPDF}
        showBulletPoints={showBulletPoints["publications"]}
      />
    ),
    skills: () => (
      <PdfSkills
        heading={formToHeading["skills"]}
        headingStyle={{ fontSize: headingTypo.fontSize + "pt", fontFamily: headingTypo.fontFamily }}
        bodyStyle={{ fontSize: bodyTypo.fontSize + "pt", fontFamily: bodyTypo.fontFamily }}
        skills={skills}
        showBulletPoints={showBulletPoints["skills"]}
      />
    ),
    custom: () => (
      <PdfCustom
        heading={formToHeading["custom"]}
        headingStyle={{ fontSize: headingTypo.fontSize + "pt", fontFamily: headingTypo.fontFamily }}
        bodyStyle={{ fontSize: bodyTypo.fontSize + "pt", fontFamily: bodyTypo.fontFamily }}
        custom={custom}
        showBulletPoints={showBulletPoints["custom"]}
      />
    ),
  };

  return (
    <>
      <Document title={`${name} Resume`} author={name} producer={"Resume"}>
        <Page
          size="LETTER"
          style={{
            ...styles.flexCol,
            color: "#171717",
            fontFamily: settings.fontFamily,
            fontSize: settings.fontSize + "pt",
          }}
        >
          <View
            style={{
              ...styles.flexCol,
              padding: `${spacing[5]} ${spacing[20]}`,
            }}
          >
            <PdfProfile
              profile={profile}
              isPDF={isPDF}
              nameStyle={{
                fontSize: nameTypo.fontSize + "pt",
                fontWeight: nameTypo.fontWeight,
                fontFamily: nameTypo.fontFamily,
              }}
              bodyFontSize={Number(bodyTypo.fontSize)}
              bodyFontFamily={bodyTypo.fontFamily}
            />
            {showFormsOrder.map((form) => {
              const Component = formTypeToComponent[form];
              return <Component key={form} />;
            })}
          </View>
        </Page>
      </Document>
      <SuppressPdfWarnings />
    </>
  );
};
