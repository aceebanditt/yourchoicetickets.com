"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getOrder } from "@/lib/api/orders";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const orderData = await getOrder(params.orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [params.orderId]);

  if (loading || !order) {
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
      <Card className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order details are below.
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Order Details</h2>
            <div className="text-sm space-y-1">
              <p>Order ID: {order.id}</p>
              <p>Date: {formatDate(order.createdAt.toString())}</p>
              <p>Total: {formatPrice(order.total)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Tickets</h2>
            <div className="space-y-2">
              {order.tickets.map((ticket) => (
                <div key={ticket.id} className="text-sm">
                  Section {ticket.section}, Row {ticket.row}, Seat {ticket.seat}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}