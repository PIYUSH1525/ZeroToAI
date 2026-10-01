"use client";

import React from "react";
import { Search } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

export default function HeroSearchTrigger() {
  const { openSearch } = useProgress();

  return (
    <button
      type="button"
      onClick={openSearch}
      className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-[#0A0E19]/90 px-4 py-3.5 text-left text-sm text-slate-400 shadow-[0_0_25px_rgba(99,102,241,0.12)] transition-all hover:border-indigo-500/50 hover:text-slate-200"
    >
      <div className="flex items-center gap-3">
        <Search className="h-4 w-4 text-indigo-400" />
        <span>Search concepts, models, or topics...</span>
      </div>
      <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-xs text-slate-400">
        ⌘K
      </kbd>
    </button>
  );
}