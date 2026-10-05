"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ConceptMeta } from "@/lib/types";
import { CategoryConfig } from "@/lib/curriculum";
import { useProgress } from "@/context/ProgressContext";
import {
  CheckCircle2,
  Flame,
  Bookmark,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  UserCheck,
  Trash2,
  Settings,
  RotateCcw,
} from "lucide-react";

interface CategoryGroup {
  config: CategoryConfig;
  concepts: ConceptMeta[];
}

interface DashboardClientViewProps {
  categories: CategoryGroup[];
  allConcepts: ConceptMeta[];
}

type DashboardTab = "overview" | "progress" | "bookmarks" | "settings";

export default function DashboardClientView({
  categories,
  allConcepts,
}: DashboardClientViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    user,
    completedSlugs,
    bookmarkedSlugs,
    streakDays,
    lastVisitedSlug,
    openAuthModal,
    toggleBookmark,
    toggleComplete,
    resetProgress,
    isCompleted,
    signOut,
  } = useProgress();

  // Derive active tab directly from URL query (?tab=overview | progress | bookmarks | settings)
  const tabParam = searchParams.get("tab");
  const activeTab: DashboardTab =
    tabParam === "progress" ||
    tabParam === "bookmarks" ||
    tabParam === "settings"
      ? tabParam
      : "overview";

  const handleTabChange = (tab: DashboardTab) => {
    router.replace(`/dashboard?tab=${tab}`, { scroll: false });
  };

  const totalTopics = allConcepts.length;
  const completedCount = useMemo(
    () => allConcepts.filter((c) => completedSlugs.includes(c.slug)).length,
    [allConcepts, completedSlugs]
  );
  const overallPercent =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const continueConcept = useMemo(() => {
    if (lastVisitedSlug) {
      const found = allConcepts.find((c) => c.slug === lastVisitedSlug);
      if (found) return found;
    }
    return (
      allConcepts.find((c) => !completedSlugs.includes(c.slug)) ||
      allConcepts[0] ||
      null
    );
  }, [allConcepts, lastVisitedSlug, completedSlugs]);

  const bookmarkedConcepts = useMemo(
    () => allConcepts.filter((c) => bookmarkedSlugs.includes(c.slug)),
    [allConcepts, bookmarkedSlugs]
  );

  const completedConcepts = useMemo(
    () => allConcepts.filter((c) => completedSlugs.includes(c.slug)),
    [allConcepts, completedSlugs]
  );

  const handleResetProgress = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (window.confirm("Reset all completed topics? This cannot be undone.")) {
      resetProgress();
    }
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-white">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-8">
        {/* Top Greeting Banner */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back, {user ? user.name : "Explorer"}!
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Track your AI curriculum mastery, resume lessons, and review saved
              concepts.
            </p>
          </div>

          {!user && (
            <button
              type="button"
              onClick={openAuthModal}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-indigo-500/40 bg-indigo-600/20 px-4 py-2.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-600/30 sm:self-auto sm:text-sm"
            >
              <UserCheck className="h-4 w-4" />
              <span>Sign in to sync progress</span>
            </button>
          )}
        </div>

        {/* 3 Key Metrics Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* Card 1: Completed Topics */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Completed Topics
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {completedCount}
              </span>
              <span className="text-sm text-slate-500">/ {totalTopics}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
              <span className="font-mono text-xs text-emerald-400">
                {overallPercent}%
              </span>
            </div>
          </div>

          {/* Card 2: Learning Streak */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Current Streak
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {streakDays} {streakDays === 1 ? "Day" : "Days"}
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {user
                ? "Daily login check-in active. Keep showing up!"
                : "Sign in to start tracking your daily login streak."}
            </p>
          </div>

          {/* Card 3: Bookmarked Topics */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Bookmarked
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <Bookmark className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {bookmarkedConcepts.length}
              </span>
              <span className="text-sm text-slate-500">saved topics</span>
            </div>
            <button
              type="button"
              onClick={() => handleTabChange("bookmarks")}
              className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View saved list →
            </button>
          </div>
        </div>

        {/* Continue Learning Spotlight Card */}
        {continueConcept && activeTab === "overview" && (
          <div className="mt-8 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#0B0E17] via-[#111629] to-[#0B0E17] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Continue Learning</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-white">
                  {continueConcept.title}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-slate-400">
                  {continueConcept.description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                  <span>{continueConcept.category}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {continueConcept.readTime}
                  </span>
                  <span>•</span>
                  <span>{continueConcept.difficulty}</span>
                </div>
              </div>

              <Link
                href={`/concepts/${continueConcept.slug}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-colors hover:bg-indigo-500"
              >
                <span>Resume Topic</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 4 Navigation Tabs matching the Avatar Dropdown Menu */}
        <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
          {(
            [
              { id: "overview", label: "Dashboard Overview" },
              { id: "progress", label: `My Progress (${completedCount})` },
              {
                id: "bookmarks",
                label: `Bookmarks (${bookmarkedConcepts.length})`,
              },
              { id: "settings", label: "Settings" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabChange(t.id)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                activeTab === t.id
                  ? "border border-indigo-500/40 bg-indigo-600/20 text-indigo-300"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW (Category Progress Grid) */}
        {activeTab === "overview" && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map(({ config, concepts }) => {
              const total = concepts.length;
              const doneCount = concepts.filter((c) =>
                isCompleted(c.slug)
              ).length;
              const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

              return (
                <Link
                  key={config.slug}
                  href={`/category/${config.slug}`}
                  className="group rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-5 transition-all hover:border-indigo-500/40"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-indigo-400">
                        Stage {config.stage}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300">
                        {config.title}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      {doneCount} / {total} completed
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-300">
                      {pct}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* TAB 2: MY PROGRESS (Completed Lessons List) */}
        {activeTab === "progress" && (
          <div className="mt-6">
            {completedConcepts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#0B0E17]/60 p-12 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
                <h3 className="mt-3 text-base font-bold text-white">
                  No Completed Topics Yet
                </h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
                  Mark lessons as completed while studying to see your mastery
                  log here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedConcepts.map((topic) => (
                  <div
                    key={topic.slug}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0B0E17] px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <span>✓ Completed</span>
                        <span>•</span>
                        <span>{topic.category}</span>
                      </div>
                      <Link
                        href={`/concepts/${topic.slug}`}
                        className="mt-0.5 block truncate text-base font-bold text-white hover:text-indigo-300"
                      >
                        {topic.title}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleComplete(topic.slug)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                    >
                      Mark Incomplete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKMARKS */}
        {activeTab === "bookmarks" && (
          <div className="mt-6">
            {bookmarkedConcepts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#0B0E17]/60 p-12 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-indigo-400" />
                <h3 className="mt-3 text-base font-bold text-white">
                  No Bookmarked Topics Yet
                </h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
                  Click the bookmark icon on any lesson page to save it here for
                  quick review.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarkedConcepts.map((topic) => {
                  const done = isCompleted(topic.slug);
                  return (
                    <div
                      key={topic.slug}
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0B0E17] px-5 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-indigo-400">
                          <span>{topic.category}</span>
                          <span>•</span>
                          <span>{topic.readTime}</span>
                        </div>
                        <Link
                          href={`/concepts/${topic.slug}`}
                          className="mt-0.5 block truncate text-base font-bold text-white hover:text-indigo-300"
                        >
                          {topic.title}
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleComplete(topic.slug)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                            done
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {done ? "Completed" : "Mark Done"}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(topic.slug)}
                          aria-label="Remove bookmark"
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === "settings" && (
          <div className="mt-6 max-w-xl rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-lg font-bold text-white">
              <Settings className="h-5 w-5 text-indigo-400" />
              <span>Account & Learning Settings</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Update your profile details or manage your saved learning state.
            </p>

            {user ? (
              <div className="mt-6 space-y-4">
                <div>
                  <div className="block text-xs font-semibold text-slate-300">Name</div>
                  <div className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#070910] px-4 py-2.5 text-sm text-white">
                    {user.name}
                  </div>
                </div>
                <div>
                  <div className="block text-xs font-semibold text-slate-300">Email Address</div>
                  <div className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#070910] px-4 py-2.5 text-sm text-white">
                    {user.email}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Signed in with Google. Name and email come from your Google account.
                </p>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-400">
                Sign in with Google to see your account details.
              </p>
            )}

            <div className="mt-8 border-t border-white/[0.08] pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Danger Zone
              </h4>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-rose-500/40 hover:text-rose-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Completed Topics</span>
                </button>
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      void signOut();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
                  >
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}