import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ConceptMeta } from "./types";

const CONCEPTS_PATH = path.join(process.cwd(), "content/concepts");

// Helper function to recursively search through all folders and sub-folders
function getMDXFiles(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    // If it's a folder, open it and search inside
    if (fs.statSync(filePath).isDirectory()) {
      getMDXFiles(filePath, fileList);
    } 
    // If it's an MDX file, add it to our list
    else if (file.endsWith(".mdx")) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

export function getAllConcepts(): ConceptMeta[] {
  if (!fs.existsSync(CONCEPTS_PATH)) return [];

  const files = getMDXFiles(CONCEPTS_PATH);

  return files.map((filePath) => {
    const source = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(source);

    // Prioritize a custom slug from frontmatter; fallback to filename
    const slug = data.slug || path.basename(filePath).replace(/\.mdx$/, "");

    return {
      ...(data as Omit<ConceptMeta, "slug">),
      slug,
    };
  }).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getConceptBySlug(slug: string) {
  const files = getMDXFiles(CONCEPTS_PATH);
  
  for (const filePath of files) {
    const source = fs.readFileSync(filePath, "utf-8");
    const { content, data } = matter(source);
    
    // Check if the frontmatter slug OR the filename matches the requested URL
    const fileSlug = data.slug || path.basename(filePath).replace(/\.mdx$/, "");
    
    if (fileSlug === slug) {
      return { content, meta: { ...(data as Omit<ConceptMeta, "slug">), slug: fileSlug } };
    }
  }

  return null;
}