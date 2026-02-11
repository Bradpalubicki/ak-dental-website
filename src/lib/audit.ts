import { createServiceSupabase } from "@/lib/supabase/server";

interface AuditEntry {
  practiceId: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export async function logAudit(entry: AuditEntry) {
  const supabase = createServiceSupabase();

  await supabase.from("audit_log").insert({
    practice_id: entry.practiceId,
    user_id: entry.userId ?? null,
    user_name: entry.userName ?? null,
    action: entry.action,
    resource_type: entry.resourceType ?? null,
    resource_id: entry.resourceId ?? null,
    details: entry.details ?? null,
    ip_address: entry.ipAddress ?? null,
  });
}
