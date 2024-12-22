"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { createOrder } from '@/lib/api/orders';
import type { Ticket } from '@/lib/types';

interface CheckoutFormProps {
  eventId: string;
  selectedTickets: Omit<Ticket, 'id' | 'orderId'>[];
  total: number;
}

export function CheckoutForm({ eventId, selectedTickets, total }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const order = await createOrder(eventId, selectedTickets);
      router.push(`/checkout/confirmation/${order.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Card Number"
          required
          className="w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="MM/YY"
            required
          />
          <Input
            type="text"
            placeholder="CVC"
            required
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Service Fee</span>
          <span>${(total * 0.15).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${(total * 1.15).toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Complete Purchase"}
      </Button>
    </form>
  );
}