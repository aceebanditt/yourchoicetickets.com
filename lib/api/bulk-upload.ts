import { z } from "zod";
import { supabase } from "@/lib/auth/auth-config";
import { eventSchema } from "@/lib/utils/validation";
import type { Event } from "@/lib/types/event";

const bulkEventSchema = z.array(eventSchema);

export async function validateEventData(data: unknown[]) {
  try {
    return {
      success: true,
      data: bulkEventSchema.parse(data),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      };
    }
    throw error;
  }
}

export async function bulkUploadEvents(events: Event[]) {
  const { data, error } = await supabase
    .from("events")
    .insert(events)
    .select();

  if (error) throw error;
  return data;
}