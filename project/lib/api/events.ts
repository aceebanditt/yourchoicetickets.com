import { supabase } from "@/lib/auth/auth-config";
import { rateLimit } from "@/lib/utils/rate-limit";
import type { Event, EventStatus } from "@/lib/types/event";

export async function getEvents(params: {
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

export async function createEvent(event: Omit<Event, "id">) {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(id: string, event: Partial<Event>) {
  const { data, error } = await supabase
    .from("events")
    .update(event)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) throw error;
}