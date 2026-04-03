"use client";

import { useEffect } from "react";
import { useSetDefaultScale } from "@/hooks/use-set-default-scale";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import type { JSX } from "react";

function ResumeControlBar({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document });

  useEffect(() => {
    update(document);
  }, [update, document]);

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-12 items-center justify-center border-t border-white/[0.06] bg-white/[0.03] px-4 text-zinc-400 backdrop-blur-xl lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
          className="accent-white"
        />
        <div className="w-10 text-xs">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden cursor-pointer items-center gap-1.5 text-xs lg:flex">
          <button
            role="checkbox"
            aria-checked={scaleOnResize}
            onClick={() => setScaleOnResize((prev) => !prev)}
            className={`flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border transition-colors ${
              scaleOnResize
                ? "border-white/20 bg-white/15"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            {scaleOnResize && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <span className="hidden text-xs text-zinc-500 lg:block">
        Best practice: keep your resume to 1-2 pages
      </span>
      {instance.url ? (
        <a
          className="ml-1 flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white lg:ml-8"
          href={instance.url}
          download={fileName}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Download</span>
        </a>
      ) : (
        <span className="ml-1 flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-1.5 text-sm text-zinc-600 lg:ml-8">
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Download</span>
        </span>
      )}
    </div>
  );
}

export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  { ssr: false }
);
