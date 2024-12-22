export interface TicketTransfer {
  id: string;
  ticketId: string;
  fromUserId: string;
  toEmail: string;
  transferToken: string;
  status: 'pending' | 'completed' | 'cancelled';
  expiresAt: Date;
  createdAt: Date;
}

export interface TicketValidation {
  valid: boolean;
  reason?: string;
  scannedAt: string;
  location?: string;
  validatedBy?: string;
}

export interface TicketScan {
  id: string;
  ticketId: string;
  scannedAt: string;
  location?: string;
  validatedBy?: string;
  valid: boolean;
  reason?: string;
}