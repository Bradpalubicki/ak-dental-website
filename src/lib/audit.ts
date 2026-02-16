import { createServiceSupabase } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";

interface AuditEntry {
  practiceId?: string | null;
  userId?: string | null;
  userName?: string | null;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  phiAccessed?: boolean;
  sessionId?: string;
  userAgent?: string;
}

/**
 * Log an audit entry. practiceId is optional for single-tenant mode.
 * Automatically captures IP and user agent from request headers when available.
 */
export async function logAudit(entry: AuditEntry) {
  try {
    const supabase = createServiceSupabase();

    // Auto-capture request metadata if not provided
    let ipAddress = entry.ipAddress;
    let userAgent = entry.userAgent;
    try {
      const hdrs = await headers();
      if (!ipAddress) {
        ipAddress = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim()
          || hdrs.get("x-real-ip")
          || undefined;
      }
      if (!userAgent) {
        userAgent = hdrs.get("user-agent") || undefined;
      }
    } catch {
      // headers() not available outside request context
    }

    await supabase.from("audit_log").insert({
      practice_id: entry.practiceId ?? null,
      user_id: entry.userId ?? null,
      user_name: entry.userName ?? null,
      action: entry.action,
      resource_type: entry.resourceType ?? null,
      resource_id: entry.resourceId ?? null,
      details: entry.details ?? null,
      ip_address: ipAddress ?? null,
      phi_accessed: entry.phiAccessed ?? false,
      session_id: entry.sessionId ?? null,
      user_agent: userAgent ?? null,
    });
  } catch (error) {
    // Audit logging should never break the main request
    console.error("[Audit] Failed to log:", error instanceof Error ? error.message : error);
  }
}

/**
 * Helper to log PHI access with auto-captured auth context.
 * Use this in API routes that read/write patient data.
 */
export async function logPhiAccess(
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, unknown>
) {
  let userId: string | null = null;
  try {
    const { userId: clerkUserId } = await auth();
    userId = clerkUserId;
  } catch {
    // Auth not available
  }

  await logAudit({
    userId,
    action,
    resourceType,
    resourceId,
    details,
    phiAccessed: true,
  });
}
