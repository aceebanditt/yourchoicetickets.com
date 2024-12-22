export interface Order {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  tickets: Ticket[];
  total: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface Ticket {
  id: string;
  orderId: string;
  section: string;
  row: string;
  seat: string;
  price: number;
  type: 'standard' | 'vip' | 'premium';
}