import { View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  PdfSection,
  PdfBulletList,
  PdfText,
} from "@/components/resume-preview/resume-pdf/common";
import { styles, spacing } from "@/components/resume-preview/resume-pdf/styles";
import type { ResumeProject } from "@/types/resume";

export const PdfProject = ({
  heading,
  projects,
  headingStyle,
  subtitleStyle,
  bodyStyle,
  dateStyle,
}: {
  heading: string;
  projects: ResumeProject[];
  headingStyle?: Style;
  subtitleStyle?: Style;
  bodyStyle?: Style;
  dateStyle?: Style;
}) => {
  return (
    <PdfSection heading={heading} headingStyle={headingStyle}>
      {projects.map(({ project, date, descriptions }, idx) => (
        <View key={idx}>
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: spacing["0.5"],
            }}
          >
            <PdfText bold={true} style={subtitleStyle}>
              {project}
            </PdfText>
            <PdfText style={dateStyle}>{date}</PdfText>
          </View>
          <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
            <PdfBulletList items={descriptions} style={bodyStyle} />
          </View>
        </View>
      ))}
    </PdfSection>
  );
};
