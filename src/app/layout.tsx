import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Navbar from "@/components/layout/Navbar";
import AuthModal from "@/components/auth/AuthModal";
import { ProgressProvider } from "@/context/ProgressContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} // AI & ML Learning Hub`,
  description:
    "MLRoadmap is a structured learning platform for AI and Machine Learning, covering math, Python, ML, deep learning, NLP, transformers, LLMs, RAG and Generative AI.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} // AI & ML Learning Hub`,
    description: "A structured path from math and Python to LLMs, RAG and AI agents.",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col justify-between bg-[#05070E] text-white antialiased selection:bg-indigo-500 selection:text-white">
        <ProgressProvider>
          <Navbar />
          <AuthModal />
          <main className="flex-grow">{children}</main>

          {/* Persistent Visitor Counter HUD */}
          <aside
            aria-label="Visitor Counter"
            className="fixed bottom-4 left-4 z-40 pointer-events-auto"
          >
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#05070E]/90 px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Visitors:
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://komarev.com/ghpvc/?username=PIYUSH1525&repo=ZeroToAI&color=6366f1&style=flat-square"
                alt="System Traffic"
                className="h-4"
              />
            </div>
          </aside>

          <footer className="border-t border-white/[0.08] py-8 text-center font-mono text-xs text-slate-500">
            <p>
              Built for future AI Engineers. 
            </p>
          </footer>
        </ProgressProvider>

        <Analytics />
      </body>
    </html>
  );
}