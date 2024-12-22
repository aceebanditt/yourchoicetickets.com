"use client";

import { useEffect, useState } from "react";
import { Event, getEventDetails } from "@/lib/api/ticketmaster";
import { EventGallery } from "@/components/events/event-gallery";
import { EventInfo } from "@/components/events/event-info";
import { EventPricing } from "@/components/events/event-pricing";
import { VenueInfo } from "@/components/venues/venue-info";
import { ShareButtons } from "@/components/common/share-buttons";

export function EventDetails({ id }: { id: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await getEventDetails(id);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <ShareButtons url={event.url} title={event.name} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <EventGallery images={event.images} />
          <EventInfo event={event} />
          {event._embedded?.venues?.[0] && (
            <VenueInfo venue={event._embedded.venues[0]} />
          )}
        </div>
        <div>
          <EventPricing event={event} />
        </div>
      </div>
    </div>
  );
}