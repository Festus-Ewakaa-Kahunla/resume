"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ResumeDropzone } from "@/components/import/resume-dropzone";
import { ParsedResumePreview } from "@/components/import/parsed-resume-preview";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/resume-store";
import type { Resume } from "@/types/resume";

export function ImportClient() {
  const [parsedResume, setParsedResume] = useState<Resume | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const router = useRouter();

  const handleParsed = useCallback((resume: Resume, name: string) => {
    setParsedResume(resume);
    setFileName(name);
  }, []);

  function handleImport() {
    if (!parsedResume) return;
    useResumeStore.getState().setResume(parsedResume);
    router.push("/builder");
  }

  function handleReset() {
    setParsedResume(null);
    setFileName("");
  }

  if (!parsedResume) {
    return <ResumeDropzone onParsed={handleParsed} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            Parsed from <span className="text-white">{fileName}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Upload Different
          </Button>
          <Button size="sm" onClick={handleImport}>
            Import & Edit
          </Button>
        </div>
      </div>

      <ParsedResumePreview resume={parsedResume} />
    </div>
  );
}
