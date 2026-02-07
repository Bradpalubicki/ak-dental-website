export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = createServiceSupabase();
  const today = new Date().toISOString().split("T")[0];
  const todayStart = `${today}T00:00:00.000Z`;

  const [
    patientsRes,
    appointmentsRes,
    leadsRes,
    pendingApprovalsRes,
    aiActionsTodayRes,
    recentAiActionsRes,
    pendingInsuranceRes,
  ] = await Promise.all([
    supabase.from("oe_patients").select("*", { count: "exact", head: true }),
    supabase
      .from("oe_appointments")
      .select("id, appointment_time, type, status, patient:oe_patients(first_name, last_name)")
      .eq("appointment_date", today)
      .order("appointment_time", { ascending: true }),
    supabase
      .from("oe_leads")
      .select("id, first_name, last_name, source, urgency, status, created_at")
      .gte("created_at", todayStart)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("oe_ai_actions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_approval"),
    supabase
      .from("oe_ai_actions")
      .select("id, status")
      .gte("created_at", todayStart),
    supabase
      .from("oe_ai_actions")
      .select("id, action_type, module, description, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("oe_insurance_verifications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const appointments = (appointmentsRes.data || []).map((apt: any) => ({
    id: apt.id as string,
    time: apt.appointment_time as string,
    patientName: apt.patient
      ? `${apt.patient.first_name} ${apt.patient.last_name}`
      : "Unknown Patient",
    type: apt.type as string,
    status: apt.status as string,
  }));

  const leads = (leadsRes.data || []).map((l: any) => ({
    id: l.id as string,
    name: `${l.first_name} ${l.last_name}`,
    source: l.source as string,
    urgency: l.urgency as string,
    status: l.status as string,
    createdAt: l.created_at as string,
  }));

  const aiActions = (recentAiActionsRes.data || []).map((a: any) => ({
    id: a.id as string,
    description: a.description as string,
    module: a.module as string,
    status: a.status as string,
    createdAt: a.created_at as string,
  }));

  const aiActionsToday = aiActionsTodayRes.data || [];
  const approvedToday = aiActionsToday.filter(
    (a: any) => a.status === "approved" || a.status === "executed"
  ).length;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <DashboardClient
      appointments={appointments}
      leads={leads}
      aiActions={aiActions}
      stats={{
        appointmentCount: appointments.length,
        unconfirmedCount: appointments.filter((a) => a.status === "scheduled").length,
        leadCount: leads.length,
        pendingApprovals: pendingApprovalsRes.count || 0,
        pendingInsurance: pendingInsuranceRes.count || 0,
        patientCount: patientsRes.count || 0,
        aiActionsToday: aiActionsToday.length,
        approvedToday,
      }}
    />
  );
}
