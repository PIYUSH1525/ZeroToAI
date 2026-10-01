"use client";

import React, { useState } from "react";
import { Mail, X } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle } = useProgress();
  const [emailMode, setEmailMode] = useState(false);
  const [nameInput, setNameInput] = useState("Piyush");
  const [emailInput, setEmailInput] = useState("piyush@gmail.com");

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithGoogle(nameInput, emailInput);
    setEmailMode(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0E17] p-8 text-center shadow-[0_0_50px_rgba(99,102,241,0.18)]">
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand Header */}
        <div className="mb-5 text-lg font-extrabold tracking-wide">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            NeuralPath
          </span>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-white">Continue Learning</h2>
        <p className="mx-auto mb-7 max-w-xs text-sm leading-relaxed text-slate-400">
          Sign in to save your progress, bookmark topics and access your personal dashboard.
        </p>

        {!emailMode ? (
          <>
            {/* Continue with Google Button */}
            <button
              onClick={() => signInWithGoogle("Piyush", "piyush@gmail.com")}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                OR
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Continue with Email Button */}
            <button
              onClick={() => setEmailMode(true)}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.07]"
            >
              <Mail className="h-4 w-4 text-slate-400" />
              <span>Continue with Email</span>
            </button>
          </>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-left">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Your Name</label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#06080F] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Email Address</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#06080F] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Continue to Dashboard
            </button>
          </form>
        )}

        <button
          onClick={closeAuthModal}
          className="mt-6 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}