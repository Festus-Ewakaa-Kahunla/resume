"use client";

import { useState, useRef, useEffect } from "react";
import { Cog6ToothIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useApiKeysStore } from "@/stores/api-keys-store";
import { PROVIDER_CONFIGS } from "@/lib/ai/config";
import { AI_PROVIDERS } from "@/lib/ai/types";
import type { AiProviderName } from "@/lib/ai/types";

export function SettingsPopover() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const apiKeys = useApiKeysStore((s) => s.apiKeys);
  const activeProvider = useApiKeysStore((s) => s.activeProvider);
  const setApiKey = useApiKeysStore((s) => s.setApiKey);
  const setActiveProvider = useApiKeysStore((s) => s.setActiveProvider);

  const [draftKey, setDraftKey] = useState(apiKeys[activeProvider] ?? "");
  const [draftProvider, setDraftProvider] = useState(activeProvider);

  useEffect(() => {
    setDraftKey(apiKeys[draftProvider] ?? "");
  }, [draftProvider, apiKeys]);

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

  const handleSave = () => {
    setApiKey(draftProvider, draftKey.trim());
    setActiveProvider(draftProvider);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        title="Settings"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>

      <div
        className={`absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl transition-all duration-150 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <p className="mb-3 text-xs font-medium text-zinc-400">AI Provider</p>

        {/* Provider toggle */}
        <div className="mb-3 flex gap-1">
          {AI_PROVIDERS.map((p) => {
            const hasKey = (apiKeys[p]?.trim().length ?? 0) > 0;
            return (
              <button
                key={p}
                onClick={() => setDraftProvider(p)}
                className={`rounded px-2 py-1 text-[11px] transition-colors ${
                  draftProvider === p
                    ? "border border-zinc-600 bg-zinc-800 text-white"
                    : hasKey
                      ? "border border-transparent bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      : "border border-transparent bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                }`}
              >
                {PROVIDER_CONFIGS[p].displayName.split(" ")[0]}
              </button>
            );
          })}
        </div>

        {/* API key input */}
        <div className="flex items-center gap-1.5">
          <input
            type={visible ? "text" : "password"}
            value={draftKey}
            onChange={(e) => setDraftKey(e.target.value)}
            placeholder="Paste API key"
            className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="rounded p-1 text-zinc-500 hover:text-white"
          >
            {visible ? (
              <EyeSlashIcon className="h-3.5 w-3.5" />
            ) : (
              <EyeIcon className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Save */}
        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={handleSave}
            className="w-full rounded-lg border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            {saved ? "Saved" : "Save"}
          </button>
          <p className="text-center text-[10px] text-zinc-600">Stored in your browser only</p>
        </div>
      </div>
    </div>
  );
}
