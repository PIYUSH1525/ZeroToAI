import React from "react";
import Link from "next/link";
import { getCategoriesWithTopics, getAllConcepts } from "@/lib/mdx";
import HeroSearchTrigger from "@/components/ui/HeroSearchTrigger";
import {
  ArrowRight,
  ChevronRight,
  Sigma,
  Code2,
  Cpu,
  Network,
  MessageSquareCode,
  Sparkles,
  Bot,
  Database,
  Layers,
} from "lucide-react";

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  mathematics: Sigma,
  "python-programming": Code2,
  "machine-learning": Cpu,
  "deep-learning": Network,
  nlp: MessageSquareCode,
  transformers: Layers,
  "generative-ai": Sparkles,
  rag: Database,
  "ai-agents": Bot,
};

const STAGE_COLORS: Record<string, string> = {
  mathematics:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:border-emerald-400 group-hover:bg-emerald-500/20",
  "python-programming":
    "border-blue-500/30 bg-blue-500/10 text-blue-400 group-hover:border-blue-400 group-hover:bg-blue-500/20",
  "machine-learning":
    "border-amber-500/30 bg-amber-500/10 text-amber-400 group-hover:border-amber-400 group-hover:bg-amber-500/20",
  "deep-learning":
    "border-indigo-500/30 bg-indigo-500/10 text-indigo-400 group-hover:border-indigo-400 group-hover:bg-indigo-500/20",
  nlp: "border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover:border-purple-400 group-hover:bg-purple-500/20",
  transformers:
    "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 group-hover:border-cyan-400 group-hover:bg-cyan-500/20",
  "generative-ai":
    "border-orange-500/30 bg-orange-500/10 text-orange-400 group-hover:border-orange-400 group-hover:bg-orange-500/20",
  rag: "border-teal-500/30 bg-teal-500/10 text-teal-400 group-hover:border-teal-400 group-hover:bg-teal-500/20",
  "ai-agents":
    "border-rose-500/30 bg-rose-500/10 text-rose-400 group-hover:border-rose-400 group-hover:bg-rose-500/20",
};

const CARD_ACCENTS: Record<
  string,
  { iconBg: string; iconColor: string; borderHover: string }
> = {
  mathematics: {
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    iconColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/40",
  },
  "machine-learning": {
    iconBg: "bg-amber-500/15 border-amber-500/30",
    iconColor: "text-amber-400",
    borderHover: "hover:border-amber-500/40",
  },
  "deep-learning": {
    iconBg: "bg-indigo-500/15 border-indigo-500/30",
    iconColor: "text-indigo-400",
    borderHover: "hover:border-indigo-500/40",
  },
  nlp: {
    iconBg: "bg-purple-500/15 border-purple-500/30",
    iconColor: "text-purple-400",
    borderHover: "hover:border-purple-500/40",
  },
  transformers: {
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    iconColor: "text-cyan-400",
    borderHover: "hover:border-cyan-500/40",
  },
  "generative-ai": {
    iconBg: "bg-orange-500/15 border-orange-500/30",
    iconColor: "text-orange-400",
    borderHover: "hover:border-orange-500/40",
  },
};

export const metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const categoriesWithTopics = getCategoriesWithTopics();
  const allConcepts = getAllConcepts();
  const firstConceptSlug = allConcepts[0]?.slug || "machine-learning";

  const featuredCategorySlugs = [
    "mathematics",
    "machine-learning",
    "deep-learning",
    "nlp",
    "transformers",
    "generative-ai",
  ];

  const featuredCategories = featuredCategorySlugs
    .map((slug) => categoriesWithTopics.find((c) => c.config.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="min-h-screen bg-[#05070E] text-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pt-16 pb-20 px-4 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mx-auto h-96 max-w-4xl bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_70%)]"
        />

        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.12]">
            Learn AI from{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              intuition
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              to clean implementation.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
            A structured learning path from mathematics to AI agents with clear
            explanations and practical code examples.
          </p>

          <div className="mx-auto mt-8 max-w-lg">
            <HeroSearchTrigger />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/concepts/${firstConceptSlug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02]"
            >
              <span>Start Learning</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.08]"
            >
              <span>View Roadmap</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. "Your AI Learning Path" Pipeline — No Scrollbar, Full-Fit Responsive Layout */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Your AI Learning Path
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Follow a structured journey from basics to advanced AI concepts.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#090C15]/90 px-4 py-7 shadow-[0_0_40px_rgba(0,0,0,0.4)] sm:px-6">
          <div className="grid grid-cols-3 gap-y-6 gap-x-2 sm:grid-cols-5 lg:flex lg:items-start lg:justify-between lg:gap-1">
            {categoriesWithTopics.map(({ config }, idx) => {
              const IconComponent = STAGE_ICONS[config.slug] || Cpu;
              const colorClass =
                STAGE_COLORS[config.slug] || STAGE_COLORS["machine-learning"];
              const isLast = idx === categoriesWithTopics.length - 1;

              return (
                <React.Fragment key={config.slug}>
                  <Link
                    href={`/category/${config.slug}`}
                    className="group flex flex-col items-center text-center lg:w-24"
                  >
                    <div className="relative">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg ${colorClass}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>

                    <span className="mt-2.5 text-[11px] font-semibold leading-tight text-slate-200 transition-colors group-hover:text-white sm:text-xs">
                      {config.shortTitle}
                    </span>
                  </Link>

                  {!isLast && (
                    <ChevronRight className="mt-4 hidden h-4 w-4 shrink-0 text-slate-600 lg:block" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. "Explore by Category" 6-Card Grid */}
      <section id="categories" className="mx-auto max-w-6xl px-4 pt-6 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Explore by Category</h2>
            <p className="mt-1 text-sm text-slate-400">
              Browse all topics by category and start learning.
            </p>
          </div>

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-white/20 hover:text-white"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map(({ config, concepts }) => {
            const IconComponent = STAGE_ICONS[config.slug] || Cpu;
            const style =
              CARD_ACCENTS[config.slug] || CARD_ACCENTS["machine-learning"];
            const topicCount = concepts.length;

            return (
              <Link
                key={config.slug}
                href={`/category/${config.slug}`}
                className={`group rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-6 transition-all hover:-translate-y-0.5 ${style.borderHover}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${style.iconBg} ${style.iconColor}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-indigo-300">
                      {config.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400">
                      {topicCount} {topicCount === 1 ? "topic" : "topics"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  {config.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}