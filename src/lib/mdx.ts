import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Concept, ConceptMeta, TocItem } from "./types";
import {
  CURRICULUM_CATEGORIES,
  TOPIC_PEDAGOGICAL_ORDER,
  resolveCategoryConfig,
  CategoryConfig,
} from "./curriculum";

const contentDirectory = path.join(process.cwd(), "content/concepts");

const DIFFICULTY_WEIGHT: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

function getMDXFiles(dirPath: string, filesList: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath);

  for (const file of entries) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getMDXFiles(fullPath, filesList);
    } else if (file.endsWith(".mdx")) {
      filesList.push(fullPath);
    }
  }

  return filesList;
}

function stripTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

function slugify(text: string, index: number): string {
  const clean = stripTags(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  return clean || `section-${index + 1}`;
}

function extractTocAndInjectIds(raw: string): { content: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  let idx = 0;

  const h2Regex = new RegExp("<h2([^>]*)>([\\s\\S]*?)<\\/h2>", "gi");

  const content = raw.replace(h2Regex, (match, attrs, inner) => {
    const title = stripTags(inner).replace(/\s+/g, " ").trim();
    if (!title) return match;

    const existingId = String(attrs).match(/\bid=["']([^"']+)["']/i);
    const id = existingId ? existingId[1] : slugify(title, idx++);
    toc.push({ id, title });

    if (existingId) return match;
    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });

  return { content, toc };
}

export function getAllConcepts(): ConceptMeta[] {
  const filePaths = getMDXFiles(contentDirectory);

  const concepts: ConceptMeta[] = filePaths.map((filePath) => {
    const slug = path.basename(filePath, ".mdx");
    const relDir = path.relative(contentDirectory, path.dirname(filePath));
    const folder = relDir && relDir !== "." ? relDir.split(path.sep)[0] : "";

    const rawFile = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(rawFile);

    const catConfig = resolveCategoryConfig(data.category || "", folder);
    const preset = TOPIC_PEDAGOGICAL_ORDER[slug];

    const words = stripTags(content).trim().split(/\s+/).length;
    const readMinutes = Math.max(8, Math.min(45, Math.round(words / 130)));

    const difficulty: "Beginner" | "Intermediate" | "Advanced" =
      data.difficulty === "Intermediate" || data.difficulty === "Advanced"
        ? data.difficulty
        : "Beginner";

    const order =
      typeof data.order === "number"
        ? data.order
        : preset?.order ?? DIFFICULTY_WEIGHT[difficulty] * 100;

    const subcategory =
      data.subcategory ||
      preset?.subcategory ||
      (catConfig.subcategories[1] ?? "Foundations");

    const lowerContent = content.toLowerCase();
    const hasCode =
      content.includes("```") || lowerContent.includes("implementation");
    const hasVisuals =
      content.includes("Mermaid") ||
      lowerContent.includes("diagram") ||
      lowerContent.includes("figure");

    return {
      slug,
      title: data.title || slug,
      order,
      category: catConfig.title,
      categorySlug: catConfig.slug,
      subcategory,
      difficulty,
      description: data.description || "",
      readTime: data.readTime || `${readMinutes} min`,
      readMinutes,
      hasCode,
      hasVisuals,
    };
  });

  return concepts.sort((a, b) => {
    const stageA =
      CURRICULUM_CATEGORIES.find((c) => c.slug === a.categorySlug)?.stage ?? 99;
    const stageB =
      CURRICULUM_CATEGORIES.find((c) => c.slug === b.categorySlug)?.stage ?? 99;

    if (stageA !== stageB) {
      return stageA - stageB;
    }

    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.title.localeCompare(b.title);
  });
}

export function getConceptBySlug(slug: string): Concept | null {
  const filePaths = getMDXFiles(contentDirectory);
  const targetPath = filePaths.find(
    (filePath) => path.basename(filePath, ".mdx") === slug
  );

  if (!targetPath) return null;

  const all = getAllConcepts();
  const idx = all.findIndex((c) => c.slug === slug);
  const meta = all[idx];
  if (!meta) return null;

  const rawFile = fs.readFileSync(targetPath, "utf8");
  const { content: raw } = matter(rawFile);
  const { content, toc } = extractTocAndInjectIds(raw);

  const sameCat = all.filter((c) => c.categorySlug === meta.categorySlug);
  const catIdx = sameCat.findIndex((c) => c.slug === slug);

  const prevConcept =
    catIdx > 0
      ? sameCat[catIdx - 1]
      : idx > 0
      ? all[idx - 1]
      : null;

  const nextConcept =
    catIdx >= 0 && catIdx < sameCat.length - 1
      ? sameCat[catIdx + 1]
      : idx < all.length - 1
      ? all[idx + 1]
      : null;

  return {
    meta,
    content,
    toc,
    prevConcept,
    nextConcept,
  };
}

export function getCategoriesWithTopics(): Array<{
  config: CategoryConfig;
  concepts: ConceptMeta[];
}> {
  const all = getAllConcepts();
  return CURRICULUM_CATEGORIES.map((config) => ({
    config,
    concepts: all.filter((c) => c.categorySlug === config.slug),
  }));
}

export function getCategoryBySlug(slug: string): {
  config: CategoryConfig;
  concepts: ConceptMeta[];
} | null {
  const config = CURRICULUM_CATEGORIES.find((c) => c.slug === slug);
  if (!config) return null;

  return {
    config,
    concepts: getAllConcepts().filter((c) => c.categorySlug === slug),
  };
}