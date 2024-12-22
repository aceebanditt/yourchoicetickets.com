import { z } from "zod";
import type { EventValidation } from "@/lib/types/event";

export const eventValidation: EventValidation = {
  title: {
    minLength: 3,
    maxLength: 100,
  },
  description: {
    minLength: 10,
    maxLength: 2000,
  },
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    formats: ["image/jpeg", "image/png", "image/webp"],
    dimensions: {
      minWidth: 800,
      minHeight: 600,
      maxWidth: 4096,
      maxHeight: 4096,
    },
  },
};

export const eventSchema = z.object({
  title: z.string()
    .min(eventValidation.title.minLength)
    .max(eventValidation.title.maxLength),
  description: z.string()
    .min(eventValidation.description.minLength)
    .max(eventValidation.description.maxLength),
  category: z.string(),
  subcategory: z.string(),
  date: z.string().refine(date => new Date(date) > new Date(), {
    message: "Event date must be in the future",
  }),
  time: z.string(),
  venueId: z.string().uuid(),
  priceRange: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }).refine(range => range.min <= range.max, {
    message: "Minimum price must be less than or equal to maximum price",
  }),
  ticketsAvailable: z.number().positive(),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "cancelled"]),
  imageUrl: z.string().url(),
});