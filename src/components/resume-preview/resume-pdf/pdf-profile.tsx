import { View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  PdfIcon,
  type IconType,
} from "@/components/resume-preview/resume-pdf/common/pdf-icon";
import { styles, spacing } from "@/components/resume-preview/resume-pdf/styles";
import {
  PdfLink,
  PdfSection,
  PdfText,
} from "@/components/resume-preview/resume-pdf/common";
import type { ResumeProfile } from "@/types/resume";

export const PdfProfile = ({
  profile,
  nameStyle,
  isPDF,
}: {
  profile: ResumeProfile;
  nameStyle?: Style;
  isPDF: boolean;
}) => {
  const { name, email, phone, url, summary, location } = profile;
  const iconProps = { email, phone, location, url };

  return (
    <PdfSection style={{ marginTop: spacing["4"] }}>
      <PdfText
        bold={true}
        color="#171717"
        style={{ fontSize: "20pt", ...nameStyle }}
      >
        {name}
      </PdfText>
      {summary && <PdfText color="#171717">{summary}</PdfText>}
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: "wrap",
          marginTop: spacing["0.5"],
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType = key as IconType;
          if (key === "url") {
            if (value.includes("github")) {
              iconType = "url_github";
            } else if (value.includes("linkedin")) {
              iconType = "url_linkedin";
            }
          }

          const shouldUseLinkWrapper = ["email", "url", "phone"].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = "";
            switch (key) {
              case "email": {
                src = `mailto:${value}`;
                break;
              }
              case "phone": {
                src = `tel:${value.replace(/[^\d+]/g, "")}`;
                break;
              }
              default: {
                src = value.startsWith("http") ? value : `https://${value}`;
              }
            }

            return (
              <PdfLink src={src} isPDF={isPDF}>
                {children}
              </PdfLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                gap: spacing["1"],
              }}
            >
              <PdfIcon type={iconType} isPDF={isPDF} />
              <Wrapper>
                <PdfText color="#525252">{value}</PdfText>
              </Wrapper>
            </View>
          );
        })}
      </View>
    </PdfSection>
  );
};
