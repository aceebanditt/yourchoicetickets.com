"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { formatDate, formatPrice } from "@/lib/utils";
import { getEventImage } from "@/lib/utils/image";
import type { Event, Ticket } from "@/lib/types";

interface OrderSummaryProps {
  event: Event;
  selectedSeats: Omit<Ticket, "id" | "orderId">[];
}

export function OrderSummary({ event, selectedSeats }: OrderSummaryProps) {
  const image = getEventImage(event.images);
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = subtotal * 0.15; // 15% service fee
  const total = subtotal + serviceFee;

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={image.url}
            alt={event.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h3 className="font-semibold">{event.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(event.dates.start.dateTime)}
          </p>
          {event._embedded?.venues?.[0] && (
            <p className="text-sm text-muted-foreground">
              {event._embedded.venues[0].name}
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        <h3 className="font-semibold mb-2">Selected Seats</h3>
        {selectedSeats.map((seat, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>
              Section {seat.section}, Row {seat.row}, Seat {seat.seat}
            </span>
            <span>{formatPrice(seat.price)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Fee</span>
          <span>{formatPrice(serviceFee)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </Card>
  );
}