import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ConceptMeta } from "./types";

const CONCEPTS_PATH = path.join(process.cwd(), "content/concepts");

export function getAllConcepts(): ConceptMeta[] {
  if (!fs.existsSync(CONCEPTS_PATH)) return [];
  const files = fs.readdirSync(CONCEPTS_PATH);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const source = fs.readFileSync(path.join(CONCEPTS_PATH, file), "utf-8");
      const { data } = matter(source);
      return {
        ...(data as Omit<ConceptMeta, "slug">),
        slug: file.replace(/\.mdx$/, ""),
      };
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getConceptBySlug(slug: string) {
  const filePath = path.join(CONCEPTS_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(source);
  return { content, meta: { ...(data as Omit<ConceptMeta, "slug">), slug } };
}