"use client";

import { useState } from "react";
import { Event } from "@/lib/api/ticketmaster";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export function EventPricing({ event }: { event: Event }) {
  const [quantity, setQuantity] = useState("1");
  const { toast } = useToast();

  const handlePurchase = () => {
    toast({
      title: "Redirecting to checkout",
      description: `Purchasing ${quantity} ticket(s)`,
    });
    window.open(event.url, "_blank");
  };

  return (
    <Card className="p-6 sticky top-24">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Select Tickets</h3>
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger>
              <SelectValue placeholder="Select quantity" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "ticket" : "tickets"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {event.priceRanges?.[0] && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Price Range</div>
            <div className="text-2xl font-bold">
              ${event.priceRanges[0].min.toFixed(2)} - $
              {event.priceRanges[0].max.toFixed(2)}
            </div>
          </div>
        )}

        <Button className="w-full" size="lg" onClick={handlePurchase}>
          Get Tickets
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You will be redirected to our secure ticketing partner
        </p>
      </div>
    </Card>
  );
}