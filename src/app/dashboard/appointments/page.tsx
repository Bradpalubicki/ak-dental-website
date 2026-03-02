export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { AppointmentsClient } from "./appointments-client";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default async function AppointmentsPage() {
  const supabase = createServiceSupabase();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("oe_appointments")
    .select(
      "id, appointment_date, appointment_time, duration_minutes, type, status, provider_name, insurance_verified, notes, confirmation_sent, reminder_24h_sent, patient:oe_patients(id, first_name, last_name, phone)"
    )
    .is("deleted_at", null)
    .gte("appointment_date", today)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true })
    .limit(50);

  // Fetch latest insurance verifications for each patient
  const patientIds = (data || [])
    .map((apt: Record<string, unknown>) => {
      const patient = apt.patient as Record<string, unknown> | null;
      return patient?.id as string | undefined;
    })
    .filter(Boolean) as string[];

  const { data: verifications } = patientIds.length > 0
    ? await supabase
        .from("oe_insurance_verifications")
        .select("patient_id, status, verified_at")
        .in("patient_id", patientIds)
        .order("verified_at", { ascending: false })
    : { data: [] };

  // Build map: patient_id → latest verification
  const verifMap = new Map<string, { status: string; verified_at: string | null }>();
  for (const v of verifications ?? []) {
    const rec = v as { patient_id: string; status: string; verified_at: string | null };
    if (!verifMap.has(rec.patient_id)) {
      verifMap.set(rec.patient_id, { status: rec.status, verified_at: rec.verified_at });
    }
  }

  const now = new Date().getTime();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const appointments = (data || []).map((apt: any) => {
    const patientId = apt.patient?.id as string | undefined;
    const verif = patientId ? verifMap.get(patientId) : undefined;

    let eligibilityStatus: "verified" | "expired" | "unverified" = "unverified";
    if (verif) {
      if (verif.status === "verified" && verif.verified_at) {
        const age = now - new Date(verif.verified_at).getTime();
        eligibilityStatus = age > THIRTY_DAYS_MS ? "expired" : "verified";
      } else if (verif.status === "verified") {
        eligibilityStatus = "verified";
      } else {
        eligibilityStatus = "unverified";
      }
    }

    return {
      id: apt.id as string,
      date: apt.appointment_date as string,
      time: apt.appointment_time as string,
      duration: apt.duration_minutes as number,
      type: apt.type as string,
      status: apt.status as string,
      provider: apt.provider_name as string,
      insuranceVerified: apt.insurance_verified as boolean,
      eligibilityStatus,
      confirmationSent: apt.confirmation_sent as boolean,
      reminderSent: apt.reminder_24h_sent as boolean,
      notes: (apt.notes || "") as string,
      patientName: apt.patient
        ? `${apt.patient.first_name} ${apt.patient.last_name}`
        : "Unknown",
      patientPhone: apt.patient?.phone || "",
    };
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return <AppointmentsClient initialAppointments={appointments} today={today} />;
}
