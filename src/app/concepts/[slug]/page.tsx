import { notFound } from "next/navigation";
import { getConceptBySlug, getAllConcepts } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Mermaid from "@/components/mdx/Mermaid";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

// Pre-builds pages for performance
export async function generateStaticParams() {
  return getAllConcepts().map((concept) => ({ slug: concept.slug }));
}

// Next.js 15 uses Promises for params
export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  
  if (!concept) notFound();

  return (
    <div className="min-h-screen bg-grid py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-[var(--color-cyber-cyan)] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roadmap
      </Link>

      <div className="glass-panel p-8 rounded-2xl mb-8 border-l-4 border-l-[var(--color-cyber-cyan)]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--color-cyber-cyan)]/10 text-[var(--color-cyber-cyan)] border border-[var(--color-cyber-cyan)]/20">
            {concept.meta.category}
          </span>
          <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min read
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{concept.meta.title}</h1>
        <p className="mt-2 text-gray-400">{concept.meta.description}</p>
      </div>

      <article className="prose prose-invert prose-pre:bg-[#0A0D14] prose-pre:border prose-pre:border-white/10 max-w-none">
        <MDXRemote
          source={concept.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          }}
          components={{ Mermaid }}
        />
      </article>
    </div>
  );
}