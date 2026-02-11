export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { AnalyticsClient } from "./analytics-client";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function AnalyticsPage() {
  const supabase = createServiceSupabase();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Run all queries in parallel
  const [metricsResult, leadsResult, aiResult, appointmentsResult, dailyResult] = await Promise.all([
    // Monthly production/collections from daily_metrics
    supabase
      .from("oe_daily_metrics")
      .select("date, production, collections, new_leads, no_shows, appointments_completed")
      .gte("date", startOfMonth.split("T")[0])
      .order("date", { ascending: true }),

    // Lead sources this month
    supabase
      .from("oe_leads")
      .select("source")
      .gte("created_at", startOfMonth),

    // AI actions this month
    supabase
      .from("oe_ai_actions")
      .select("status")
      .gte("created_at", startOfMonth),

    // Appointments this month for no-show rate
    supabase
      .from("oe_appointments")
      .select("status")
      .gte("appointment_date", startOfMonth.split("T")[0]),

    // Last 7 days for weekly chart
    supabase
      .from("oe_daily_metrics")
      .select("date, production, collections")
      .gte("date", new Date(now.getTime() - 7 * 86400000).toISOString().split("T")[0])
      .order("date", { ascending: true }),
  ]);

  // Build weekly chart data
  const weeklyData = (dailyResult.data || []).map((d) => ({
    day: DAY_NAMES[new Date(d.date + "T12:00:00").getDay()],
    production: Number(d.production || 0),
    collections: Number(d.collections || 0),
  }));

  // Monthly metrics
  const metrics = metricsResult.data || [];
  const totalProduction = metrics.reduce((s, m) => s + Number(m.production || 0), 0);
  const totalCollections = metrics.reduce((s, m) => s + Number(m.collections || 0), 0);
  const totalNewLeads = metrics.reduce((s, m) => s + (m.new_leads || 0), 0);

  // No-show rate from appointments
  const appointments = appointmentsResult.data || [];
  const totalAppts = appointments.length;
  const noShows = appointments.filter((a) => a.status === "no_show").length;
  const noShowRate = totalAppts > 0 ? Math.round((noShows / totalAppts) * 100 * 10) / 10 : 0;

  // Treatment acceptance (completed / total that could be completed)
  const completed = appointments.filter((a) => a.status === "completed").length;
  const treatmentAcceptance = totalAppts > 0 ? Math.round((completed / totalAppts) * 100) : 0;

  // Lead sources breakdown
  const leadSourceMap: Record<string, number> = {};
  for (const lead of leadsResult.data || []) {
    const src = lead.source || "other";
    leadSourceMap[src] = (leadSourceMap[src] || 0) + 1;
  }
  const totalLeads = Object.values(leadSourceMap).reduce((s, v) => s + v, 0) || 1;
  const leadSources = Object.entries(leadSourceMap)
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => ({
      source: source.charAt(0).toUpperCase() + source.slice(1).replace(/_/g, " "),
      count,
      percentage: Math.round((count / totalLeads) * 100),
    }));

  // AI performance
  const aiActions = aiResult.data || [];
  const aiTotal = aiActions.length;
  const aiApproved = aiActions.filter((a) => a.status === "approved" || a.status === "executed").length;
  const aiRejected = aiActions.filter((a) => a.status === "rejected").length;
  const aiPending = aiActions.filter((a) => a.status === "pending_approval").length;
  const aiApprovalRate = aiTotal > 0 ? Math.round((aiApproved / aiTotal) * 1000) / 10 : 0;

  return (
    <AnalyticsClient
      data={{
        weeklyData,
        monthlyMetrics: {
          production: totalProduction,
          collections: totalCollections,
          newPatients: totalNewLeads,
          noShowRate,
          treatmentAcceptance,
        },
        leadSources,
        aiPerformance: {
          totalActions: aiTotal,
          approved: aiApproved,
          rejected: aiRejected,
          pending: aiPending,
          approvalRate: aiApprovalRate,
        },
      }}
    />
  );
}
