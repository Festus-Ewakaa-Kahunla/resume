import { View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  PdfBulletList,
  PdfSection,
  PdfText,
} from "@/components/resume-preview/resume-pdf/common";
import { styles, spacing } from "@/components/resume-preview/resume-pdf/styles";
import type { ResumeEducation } from "@/types/resume";

export const PdfEducation = ({
  heading,
  educations,
  showBulletPoints,
  headingStyle,
  subtitleStyle,
  detailStyle,
  bodyStyle,
  dateStyle,
}: {
  heading: string;
  educations: ResumeEducation[];
  showBulletPoints: boolean;
  headingStyle?: Style;
  subtitleStyle?: Style;
  detailStyle?: Style;
  bodyStyle?: Style;
  dateStyle?: Style;
}) => {
  return (
    <PdfSection heading={heading} headingStyle={headingStyle}>
      {educations.map(
        ({ school, degree, date, gpa, descriptions = [] }, idx) => {
          const hideSchoolName =
            idx > 0 && school === educations[idx - 1].school;
          const showDescriptions = descriptions.join() !== "";

          const degreeText = gpa
            ? `${degree} - ${Number(gpa) ? gpa + " GPA" : gpa}`
            : degree;

          return (
            <View key={idx}>
              {!hideSchoolName && (
                <PdfText bold={true} style={subtitleStyle}>
                  {school}
                </PdfText>
              )}
              <View
                style={{
                  ...styles.flexRowBetween,
                  marginTop: hideSchoolName
                    ? "-" + spacing["1"]
                    : spacing["1.5"],
                }}
              >
                <PdfText italic={true} style={detailStyle ?? bodyStyle}>
                  {degreeText}
                </PdfText>
                <PdfText style={dateStyle}>{date}</PdfText>
              </View>
              {showDescriptions && (
                <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                  <PdfBulletList
                    items={descriptions}
                    showBulletPoints={showBulletPoints}
                    style={bodyStyle}
                  />
                </View>
              )}
            </View>
          );
        }
      )}
    </PdfSection>
  );
};
