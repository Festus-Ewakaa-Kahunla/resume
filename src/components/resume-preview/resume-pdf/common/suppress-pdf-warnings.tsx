"use client";

/**
 * Suppress @react-pdf/renderer development warnings.
 *
 * When PdfDocument is rendered outside of PDFViewer (for instant preview),
 * react-pdf elements trigger React casing warnings in the console.
 * This module silences those specific warnings in development.
 *
 * See: https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  const consoleError = console.error;
  const SUPPRESSED_WARNINGS = ["DOCUMENT", "PAGE", "TEXT", "VIEW"];
  console.error = function filterWarnings(msg, ...args) {
    if (!SUPPRESSED_WARNINGS.some((entry) => args[0]?.includes(entry))) {
      consoleError(msg, ...args);
    }
  };
}

export const SuppressPdfWarnings = () => {
  return <></>;
};
