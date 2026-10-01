// This file permanently fixes the alphabetical sorting bug and powers the 9-Stage Learning Path (Screens 1 & 4) and Explore by Category Grid (Screens 1 & 2)

export interface CategoryConfig {
  slug: string;
  title: string;
  shortTitle: string;
  stage: number;
  description: string;
  longDescription: string;
  accentColor: string;
  subcategories: string[];
  aliases: string[];
}

// Powers the 9-Stage Learning Path (Screen 1 & Screen 4) and Category Pages (Screen 2)
export const CURRICULUM_CATEGORIES: CategoryConfig[] = [
  {
    slug: "mathematics",
    title: "Mathematics",
    shortTitle: "Math Foundations",
    stage: 1,
    description: "Build your mathematical foundation for AI.",
    longDescription: "Linear algebra, calculus, probability, and optimization foundations that power every machine learning algorithm.",
    accentColor: "emerald",
    subcategories: ["All Topics", "Linear Algebra", "Calculus", "Probability", "Optimization"],
    aliases: ["mathematics", "math", "math foundations"],
  },
  {
    slug: "python-programming",
    title: "Python Programming",
    shortTitle: "Python Programming",
    stage: 2,
    description: "Python basics, data structures, libraries.",
    longDescription: "Master Python syntax, NumPy vectorization, Pandas data manipulation, and PyTorch tensor operations.",
    accentColor: "blue",
    subcategories: ["All Topics", "Python Basics", "NumPy & Pandas", "Data Visualization"],
    aliases: ["python", "python programming"],
  },
  {
    slug: "machine-learning",
    title: "Machine Learning",
    shortTitle: "Machine Learning",
    stage: 3,
    description: "Learn core ML concepts from scratch.",
    longDescription: "Learn the fundamental concepts of machine learning from basic intuition to advanced algorithms.",
    accentColor: "amber",
    subcategories: ["All Topics", "Foundations", "Regression", "Classification", "Clustering", "Advanced"],
    aliases: ["machine learning", "ml fundamentals", "ml", "ml basics"],
  },
  {
    slug: "deep-learning",
    title: "Deep Learning",
    shortTitle: "Deep Learning",
    stage: 4,
    description: "Neural networks, training and optimization.",
    longDescription: "Understand multi-layer perceptrons, activation functions, backpropagation, CNNs, and modern training loops.",
    accentColor: "indigo",
    subcategories: ["All Topics", "Neural Networks", "Optimization", "Regularization", "Architectures"],
    aliases: ["deep learning", "dl", "neural networks"],
  },
  {
    slug: "nlp",
    title: "NLP",
    shortTitle: "NLP",
    stage: 5,
    description: "Text processing and language understanding.",
    longDescription: "Explore how machines tokenize, embed, and model human language from word vectors to sequence models.",
    accentColor: "purple",
    subcategories: ["All Topics", "Tokenization", "Embeddings", "Sequence Models"],
    aliases: ["nlp", "natural language processing"],
  },
  {
    slug: "transformers",
    title: "Transformers",
    shortTitle: "Transformers",
    stage: 6,
    description: "Attention, architecture and beyond.",
    longDescription: "Unpack self-attention, multi-head routing, positional encoding, and the architecture behind modern AI.",
    accentColor: "cyan",
    subcategories: ["All Topics", "Foundations", "Attention", "Architecture"],
    aliases: ["transformers", "transformer"],
  },
  {
    slug: "generative-ai",
    title: "Generative AI",
    shortTitle: "LLMs",
    stage: 7,
    description: "LLMs, RAG, tools and AI agents.",
    longDescription: "Large language models, pretraining, fine-tuning, alignment, and generative architectures.",
    accentColor: "orange",
    subcategories: ["All Topics", "LLMs", "Fine-Tuning", "Prompting & Alignment"],
    aliases: ["generative ai", "llms", "llm", "large language models"],
  },
  {
    slug: "rag",
    title: "RAG",
    shortTitle: "RAG",
    stage: 8,
    description: "Retrieval augmented generation.",
    longDescription: "Connect LLMs to external knowledge using chunking, vector databases, semantic search, and grounded generation.",
    accentColor: "teal",
    subcategories: ["All Topics", "Retrieval", "Vector Databases", "Evaluation"],
    aliases: ["rag", "retrieval augmented generation"],
  },
  {
    slug: "ai-agents",
    title: "AI Agents",
    shortTitle: "AI Agents",
    stage: 9,
    description: "Tools, memory, and autonomous agents.",
    longDescription: "Design autonomous systems capable of reasoning, planning, tool execution, and multi-agent collaboration.",
    accentColor: "rose",
    subcategories: ["All Topics", "Agent Loops", "Tool Use", "Memory Systems"],
    aliases: ["ai agents", "agents", "autonomous agents"],
  },
];

// Explicit pedagogical sequence for lessons so they NEVER sort alphabetically by mistake
export const TOPIC_PEDAGOGICAL_ORDER: Record<string, { order: number; subcategory: string }> = {
  // Machine Learning track
  "machine-learning": { order: 1, subcategory: "Foundations" },
  "intro-to-machine-learning": { order: 1, subcategory: "Foundations" },
  "supervised-machine-learning": { order: 2, subcategory: "Foundations" },
  "unsupervised-learning": { order: 3, subcategory: "Foundations" },
  "reinforcement-learning": { order: 4, subcategory: "Foundations" },
  "linear-regression": { order: 5, subcategory: "Regression" },
  "gradient-descent": { order: 6, subcategory: "Regression" },

  // Transformers track
  "transformers": { order: 1, subcategory: "Foundations" },
  "attention": { order: 2, subcategory: "Attention" },
  "attention_all_you_need": { order: 3, subcategory: "Architecture" },

  // Generative AI / LLMs track
  "intro-to-llms": { order: 1, subcategory: "LLMs" },

  // RAG track
  "rag": { order: 1, subcategory: "Retrieval" },
};

export function resolveCategoryConfig(rawCategory: string, folderName?: string): CategoryConfig {
  const candidates = [rawCategory, folderName || ""].map((s) => s.trim().toLowerCase());

  for (const candidate of candidates) {
    if (!candidate) continue;
    const match = CURRICULUM_CATEGORIES.find(
      (cat) =>
        cat.slug === candidate ||
        cat.title.toLowerCase() === candidate ||
        cat.aliases.includes(candidate)
    );
    if (match) return match;
  }

  // Fallback to Machine Learning if unspecified
  return CURRICULUM_CATEGORIES[2];
}