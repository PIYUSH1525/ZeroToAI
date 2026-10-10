import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CURRICULUM_CATEGORIES } from "@/lib/curriculum";
import { getCategoryBySlug } from "@/lib/mdx";
import CategoryClientView from "@/components/category/CategoryClientView";
import { SITE_NAME, trimDescription } from "@/lib/site";

export async function generateStaticParams() {
  return CURRICULUM_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categoryData = getCategoryBySlug(slug);

  if (!categoryData) {
    return { title: `Category not found // ${SITE_NAME}`, robots: { index: false } };
  }

  const { title, longDescription } = categoryData.config;
  const pageTitle = `${title} Tutorials // ${SITE_NAME}`;
  const pageDescription = trimDescription(longDescription);
  const url = `/category/${categoryData.config.slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: pageTitle,
      description: pageDescription,
    },
    twitter: { card: "summary", title: pageTitle, description: pageDescription },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryData = getCategoryBySlug(slug);

  if (!categoryData) {
    notFound();
  }

  return (
    <CategoryClientView
      config={categoryData.config}
      concepts={categoryData.concepts}
    />
  );
}