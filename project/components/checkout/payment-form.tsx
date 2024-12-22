"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { confirmPayment } from "@/lib/api/payment";

interface PaymentFormProps {
  clientSecret: string;
  orderId: string;
  onSuccess: () => void;
}

export function PaymentForm({ clientSecret, orderId, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, this would use a real payment provider's SDK
      const success = await confirmPayment(clientSecret);
      
      if (success) {
        onSuccess();
        router.push(`/checkout/confirmation/${orderId}`);
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again or use a different payment method.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            placeholder="123"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}