import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "NeuralPath // AI & ML Learning Hub",
  description: "Master AI and Machine Learning from intuition to implementation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between bg-[#040508] text-white antialiased selection:bg-[var(--color-cyber-cyan)] selection:text-black">
        
        {/* Global Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Persistent Visitor Counter HUD */}
        <aside aria-label="Visitor Counter" className="fixed bottom-4 left-4 z-50 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-[#040508]/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.08)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-cyber-cyan)] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Visitors:</span>
            <img 
              src="https://komarev.com/ghpvc/?username=PIYUSH1525&repo=ZeroToAI&color=00f0ff&style=flat-square" 
              alt="System Traffic"
              className="h-4"
            />
          </div>
        </aside>

        {/* Minimal Footer */}
        <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-gray-500 font-mono">
          <p>Built for future AI Engineers.</p>
          <p className="mt-1 text-[var(--color-cyber-emerald)]">All systems operational.</p>
        </footer>

        {/* Vercel Analytics Tracker */}
        <Analytics />

      </body>
    </html>
  );
}