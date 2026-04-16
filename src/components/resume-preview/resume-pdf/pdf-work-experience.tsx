import { View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  PdfSection,
  PdfBulletList,
  PdfText,
} from "@/components/resume-preview/resume-pdf/common";
import { styles, spacing } from "@/components/resume-preview/resume-pdf/styles";
import type { ResumeWorkExperience } from "@/types/resume";

export const PdfWorkExperience = ({
  heading,
  workExperiences,
  headingStyle,
  subtitleStyle,
  detailStyle,
  bodyStyle,
  dateStyle,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  headingStyle?: Style;
  subtitleStyle?: Style;
  detailStyle?: Style;
  bodyStyle?: Style;
  dateStyle?: Style;
}) => {
  return (
    <PdfSection heading={heading} headingStyle={headingStyle}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;

        return (
          <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
            {!hideCompanyName && (
              <PdfText bold={true} style={subtitleStyle}>
                {company}
              </PdfText>
            )}
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: hideCompanyName
                  ? "-" + spacing["1"]
                  : spacing["1.5"],
              }}
            >
              <PdfText italic={true} style={detailStyle ?? bodyStyle}>
                {jobTitle}
              </PdfText>
              <PdfText style={dateStyle}>{date}</PdfText>
            </View>
            <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
              <PdfBulletList items={descriptions} style={bodyStyle} />
            </View>
          </View>
        );
      })}
    </PdfSection>
  );
};
