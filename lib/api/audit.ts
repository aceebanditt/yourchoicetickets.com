import { supabase } from "@/lib/auth/auth-config";

export interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
}

export async function createAuditLog(
  userId: string,
  entry: AuditLogEntry,
  context: { ip?: string; userAgent?: string }
) {
  const { error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: userId,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      metadata: entry.metadata,
      ip_address: context.ip,
      user_agent: context.userAgent
    });

  if (error) throw error;
}

export async function getAuditLogs(params: {
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  const { userId, action, entityType, startDate, endDate, page = 1, limit = 50 } = params;
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' });

  if (userId) query = query.eq('user_id', userId);
  if (action) query = query.eq('action', action);
  if (entityType) query = query.eq('entity_type', entityType);
  if (startDate) query = query.gte('created_at', startDate.toISOString());
  if (endDate) query = query.lte('created_at', endDate.toISOString());

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;

  return {
    logs: data || [],
    total: count || 0,
    page,
    limit
  };
}