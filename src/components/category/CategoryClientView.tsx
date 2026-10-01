"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ConceptMeta } from "@/lib/types";
import { CategoryConfig } from "@/lib/curriculum";
import { useProgress } from "@/context/ProgressContext";
import {
  Check,
  Clock,
  ArrowRight,
  ChevronRight,
  Cpu,
  BookOpen,
} from "lucide-react";

interface CategoryClientViewProps {
  config: CategoryConfig;
  concepts: ConceptMeta[];
}

export default function CategoryClientView({
  config,
  concepts,
}: CategoryClientViewProps) {
  const { isCompleted, toggleComplete } = useProgress();
  const [activeTab, setActiveTab] = useState<string>("All Topics");

  // Calculate dynamic category progress (Screens 2 & 10)
  const completedCount = useMemo(
    () => concepts.filter((c) => isCompleted(c.slug)).length,
    [concepts, isCompleted]
  );
  const totalCount = concepts.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find the next uncompleted topic for the "Continue Learning" button
  const nextTopic = useMemo(() => {
    return (
      concepts.find((c) => !isCompleted(c.slug)) ||
      concepts[0] ||
      null
    );
  }, [concepts, isCompleted]);

  // Build subcategory tabs from curriculum config + existing concepts
  const tabs = useMemo(() => {
    const set = new Set<string>(["All Topics"]);
    config.subcategories.forEach((sub) => set.add(sub));
    concepts.forEach((c) => {
      if (c.subcategory) set.add(c.subcategory);
    });
    return Array.from(set);
  }, [config.subcategories, concepts]);

  // Group topics by subcategory
  const groupedSections = useMemo(() => {
    const filtered =
      activeTab === "All Topics"
        ? concepts
        : concepts.filter((c) => c.subcategory === activeTab);

    const groups: Record<string, ConceptMeta[]> = {};
    for (const item of filtered) {
      const groupName = item.subcategory || "Foundations";
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    }
    return Object.entries(groups);
  }, [concepts, activeTab]);

  return (
    <div className="min-h-screen bg-[#05070E] text-white">
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-24 sm:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400"
        >
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-slate-200">{config.title}</span>
        </nav>

        {/* Category Header Banner (Screen 2) */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl"
          />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {config.title}
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400 sm:text-base">
                {config.longDescription}
              </p>
            </div>

            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 md:flex">
              <Cpu className="h-10 w-10" />
            </div>
          </div>

          {/* Progress Bar & Continue Learning CTA */}
          <div className="mt-8 flex flex-col justify-between gap-6 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-end">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Your Progress
                </span>
                <span className="font-mono text-slate-400">
                  {completedCount} / {totalCount} completed
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-mono text-xs font-bold text-slate-200">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {nextTopic && (
              <Link
                href={`/concepts/${nextTopic.slug}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-colors hover:bg-indigo-500"
              >
                <span>Continue Learning</span>
              </Link>
            )}
          </div>
        </div>

        {/* Subcategory Filter Tabs */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto border-b border-white/[0.08] pb-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Grouped Topic List */}
        {groupedSections.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/10 bg-[#0B0E17]/60 p-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-indigo-400" />
            <h3 className="mt-3 text-base font-bold text-white">
              Modules Coming Soon
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
              Add an .mdx lesson with category &ldquo;{config.title}&rdquo; inside
              content/concepts/ to populate this section automatically.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {groupedSections.map(([sectionTitle, items]) => (
              <div key={sectionTitle}>
                <div className="mb-4 flex items-baseline gap-2.5">
                  <h2 className="text-xl font-bold text-white">
                    {sectionTitle}
                  </h2>
                  <span className="text-xs text-slate-500">
                    ({items.length} {items.length === 1 ? "topic" : "topics"})
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((topic) => {
                    const done = isCompleted(topic.slug);

                    return (
                      <div
                        key={topic.slug}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0B0E17] px-5 py-4 transition-all hover:border-indigo-500/40 hover:bg-[#0E121E]"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          {/* Interactive Completion Checkmark Button */}
                          <button
                            type="button"
                            onClick={() => toggleComplete(topic.slug)}
                            aria-label={
                              done ? "Mark as incomplete" : "Mark as completed"
                            }
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                              done
                                ? "border-emerald-500 bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                                : "border-slate-600 bg-transparent hover:border-emerald-400"
                            }`}
                          >
                            {done && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </button>

                          <Link
                            href={`/concepts/${topic.slug}`}
                            className="min-w-0 flex-1"
                          >
                            <h3 className="truncate text-base font-bold text-white transition-colors group-hover:text-indigo-300">
                              {topic.title}
                            </h3>
                            <p className="mt-0.5 truncate text-xs text-slate-400 sm:text-sm">
                              {topic.description}
                            </p>
                          </Link>
                        </div>

                        <Link
                          href={`/concepts/${topic.slug}`}
                          className="flex shrink-0 items-center gap-4 text-xs text-slate-400 group-hover:text-white"
                        >
                          <span className="hidden items-center gap-1.5 sm:inline-flex">
                            <Clock className="h-3.5 w-3.5 text-slate-500" />
                            {topic.readTime}
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}