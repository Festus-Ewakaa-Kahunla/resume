"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Frame from "react-frame-component";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  A4_WIDTH_PT,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
  LETTER_WIDTH_PT,
} from "@/lib/constants";
import { ENGLISH_FONT_FAMILIES } from "@/lib/pdf/fonts/constants";
import dynamic from "next/dynamic";

const MAX_PAGES = 2;
const PAGE_GAP = 16;

function getIframeInitialContent(isA4: boolean) {
  const width = isA4 ? A4_WIDTH_PT : LETTER_WIDTH_PT;
  const fontFamilies = ENGLISH_FONT_FAMILIES;

  const preloadLinks = fontFamilies
    .map(
      (font) =>
        `<link rel="preload" as="font" href="/fonts/${font}-Regular.ttf" type="font/ttf" crossorigin="anonymous">
<link rel="preload" as="font" href="/fonts/${font}-Bold.ttf" type="font/ttf" crossorigin="anonymous">`
    )
    .join("");

  const fontFaces = fontFamilies
    .map(
      (font) =>
        `@font-face {font-family: "${font}"; src: url("/fonts/${font}-Regular.ttf");}
@font-face {font-family: "${font}"; src: url("/fonts/${font}-Bold.ttf"); font-weight: bold;}`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <head>
    ${preloadLinks}
    <style>${fontFaces}</style>
  </head>
  <body style='overflow: hidden; width: ${width}pt; margin: 0; padding: 0; -webkit-text-size-adjust:none; overflow-wrap: break-word; word-break: break-word;'>
    <div></div>
  </body>
</html>`;
}

function ResumeIframe({
  documentSize,
  scale,
  children,
  enablePDFViewer = false,
}: {
  documentSize: string;
  scale: number;
  children: React.ReactNode;
  enablePDFViewer?: boolean;
}) {
  const isA4 = documentSize === "A4";
  const [needsSecondPage, setNeedsSecondPage] = useState(false);
  const page1Ref = useRef<HTMLDivElement>(null);

  const iframeInitialContent = useMemo(
    () => getIframeInitialContent(isA4),
    [isA4]
  );

  const width = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
  const pageHeight = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
  const iframeHeight = pageHeight * MAX_PAGES;

  useEffect(() => {
    const container = page1Ref.current;
    if (!container) return;

    const iframe = container.querySelector("iframe");
    if (!iframe) return;

    let observer: ResizeObserver | null = null;

    const checkOverflow = () => {
      const root = iframe.contentDocument?.body?.firstElementChild as HTMLElement | null;
      if (!root) return;
      setNeedsSecondPage(root.scrollHeight > pageHeight);
    };

    const setupObserver = () => {
      const root = iframe.contentDocument?.body?.firstElementChild as HTMLElement | null;
      if (!root) return;
      observer = new ResizeObserver(checkOverflow);
      observer.observe(root);
      checkOverflow();
    };

    if (iframe.contentDocument?.body?.firstElementChild) {
      setupObserver();
    }

    iframe.addEventListener("load", setupObserver);

    return () => {
      iframe.removeEventListener("load", setupObserver);
      observer?.disconnect();
    };
  }, [pageHeight]);

  if (enablePDFViewer) {
    return (
      <DynamicPDFViewer className="h-full w-full">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {children as any}
      </DynamicPDFViewer>
    );
  }

  const totalHeight = needsSecondPage
    ? pageHeight * MAX_PAGES + PAGE_GAP
    : pageHeight;

  return (
    <div
      style={{
        maxWidth: `${width * scale}px`,
        maxHeight: `${totalHeight * scale}px`,
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${totalHeight}px`,
          transform: `scale(${scale})`,
        }}
        className="origin-top-left"
      >
        {/* Page 1 */}
        <div
          ref={page1Ref}
          style={{
            width: `${width}px`,
            height: `${pageHeight}px`,
            overflow: "hidden",
          }}
          className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
        >
          <Frame
            style={{ width: "100%", height: `${iframeHeight}px`, border: "none", overflow: "hidden" }}
            initialContent={iframeInitialContent}
            key={`${isA4 ? "A4" : "LETTER"}-p1`}
          >
            {children}
          </Frame>
        </div>

        {/* Page 2 — only rendered when content overflows page 1 */}
        {needsSecondPage && (
          <>
            <div style={{ height: `${PAGE_GAP}px` }} />
            <div
              style={{
                width: `${width}px`,
                height: `${pageHeight}px`,
                overflow: "hidden",
              }}
              className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
            >
              <Frame
                style={{
                  width: "100%",
                  height: `${iframeHeight}px`,
                  marginTop: `-${pageHeight}px`,
                  border: "none",
                }}
                initialContent={iframeInitialContent}
                key={`${isA4 ? "A4" : "LETTER"}-p2`}
              >
                {children}
              </Frame>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const ResumeIframeCSR = dynamic(() => Promise.resolve(ResumeIframe), {
  ssr: false,
});

const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  { ssr: false }
);
