"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { VenueSection, Ticket } from "@/lib/types";

interface SeatSelectorProps {
  section: VenueSection;
  selectedSeats: Omit<Ticket, "id" | "orderId">[];
  onSeatSelect: (seat: Omit<Ticket, "id" | "orderId">) => void;
}

export function SeatSelector({ section, selectedSeats, onSeatSelect }: SeatSelectorProps) {
  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{section.name}</h3>
        <p className="text-sm text-muted-foreground">
          Select up to 8 seats in this section
        </p>
      </div>

      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-6">
          {section.rows.map((row) => (
            <div key={row.name} className="space-y-2">
              <div className="text-sm font-medium">Row {row.name}</div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: row.seats }, (_, i) => {
                  const seatNumber = (i + 1).toString().padStart(2, "0");
                  const isSelected = selectedSeats.some(
                    (s) =>
                      s.section === section.id &&
                      s.row === row.name &&
                      s.seat === seatNumber
                  );

                  return (
                    <Button
                      key={seatNumber}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "w-10 h-10 p-0",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                      onClick={() =>
                        onSeatSelect({
                          section: section.id,
                          row: row.name,
                          seat: seatNumber,
                          price: section.pricing.basePrice,
                          type: section.type,
                        })
                      }
                    >
                      {seatNumber}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}