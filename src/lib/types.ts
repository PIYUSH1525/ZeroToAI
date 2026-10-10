// Section types that the "Code" and "Visualizations" buttons can jump to.
// To add a new kind of section later, add its name here and use it in MDX as data-type="...".
export const SECTION_TYPES = ["code", "visualization"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export interface TocItem {
  id: string;
  title: string;
  /** Optional. Set in MDX with <h2 data-type="code"> or <h2 data-type="visualization"> */
  type?: SectionType;
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