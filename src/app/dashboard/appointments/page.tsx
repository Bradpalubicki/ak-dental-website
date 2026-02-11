export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { AppointmentsClient } from "./appointments-client";

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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const appointments = (data || []).map((apt: any) => ({
    id: apt.id as string,
    date: apt.appointment_date as string,
    time: apt.appointment_time as string,
    duration: apt.duration_minutes as number,
    type: apt.type as string,
    status: apt.status as string,
    provider: apt.provider_name as string,
    insuranceVerified: apt.insurance_verified as boolean,
    confirmationSent: apt.confirmation_sent as boolean,
    reminderSent: apt.reminder_24h_sent as boolean,
    notes: (apt.notes || "") as string,
    patientName: apt.patient
      ? `${apt.patient.first_name} ${apt.patient.last_name}`
      : "Unknown",
    patientPhone: apt.patient?.phone || "",
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return <AppointmentsClient initialAppointments={appointments} today={today} />;
}
