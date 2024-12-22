import { supabase } from "@/lib/auth/auth-config";
import { createAuditLog } from "@/lib/api/audit";
import type { Event, EventStatus } from "@/lib/types/event";

export class EventService {
  static async getEvents(params: {
    category?: string;
    status?: EventStatus;
    featured?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, status = "published", featured, sort, page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("events")
      .select("*", { count: "exact" });

    if (category) query = query.eq("category", category);
    if (status) query = query.eq("status", status);
    if (featured) query = query.eq("featured", true);

    if (sort) {
      const [field, order] = sort.split(":");
      query = query.order(field, { ascending: order === "asc" });
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      events: data || [],
      total: count || 0,
      page,
      limit,
    };
  }

  static async createEvent(event: Omit<Event, "id">, userId: string) {
    const { data, error } = await supabase
      .from("events")
      .insert(event)
      .select()
      .single();

    if (error) throw error;

    await createAuditLog(userId, {
      action: "create",
      entityType: "event",
      entityId: data.id,
      metadata: { title: event.title }
    });

    return data;
  }

  static async updateEvent(id: string, event: Partial<Event>, userId: string) {
    const { data, error } = await supabase
      .from("events")
      .update(event)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await createAuditLog(userId, {
      action: "update",
      entityType: "event",
      entityId: id,
      metadata: { title: event.title }
    });

    return data;
  }

  static async deleteEvent(id: string, userId: string) {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await createAuditLog(userId, {
      action: "delete",
      entityType: "event",
      entityId: id
    });
  }
}