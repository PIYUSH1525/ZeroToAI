"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ConceptMeta, TocItem } from "@/lib/types";
import { useProgress } from "@/context/ProgressContext";
import {
  Clock,
  Code2,
  Check,
  Bookmark,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  FileText,
  Sparkles,
} from "lucide-react";

interface ConceptClientShellProps {
  meta: ConceptMeta;
  toc: TocItem[];
  prevConcept: ConceptMeta | null;
  nextConcept: ConceptMeta | null;
  relatedConcepts: ConceptMeta[];
  children: React.ReactNode;
}

export default function ConceptClientShell({
  meta,
  toc,
  prevConcept,
  nextConcept,
  relatedConcepts,
  children,
}: ConceptClientShellProps) {
  const {
    isCompleted,
    toggleComplete,
    isBookmarked,
    toggleBookmark,
    setLastVisited,
  } = useProgress();

  const [activeTab, setActiveTab] = useState<
    "content" | "code" | "visuals" | "related"
  >("content");
  const [activeTocId, setActiveTocId] = useState<string>(toc[0]?.id || "");

  const completed = isCompleted(meta.slug);
  const bookmarked = isBookmarked(meta.slug);

  // Track this lesson as the user's most recently visited module for the Dashboard
  useEffect(() => {
    setLastVisited(meta.slug);
  }, [meta.slug, setLastVisited]);

  // Scroll-spy for the sticky left Table of Contents
  useEffect(() => {
    if (toc.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      let currentId = toc[0].id;

      for (const item of toc) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentId = item.id;
        }
      }
      setActiveTocId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const scrollToSection = (id: string) => {
    setActiveTab("content");
    setActiveTocId(id);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 30);
  };

  // Find sections by their declared type (data-type in the MDX), never by guessing from the title.
  const codeSection = toc.find((t) => t.type === "code");
  const visualSection = toc.find((t) => t.type === "visualization");

  type TabId = "content" | "code" | "visuals" | "related";

  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab);

    if (tab === "code" && codeSection) {
      scrollToSection(codeSection.id);
    } else if (tab === "visuals" && visualSection) {
      scrollToSection(visualSection.id);
    }
  };

  // Only show the Code / Visualizations buttons when the lesson really has such a section.
  const subTabs: { id: TabId; label: string }[] = [
    { id: "content", label: "Content" },
    ...(codeSection ? [{ id: "code" as const, label: "Code" }] : []),
    ...(visualSection ? [{ id: "visuals" as const, label: "Visualizations" }] : []),
    { id: "related", label: "Related" },
  ];

  return (
    <div className="min-h-screen bg-[#05070E] text-white">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-24 sm:px-8">
        {/* 1. Breadcrumbs (Screen 3) */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400"
        >
          <Link
            href={`/category/${meta.categorySlug}`}
            className="transition-colors hover:text-white"
          >
            {meta.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <Link
            href={`/category/${meta.categorySlug}`}
            className="transition-colors hover:text-white"
          >
            {meta.subcategory}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-indigo-300">{meta.title}</span>
        </nav>

        {/* 2. Topic Header & Mark as Completed CTA (Screen 3) */}
        <div className="border-b border-white/[0.08] pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {meta.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {meta.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {meta.readTime}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 font-medium text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                {meta.difficulty}
              </span>

              {meta.hasCode && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <Code2 className="h-3.5 w-3.5 text-slate-400" />
                  Code Examples
                </span>
              )}
            </div>

            {/* Bookmark + Mark as Completed Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleBookmark(meta.slug)}
                aria-label={bookmarked ? "Remove bookmark" : "Bookmark topic"}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                  bookmarked
                    ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-300"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${bookmarked ? "fill-indigo-400" : ""}`}
                />
              </button>

              <button
                type="button"
                onClick={() => toggleComplete(meta.slug)}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                  completed
                    ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                    : "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:bg-indigo-500"
                }`}
              >
                {completed && <Check className="h-4 w-4 stroke-[2.5]" />}
                <span>{completed ? "Completed" : "Mark as Completed"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Sub-navigation Bar: Content | Code | Visualizations | Related (Screen 3) */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto border-b border-white/[0.08] pb-3">
          {subTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  isActive
                    ? "border border-indigo-500/40 bg-indigo-600/20 text-indigo-300"
                    : "border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4. Main 2-Column Reader Body (Screen 3) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Sticky Table of Contents Sidebar */}
          {toc.length > 0 && (
            <aside className="lg:col-span-3">
              <div className="sticky top-24 rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-4">
                <div className="mb-3 px-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  On This Page
                </div>
                <nav className="space-y-1">
                  {toc.map((item) => {
                    const isCurrent = activeTocId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-all ${
                          isCurrent
                            ? "border-l-2 border-indigo-400 bg-indigo-600/15 font-semibold text-indigo-300"
                            : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{item.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}

          {/* Right Content Column */}
          <div className={toc.length > 0 ? "lg:col-span-9" : "lg:col-span-12"}>
            {activeTab === "related" ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-6">
                <h2 className="mb-4 text-xl font-bold text-white">
                  Related Topics in {meta.category}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {relatedConcepts.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/concepts/${rel.slug}`}
                      className="rounded-xl border border-white/10 bg-[#070910] p-4 transition-colors hover:border-indigo-500/40"
                    >
                      <div className="text-xs font-medium text-indigo-400">
                        {rel.subcategory} • {rel.readTime}
                      </div>
                      <div className="mt-1 text-base font-bold text-white">
                        {rel.title}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                        {rel.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0B0E17]/70 p-6 sm:p-8">
                {children}
              </div>
            )}

            {/* 5. Previous & Next Lesson Footer Cards (Screen 3) */}
            <div className="mt-10 grid grid-cols-1 gap-4 border-t border-white/[0.08] pt-8 sm:grid-cols-2">
              {prevConcept ? (
                <Link
                  href={`/concepts/${prevConcept.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0B0E17] p-4 transition-all hover:border-indigo-500/40"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:-translate-x-1 group-hover:text-indigo-400" />
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">Previous</div>
                    <div className="truncate text-sm font-bold text-white group-hover:text-indigo-300">
                      {prevConcept.title}
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextConcept ? (
                <Link
                  href={`/concepts/${nextConcept.slug}`}
                  className="group flex items-center justify-end gap-3 rounded-xl border border-white/[0.08] bg-[#0B0E17] p-4 text-right transition-all hover:border-indigo-500/40"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">Next</div>
                    <div className="truncate text-sm font-bold text-white group-hover:text-indigo-300">
                      {nextConcept.title}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}