"use client";

import { useEffect, useState } from "react";
import { EventCard } from "@/components/events/event-card";
import { EventService } from "@/lib/services/event-service";
import type { Event } from "@/lib/types/event";

interface CategoryResultsProps {
  category: string;
  searchParams: { [key: string]: string | undefined };
}

export function CategoryResults({ category, searchParams }: CategoryResultsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const { events } = await EventService.getEvents({
          category,
          sort: searchParams.sort,
          featured: searchParams.featured === "true",
          minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
          maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
          date: searchParams.date,
        });
        setEvents(events);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [category, searchParams]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
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