export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getPortalPatient } from "@/lib/portal-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { BillingClient } from "./billing-client";

export default async function PortalBillingPage() {
  const patient = await getPortalPatient();
  if (!patient) redirect("/portal/login");

  const supabase = createServiceSupabase();

  // Get treatment plans for billing summary
  const { data: treatments } = await supabase
    .from("oe_treatment_plans")
    .select("id, title, status, total_cost, insurance_estimate, patient_estimate, created_at, accepted_at")
    .eq("patient_id", patient.id)
    .order("created_at", { ascending: false });

  const allTreatments = treatments || [];

  // Compute billing summary from treatment data
  const acceptedPlans = allTreatments.filter((t) => t.status === "accepted" || t.status === "completed");
  const totalCharges = acceptedPlans.reduce((sum, t) => sum + t.total_cost, 0);
  const insurancePaid = acceptedPlans.reduce((sum, t) => sum + t.insurance_estimate, 0);
  const patientResponsibility = acceptedPlans.reduce((sum, t) => sum + t.patient_estimate, 0);
  // Simulate partial payments on completed treatments
  const completedPlans = allTreatments.filter((t) => t.status === "completed");
  const estimatedPaid = completedPlans.reduce((sum, t) => sum + t.patient_estimate, 0);
  const balance = patientResponsibility - estimatedPaid;

  return (
    <BillingClient
      treatments={allTreatments}
      summary={{
        totalCharges,
        insurancePaid,
        patientResponsibility,
        amountPaid: estimatedPaid,
        balance: Math.max(0, balance),
      }}
    />
  );
}
