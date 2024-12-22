"use client";

import { useEffect, useState } from "react";
import { Event, searchEvents } from "@/lib/api/ticketmaster";
import { EventCard } from "@/components/events/event-card";

interface SubcategoryResultsProps {
  category: string;
  subcategory: string;
}

export function SubcategoryResults({ category, subcategory }: SubcategoryResultsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const response = await searchEvents({
          classificationName: category,
          keyword: subcategory,
          size: 20,
        });
        setEvents(response._embedded?.events || []);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [category, subcategory]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted h-[380px] rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No events found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}