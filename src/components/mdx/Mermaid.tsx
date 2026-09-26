"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Upgraded Sci-Fi Theme Configuration
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    darkMode: true,
    background: "transparent",
    primaryColor: "rgba(10, 13, 20, 0.8)", // Dark glass background for boxes
    primaryBorderColor: "#00F0FF",         // Cyber cyan borders
    primaryTextColor: "#FFFFFF",
    lineColor: "#8B5CF6",                  // Cyber violet connecting lines
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "14px",
    edgeLabelBackground: "#040508",
    tertiaryColor: "rgba(16, 185, 129, 0.1)", // Emerald hints
    tertiaryBorderColor: "#10B981",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis", // Smooth, curvy lines instead of rigid angles
  },
});

export default function Mermaid({ chart }: { chart?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!chart) return;
    if (ref.current) {
      try {
        mermaid
          .render(`mermaid-${Math.random().toString(36).substring(7)}`, chart)
          .then((res) => {
            if (ref.current) ref.current.innerHTML = res.svg;
            setHasError(false);
          })
          .catch((err) => {
            console.error("Mermaid syntax error:", err);
            setHasError(true);
          });
      } catch (err) {
        console.error("Mermaid setup error:", err);
        setHasError(true);
      }
    }
  }, [chart]);

  if (hasError || !chart) {
    return (
      <div className="my-6 p-4 glass-panel rounded-xl border-red-500/30 text-red-400 font-mono text-sm flex justify-center">
        [ SYSTEM WARNING: Diagram Failed to Render ]
      </div>
    );
  }

  return (
    // Added a subtle grid background specifically for the diagrams
    <div 
      ref={ref} 
      className="my-8 flex justify-center overflow-x-auto p-6 glass-panel rounded-2xl bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)]"
      style={{ backgroundSize: '16px 16px' }} 
    />
  );
}