import { notFound } from "next/navigation";
import { SubcategoryResults } from "./subcategory-results";

const validSubcategories = {
  sports: ["mlb", "nba", "nfl", "nhl"],
  concerts: ["rock", "pop", "hip-hop", "country"],
  theater: ["musical", "play", "opera", "ballet"],
  comedy: ["standup", "improv"],
};

export function generateStaticParams() {
  // Generate all possible category/subcategory combinations
  const params = [];
  
  for (const [category, subcategories] of Object.entries(validSubcategories)) {
    for (const subcategory of subcategories) {
      params.push({
        category,
        subcategory,
      });
    }
  }
  
  return params;
}

export default function SubcategoryPage({
  params,
}: {
  params: { category: string; subcategory: string };
}) {
  const validSubcats = validSubcategories[params.category as keyof typeof validSubcategories];
  
  if (!validSubcats || !validSubcats.includes(params.subcategory)) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {params.subcategory.replace("-", " ")} Events
      </h1>
      <SubcategoryResults 
        category={params.category}
        subcategory={params.subcategory}
      />
    </div>
  );
}