export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getPortalPatient } from "@/lib/portal-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { IntakeFormClient } from "./intake-form-client";

export default async function IntakePage() {
  const patient = await getPortalPatient();
  if (!patient) redirect("/portal/login");

  const supabase = createServiceSupabase();

  // Check if intake already completed
  const { data: existing } = await supabase
    .from("oe_intake_submissions")
    .select("id, submitted_at")
    .eq("patient_id", patient.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <IntakeFormClient
      patient={{
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        phone: patient.phone || "",
        date_of_birth: patient.date_of_birth || "",
        address: patient.address || "",
        city: patient.city || "",
        state: patient.state || "",
        zip: patient.zip || "",
        insurance_provider: patient.insurance_provider || "",
        insurance_member_id: patient.insurance_member_id || "",
        insurance_group_number: patient.insurance_group_number || "",
      }}
      alreadySubmitted={!!existing}
      submittedAt={existing?.submitted_at || null}
    />
  );
}
