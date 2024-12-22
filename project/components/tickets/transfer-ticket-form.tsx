"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { initiateTicketTransfer } from "@/lib/api/ticket-transfer";

interface TransferTicketFormProps {
  ticketId: string;
  userId: string;
  onSuccess: () => void;
}

export function TransferTicketForm({ ticketId, userId, onSuccess }: TransferTicketFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await initiateTicketTransfer(ticketId, userId, email);
      toast({
        title: "Transfer initiated",
        description: "An email has been sent to the recipient with transfer instructions.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Transfer failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Recipient Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter recipient's email"
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Initiating Transfer..." : "Transfer Ticket"}
      </Button>
    </form>
  );
}