"use client";

import { useState, useRef, useEffect } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import {
  ENGLISH_FONT_FAMILIES,
  FONT_FAMILY_TO_DISPLAY_NAME,
} from "@/lib/pdf/fonts/constants";
import type { TypographyElement } from "@/types/settings";

const SIZES = ["8", "9", "10", "11", "12", "13", "14", "16", "18", "20", "24"];

interface FontToolbarProps {
  element: TypographyElement;
}

export function FontToolbar({ element }: FontToolbarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const settings = useSettingsStore((state) => state.settings);
  const changeTypography = useSettingsStore((state) => state.changeTypography);

  const override = settings.typography?.[element];
  const hasOverride = override?.fontFamily || override?.fontSize || override?.fontWeight;
  const effectiveFont = override?.fontFamily ?? settings.fontFamily;
  const effectiveSize = override?.fontSize ?? settings.fontSize;
  const effectiveWeight = override?.fontWeight ?? "normal";

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`rounded px-1.5 py-0.5 text-[10px] transition-colors ${
          hasOverride
            ? "bg-zinc-800 text-zinc-300"
            : "text-zinc-600 hover:text-zinc-400"
        }`}
        title="Font settings"
      >
        Aa
      </button>
      <div
        className={`absolute right-0 top-full z-50 mt-1 flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 p-1.5 shadow-xl transition-all duration-150 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <select
          value={effectiveFont}
          onChange={(e) => changeTypography(element, { fontFamily: e.target.value })}
          className="h-6 rounded border border-zinc-700 bg-zinc-800 px-1 text-[10px] text-white focus:border-zinc-500 focus:outline-none"
        >
          {ENGLISH_FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>
              {FONT_FAMILY_TO_DISPLAY_NAME[font]}
            </option>
          ))}
        </select>
        <select
          value={effectiveSize}
          onChange={(e) => changeTypography(element, { fontSize: e.target.value })}
          className="h-6 w-12 rounded border border-zinc-700 bg-zinc-800 px-1 text-[10px] text-white focus:border-zinc-500 focus:outline-none"
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() =>
            changeTypography(element, {
              fontWeight: effectiveWeight === "bold" ? "normal" : "bold",
            })
          }
          className={`h-6 w-6 rounded text-[10px] font-bold transition-colors ${
            effectiveWeight === "bold"
              ? "bg-white text-black"
              : "border border-zinc-700 text-zinc-500 hover:text-white"
          }`}
        >
          B
        </button>
      </div>
    </div>
  );
}
