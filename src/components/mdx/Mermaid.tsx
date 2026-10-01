"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    darkMode: true,
    background: "transparent",
    primaryColor: "rgba(10, 13, 20, 0.8)",
    primaryBorderColor: "#00F0FF",
    primaryTextColor: "#FFFFFF",
    lineColor: "#8B5CF6",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "14px",
    edgeLabelBackground: "#040508",
    tertiaryColor: "rgba(16, 185, 129, 0.1)",
    tertiaryBorderColor: "#10B981",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
  },
});

export default function Mermaid({ chart }: { chart?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chart || !ref.current) return;
    let isCancelled = false;

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const res = await mermaid.render(id, chart);
        if (!isCancelled && ref.current) {
          ref.current.innerHTML = res.svg;
        }
      } catch (err) {
        console.error("Mermaid syntax error:", err);
        if (!isCancelled && ref.current) {
          ref.current.innerHTML =
            '<div class="text-red-400 font-mono text-sm py-2">[ SYSTEM WARNING: Diagram Failed to Render ]</div>';
        }
      }
    };

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [chart]);

  if (!chart) {
    return (
      <div className="my-6 flex justify-center rounded-xl border border-red-500/30 p-4 font-mono text-sm text-red-400 glass-panel">
        [ SYSTEM WARNING: Diagram Failed to Render ]
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-8 flex justify-center overflow-x-auto rounded-2xl bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] p-6 glass-panel"
      style={{ backgroundSize: "16px 16px" }}
    />
  );
}