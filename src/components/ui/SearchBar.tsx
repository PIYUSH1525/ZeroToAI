"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useProgress } from "@/context/ProgressContext";
import {
  Search,
  Bell,
  LayoutGrid,
  Clock,
  Bookmark,
  Settings,
  LogOut,
  FileText,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";

interface ConceptItem {
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  readTime?: string;
  difficulty?: string;
}

export default function SearchBar({ concepts }: { concepts: ConceptItem[] }) {
  const router = useRouter();
  const {
    user,
    openAuthModal,
    signOut,
    isSearchOpen,
    openSearch,
    closeSearch,
  } = useProgress();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when Search Modal opens
  useEffect(() => {
    if (!isSearchOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
    return () => clearTimeout(timer);
  }, [isSearchOpen]);

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredConcepts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return concepts.slice(0, 8);
    return concepts.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.subcategory && c.subcategory.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q)
    );
  }, [concepts, query]);

  const handleOpenSearch = () => {
    setQuery("");
    setSelectedIndex(0);
    openSearch();
  };

  const handleCloseSearch = () => {
    setQuery("");
    setSelectedIndex(0);
    closeSearch();
  };

  const navigateFromMenu = (url: string) => {
    setMenuOpen(false);
    router.push(url);
  };

  const handleSelectConcept = (slug: string) => {
    handleCloseSearch();
    router.push(`/concepts/${slug}`);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Desktop Search Button */}
        <button
          type="button"
          onClick={handleOpenSearch}
          className="hidden items-center gap-8 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-slate-400 transition-colors hover:border-indigo-500/40 hover:text-slate-200 sm:flex"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search topics...</span>
          </span>
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={handleOpenSearch}
          aria-label="Search topics"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white sm:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Sign In OR Bell + User Avatar Dropdown */}
        {!user ? (
          <button
            type="button"
            onClick={openAuthModal}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-colors hover:bg-indigo-500 sm:text-sm"
          >
            Sign In
          </button>
        ) : (
          <div className="relative flex items-center gap-2.5" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => navigateFromMenu("/dashboard?tab=overview")}
              aria-label="Open Dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <Bell className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Open user menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-transform hover:scale-105"
            >
              {user.initial}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0E17] p-2 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/[0.08] px-3 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {user.initial}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-white">
                      {user.name}
                    </div>
                    <div className="truncate text-xs text-slate-400">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="py-1.5">
                  <button
                    type="button"
                    onClick={() => navigateFromMenu("/dashboard?tab=overview")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <LayoutGrid className="h-4 w-4 text-slate-400" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateFromMenu("/dashboard?tab=progress")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>My Progress</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateFromMenu("/dashboard?tab=bookmarks")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Bookmark className="h-4 w-4 text-slate-400" />
                    <span>Bookmarks</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateFromMenu("/dashboard?tab=settings")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-white/[0.08] pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Command Palette Search Modal (Rendered via Portal into document.body) */}
      {typeof document !== "undefined" &&
        isSearchOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/75 px-4 pt-20 backdrop-blur-sm"
            onClick={handleCloseSearch}
          >
            <div
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B0E17] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5">
                <Search className="h-4 w-4 text-indigo-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSelectedIndex((prev) =>
                        filteredConcepts.length > 0
                          ? (prev + 1) % filteredConcepts.length
                          : 0
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSelectedIndex((prev) =>
                        filteredConcepts.length > 0
                          ? (prev - 1 + filteredConcepts.length) %
                            filteredConcepts.length
                          : 0
                      );
                    } else if (
                      e.key === "Enter" &&
                      filteredConcepts[selectedIndex]
                    ) {
                      e.preventDefault();
                      handleSelectConcept(filteredConcepts[selectedIndex].slug);
                    }
                  }}
                  placeholder="Search topics, models, or categories..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCloseSearch}
                  className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400 hover:text-white"
                >
                  ESC
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredConcepts.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-500">
                    No matching topics found for &ldquo;{query}&rdquo;.
                  </div>
                ) : (
                  filteredConcepts.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => handleSelectConcept(item.slug)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left transition-colors ${
                          isSelected
                            ? "bg-indigo-600/20"
                            : "hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-white">
                              {item.title}
                            </div>
                            <div className="truncate text-xs text-slate-400">
                              {item.category} • {item.description}
                            </div>
                          </div>
                        </div>
                        <ArrowRight
                          className={`h-4 w-4 shrink-0 ${
                            isSelected ? "text-indigo-400" : "text-slate-600"
                          }`}
                        />
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer Hints */}
              <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#070910] px-4 py-2.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <CornerDownLeft className="h-3 w-3" /> to select
                  </span>
                  <span>↑↓ to navigate</span>
                </div>
                <span>ESC or click outside to close</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}