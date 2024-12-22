import { z } from "zod";
import { supabase } from "@/lib/auth/auth-config";
import { eventSchema } from "@/lib/utils/validation";
import { createAuditLog } from "@/lib/api/audit";
import type { Event } from "@/lib/types/event";

const bulkEventSchema = z.array(eventSchema);

export class BulkUploadService {
  static async validateEvents(data: unknown[]) {
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

  static async uploadEvents(events: Event[], userId: string) {
    const { data, error } = await supabase
      .from("events")
      .insert(events)
      .select();

    if (error) throw error;

    await createAuditLog(userId, {
      action: "bulk_upload",
      entityType: "events",
      entityId: "bulk",
      metadata: { count: events.length }
    });

    return data;
  }

  static async parseCSV(file: File): Promise<unknown[]> {
    const text = await file.text();
    const rows = text.split("\n").map(row => row.split(","));
    const [headers, ...data] = rows;

    return data.map(row => {
      const event: Record<string, any> = {};
      headers.forEach((header, index) => {
        event[header.trim()] = row[index]?.trim();
      });
      return event;
    });
  }
}