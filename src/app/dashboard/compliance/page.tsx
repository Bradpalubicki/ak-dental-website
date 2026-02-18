import { createServiceSupabase } from "@/lib/supabase/server";
import { ComplianceClient } from "./compliance-client";

export default async function CompliancePage() {
  const supabase = createServiceSupabase();

  // Get recent audit logs
  const { data: recentLogs } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // Get PHI access count (last 24h)
  // eslint-disable-next-line react-hooks/purity -- server component: Date.now() is valid here
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: phiAccessCount } = await supabase
    .from("audit_log")
    .select("*", { count: "exact", head: true })
    .eq("phi_accessed", true)
    .gte("created_at", yesterday);

  // Get total audit entries
  const { count: totalAuditEntries } = await supabase
    .from("audit_log")
    .select("*", { count: "exact", head: true });

  // Get consent stats
  const { data: consentStats } = await supabase
    .from("oe_patient_consents")
    .select("status");

  const consentSummary = {
    granted: consentStats?.filter(c => c.status === "granted").length || 0,
    denied: consentStats?.filter(c => c.status === "denied").length || 0,
    revoked: consentStats?.filter(c => c.status === "revoked").length || 0,
    pending: consentStats?.filter(c => c.status === "pending").length || 0,
  };

  // Get opt-out count
  const { count: optOutCount } = await supabase
    .from("oe_opt_outs")
    .select("*", { count: "exact", head: true });

  // Get retention policies
  const { data: retentionPolicies } = await supabase
    .from("oe_data_retention_policies")
    .select("*")
    .order("resource_type");

  return (
    <ComplianceClient
      recentLogs={recentLogs || []}
      stats={{
        phiAccessLast24h: phiAccessCount || 0,
        totalAuditEntries: totalAuditEntries || 0,
        consentSummary,
        optOuts: optOutCount || 0,
      }}
      retentionPolicies={retentionPolicies || []}
    />
  );
}
