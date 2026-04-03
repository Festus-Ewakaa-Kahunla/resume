import { View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  PdfSection,
  PdfBulletList,
} from "@/components/resume-preview/resume-pdf/common";
import { styles } from "@/components/resume-preview/resume-pdf/styles";
import type { ResumeSkills } from "@/types/resume";

export const PdfSkills = ({
  heading,
  skills,
  showBulletPoints,
  headingStyle,
  bodyStyle,
}: {
  heading: string;
  skills: ResumeSkills;
  showBulletPoints: boolean;
  headingStyle?: Style;
  bodyStyle?: Style;
}) => {
  const { descriptions } = skills;

  return (
    <PdfSection heading={heading} headingStyle={headingStyle}>
      <View style={{ ...styles.flexCol }}>
        <PdfBulletList
          items={descriptions}
          showBulletPoints={showBulletPoints}
          style={bodyStyle}
        />
      </View>
    </PdfSection>
  );
};
