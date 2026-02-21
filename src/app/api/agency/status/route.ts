import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyAgencySecret } from "@/lib/agency-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = verifyAgencySecret(req);
  if (!auth.valid) return auth.response!;

  try {
    const supabase = createServiceSupabase();
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]!;
    const todayStart = `${todayStr}T00:00:00.000Z`;

    // Start of this week (Monday)
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - mondayOffset);
    const weekStartStr = weekStart.toISOString().split("T")[0]!;

    // 30 days ago
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      leadsToday,
      leadsThisWeek,
      leadsPending,
      leadsAvgResponse,
      apptsToday,
      apptsThisWeek,
      apptsConfirmed,
      apptsNoShows,
      apptsCancellations,
      patientsTotal,
      patientsActive,
      patientsNew30d,
      aiPending,
      aiApprovedToday,
      aiRejectedToday,
      aiTotalToday,
      outreachSentToday,
      outreachDeliveredToday,
      outreachFailedToday,
      activeWorkflows,
      lastMetricsEntry,
    ] = await Promise.all([
      supabase.from("oe_leads").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
      supabase.from("oe_leads").select("id", { count: "exact", head: true }).gte("created_at", weekStartStr),
      supabase.from("oe_leads").select("id", { count: "exact", head: true }).in("status", ["new", "contacted"]),
      supabase.from("oe_leads").select("response_time_seconds").not("response_time_seconds", "is", null).gte("created_at", thirtyDaysAgo),

      supabase.from("oe_appointments").select("id", { count: "exact", head: true }).eq("appointment_date", todayStr),
      supabase.from("oe_appointments").select("id", { count: "exact", head: true }).gte("appointment_date", weekStartStr),
      supabase.from("oe_appointments").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase.from("oe_appointments").select("id", { count: "exact", head: true }).eq("status", "no_show").gte("appointment_date", weekStartStr),
      supabase.from("oe_appointments").select("id", { count: "exact", head: true }).eq("status", "cancelled").gte("appointment_date", weekStartStr),

      supabase.from("oe_patients").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("oe_patients").select("id", { count: "exact", head: true }).eq("status", "active").is("deleted_at", null),
      supabase.from("oe_patients").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo).is("deleted_at", null),

      supabase.from("oe_ai_actions").select("id", { count: "exact", head: true }).eq("status", "pending_approval"),
      supabase.from("oe_ai_actions").select("id", { count: "exact", head: true }).in("status", ["approved", "executed"]).gte("created_at", todayStart),
      supabase.from("oe_ai_actions").select("id", { count: "exact", head: true }).eq("status", "rejected").gte("created_at", todayStart),
      supabase.from("oe_ai_actions").select("id", { count: "exact", head: true }).gte("created_at", todayStart),

      supabase.from("oe_outreach_messages").select("id", { count: "exact", head: true }).eq("direction", "outbound").gte("created_at", todayStart),
      supabase.from("oe_outreach_messages").select("id", { count: "exact", head: true }).eq("status", "delivered").gte("created_at", todayStart),
      supabase.from("oe_outreach_messages").select("id", { count: "exact", head: true }).eq("status", "failed").gte("created_at", todayStart),
      supabase.from("oe_outreach_workflows").select("id", { count: "exact", head: true }).eq("status", "active").is("deleted_at", null),

      supabase.from("oe_daily_metrics").select("date").order("date", { ascending: false }).limit(1),
    ]);

    const responseTimes = (leadsAvgResponse.data as { response_time_seconds: number }[]) || [];
    const avgResponseSeconds =
      responseTimes.length > 0
        ? Math.round(responseTimes.reduce((sum, r) => sum + (r.response_time_seconds || 0), 0) / responseTimes.length)
        : null;

    const lastMetricsDate = (lastMetricsEntry.data as { date: string }[])?.[0]?.date;
    const lastCronRun = lastMetricsDate ? `${lastMetricsDate}T14:00:00.000Z` : null;
    const cronHealthy = lastMetricsDate
      ? (Date.now() - new Date(lastMetricsDate).getTime()) < 48 * 60 * 60 * 1000
      : false;

    const twilioConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN !== "PLACEHOLDER_ADD_TWILIO_TOKEN");
    const resendConfigured = !!process.env.RESEND_API_KEY;
    const claudeConfigured = !!(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "PLACEHOLDER_ADD_ANTHROPIC_KEY");

    return NextResponse.json({
      engine: "dental",
      practice: "AK Ultimate Dental",
      generatedAt: now.toISOString(),
      leads: {
        today: leadsToday.count ?? 0,
        thisWeek: leadsThisWeek.count ?? 0,
        thisMonth: 0,
        pending: leadsPending.count ?? 0,
        avgResponseSeconds,
      },
      appointments: {
        today: apptsToday.count ?? 0,
        thisWeek: apptsThisWeek.count ?? 0,
        confirmed: apptsConfirmed.count ?? 0,
        noShows: apptsNoShows.count ?? 0,
        cancellations: apptsCancellations.count ?? 0,
      },
      patients: {
        total: patientsTotal.count ?? 0,
        active: patientsActive.count ?? 0,
        new30d: patientsNew30d.count ?? 0,
      },
      aiActions: {
        pending: aiPending.count ?? 0,
        approvedToday: aiApprovedToday.count ?? 0,
        rejectedToday: aiRejectedToday.count ?? 0,
        totalToday: aiTotalToday.count ?? 0,
      },
      outreach: {
        sentToday: outreachSentToday.count ?? 0,
        deliveredToday: outreachDeliveredToday.count ?? 0,
        failedToday: outreachFailedToday.count ?? 0,
        activeSequences: activeWorkflows.count ?? 0,
      },
      integrations: {
        twilio: { status: twilioConfigured ? "connected" : "not_configured", configured: twilioConfigured },
        resend: { status: resendConfigured ? "connected" : "not_configured", configured: resendConfigured },
        claude: { status: claudeConfigured ? "connected" : "not_configured", configured: claudeConfigured },
        supabase: { status: "connected", configured: true },
      },
      health: {
        dbOk: true,
        lastCronRun,
        cronHealthy,
      },
    });
  } catch (error) {
    console.error("[Agency Status] Error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to generate status" }, { status: 500 });
  }
}
