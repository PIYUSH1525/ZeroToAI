import "./globals.css";
import Link from "next/link";
import { Cpu } from "lucide-react";

export const metadata = {
  title: "NeuralPath // AI & ML Learning Hub",
  description: "Master AI and Machine Learning from intuition to implementation.",
};

// Custom GitHub Icon since Lucide removed brand logos
const GithubIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.47-1.4 6.47-7.01a4.9 4.9 0 0 0-1.38-3.5 4.9 4.9 0 0 0-.14-3.46s-1.12-.35-3.5 1.25a12.1 12.1 0 0 0-6.4 0C6.12 1.35 5 1.7 5 1.7a4.9 4.9 0 0 0-.14 3.46 4.9 4.9 0 0 0-1.38 3.5c0 5.6 3.32 6.63 6.47 7A4.8 4.8 0 0 0 9 18v4" />
  </svg>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        {/* Raycast-style Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#040508]/80 border-b border-white/[0.08]">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-mono tracking-wider font-semibold text-white hover:text-[var(--color-cyber-cyan)] transition-colors">
              <Cpu className="w-5 h-5 text-[var(--color-cyber-cyan)]" />
              <span>NEURAL<span className="text-[var(--color-cyber-cyan)]">PATH</span></span>
            </Link>
            <div className="flex items-center gap-4 text-sm font-mono">
              <Link href="/#roadmap" className="text-gray-400 hover:text-white transition-colors">Roadmap</Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow">{children}</main>

        {/* Minimal Footer */}
        <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-gray-500 font-mono">
          <p>Built for future AI Engineers.</p>
          <p className="mt-1 text-[var(--color-cyber-emerald)]">All systems operational.</p>
        </footer>
      </body>
    </html>
  );
}