"use client";

import { useState, useMemo, useEffect } from "react";
import { ResumeIframeCSR } from "@/components/resume-preview/resume-iframe";
import { PdfDocument } from "@/components/resume-preview/resume-pdf";
import { ResumeControlBarCSR } from "@/components/resume-preview/resume-control-bar";
import { useResumeStore } from "@/stores/resume-store";
import { useSettingsStore } from "@/stores/settings-store";
import { DEBUG_RESUME_PDF_FLAG } from "@/lib/constants";
import {
  registerPDFFonts,
  registerPDFHyphenationCallback,
} from "@/lib/pdf/fonts/register";

export function ResumePreview() {
  const [scale, setScale] = useState(0.8);
  const resume = useResumeStore((state) => state.resume);
  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    registerPDFFonts();
    registerPDFHyphenationCallback();
  }, []);

  const document = useMemo(
    () => <PdfDocument resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  return (
    <div className="relative flex h-full flex-col">
      <section className="flex-1 overflow-y-auto overscroll-contain p-4">
        <div className="flex justify-center">
          <ResumeIframeCSR
            documentSize={"Letter"}
            scale={scale}
            enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
          >
            <PdfDocument
              resume={resume}
              settings={settings}
              isPDF={DEBUG_RESUME_PDF_FLAG}
            />
          </ResumeIframeCSR>
        </div>
      </section>
      <ResumeControlBarCSR
        scale={scale}
        setScale={setScale}
        documentSize={"Letter"}
        document={document}
        fileName={resume.profile.name ? `${resume.profile.name} Resume` : "Resume"}
      />
    </div>
  );
}
