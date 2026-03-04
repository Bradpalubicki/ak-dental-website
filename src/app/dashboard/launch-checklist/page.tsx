export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { LaunchChecklistClient } from "./launch-checklist-client";

export default async function LaunchChecklistPage() {
  const supabase = createServiceSupabase();
  const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();

  // Run all auto-checks in parallel
  const [
    templatesRes,
    patientsRes,
    settingsRes,
    callsRes,
    _staffRes,
    trainingRes,
  ] = await Promise.all([
    supabase.from("oe_message_templates").select("approved").eq("approved", true),
    supabase.from("oe_patients").select("id", { count: "exact", head: true }),
    supabase.from("oe_settings").select("key, value").in("key", ["test_mode", "go_live_at", "nustack_signoff"]),
    supabase.from("oe_calls").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    supabase.from("oe_training_completions").select("user_id, module, passed"),
    supabase.from("oe_training_completions").select("user_id").eq("module", "hipaa").eq("passed", true),
  ]);

  const approvedTemplates = templatesRes.data?.length || 0;
  const patientCount = patientsRes.count || 0;

  const settingsMap: Record<string, string> = {};
  for (const row of settingsRes.data || []) settingsMap[row.key] = row.value || "";

  const testModeOff = settingsMap.test_mode !== "true";
  const nutstackSignoff = settingsMap.nustack_signoff === "true";
  const goLiveAt = settingsMap.go_live_at || null;

  const recentCallCount = callsRes.count || 0;
  const hipaaTrainedCount = trainingRes.data?.length || 0;

  const checks = {
    // Integrations
    resendDomain: false, // checked client-side via Resend API
    twilioConfigured: !!process.env.TWILIO_ACCOUNT_SID,
    vapiConfigured: !!(process.env.VAPI_API_KEY && process.env.VAPI_API_KEY.length > 10),
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    supabasePopulated: patientCount > 0,
    // Templates
    allTemplatesApproved: approvedTemplates >= 18,
    approvedTemplateCount: approvedTemplates,
    // Voice AI
    vapiCallLogged: recentCallCount > 0,
    // Staff
    hipaaTrainedCount,
    // Compliance
    complianceSigned: false, // manual
    // Cron
    cronConfigured: !!process.env.CRON_SECRET,
    // DNS
    dnsPointed: false, // checked client-side
    sslActive: false,
    // Go-live gate
    testModeOff,
    nutstackSignoff,
    goLiveAt,
  };

  return <LaunchChecklistClient checks={checks} />;
}
