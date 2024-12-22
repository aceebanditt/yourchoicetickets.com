"use client";

import { useState } from "react";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Taylor Swift | The Eras Tour",
    venue: "MetLife Stadium",
    date: "2024-05-15T19:00:00",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    minPrice: 199,
    maxPrice: 999,
    dealScore: 8.5,
  },
  // Add more mock events as needed
];

export function EventGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Popular Events</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {MOCK_EVENTS.map((event) => (
          <EventCard key={event.id} event={event} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}