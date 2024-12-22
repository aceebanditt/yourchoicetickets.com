import { supabase } from "@/lib/auth/auth-config";
import type { Order } from "@/lib/types";

export async function sendOrderConfirmationEmail(order: Order) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", order.userId)
    .single();

  if (!profile?.email) {
    throw new Error("User email not found");
  }

  // In a real application, you would integrate with an email service provider
  // For now, we'll just log the email content
  console.log(`
    To: ${profile.email}
    Subject: Order Confirmation - #${order.id}
    
    Thank you for your order!
    
    Order Details:
    Order ID: ${order.id}
    Total: $${order.total.toFixed(2)}
    
    Your Tickets:
    ${order.tickets
      .map(
        (ticket) =>
          `Section ${ticket.section}, Row ${ticket.row}, Seat ${ticket.seat}`
      )
      .join("\n")}
    
    You can view your order details and tickets at any time by visiting your account.
  `);
}

export async function sendOrderReminder(order: Order) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", order.userId)
    .single();

  if (!profile?.email) {
    throw new Error("User email not found");
  }

  // In a real application, you would integrate with an email service provider
  console.log(`
    To: ${profile.email}
    Subject: Your Event is Coming Up!
    
    Don't forget about your upcoming event!
    
    Event Details:
    Order ID: ${order.id}
    
    Your Tickets:
    ${order.tickets
      .map(
        (ticket) =>
          `Section ${ticket.section}, Row ${ticket.row}, Seat ${ticket.seat}`
      )
      .join("\n")}
    
    We look forward to seeing you there!
  `);
}