export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";

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
    emergencyLeadsRes,
  ] = await Promise.all([
    supabase.from("oe_patients").select("id", { count: "exact", head: true }),
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
      .select("id", { count: "exact", head: true })
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
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("oe_leads")
      .select("id, first_name, last_name, urgency, inquiry_type, created_at")
      .in("urgency", ["high", "emergency"])
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(5),
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

  // Build urgent items
  const urgentItems: Array<{ type: string; label: string; detail: string; href: string; level: string }> = [];

  (emergencyLeadsRes.data || []).forEach((l: any) => {
    urgentItems.push({
      type: "lead",
      label: l.urgency === "emergency" ? "EMERGENCY LEAD" : "High-Priority Lead",
      detail: `${l.first_name} ${l.last_name} — ${l.inquiry_type || "new inquiry"}`,
      href: "/dashboard/leads",
      level: l.urgency === "emergency" ? "critical" : "warning",
    });
  });

  const pendingApprovals = pendingApprovalsRes.count || 0;
  if (pendingApprovals > 0) {
    urgentItems.push({
      type: "approvals",
      label: `${pendingApprovals} AI Action${pendingApprovals !== 1 ? "s" : ""} Awaiting Approval`,
      detail: "Review and approve before messages are sent",
      href: "/dashboard/approvals",
      level: pendingApprovals > 3 ? "warning" : "info",
    });
  }

  const unconfirmed = appointments.filter((a) => a.status === "scheduled");
  if (unconfirmed.length > 0) {
    urgentItems.push({
      type: "appointments",
      label: `${unconfirmed.length} Unconfirmed Appointment${unconfirmed.length !== 1 ? "s" : ""} Today`,
      detail: unconfirmed.map((a) => a.patientName).join(", "),
      href: "/dashboard/appointments",
      level: "warning",
    });
  }

  const pendingIns = pendingInsuranceRes.count || 0;
  if (pendingIns > 0) {
    urgentItems.push({
      type: "insurance",
      label: `${pendingIns} Pending Insurance Verification${pendingIns !== 1 ? "s" : ""}`,
      detail: "Verify before patient appointments",
      href: "/dashboard/insurance",
      level: "info",
    });
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const levelOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
  urgentItems.sort((a, b) => (levelOrder[a.level] ?? 2) - (levelOrder[b.level] ?? 2));

  return (
    <DashboardGrid
      data={{
        appointments,
        leads,
        aiActions,
        urgentItems,
        stats: {
          appointmentCount: appointments.length,
          unconfirmedCount: unconfirmed.length,
          leadCount: leads.length,
          pendingApprovals,
          pendingInsurance: pendingIns,
          patientCount: patientsRes.count || 0,
          aiActionsToday: aiActionsToday.length,
          approvedToday,
        },
      }}
    />
  );
}
