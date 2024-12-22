import QRCode from 'qrcode';
import { supabase } from "@/lib/auth/auth-config";
import type { Ticket } from "@/lib/types";

export async function generateTicketQR(ticket: Ticket): Promise<string> {
  const ticketData = {
    id: ticket.id,
    orderId: ticket.orderId,
    section: ticket.section,
    row: ticket.row,
    seat: ticket.seat,
    timestamp: Date.now(),
  };

  // Generate QR code as data URL
  return QRCode.toDataURL(JSON.stringify(ticketData));
}

export async function verifyTicket(ticketId: string): Promise<boolean> {
  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', ticketId)
    .single();

  if (error || !ticket) {
    return false;
  }

  return true;
}