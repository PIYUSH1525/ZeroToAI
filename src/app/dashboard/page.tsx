import React, { Suspense } from "react";
import { getCategoriesWithTopics, getAllConcepts } from "@/lib/mdx";
import DashboardClientView from "@/components/dashboard/DashboardClientView";

export const metadata = {
  title: "Dashboard // NeuralPath",
  description:
    "Track your AI learning progress, daily streak, and bookmarked topics.",
};

export default function DashboardPage() {
  const categories = getCategoriesWithTopics();
  const allConcepts = getAllConcepts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070E]" />}>
      <DashboardClientView
        categories={categories}
        allConcepts={allConcepts}
      />
    </Suspense>
  );
}