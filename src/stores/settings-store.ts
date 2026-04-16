import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  ResumeSettings,
  ShowForm,
  FormWithBulletPoints,
  TypographyElement,
  TypographyOverride,
} from "@/types/settings";
import { initialSettings } from "@/types/settings";

interface SettingsStore {
  settings: ResumeSettings;

  changeGlobalFont: (fontFamily: string) => void;
  changeGlobalFontSize: (fontSize: string) => void;
  changeTypography: (element: TypographyElement, override: TypographyOverride) => void;
  resetTypography: (element: TypographyElement) => void;
  changeShowForm: (form: ShowForm, value: boolean) => void;
  changeFormHeading: (form: ShowForm, value: string) => void;
  changeFormOrder: (form: ShowForm, direction: "up" | "down") => void;
  changeShowBulletPoints: (form: FormWithBulletPoints, value: boolean) => void;
  setSettings: (settings: ResumeSettings) => void;

  getEffectiveFont: (element?: TypographyElement) => {
    fontFamily: string;
    fontSize: string;
    fontWeight: "normal" | "bold";
  };
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    immer((set, get) => ({
      settings: initialSettings,

      changeGlobalFont: (fontFamily) =>
        set((state) => {
          state.settings.fontFamily = fontFamily;
        }),

      changeGlobalFontSize: (fontSize) =>
        set((state) => {
          state.settings.fontSize = fontSize;
        }),

      changeTypography: (element, override) =>
        set((state) => {
          if (!state.settings.typography) state.settings.typography = {};
          state.settings.typography[element] = {
            ...state.settings.typography[element],
            ...override,
          };
        }),

      resetTypography: (element) =>
        set((state) => {
          if (state.settings.typography) {
            delete state.settings.typography[element];
          }
        }),

      changeShowForm: (form, value) =>
        set((state) => {
          state.settings.formToShow[form] = value;
        }),

      changeFormHeading: (form, value) =>
        set((state) => {
          state.settings.formToHeading[form] = value;
        }),

      changeFormOrder: (form, direction) =>
        set((state) => {
          const order = state.settings.formsOrder;
          const pos = order.indexOf(form);
          const targetPos = direction === "up" ? pos - 1 : pos + 1;

          if (targetPos < 0 || targetPos >= order.length) return;

          const temp = order[pos];
          order[pos] = order[targetPos];
          order[targetPos] = temp;
        }),

      changeShowBulletPoints: (form, value) =>
        set((state) => {
          state.settings.showBulletPoints[form] = value;
        }),

      setSettings: (settings) =>
        set((state) => {
          state.settings = settings;
        }),

      getEffectiveFont: (element) => {
        const { settings } = get();
        const override = element ? settings.typography?.[element] : undefined;
        return {
          fontFamily: override?.fontFamily ?? settings.fontFamily,
          fontSize: override?.fontSize ?? settings.fontSize,
          fontWeight: override?.fontWeight ?? "normal",
        };
      },
    })),
    {
      name: "resume-settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
      version: 2,
    }
  )
);
