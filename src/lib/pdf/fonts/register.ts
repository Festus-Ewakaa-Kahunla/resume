import { Font } from "@react-pdf/renderer";
import type { FontStyle, FontWeight } from "@react-pdf/types";
import { ENGLISH_FONT_FAMILIES } from "@/lib/pdf/fonts/constants";

/**
 * Font families that have italic variants available in public/fonts/.
 */
const FAMILIES_WITH_ITALIC = new Set(["Roboto"]);

/**
 * Register all font families with @react-pdf/renderer so it can render
 * fonts correctly in both the live preview and the generated PDF.
 */
export function registerPDFFonts(): void {
  ENGLISH_FONT_FAMILIES.forEach((fontFamily) => {
    const fonts: Array<{ src: string; fontWeight?: FontWeight; fontStyle?: FontStyle }> = [
      {
        src: `/fonts/${fontFamily}-Regular.ttf`,
      },
      {
        src: `/fonts/${fontFamily}-Bold.ttf`,
        fontWeight: "bold",
      },
    ];

    if (FAMILIES_WITH_ITALIC.has(fontFamily)) {
      fonts.push(
        {
          src: `/fonts/${fontFamily}-Italic.ttf`,
          fontStyle: "italic",
        },
        {
          src: `/fonts/${fontFamily}-BoldItalic.ttf`,
          fontWeight: "bold",
          fontStyle: "italic",
        }
      );
    }

    Font.register({ family: fontFamily, fonts });
  });
}

/**
 * Configure hyphenation behavior for @react-pdf/renderer.
 *
 * Disabling hyphenation for English fonts ensures words wrap naturally
 * at line boundaries without mid-word breaks.
 * See: https://github.com/diegomura/react-pdf/issues/311#issuecomment-548301604
 */
export function registerPDFHyphenationCallback(): void {
  Font.registerHyphenationCallback((word: string) => {
    if (word.length > 30) {
      return Array.from(word);
    }
    return [word];
  });
}
