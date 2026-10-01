import { notFound } from "next/navigation";
import { CURRICULUM_CATEGORIES } from "@/lib/curriculum";
import { getCategoryBySlug } from "@/lib/mdx";
import CategoryClientView from "@/components/category/CategoryClientView";

export async function generateStaticParams() {
  return CURRICULUM_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
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