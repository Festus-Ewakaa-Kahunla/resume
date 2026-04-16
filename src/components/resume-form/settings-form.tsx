"use client";

import { BaseForm } from "@/components/resume-form/form";
import { useSettingsStore } from "@/stores/settings-store";
import {
  ENGLISH_FONT_FAMILIES,
  FONT_FAMILY_TO_DISPLAY_NAME,
} from "@/lib/pdf/fonts/constants";
import type { TypographyElement } from "@/types/settings";

const SIZE_OPTIONS = [
  "8", "9", "10", "10.5", "11", "12", "13", "14", "16", "18", "20", "22", "24", "28",
];

interface TypoControl {
  key: TypographyElement;
  label: string;
  description: string;
}

const TYPO_CONTROLS: TypoControl[] = [
  {
    key: "name",
    label: "Your Name",
    description: "The big heading at the top of your resume",
  },
  {
    key: "sectionHeading",
    label: "Section Titles",
    description: "EDUCATION, SKILLS, EXPERIENCE",
  },
  {
    key: "subtitle",
    label: "Company / School",
    description: "Organization names — bold",
  },
  {
    key: "detail",
    label: "Role / Degree",
    description: "Job title or degree — italic",
  },
  {
    key: "body",
    label: "Bullet Points",
    description: "Descriptions and content",
  },
  {
    key: "date",
    label: "Dates",
    description: "Time periods next to roles",
  },
];

export const SettingsForm = () => {
  const settings = useSettingsStore((s) => s.settings);
  const changeGlobalFont = useSettingsStore((s) => s.changeGlobalFont);
  const changeTypography = useSettingsStore((s) => s.changeTypography);

  return (
    <BaseForm>
      <div className="flex items-center gap-3">
        <span className="flex-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          Settings
        </span>
      </div>

      <p className="text-[11px] text-zinc-600">
        Adjust the font and size for every part of your resume. Changes apply
        instantly.
      </p>

      <div className="mt-2 flex flex-col gap-5">
        {/* Font family */}
        <div>
          <p className="mb-1 text-[11px] font-medium text-zinc-300">Typeface</p>
          <p className="mb-2 text-[10px] text-zinc-600">
            One font for the whole resume keeps it clean.
          </p>
          <select
            value={settings.fontFamily}
            onChange={(e) => changeGlobalFont(e.target.value)}
            className="block w-full rounded-md border-0 bg-white/[0.04] px-3 py-2 text-[13px] text-white outline-none focus:bg-white/[0.07] focus:ring-1 focus:ring-zinc-700 transition-colors"
          >
            {ENGLISH_FONT_FAMILIES.map((font) => (
              <option key={font} value={font}>
                {FONT_FAMILY_TO_DISPLAY_NAME[font]}
              </option>
            ))}
          </select>
        </div>

        {/* Font sizes */}
        <div>
          <p className="mb-1 text-[11px] font-medium text-zinc-300">
            Font Sizes
          </p>
          <p className="mb-3 text-[10px] text-zinc-600">
            Each part of your resume can have its own size.
          </p>

          <div className="flex flex-col gap-2">
            {TYPO_CONTROLS.map(({ key, label, description }) => {
              const override = settings.typography?.[key];
              const size = override?.fontSize ?? settings.fontSize;
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-md border border-zinc-800/60 bg-white/[0.02] px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-zinc-200">
                      {label}
                    </p>
                    <p className="text-[10px] text-zinc-600 truncate">
                      {description}
                    </p>
                  </div>
                  <select
                    value={size}
                    onChange={(e) =>
                      changeTypography(key, { fontSize: e.target.value })
                    }
                    className="w-20 shrink-0 rounded-md border-0 bg-white/[0.04] px-2 py-1 text-[12px] text-white outline-none focus:bg-white/[0.07] focus:ring-1 focus:ring-zinc-700 transition-colors"
                  >
                    {SIZE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}pt
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BaseForm>
  );
};
