export interface Venue {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  capacity: number;
  sections: VenueSection[];
  amenities: string[];
  parkingInfo?: string;
  accessibilityInfo?: string;
}

export interface VenueSection {
  id: string;
  name: string;
  capacity: number;
  type: 'standard' | 'vip' | 'premium';
  rows: VenueRow[];
  pricing: {
    basePrice: number;
    serviceFee: number;
  };
}