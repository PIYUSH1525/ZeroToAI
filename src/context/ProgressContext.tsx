"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { CheckCircle2, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface UserProfile {
  name: string;
  email: string;
  initial: string;
}

interface ProgressContextType {
  completedSlugs: string[];
  bookmarkedSlugs: string[];
  streakDays: number;
  lastVisitedSlug: string | null;
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  isSearchOpen: boolean;
  isSigningIn: boolean;
  authError: string | null;
  resetProgress: () => void;
  toggleComplete: (slug: string) => void;
  toggleBookmark: (slug: string) => void;
  setLastVisited: (slug: string) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isCompleted: (slug: string) => boolean;
  isBookmarked: (slug: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Old browser-storage keys from earlier versions. Progress is now stored in Supabase,
// so these are only ever DELETED (never read) to make sure nothing leaks between users.
const LEGACY_STORAGE_KEYS = [
  "neuralpath_completed_v2",
  "neuralpath_bookmarks_v2",
  "neuralpath_last_visited_v2",
  "neuralpath_user_v2",
  "neuralpath_streak_v2",
  "neuralpath_last_login_date_v2",
];

function clearLegacyStorage() {
  try {
    LEGACY_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore storage errors (private browsing)
  }
}

const TABLE = "user_progress";

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

// Converts a verified Supabase user into the profile shape the UI uses.
function toProfile(u: User): UserProfile {
  const meta = u.user_metadata ?? {};
  const email = u.email ?? "";
  const name: string =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    email.split("@")[0] ||
    "Learner";
  return { name, email, initial: name.charAt(0).toUpperCase() };
}

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(yesterday);
}

// Works out the new streak from the values saved in the database.
function computeStreak(savedStreak: number, lastLoginDate: string | null): number {
  const today = getLocalDateString();
  if (lastLoginDate === today) return Math.max(1, savedStreak);
  return lastLoginDate === getYesterdayDateString() ? savedStreak + 1 : 1;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [lastVisitedSlug, setLastVisitedSlug] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Refs always hold the latest values so save functions never use stale data.
  const completedRef = useRef<string[]>([]);
  const bookmarksRef = useRef<string[]>([]);
  const lastVisitedRef = useRef<string | null>(null);
  const pendingWrites = useRef(0);

  const applyCompleted = useCallback((v: string[]) => {
    completedRef.current = v;
    setCompletedSlugs(v);
  }, []);
  const applyBookmarks = useCallback((v: string[]) => {
    bookmarksRef.current = v;
    setBookmarkedSlugs(v);
  }, []);
  const applyLastVisited = useCallback((v: string | null) => {
    lastVisitedRef.current = v;
    setLastVisitedSlug(v);
  }, []);

  // Wipes ALL progress from memory (used on sign-out).
  const clearAllProgress = useCallback(() => {
    applyCompleted([]);
    applyBookmarks([]);
    applyLastVisited(null);
    setStreakDays(0);
  }, [applyCompleted, applyBookmarks, applyLastVisited]);

  const showSyncError = useCallback(() => {
    setSyncError("Could not save your progress. Check your connection and try again.");
    setTimeout(() => setSyncError(null), 5000);
  }, []);

  // Removes progress left in the browser by older versions of the app.
  useEffect(() => {
    clearLegacyStorage();
  }, []);

  // Keep `user` in sync with the real Supabase session (login, logout, token refresh, other tabs).
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(toProfile(session.user));
        setUserId((prev) => (prev === session.user.id ? prev : session.user.id));
      } else {
        setUser(null);
        setUserId(null);
        clearAllProgress();
        clearLegacyStorage();
      }
    });

    return () => data.subscription.unsubscribe();
  }, [clearAllProgress]);

  // Load this user's saved progress from Supabase whenever a user signs in.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const load = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from(TABLE)
        .select("completed_slugs, bookmarked_slugs, last_visited_slug, streak_days, last_login_date")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        showSyncError();
        return;
      }

      const savedStreak = Number(data?.streak_days) || 0;
      const lastDate: string | null = data?.last_login_date ?? null;
      const nextStreak = computeStreak(savedStreak, lastDate);

      applyCompleted(cleanStringArray(data?.completed_slugs));
      applyBookmarks(cleanStringArray(data?.bookmarked_slugs));
      applyLastVisited(typeof data?.last_visited_slug === "string" ? data.last_visited_slug : null);
      setStreakDays(nextStreak);

      // Save today's streak (also creates the row for first-time users).
      const today = getLocalDateString();
      if (lastDate !== today || !data) {
        const { error: upsertError } = await supabase
          .from(TABLE)
          .upsert(
            { user_id: userId, streak_days: nextStreak, last_login_date: today },
            { onConflict: "user_id" }
          );
        if (upsertError && !cancelled) showSyncError();
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [userId, applyCompleted, applyBookmarks, applyLastVisited, showSyncError]);

  // Refresh from Supabase when the user returns to this tab, so changes made on another device appear.
  useEffect(() => {
    if (!userId) return;

    const refresh = async () => {
      if (document.visibilityState !== "visible" || pendingWrites.current > 0) return;
      const { data, error } = await getSupabaseBrowserClient()
        .from(TABLE)
        .select("completed_slugs, bookmarked_slugs, last_visited_slug")
        .eq("user_id", userId)
        .maybeSingle();
      if (error || !data || pendingWrites.current > 0) return;
      applyCompleted(cleanStringArray(data.completed_slugs));
      applyBookmarks(cleanStringArray(data.bookmarked_slugs));
      applyLastVisited(typeof data.last_visited_slug === "string" ? data.last_visited_slug : null);
    };

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [userId, applyCompleted, applyBookmarks, applyLastVisited]);

  // Global keyboard shortcuts (Ctrl+K / Cmd+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Saves one column to the user's row. Returns true on success.
  const saveColumn = useCallback(
    async (column: "completed" | "bookmarks" | "last_visited", value: string[] | string) => {
      if (!userId) return false;
      pendingWrites.current += 1;
      try {
        const { error } = await getSupabaseBrowserClient()
          .from(TABLE)
          .upsert({ user_id: userId, [column]: value }, { onConflict: "user_id" });
        return !error;
      } catch {
        return false;
      } finally {
        pendingWrites.current -= 1;
      }
    },
    [userId]
  );

  const toggleComplete = useCallback(
    (slug: string) => {
      if (!userId) {
        setIsAuthModalOpen(true);
        return;
      }
      const prev = completedRef.current;
      const exists = prev.includes(slug);
      const updated = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      applyCompleted(updated);

      if (!exists) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }

      void saveColumn("completed", updated).then((ok) => {
        if (!ok) {
          applyCompleted(prev);
          showSyncError();
        }
      });
    },
    [userId, applyCompleted, saveColumn, showSyncError]
  );

  const toggleBookmark = useCallback(
    (slug: string) => {
      if (!userId) {
        setIsAuthModalOpen(true);
        return;
      }
      const prev = bookmarksRef.current;
      const exists = prev.includes(slug);
      const updated = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      applyBookmarks(updated);

      void saveColumn("bookmarks", updated).then((ok) => {
        if (!ok) {
          applyBookmarks(prev);
          showSyncError();
        }
      });
    },
    [userId, applyBookmarks, saveColumn, showSyncError]
  );

  // Clears all completed topics in ONE database write.
  const resetProgress = useCallback(() => {
    if (!userId) return;
    const prev = completedRef.current;
    if (prev.length === 0) return;
    applyCompleted([]);
    void saveColumn("completed", []).then((ok) => {
      if (!ok) {
        applyCompleted(prev);
        showSyncError();
      }
    });
  }, [userId, applyCompleted, saveColumn, showSyncError]);

  const setLastVisited = useCallback(
    (slug: string) => {
      if (!userId) return; // Logged-out visitors have no saved progress
      if (lastVisitedRef.current === slug) return;
      applyLastVisited(slug);
      void saveColumn("last_visited", slug);
    },
    [userId, applyLastVisited, saveColumn]
  );

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const next = window.location.pathname + window.location.search;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setAuthError("Could not start Google sign-in. Please try again.");
        setIsSigningIn(false);
      }
      // On success the browser is redirected to Google, so nothing else to do.
    } catch {
      setAuthError("Could not start Google sign-in. Please try again.");
      setIsSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await getSupabaseBrowserClient().auth.signOut();
    } catch {}
    // Always wipe the screen, even if the network call failed.
    setUser(null);
    setUserId(null);
    clearAllProgress();
    clearLegacyStorage();
  }, [clearAllProgress]);

  return (
    <ProgressContext.Provider
      value={{
        completedSlugs,
        bookmarkedSlugs,
        // Strictly 0 if not logged in
        streakDays: user ? streakDays : 0,
        lastVisitedSlug,
        user,
        isAuthModalOpen,
        isSearchOpen,
        isSigningIn,
        authError,
        resetProgress,
        toggleComplete,
        toggleBookmark,
        setLastVisited,
        openAuthModal: () => {
          setAuthError(null);
          setIsSigningIn(false);
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => setIsAuthModalOpen(false),
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        signInWithGoogle,
        signOut,
        isCompleted: (slug: string) => completedSlugs.includes(slug),
        isBookmarked: (slug: string) => bookmarkedSlugs.includes(slug),
      }}
    >
      {children}

      {syncError && (
        <div
          role="alert"
          className="fixed bottom-16 right-4 z-50 rounded-xl border border-rose-500/30 bg-[#0A0E1A]/95 px-4 py-3 text-sm text-rose-300 shadow-lg backdrop-blur-md"
        >
          {syncError}
        </div>
      )}

      {/* Screen 9: Topic Completion Toast Notification */}
      {showToast && (
        <div className="fixed bottom-16 left-4 z-50 flex items-center gap-3.5 rounded-xl border border-emerald-500/30 bg-[#0A0E1A]/95 px-4 py-3.5 shadow-[0_0_25px_rgba(16,185,129,0.2)] backdrop-blur-md">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="pr-4">
            <div className="text-sm font-bold text-white">Marked as completed!</div>
            <div className="text-xs text-slate-400">Great job! Keep going.</div>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-slate-400 transition-colors hover:text-white"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
} 