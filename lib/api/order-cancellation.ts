import { db } from "@/lib/auth/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { sendOrderCancellationEmail } from "./email";
import type { Order } from "@/lib/types";

export async function cancelOrder(orderId: string, userId: string): Promise<void> {
  // Get order details
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    throw new Error('Order not found');
  }

  const order = orderSnap.data();

  if (order.status === 'cancelled') {
    throw new Error('Order is already cancelled');
  }

  if (order.status !== 'pending' && order.status !== 'confirmed') {
    throw new Error('Order cannot be cancelled');
  }

  // Start cancellation process
  await updateDoc(orderRef, {
    status: 'cancelled',
    cancelled_at: new Date().toISOString(),
  });

  // Release tickets back to inventory
  const ticketsRef = doc(db, "tickets", orderId);
  await updateDoc(ticketsRef, {
    status: 'available',
    user_id: null,
    order_id: null
  });

  // Send cancellation email
  await sendOrderCancellationEmail(order);
}

export async function getCancellationEligibility(orderId: string): Promise<{
  eligible: boolean;
  reason?: string;
}> {
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    return { eligible: false, reason: "Order not found" };
  }

  const order = orderSnap.data();

  if (order.status === "cancelled") {
    return { eligible: false, reason: "Order is already cancelled" };
  }

  const eventDate = new Date(order.event_date);
  const now = new Date();
  const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilEvent < 24) {
    return { eligible: false, reason: "Cannot cancel within 24 hours of event" };
  }

  return { eligible: true };
}