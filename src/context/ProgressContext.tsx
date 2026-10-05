"use client";

import React, {
  createContext,
  useContext,
  useEffect,
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

const STORAGE_KEYS = {
  COMPLETED: "neuralpath_completed_v2",
  BOOKMARKS: "neuralpath_bookmarks_v2",
  LAST_VISITED: "neuralpath_last_visited_v2",
  USER: "neuralpath_user_v2",
  STREAK: "neuralpath_streak_v2",
  LAST_LOGIN_DATE: "neuralpath_last_login_date_v2",
};

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

// Calculates and saves the daily login streak for a signed-in user
function syncLoginStreak(): number {
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  const savedStreak = Number(localStorage.getItem(STORAGE_KEYS.STREAK)) || 0;
  const lastLoginDate = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN_DATE);

  if (lastLoginDate === today) {
    // Already logged in today -> keep current streak
    return Math.max(1, savedStreak);
  }

  // Logged in yesterday -> increment streak by 1; otherwise start fresh at 1
  const nextStreak = lastLoginDate === yesterday ? savedStreak + 1 : 1;
  localStorage.setItem(STORAGE_KEYS.STREAK, String(nextStreak));
  localStorage.setItem(STORAGE_KEYS.LAST_LOGIN_DATE, today);
  return nextStreak;
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

// Load saved state on mount via async callback to satisfy react-hooks/set-state-in-effect
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED);
        if (savedCompleted) {
          const parsed = JSON.parse(savedCompleted);
          if (Array.isArray(parsed)) setCompletedSlugs(parsed);
        }

        const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
        if (savedBookmarks) {
          const parsed = JSON.parse(savedBookmarks);
          if (Array.isArray(parsed)) setBookmarkedSlugs(parsed);
        }

        const savedLast = localStorage.getItem(STORAGE_KEYS.LAST_VISITED);
        if (savedLast) setLastVisitedSlug(savedLast);

        // Remove the old fake "logged-in user" saved by the previous mock login.
        localStorage.removeItem(STORAGE_KEYS.USER);
      } catch {
        // Ignore storage errors in private browsing
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Keep `user` in sync with the real Supabase session (login, logout, token refresh, other tabs).
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(toProfile(session.user));
        try {
          setStreakDays(syncLoginStreak());
        } catch {}
      } else {
        setUser(null);
        setStreakDays(0);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

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

  const toggleComplete = useCallback((slug: string) => {
    setCompletedSlugs((prev) => {
      const exists = prev.includes(slug);
      const updated = exists ? prev.filter((s) => s !== slug) : [...prev, slug];

      try {
        localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(updated));
      } catch {}

      if (!exists) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }

      return updated;
    });
  }, []);

  const toggleBookmark = useCallback((slug: string) => {
    setBookmarkedSlugs((prev) => {
      const exists = prev.includes(slug);
      const updated = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const setLastVisited = useCallback((slug: string) => {
    setLastVisitedSlug(slug);
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_VISITED, slug);
    } catch {}
  }, []);

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
    setUser(null);
    setStreakDays(0);
  }, []);

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