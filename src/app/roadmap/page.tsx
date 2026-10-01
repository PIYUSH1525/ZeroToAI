import { getCategoriesWithTopics } from "@/lib/mdx";
import RoadmapClientView from "@/components/roadmap/RoadmapClientView";

export const metadata = {
  title: "AI Learning Roadmap // NeuralPath",
  description:
    "A step-by-step guide to go from complete beginner to AI practitioner.",
};

export default function RoadmapPage() {
  const stages = getCategoriesWithTopics();

  return <RoadmapClientView stages={stages} />;
}