import { getAllConcepts } from "@/lib/mdx";
import Link from "next/link";
import { Sparkles, ArrowRight, Layers } from "lucide-react";

export default function HomePage() {
  const concepts = getAllConcepts();

  // 1. Group concepts dynamically by their frontmatter category
  const categoriesMap = concepts.reduce((acc, concept) => {
    const category = concept.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(concept);
    return acc;
  }, {} as Record<string, typeof concepts>);

  // 2. Sort categories in alphabetical order (A → Z)
  const sortedCategories = Object.keys(categoriesMap).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  return (
    <div className="bg-grid min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto pt-20 pb-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-cyber-cyan)]/30 bg-[var(--color-cyber-cyan)]/5 text-[var(--color-cyber-cyan)] text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5" /> SYSTEM ARCHITECTURE: ONLINE
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Learn AI from intuition <br />
          <span className="bg-gradient-to-r from-[var(--color-cyber-cyan)] via-[var(--color-cyber-violet)] to-[var(--color-cyber-emerald)] bg-clip-text text-transparent">
            to clean implementation.
          </span>
        </h1>
        <p className="mt-6 text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
          A structured progressive path from fundamental mathematics to autonomous agents.
        </p>
      </section>

      {/* Dynamic Alphabetized Modules Section */}
      <section id="roadmap" className="max-w-5xl mx-auto px-4 pb-24 space-y-12">
        {sortedCategories.map((category) => {
          // Sort sub-content concept cards inside this category alphabetically by title (A → Z)
          const categoryConcepts = [...categoriesMap[category]].sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          );

          return (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-6 border-b border-white/[0.08] pb-3">
                <Layers className="w-4 h-4 text-[var(--color-cyber-cyan)]" />
                <h2 className="text-lg font-mono font-bold tracking-wider text-white uppercase">
                  {category}
                </h2>
                <span className="text-xs font-mono text-gray-500 ml-auto">
                  {categoryConcepts.length} {categoryConcepts.length === 1 ? "module" : "modules"}
                </span>
              </div>

              {/* Module Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryConcepts.map((concept, index) => (
                  <Link
                    key={concept.slug}
                    href={`/concepts/${concept.slug}`}
                    className="glass-panel p-6 rounded-xl flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        {/* Auto-assigned sequential tag */}
                        <span className="text-xs font-mono text-[var(--color-cyber-cyan)]">
                          #{index + 1}
                        </span>
                        <span className="text-xs text-gray-500 border border-white/5 px-2 py-0.5 rounded">
                          {concept.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[var(--color-cyber-cyan)] transition-colors">
                        {concept.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                        {concept.description}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center text-xs font-mono text-gray-400 group-hover:text-white transition-colors">
                      Initialize module{" "}
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1 text-[var(--color-cyber-cyan)]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}