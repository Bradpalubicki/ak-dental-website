export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { TreatmentsClient } from "./treatments-client";

export default async function TreatmentsPage() {
  const supabase = createServiceSupabase();

  const { data: plans } = await supabase
    .from("oe_treatment_plans")
    .select("*, patient:oe_patients(id, first_name, last_name, insurance_provider)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const treatments = (plans || []).map((p: any) => ({
    id: p.id as string,
    patientName: p.patient
      ? `${p.patient.first_name} ${p.patient.last_name}`
      : "Unknown Patient",
    patientInsurance: p.patient?.insurance_provider || null,
    title: p.title as string,
    procedures: (p.procedures || []) as Array<{ name: string; code: string; cost: number; category?: string }>,
    totalCost: Number(p.total_cost),
    insuranceEstimate: Number(p.insurance_estimate),
    patientEstimate: Number(p.patient_estimate),
    status: p.status as string,
    hasAiSummary: !!p.ai_summary,
    createdAt: p.created_at as string,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return <TreatmentsClient treatments={treatments} />;
}
