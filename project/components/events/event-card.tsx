"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Event } from "@/lib/types/event";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const image = event.images.find((img) => img.ratio === "16_9") || event.images[0];
  const venue = event._embedded?.venues[0];
  const price = event.priceRanges?.[0];

  if (!image?.url) {
    return null;
  }

  return (
    <Link 
      href={event.url}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[380px] rounded-lg overflow-hidden">
        <Image
          src={image.url}
          alt={event.name}
          fill
          className={cn(
            "object-cover transition-transform duration-300",
            isHovered && "scale-105"
          )}
        />
        
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorited(!isFavorited);
          }}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full transition-colors",
            "bg-black/20 hover:bg-black/40",
            isFavorited && "text-red-500"
          )}
        >
          <Heart className="w-6 h-6" fill={isFavorited ? "currentColor" : "none"} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <h3 className="text-lg font-semibold text-white mb-1">{event.name}</h3>
          <div className="flex justify-between items-end">
            <div className="text-sm text-white/90">
              <div>{new Date(event.dates.start.dateTime).toLocaleDateString()}</div>
              {venue && (
                <div>{venue.name}, {venue.city.name}</div>
              )}
            </div>
            {price && (
              <div className="text-white font-bold">
                From ${price.min.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}