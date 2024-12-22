import { supabase } from "@/lib/auth/auth-config";
import { createPaymentIntent, confirmPayment } from "./payment";
import { generateTicketQR } from "./tickets";
import { sendOrderConfirmationEmail } from "./email";
import type { Order, Ticket } from "@/lib/types";

export async function createOrder(
  userId: string,
  eventId: string,
  tickets: Omit<Ticket, "id" | "orderId">[]
): Promise<Order> {
  const total = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

  // Start a Supabase transaction
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      event_id: eventId,
      total,
      status: 'pending',
      expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error('Failed to create order');
  }

  // Create payment intent
  const paymentIntent = await createPaymentIntent(total);

  // Update order with payment intent
  const { error: updateError } = await supabase
    .from('orders')
    .update({ payment_intent_id: paymentIntent.id })
    .eq('id', order.id);

  if (updateError) {
    throw new Error('Failed to update order with payment intent');
  }

  return {
    ...order,
    tickets: [],
    paymentIntentClientSecret: paymentIntent.clientSecret,
  };
}

export async function confirmOrder(orderId: string): Promise<Order> {
  // Get order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, tickets(*)')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    throw new Error('Order not found');
  }

  // Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'confirmed' })
    .eq('id', orderId);

  if (updateError) {
    throw new Error('Failed to confirm order');
  }

  // Generate QR codes for tickets
  const ticketsWithQR = await Promise.all(
    order.tickets.map(async (ticket) => ({
      ...ticket,
      qrCode: await generateTicketQR(ticket),
    }))
  );

  // Send confirmation email
  await sendOrderConfirmationEmail({
    ...order,
    tickets: ticketsWithQR,
  });

  return {
    ...order,
    tickets: ticketsWithQR,
  };
}

export async function getOrder(orderId: string): Promise<Order> {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, tickets(*)')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    throw new Error('Order not found');
  }

  return order;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, tickets(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch orders');
  }

  return orders || [];
}