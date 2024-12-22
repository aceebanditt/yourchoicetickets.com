export interface PaymentIntent {
  id: string;
  amount: number;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded';
  clientSecret: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  card?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}