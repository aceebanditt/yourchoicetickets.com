"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SeatingChart } from "@/components/venues/seating-chart";
import { SeatSelector } from "@/components/venues/seat-selector";
import { useToast } from "@/components/ui/use-toast";
import type { VenueSection, Ticket } from "@/lib/types";

interface TicketSelectionProps {
  eventId: string;
  venueSections: VenueSection[];
}

export function TicketSelection({ eventId, venueSections }: TicketSelectionProps) {
  const [selectedSection, setSelectedSection] = useState<string>();
  const [selectedSeats, setSelectedSeats] = useState<Omit<Ticket, "id" | "orderId">[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
    setSelectedSeats([]);
  };

  const handleSeatSelect = (seat: Omit<Ticket, "id" | "orderId">) => {
    setSelectedSeats((prev) => {
      const exists = prev.some(
        (s) => s.section === seat.section && s.row === seat.row && s.seat === seat.seat
      );
      
      if (exists) {
        return prev.filter(
          (s) => !(s.section === seat.section && s.row === seat.row && s.seat === seat.seat)
        );
      }
      
      if (prev.length >= 8) {
        toast({
          title: "Maximum seats reached",
          description: "You can select up to 8 seats per order.",
          variant: "destructive",
        });
        return prev;
      }
      
      return [...prev, seat];
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive",
      });
      return;
    }

    router.push(`/checkout/${eventId}?seats=${encodeURIComponent(JSON.stringify(selectedSeats))}`);
  };

  return (
    <div className="space-y-8">
      <div className="aspect-[16/9] relative">
        <SeatingChart
          sections={venueSections}
          selectedSection={selectedSection}
          onSectionSelect={handleSectionSelect}
        />
      </div>

      {selectedSection && (
        <SeatSelector
          section={venueSections.find((s) => s.id === selectedSection)!}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
        />
      )}

      <div className="sticky bottom-0 bg-background border-t p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Selected Seats</div>
            <div className="font-bold">{selectedSeats.length} seats</div>
          </div>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
          >
            Continue to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}