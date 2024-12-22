export type EventStatus = "draft" | "published" | "cancelled";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  date: string;
  time: string;
  venueId: string;
  priceRange: {
    min: number;
    max: number;
  };
  ticketsAvailable: number;
  featured: boolean;
  status: EventStatus;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventValidation {
  title: {
    minLength: number;
    maxLength: number;
  };
  description: {
    minLength: number;
    maxLength: number;
  };
  image: {
    maxSize: number; // in bytes
    formats: string[];
    dimensions: {
      minWidth: number;
      minHeight: number;
      maxWidth: number;
      maxHeight: number;
    };
  };
}