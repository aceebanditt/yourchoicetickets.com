import { supabase } from "@/lib/auth/auth-config";
import { sendTicketTransferEmail } from "./email";
import type { Ticket } from "@/lib/types";

export async function initiateTicketTransfer(
  ticketId: string, 
  fromUserId: string,
  toEmail: string
): Promise<string> {
  // Generate transfer token
  const transferToken = Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const { error } = await supabase
    .from('ticket_transfers')
    .insert({
      ticket_id: ticketId,
      from_user_id: fromUserId,
      to_email: toEmail,
      transfer_token: transferToken,
      expires_at: expiresAt,
      status: 'pending'
    });

  if (error) throw new Error('Failed to initiate transfer');

  // Send transfer email
  await sendTicketTransferEmail(toEmail, transferToken);

  return transferToken;
}

export async function acceptTicketTransfer(
  transferToken: string,
  toUserId: string
): Promise<Ticket> {
  // Verify transfer token and get transfer details
  const { data: transfer, error: transferError } = await supabase
    .from('ticket_transfers')
    .select('*')
    .eq('transfer_token', transferToken)
    .eq('status', 'pending')
    .single();

  if (transferError || !transfer) {
    throw new Error('Invalid or expired transfer token');
  }

  // Update ticket ownership
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .update({ user_id: toUserId })
    .eq('id', transfer.ticket_id)
    .select()
    .single();

  if (ticketError || !ticket) {
    throw new Error('Failed to transfer ticket');
  }

  // Mark transfer as completed
  await supabase
    .from('ticket_transfers')
    .update({ status: 'completed' })
    .eq('transfer_token', transferToken);

  return ticket;
}