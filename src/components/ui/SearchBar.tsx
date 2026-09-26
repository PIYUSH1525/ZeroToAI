"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type SearchConcept = {
  title: string;
  slug: string;
  category: string;
  description: string;
};

export default function SearchBar({ concepts }: { concepts: SearchConcept[] }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter concepts based on title, description, or category
  const filtered = concepts.filter((c) => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.description.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5); // Limit to top 5 results

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--color-cyber-cyan)] transition-colors" />
        <input 
          type="text" 
          placeholder="Search modules, math, models..." 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-[#0A0D14]/80 border border-white/10 rounded-full py-2 pl-10 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-cyber-cyan)] focus:ring-1 focus:ring-[var(--color-cyber-cyan)] transition-all"
        />
        {/* Cosmetic keyboard shortcut hint */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white/5 border border-white/10 rounded">⌘</kbd>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white/5 border border-white/10 rounded">K</kbd>
        </div>
      </div>

      {/* Cyber Dropdown Menu */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#0A0D14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.05)] overflow-hidden z-50">
          {filtered.length > 0 ? (
            <div className="py-2">
              {filtered.map((concept) => (
                <Link 
                  key={concept.slug} 
                  href={`/concepts/${concept.slug}`}
                  onClick={() => { setQuery(""); setIsOpen(false); }}
                  className="flex flex-col px-4 py-3 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-[var(--color-cyber-cyan)] group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white group-hover:text-[var(--color-cyber-cyan)] transition-colors">
                      {concept.title}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 border border-white/10 px-1.5 py-0.5 rounded">
                      {concept.category}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 line-clamp-1">{concept.description}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center font-mono text-sm text-gray-500">
              [ NO MATCHING MODULES FOUND ]
            </div>
          )}
        </div>
      )}
    </div>
  );
}