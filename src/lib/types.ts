export interface ConceptMeta {
  title: string;
  slug: string;
  category: "Mathematics" | "ML Fundamentals" | "Deep Learning" | "NLP" | "Transformers";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  order?: number;
  description: string;
}