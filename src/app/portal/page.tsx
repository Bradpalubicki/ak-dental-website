export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getPortalPatient } from "@/lib/portal-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { PortalDashboard } from "./portal-dashboard";

export default async function PortalPage() {
  const patient = await getPortalPatient();
  if (!patient) redirect("/portal/login");

  const supabase = createServiceSupabase();
  const now = new Date().toISOString();

  const [appointmentsResult, treatmentsResult, messagesResult] = await Promise.all([
    supabase
      .from("oe_appointments")
      .select("id, appointment_date, appointment_time, type, status, provider_name, duration_minutes")
      .eq("patient_id", patient.id)
      .gte("appointment_date", new Date().toISOString().split("T")[0])
      .order("appointment_date", { ascending: true })
      .limit(5),
    supabase
      .from("oe_treatment_plans")
      .select("id, title, status, total_cost, patient_estimate, insurance_estimate, created_at")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("oe_outreach_messages")
      .select("id, subject, channel, sent_at, status")
      .eq("patient_id", patient.id)
      .order("sent_at", { ascending: false })
      .limit(5),
  ]);

  // Get past appointment count
  const { count: pastAppointmentCount } = await supabase
    .from("oe_appointments")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patient.id)
    .eq("status", "completed");

  // Get active treatment count
  const activeTreatments = (treatmentsResult.data || []).filter(
    (t) => t.status === "presented" || t.status === "accepted" || t.status === "partially_accepted"
  );

  return (
    <PortalDashboard
      patientName={patient.first_name}
      upcomingAppointments={appointmentsResult.data || []}
      recentTreatments={treatmentsResult.data || []}
      recentMessages={messagesResult.data || []}
      stats={{
        upcomingCount: (appointmentsResult.data || []).length,
        completedVisits: pastAppointmentCount || 0,
        activeTreatments: activeTreatments.length,
        lastVisit: patient.last_visit,
      }}
    />
  );
}
