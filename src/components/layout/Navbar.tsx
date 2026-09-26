import Link from "next/link";
import Image from "next/image";
import { getAllConcepts } from "@/lib/mdx";
import SearchBar from "../ui/SearchBar";

export default function Navbar() {
  const concepts = getAllConcepts().map((c) => ({
    title: c.title,
    slug: c.slug,
    category: c.category,
    description: c.description,
  }));

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#040508]/80 backdrop-blur-md">
      {/* Changed to w-full and px-8 to push elements to the extreme left and right corners */}
      <div className="w-full px-8 sm:px-12 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Ensure your logo image is inside the 'public' folder and update the src below */}
          <Image 
            src="/brand-logo.png" 
            alt="NeuralPath Logo" 
            width={32} 
            height={32}
            style={{ width: "auto", height: "32px" }}
            className="rounded-lg object-contain"
            priority
          />
          <span className="font-mono font-bold text-white hidden sm:block tracking-widest group-hover:text-[var(--color-cyber-cyan)] transition-colors">
            NEURAL<span className="text-gray-500">PATH</span>
          </span>
        </Link>

        {/* Search Integration pushed to the right */}
        <div className="w-full max-w-md flex justify-end">
          <SearchBar concepts={concepts} />
        </div>
        
      </div>
    </nav>
  );
}