"use client";

import { useState, useEffect } from "react";
import { getSuggestions } from "@/lib/api/ticketmaster";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchSuggestionsProps {
  query: string;
  onSelect: () => void;
}

export function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSuggestions() {
      if (!query) return;
      
      try {
        setLoading(true);
        const data = await getSuggestions(query);
        setSuggestions(data._embedded?.suggestions || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [query]);

  if (loading) {
    return (
      <Card className="absolute top-full mt-1 w-full z-50 p-2">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (!suggestions.length) {
    return null;
  }

  return (
    <Card className="absolute top-full mt-1 w-full z-50 p-2">
      <div className="space-y-1">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent"
            onClick={() => {
              onSelect();
              // Handle suggestion selection
            }}
          >
            {suggestion.name}
          </button>
        ))}
      </div>
    </Card>
  );
}