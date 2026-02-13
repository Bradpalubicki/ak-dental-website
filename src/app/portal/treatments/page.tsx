export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getPortalPatient } from "@/lib/portal-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { TreatmentsClient } from "./treatments-client";

export default async function PortalTreatmentsPage() {
  const patient = await getPortalPatient();
  if (!patient) redirect("/portal/login");

  const supabase = createServiceSupabase();

  const { data: treatments } = await supabase
    .from("oe_treatment_plans")
    .select("id, title, status, procedures, total_cost, insurance_estimate, patient_estimate, ai_summary, created_at, accepted_at, provider_name")
    .eq("patient_id", patient.id)
    .order("created_at", { ascending: false });

  return <TreatmentsClient treatments={treatments || []} />;
}
