import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "@/components/resume-preview/resume-pdf/styles";
import { DEBUG_RESUME_PDF_FLAG } from "@/lib/constants";

const BLACK = "#171717";
const GRAY = "#525252";

export const PdfSection = ({
  heading,
  headingStyle,
  style = {},
  children,
}: {
  heading?: string;
  headingStyle?: Style;
  style?: Style;
  children: React.ReactNode;
}) => (
  <View
    style={{
      ...styles.flexCol,
      gap: spacing["2"],
      marginTop: spacing["5"],
      ...style,
    }}
  >
    {heading && (
      <View
        style={{
          borderBottomWidth: 0.75,
          borderBottomColor: BLACK,
          paddingBottom: spacing["1"],
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            letterSpacing: "0.3pt",
            color: BLACK,
            ...headingStyle,
          }}
          debug={DEBUG_RESUME_PDF_FLAG}
        >
          {heading}
        </Text>
      </View>
    )}
    {children}
  </View>
);

export const PdfText = ({
  bold = false,
  italic = false,
  color,
  style = {},
  children,
}: {
  bold?: boolean;
  italic?: boolean;
  color?: string;
  style?: Style;
  children: React.ReactNode;
}) => {
  return (
    <Text
      style={{
        color: color ?? BLACK,
        fontWeight: bold ? "bold" : "normal",
        fontStyle: italic ? "italic" : "normal",
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {children}
    </Text>
  );
};

export const PdfBulletList = ({
  items,
  showBulletPoints = true,
  style = {},
}: {
  items: string[];
  showBulletPoints?: boolean;
  style?: Style;
}) => {
  return (
    <>
      {items.map((item, idx) => (
        <View style={{ ...styles.flexRow }} key={idx}>
          {showBulletPoints && (
            <PdfText
              style={{
                paddingLeft: spacing["2"],
                paddingRight: spacing["2"],
                lineHeight: "1.3",
                ...style,
              }}
              bold={true}
            >
              {"•"}
            </PdfText>
          )}
          <PdfText
            style={{ lineHeight: "1.3", flexGrow: 1, flexBasis: 0, ...style }}
          >
            {item}
          </PdfText>
        </View>
      ))}
    </>
  );
};

export const PdfLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const PdfFeaturedSkill = ({
  skill,
  rating,
  style = {},
}: {
  skill: string;
  rating: number;
  style?: Style;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <PdfText style={{ marginRight: spacing[0.5] }}>
        {skill}
      </PdfText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "9pt",
            width: "9pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? BLACK : "#d9d9d9",
            borderRadius: "4.5pt",
          }}
        />
      ))}
    </View>
  );
};
