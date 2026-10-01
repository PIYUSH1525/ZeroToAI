export interface TocItem {
  id: string;
  title: string;
}

export interface ConceptMeta {
  slug: string;
  title: string;
  order?: number;
  category: string;
  categorySlug: string;
  subcategory: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  readTime: string;
  readMinutes: number;
  hasCode: boolean;
  hasVisuals: boolean;
}

export interface Concept {
  meta: ConceptMeta;
  content: string;
  toc: TocItem[];
  prevConcept: ConceptMeta | null;
  nextConcept: ConceptMeta | null;
}