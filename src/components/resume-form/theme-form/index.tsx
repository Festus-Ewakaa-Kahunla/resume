"use client";

import { BaseForm } from "@/components/resume-form/form";
import { useSettingsStore } from "@/stores/settings-store";
import {
  ENGLISH_FONT_FAMILIES,
  FONT_FAMILY_TO_DISPLAY_NAME,
} from "@/lib/pdf/fonts/constants";
import type { TypographyElement } from "@/types/settings";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

const TYPOGRAPHY_ELEMENTS: {
  key: TypographyElement;
  label: string;
}[] = [
  { key: "name", label: "Name" },
  { key: "sectionHeading", label: "Section Headings" },
  { key: "subtitle", label: "Subtitles" },
  { key: "body", label: "Body Text" },
  { key: "date", label: "Dates" },
];

const FONT_SIZE_OPTIONS = [
  "8", "9", "10", "11", "12", "13", "14", "16", "18", "20", "24", "28",
];

export const ThemeForm = () => {
  const settings = useSettingsStore((state) => state.settings);
  const changeGlobalFont = useSettingsStore((state) => state.changeGlobalFont);
  const changeGlobalFontSize = useSettingsStore((state) => state.changeGlobalFontSize);
  const changeTypography = useSettingsStore((state) => state.changeTypography);

  return (
    <BaseForm>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6 text-zinc-500" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-wide text-white">
            Typography
          </h1>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Default Font
          </p>
          <div className="flex gap-2">
            <select
              value={settings.fontFamily}
              onChange={(e) => changeGlobalFont(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
            >
              {ENGLISH_FONT_FAMILIES.map((font) => (
                <option key={font} value={font}>
                  {FONT_FAMILY_TO_DISPLAY_NAME[font]}
                </option>
              ))}
            </select>
            <select
              value={settings.fontSize}
              onChange={(e) => changeGlobalFontSize(e.target.value)}
              className="w-20 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
            >
              {FONT_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}pt
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1.5 text-xs text-zinc-600">
            Applies everywhere unless overridden below
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Per-Section
          </p>
          <div className="space-y-2">
            {TYPOGRAPHY_ELEMENTS.map(({ key, label }) => {
              const override = settings.typography?.[key];
              const effectiveFont = override?.fontFamily ?? settings.fontFamily;
              const effectiveSize = override?.fontSize ?? settings.fontSize;
              const effectiveWeight = override?.fontWeight ?? "normal";

              return (
                <div
                  key={key}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5"
                >
                  <p className="mb-2 text-xs text-zinc-400">{label}</p>
                  <div className="flex gap-1.5">
                    <select
                      value={effectiveFont}
                      onChange={(e) =>
                        changeTypography(key, { fontFamily: e.target.value })
                      }
                      className="flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-white focus:border-zinc-600 focus:outline-none"
                    >
                      {ENGLISH_FONT_FAMILIES.map((font) => (
                        <option key={font} value={font}>
                          {FONT_FAMILY_TO_DISPLAY_NAME[font]}
                        </option>
                      ))}
                    </select>
                    <select
                      value={effectiveSize}
                      onChange={(e) =>
                        changeTypography(key, { fontSize: e.target.value })
                      }
                      className="w-16 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-white focus:border-zinc-600 focus:outline-none"
                    >
                      {FONT_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        changeTypography(key, {
                          fontWeight:
                            effectiveWeight === "bold" ? "normal" : "bold",
                        })
                      }
                      className={`rounded border px-2 py-1 text-xs font-bold transition-colors ${
                        effectiveWeight === "bold"
                          ? "border-white bg-white text-black"
                          : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-white"
                      }`}
                    >
                      B
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BaseForm>
  );
};
