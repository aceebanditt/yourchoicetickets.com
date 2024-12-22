"use client";

import { useEffect, useState } from "react";
import { searchVenues } from "@/lib/api/ticketmaster";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  city: {
    name: string;
  };
  state: {
    name: string;
  };
  images?: Array<{
    url: string;
    ratio: string;
  }>;
}

export function PopularVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await searchVenues({
          countryCode: "US",
        });
        setVenues(response._embedded?.venues || []);
      } catch (err) {
        setError("Failed to load venues");
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Popular Venues</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {venues.slice(0, 8).map((venue) => (
          <Card key={venue.id} className="overflow-hidden group">
            <Link href={`/venues/${venue.id}`}>
              <div className="relative pt-[56.25%] bg-muted">
                {venue.images?.[0] && (
                  <Image
                    src={venue.images[0].url}
                    alt={venue.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{venue.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {venue.city.name}, {venue.state.name}
                  </span>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}