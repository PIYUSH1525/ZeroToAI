
import type { MetadataRoute } from "next";
import { getAllConcepts, getCategoriesWithTopics } from "@/lib/mdx";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const concepts = getAllConcepts();
  const categories = getCategoriesWithTopics();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
    },
    {
      url: `${SITE_URL}/roadmap`,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((category) => category.concepts.length > 0)
    .map((category) => ({
      url: `${SITE_URL}/category/${category.config.slug}`,
    }));

  const conceptPages: MetadataRoute.Sitemap = concepts.map((concept) => ({
    url: `${SITE_URL}/concepts/${concept.slug}`,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...conceptPages,
  ];
}
