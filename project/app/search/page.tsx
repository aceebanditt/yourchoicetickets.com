import { Suspense } from "react";
import { SearchResults } from "./search-results";
import { SearchFilters } from "./search-filters";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{searchParams.q}"
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <SearchFilters />
        </aside>
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            }
          >
            <SearchResults query={searchParams.q} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}