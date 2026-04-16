import { View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  PdfSection,
  PdfBulletList,
  PdfText,
  PdfLink,
} from "@/components/resume-preview/resume-pdf/common";
import { styles, spacing } from "@/components/resume-preview/resume-pdf/styles";
import type { ResumePublication } from "@/types/resume";

export const PdfPublications = ({
  heading,
  publications,
  isPDF,
  showBulletPoints,
  headingStyle,
  subtitleStyle,
  bodyStyle,
  dateStyle,
}: {
  heading: string;
  publications: ResumePublication[];
  isPDF: boolean;
  showBulletPoints: boolean;
  headingStyle?: Style;
  subtitleStyle?: Style;
  bodyStyle?: Style;
  dateStyle?: Style;
}) => {
  return (
    <PdfSection heading={heading} headingStyle={headingStyle}>
      {publications.map(
        ({ title, authors, venue, date, url, descriptions }, idx) => {
          const linkSrc = url
            ? url.startsWith("http")
              ? url
              : `https://${url}`
            : null;

          return (
            <View key={idx}>
              <View
                style={{
                  ...styles.flexRowBetween,
                  marginTop: spacing["0.5"],
                }}
              >
                {linkSrc ? (
                  <PdfLink src={linkSrc} isPDF={isPDF}>
                    <PdfText bold={true} style={subtitleStyle}>
                      {title}
                    </PdfText>
                  </PdfLink>
                ) : (
                  <PdfText bold={true} style={subtitleStyle}>
                    {title}
                  </PdfText>
                )}
                <PdfText style={dateStyle}>{date}</PdfText>
              </View>
              {(authors || venue) && (
                <PdfText
                  italic={true}
                  color="#525252"
                  style={{ ...bodyStyle, marginTop: spacing["0.5"] }}
                >
                  {[authors, venue].filter(Boolean).join(" — ")}
                </PdfText>
              )}
              {descriptions.length > 0 && (
                <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
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
