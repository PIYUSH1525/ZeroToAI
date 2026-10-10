import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConceptBySlug, getAllConcepts } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Mermaid from "@/components/mdx/Mermaid";
import ConceptClientShell from "@/components/concept/ConceptClientShell";
import { SITE_NAME, trimDescription } from "@/lib/site";

export async function generateStaticParams() {
  const concepts = getAllConcepts();
  return concepts.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    return { title: `Lesson not found // ${SITE_NAME}`, robots: { index: false } };
  }

  const { title, description, category } = concept.meta;
  const pageTitle = `${title} // ${SITE_NAME}`;
  const pageDescription = trimDescription(description);
  const url = `/concepts/${concept.meta.slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: pageTitle,
      description: pageDescription,
      section: category,
    },
    twitter: { card: "summary", title: pageTitle, description: pageDescription },
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = getCompoundConceptOrNull(slug);

  if (!concept) {
    notFound();
  }

  const allConcepts = getAllConcepts();
  const relatedConcepts = allConcepts
    .filter(
      (c) =>
        c.categorySlug === concept.meta.categorySlug &&
        c.slug !== concept.meta.slug
    )
    .slice(0, 4);

  return (
    <ConceptClientShell
      meta={concept.meta}
      toc={concept.toc}
      prevConcept={concept.prevConcept}
      nextConcept={concept.nextConcept}
      relatedConcepts={relatedConcepts}
    >
      <article className="prose prose-invert prose-pre:bg-[#060911] prose-pre:border prose-pre:border-white/10 max-w-none">
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
    </ConceptClientShell>
  );
}

function getCompoundConceptOrNull(slug: string) {
  return getConceptBySlug(slug);
}