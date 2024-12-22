"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useAuth } from "@/components/auth/auth-provider";
import { getEventDetails } from "@/lib/api/ticketmaster";
import type { Event } from "@/lib/types";

export default function CheckoutPage({ params }: { params: { eventId: string } }) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedSeats = searchParams.get("seats")
    ? JSON.parse(decodeURIComponent(searchParams.get("seats")!))
    : [];

  useEffect(() => {
    async function loadEvent() {
      try {
        const eventData = await getEventDetails(params.eventId);
        setEvent(eventData);
      } catch (error) {
        console.error("Error loading event:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [params.eventId]);

  if (loading || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-[400px] bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CheckoutForm
            eventId={params.eventId}
            selectedTickets={selectedSeats}
            total={selectedSeats.reduce((sum: number, seat: any) => sum + seat.price, 0)}
          />
        </div>
        
        <div>
          <OrderSummary
            event={event}
            selectedSeats={selectedSeats}
          />
        </div>
      </div>
    </div>
  );
}