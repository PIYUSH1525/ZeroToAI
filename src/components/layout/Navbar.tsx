import Link from "next/link";
import Image from "next/image";
import { getAllConcepts } from "@/lib/mdx";
import SearchBar from "../ui/SearchBar";

export default function Navbar() {
  const concepts = getAllConcepts().map((c) => ({
    title: c.title,
    slug: c.slug,
    category: c.category,
    subcategory: c.subcategory,
    description: c.description,
    readTime: c.readTime,
    difficulty: c.difficulty,
  }));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#05070E]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/brand-logo.png"
              alt="NeuralPath Logo"
              width={32}
              height={32}
              style={{ width: "auto", height: "32px" }}
              className="rounded-lg object-contain"
              priority
            />
            <span className="text-base font-bold tracking-tight text-white">
              NeuralPath
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="/#categories"
              className="text-slate-300 transition-colors hover:text-white"
            >
              Categories
            </Link>
            <Link
              href="/roadmap"
              className="text-slate-300 transition-colors hover:text-white"
            >
              Roadmap
            </Link>
          </nav>
        </div>

        {/* Right: Search Button + Search Popup Modal + Working Avatar Dropdown */}
        <SearchBar concepts={concepts} />
      </div>
    </header>
  );
}