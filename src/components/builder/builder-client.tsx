"use client";

import { useState } from "react";
import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview/resume-preview";
import { AiPanel } from "@/components/ai/ai-panel";

export function BuilderClient() {
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  return (
    <div
      className="flex h-dvh flex-col"
      style={{
        backgroundColor: "#141415",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <div className="flex flex-1 overflow-hidden p-3 gap-3">
        {/* Form panel */}
        <div
          className={`w-full overflow-y-auto overscroll-contain rounded-xl border border-zinc-800/60 bg-[#0a0a0a] md:block md:w-[520px] md:shrink-0 ${
            mobileView === "edit" ? "block" : "hidden"
          }`}
        >
          <ResumeForm />
          <AiPanel />
        </div>

        {/* Preview panel */}
        <div
          className={`flex-1 overflow-hidden rounded-xl md:block ${
            mobileView === "preview" ? "block" : "hidden"
          }`}
        >
          <ResumePreview />
        </div>
      </div>

      {/* Mobile bottom tabs */}
      <div className="flex shrink-0 border-t border-zinc-800 md:hidden">
        <button
          onClick={() => setMobileView("edit")}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            mobileView === "edit"
              ? "bg-zinc-900 text-white"
              : "text-zinc-500"
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            mobileView === "preview"
              ? "bg-zinc-900 text-white"
              : "text-zinc-500"
          }`}
        >
          Preview
        </button>
      </div>
    </div>
  );
}
