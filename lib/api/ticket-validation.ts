import { supabase } from "@/lib/auth/auth-config";
import type { TicketValidation } from "@/lib/types/ticket";

export async function validateTicket(ticketId: string): Promise<TicketValidation> {
  // Get ticket details with related order and event
  const { data: ticket, error } = await supabase
    .from('tickets')
    .select(`
      *,
      orders (
        status,
        event_date
      )
    `)
    .eq('id', ticketId)
    .single();

  if (error || !ticket) {
    return {
      valid: false,
      reason: 'Ticket not found',
      scannedAt: new Date().toISOString(),
    };
  }

  // Check if ticket has been scanned
  const { data: scanLog } = await supabase
    .from('ticket_scans')
    .select('*')
    .eq('ticket_id', ticketId)
    .single();

  if (scanLog) {
    return {
      valid: false,
      reason: 'Ticket has already been used',
      scannedAt: scanLog.scanned_at,
    };
  }

  // Log the scan
  await supabase
    .from('ticket_scans')
    .insert({
      ticket_id: ticketId,
      scanned_at: new Date().toISOString(),
    });

  return {
    valid: true,
    scannedAt: new Date().toISOString(),
  };
}

export async function getTicketValidationHistory(ticketId: string): Promise<TicketValidation[]> {
  const { data, error } = await supabase
    .from('ticket_scans')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('scanned_at', { ascending: false });

  if (error) {
    throw new Error('Failed to get validation history');
  }

  return data || [];
}