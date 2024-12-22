"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterState {
  sort: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  featured?: boolean;
}

export function useCategoryFilters(initialFilters?: Partial<FilterState>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    sort: initialFilters?.sort || "date:asc",
    minPrice: initialFilters?.minPrice,
    maxPrice: initialFilters?.maxPrice,
    date: initialFilters?.date,
    featured: initialFilters?.featured,
  });

  const [debouncedUpdate, setDebouncedUpdate] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (debouncedUpdate) {
      clearTimeout(debouncedUpdate);
    }

    setDebouncedUpdate(
      setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.set(key, value.toString());
          } else {
            params.delete(key);
          }
        });

        router.push(`?${params.toString()}`);
      }, 500)
    );

    return () => {
      if (debouncedUpdate) {
        clearTimeout(debouncedUpdate);
      }
    };
  }, [filters, router, searchParams]);

  return {
    filters,
    setFilters,
    updateFilter: (key: keyof FilterState, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
  };
}