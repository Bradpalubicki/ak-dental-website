export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getPortalPatient } from "@/lib/portal-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { AppointmentsClient } from "./appointments-client";

export default async function PortalAppointmentsPage() {
  const patient = await getPortalPatient();
  if (!patient) redirect("/portal/login");

  const supabase = createServiceSupabase();

  const { data: appointments } = await supabase
    .from("oe_appointments")
    .select("id, appointment_date, appointment_time, type, status, provider_name, duration_minutes, notes, insurance_verified")
    .eq("patient_id", patient.id)
    .order("appointment_date", { ascending: false })
    .limit(50);

  return <AppointmentsClient appointments={appointments || []} />;
}
