"use client";

import { useState, useCallback } from "react";
import { useApiKeysStore } from "@/stores/api-keys-store";
import {
  extractResumeInput,
  isSupportedResumeFile,
} from "@/lib/extract-resume-input";
import type { Resume } from "@/types/resume";

interface ResumeDropzoneProps {
  onParsed: (resume: Resume, fileName: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function ResumeDropzone({ onParsed }: ResumeDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!isSupportedResumeFile(file)) {
        setError("Please upload a PDF or image (PNG/JPG)");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File must be under 10MB");
        return;
      }

      setError(null);
      setParsing(true);
      setStatus("Reading your resume...");

      try {
        const input = await extractResumeInput(file);

        setStatus(
          input.kind === "image"
            ? "AI is reading your resume image..."
            : "AI is parsing your resume..."
        );

        const { apiKeys, activeProvider } = useApiKeysStore.getState();
        const filteredKeys = Object.fromEntries(
          Object.entries(apiKeys).filter(([, v]) => v && v.trim().length > 0)
        );

        const body =
          input.kind === "text"
            ? { rawText: input.text, provider: activeProvider, apiKeys: filteredKeys }
            : {
                image: { mimeType: input.mimeType, base64: input.base64 },
                provider: activeProvider,
                apiKeys: filteredKeys,
              };

        const response = await fetch("/api/ai/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "AI parsing failed");
        }

        const { resume } = await response.json();
        onParsed(resume, file.name);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to parse file";
        setError(message);
      } finally {
        setParsing(false);
        setStatus("");
      }
    },
    [onParsed]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 transition-colors ${
        dragActive
          ? "border-sky-500 bg-sky-500/5"
          : "border-zinc-800 hover:border-zinc-600"
      }`}
    >
      {parsing ? (
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-sky-500" />
          <p className="text-sm text-zinc-400">{status}</p>
        </div>
      ) : (
        <>
          <UploadIcon />
          <p className="mt-4 text-sm text-zinc-400">
            Drag and drop your resume here, or
          </p>
          <label className="mt-3 cursor-pointer rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200">
            Browse Files
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          <p className="mt-3 text-xs text-zinc-600">PDF or image, max 10MB</p>
        </>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-zinc-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}
