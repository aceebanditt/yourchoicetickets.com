"use client";

import { useEffect, useState } from "react";
import { Event, searchEvents } from "@/lib/api/ticketmaster";
import { EventCard } from "@/components/events/event-card";

export function SearchResults({ query }: { query: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const response = await searchEvents({
          keyword: query,
          size: 20,
        });
        setEvents(response._embedded?.events || []);
      } catch (err) {
        setError("Failed to load search results");
      } finally {
        setLoading(false);
      }
    }

    if (query) {
      fetchResults();
    }
  }, [query]);

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