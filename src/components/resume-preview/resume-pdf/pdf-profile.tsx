import { View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { spacing } from "@/components/resume-preview/resume-pdf/styles";
import {
  PdfLink,
  PdfSection,
  PdfText,
} from "@/components/resume-preview/resume-pdf/common";
import type { ResumeProfile } from "@/types/resume";

type ContactField = "email" | "phone" | "location" | "url";

const CONTACT_TEXT_SCALE = 0.85;

export const PdfProfile = ({
  profile,
  nameStyle,
  isPDF,
  bodyFontSize,
  bodyFontFamily,
}: {
  profile: ResumeProfile;
  nameStyle?: Style;
  isPDF: boolean;
  bodyFontSize: number;
  bodyFontFamily: string;
}) => {
  const { name } = profile;

  const contactOrder: ContactField[] = ["email", "phone", "location", "url"];
  const contactItems = contactOrder
    .map((key) => ({ key, value: profile[key] }))
    .filter((item) => Boolean(item.value));

  const contactFontSize = `${(bodyFontSize * CONTACT_TEXT_SCALE).toFixed(2)}pt`;
  const pipeFontSize = `${bodyFontSize}pt`;

  const contactStyle: Style = {
    fontSize: contactFontSize,
    fontFamily: bodyFontFamily,
  };
  const pipeStyle: Style = {
    fontSize: pipeFontSize,
    fontFamily: bodyFontFamily,
  };

  const buildLinkSrc = (key: ContactField, value: string): string | null => {
    switch (key) {
      case "email":
        return `mailto:${value}`;
      case "phone":
        return `tel:${value.replace(/[^\d+]/g, "")}`;
      case "url":
        return value.startsWith("http") ? value : `https://${value}`;
      default:
        return null;
    }
  };

  return (
    <PdfSection style={{ marginTop: spacing["4"], gap: spacing["1"] }}>
      <PdfText
        bold={true}
        color="#171717"
        style={{ fontSize: "20pt", textAlign: "center", ...nameStyle }}
      >
        {name}
      </PdfText>
      {contactItems.length > 0 && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {contactItems.map((item, idx) => {
            const value = item.value as string;
            const src = buildLinkSrc(item.key, value);
            const isLast = idx === contactItems.length - 1;
            return (
              <View
                key={item.key}
                style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
              >
                {src ? (
                  <PdfLink src={src} isPDF={isPDF}>
                    <PdfText color="#525252" style={contactStyle}>
                      {value}
                    </PdfText>
                  </PdfLink>
                ) : (
                  <PdfText color="#525252" style={contactStyle}>
                    {value}
                  </PdfText>
                )}
                {!isLast && (
                  <View
                    style={{
                      paddingLeft: spacing["2"],
                      paddingRight: spacing["2"],
                    }}
                  >
                    <PdfText color="#525252" style={pipeStyle}>
                      {"|"}
                    </PdfText>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </PdfSection>
  );
};
