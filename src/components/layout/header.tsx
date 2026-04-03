"use client";

import { SettingsPopover } from "@/components/settings/settings-popover";

export function Header() {
  return (
    <header className="border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-end px-4">
        <SettingsPopover />
      </div>
    </header>
  );
}
