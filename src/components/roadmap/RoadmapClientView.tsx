"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CategoryConfig } from "@/lib/curriculum";
import { ConceptMeta } from "@/lib/types";
import { useProgress } from "@/context/ProgressContext";
import {
  ChevronDown,
  Check,
  Clock,
  ArrowRight,
  Sigma,
  Code2,
  Cpu,
  Network,
  MessageSquareCode,
  Layers,
  Sparkles,
  Database,
  Bot,
} from "lucide-react";

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  mathematics: Sigma,
  "python-programming": Code2,
  "machine-learning": Cpu,
  "deep-learning": Network,
  nlp: MessageSquareCode,
  transformers: Layers,
  "generative-ai": Sparkles,
  rag: Database,
  "ai-agents": Bot,
};

const ICON_COLORS: Record<string, string> = {
  mathematics: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  "python-programming": "border-blue-500/30 bg-blue-500/10 text-blue-400",
  "machine-learning": "border-amber-500/30 bg-amber-500/10 text-amber-400",
  "deep-learning": "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  nlp: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  transformers: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  "generative-ai": "border-orange-500/30 bg-orange-500/10 text-orange-400",
  rag: "border-teal-500/30 bg-teal-500/10 text-teal-400",
  "ai-agents": "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

interface StageItem {
  config: CategoryConfig;
  concepts: ConceptMeta[];
}

export default function RoadmapClientView({ stages }: { stages: StageItem[] }) {
  const { isCompleted, toggleComplete } = useProgress();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const toggleStage = (slug: string) => {
    setOpenSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-white">
      <div className="mx-auto max-w-4xl px-4 pt-14 pb-24 sm:px-8">
        {/* Header (Screen 4) */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Your AI Learning Roadmap
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            A step-by-step guide to go from complete beginner to AI practitioner.
            Click on any stage to explore the topics.
          </p>
        </div>

        {/* Vertical Timeline Stages (1 to 9) */}
        <div className="relative mt-12">
          {/* Vertical connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500/60 via-purple-500/40 to-indigo-500/20 sm:left-6"
          />

          <div className="space-y-5">
            {stages.map(({ config, concepts }) => {
              const IconComponent = STAGE_ICONS[config.slug] || Cpu;
              const iconStyle =
                ICON_COLORS[config.slug] || ICON_COLORS["machine-learning"];
              const isOpen = openSlug === config.slug;
              const topicCount = concepts.length;

              return (
                <div
                  key={config.slug}
                  className="relative flex items-start gap-4 sm:gap-6"
                >
                  {/* Left Numbered Circle Node */}
                  <button
                    type="button"
                    onClick={() => toggleStage(config.slug)}
                    className={`relative z-10 mt-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-all sm:h-12 sm:w-12 ${
                      isOpen
                        ? "border-indigo-400 bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                        : "border-indigo-500/40 bg-[#0B0E17] text-indigo-300 hover:border-indigo-400"
                    }`}
                  >
                    {config.stage}
                  </button>

                  {/* Right Stage Accordion Card */}
                  <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0E17] transition-all hover:border-indigo-500/30">
                    <button
                      type="button"
                      onClick={() => toggleStage(config.slug)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconStyle}`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-bold text-white sm:text-xl">
                            {config.title}
                          </h2>
                          <p className="mt-0.5 truncate text-xs text-slate-400 sm:text-sm">
                            {config.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300">
                          {topicCount} {topicCount === 1 ? "topic" : "topics"}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-indigo-400" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expanded Topics List */}
                    {isOpen && (
                      <div className="border-t border-white/[0.08] bg-[#070910] px-5 py-4 sm:px-6">
                        {concepts.length === 0 ? (
                          <div className="flex items-center justify-between py-2 text-xs text-slate-400">
                            <span>
                              Topics for {config.title} are being added to the
                              curriculum.
                            </span>
                            <Link
                              href={`/category/${config.slug}`}
                              className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                              <span>View Category</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {concepts.map((topic) => {
                              const done = isCompleted(topic.slug);
                              return (
                                <div
                                  key={topic.slug}
                                  className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0B0E17] px-4 py-3 transition-colors hover:border-indigo-500/30"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => toggleComplete(topic.slug)}
                                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                                        done
                                          ? "border-emerald-500 bg-emerald-500 text-black"
                                          : "border-slate-600 bg-transparent hover:border-emerald-400"
                                      }`}
                                      aria-label="Toggle completion"
                                    >
                                      {done && (
                                        <Check className="h-3 w-3 stroke-[3]" />
                                      )}
                                    </button>
                                    <Link
                                      href={`/concepts/${topic.slug}`}
                                      className="truncate text-sm font-semibold text-slate-200 hover:text-indigo-300"
                                    >
                                      {topic.title}
                                    </Link>
                                  </div>

                                  <Link
                                    href={`/concepts/${topic.slug}`}
                                    className="flex shrink-0 items-center gap-3 text-xs text-slate-400 hover:text-white"
                                  >
                                    <span className="hidden items-center gap-1 sm:inline-flex">
                                      <Clock className="h-3 w-3" />
                                      {topic.readTime}
                                    </span>
                                    <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                                  </Link>
                                </div>
                              );
                            })}

                            <div className="pt-2 text-right">
                              <Link
                                href={`/category/${config.slug}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                              >
                                <span>Explore all in {config.title}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}