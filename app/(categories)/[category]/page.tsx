import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CategoryResults } from "./category-results";
import { CategoryFilters } from "./category-filters";
import { Skeleton } from "@/components/ui/skeleton";

const validCategories = ["sports", "concerts", "theater", "comedy"];

export function generateStaticParams() {
  return validCategories.map((category) => ({
    category,
  }));
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { [key: string]: string | undefined };
}) {
  if (!validCategories.includes(params.category)) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {params.category} Events
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside>
          <CategoryFilters
            initialFilters={{
              sort: searchParams.sort,
              minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
              maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
              date: searchParams.date,
            }}
          />
        </aside>

        <main className="lg:col-span-3">
          <Suspense 
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[380px]" />
                ))}
              </div>
            }
          >
            <CategoryResults 
              category={params.category}
              searchParams={searchParams}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}