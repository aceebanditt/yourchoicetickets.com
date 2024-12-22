import { supabase } from "@/lib/auth/auth-config";
import { sendOrderCancellationEmail } from "./email";
import type { Order } from "@/lib/types";

export async function cancelOrder(orderId: string, userId: string): Promise<void> {
  // Get order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (orderError || !order) {
    throw new Error('Order not found');
  }

  if (order.status === 'cancelled') {
    throw new Error('Order is already cancelled');
  }

  if (order.status !== 'pending' && order.status !== 'confirmed') {
    throw new Error('Order cannot be cancelled');
  }

  // Start cancellation process
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (updateError) {
    throw new Error('Failed to cancel order');
  }

  // Release tickets back to inventory
  await supabase
    .from('tickets')
    .update({
      status: 'available',
      user_id: null,
      order_id: null
    })
    .eq('order_id', orderId);

  // Send cancellation email
  await sendOrderCancellationEmail(order);
}

export async function getCancellationEligibility(orderId: string): Promise<{
  eligible: boolean;
  reason?: string;
}> {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return { eligible: false, reason: 'Order not found' };
  }

  if (order.status === 'cancelled') {
    return { eligible: false, reason: 'Order is already cancelled' };
  }

  const eventDate = new Date(order.event_date);
  const now = new Date();
  const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilEvent < 24) {
    return { eligible: false, reason: 'Cannot cancel within 24 hours of event' };
  }

  return { eligible: true };
}