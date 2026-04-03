import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AiProviderName } from "@/lib/ai/types";

type ApiKeyMap = Partial<Record<AiProviderName, string>>;

interface ApiKeysStore {
  apiKeys: ApiKeyMap;
  activeProvider: AiProviderName;
  setApiKey: (provider: AiProviderName, key: string) => void;
  clearApiKey: (provider: AiProviderName) => void;
  setActiveProvider: (provider: AiProviderName) => void;
}

export const useApiKeysStore = create<ApiKeysStore>()(
  persist(
    (set) => ({
      apiKeys: {},
      activeProvider: "gemini" as AiProviderName,
      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key },
        })),
      clearApiKey: (provider) =>
        set((state) => {
          const next = { ...state.apiKeys };
          delete next[provider];
          return { apiKeys: next };
        }),
      setActiveProvider: (provider) => set({ activeProvider: provider }),
    }),
    {
      name: "resume-api-keys",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
