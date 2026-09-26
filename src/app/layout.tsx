import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "NeuralPath // AI & ML Learning Hub",
  description: "Master AI and Machine Learning from intuition to implementation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between bg-[#040508] text-white antialiased selection:bg-[var(--color-cyber-cyan)] selection:text-black">
        
        {/* New Global Navbar with Search */}
        <Navbar />

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