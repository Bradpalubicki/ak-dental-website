import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

/**
 * Weekly data retention cron job.
 * Enforces retention policies from oe_data_retention_policies.
 * Configured in vercel.json: schedule "0 3 * * 0" (Sunday 3 AM)
 */
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabase();
  const results: Record<string, string> = {};

  // Fetch active retention policies
  const { data: policies } = await supabase
    .from("oe_data_retention_policies")
    .select("*")
    .eq("is_active", true);

  if (!policies || policies.length === 0) {
    return NextResponse.json({ message: "No active retention policies" });
  }

  for (const policy of policies) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retention_days);
    const cutoff = cutoffDate.toISOString();

    try {
      if (policy.action === "anonymize" && policy.resource_type === "oe_leads") {
        // Anonymize old non-converted leads
        const { count } = await supabase
          .from("oe_leads")
          .update({
            first_name: "REDACTED",
            last_name: "REDACTED",
            email: null,
            phone: null,
            message: "REDACTED per retention policy",
          })
          .lt("created_at", cutoff)
          .neq("status", "converted")
          .neq("first_name", "REDACTED");

        results[policy.resource_type] = `Anonymized ${count || 0} records`;
      } else if (policy.action === "anonymize" && policy.resource_type === "oe_calls") {
        // Anonymize old call records
        const { count } = await supabase
          .from("oe_calls")
          .update({
            caller_name: "REDACTED",
            caller_phone: "REDACTED",
            transcription: null,
            recording_url: null,
            ai_summary: "REDACTED per retention policy",
          })
          .lt("created_at", cutoff)
          .neq("caller_name", "REDACTED");

        results[policy.resource_type] = `Anonymized ${count || 0} records`;
      } else {
        // For archive/other policies, just log - actual archival would move to cold storage
        results[policy.resource_type] = `Policy noted: ${policy.action} after ${policy.retention_days} days`;
      }
    } catch (error) {
      results[policy.resource_type] = `Error: ${error instanceof Error ? error.message : "Unknown"}`;
    }
  }

  await logAudit({
    action: "cron.data_retention",
    resourceType: "system",
    details: results,
  });

  return NextResponse.json({ success: true, results });
}
