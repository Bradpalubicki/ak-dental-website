import { redirect } from "next/navigation";
import { getPortalPatient } from "@/lib/portal-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { PortalShell } from "./portal-shell";

export const metadata = {
  title: "Patient Portal | AK Ultimate Dental",
  description: "Manage your dental appointments, treatments, and billing securely online.",
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const patient = await getPortalPatient();

  if (!patient) {
    redirect("/portal/login");
  }

  // Non-blocking intake completion check
  const supabase = createServiceSupabase();
  const { data: intakeRecord } = await supabase
    .from("oe_intake_submissions")
    .select("id")
    .eq("patient_id", patient.id)
    .limit(1)
    .maybeSingle();

  const intakeCompleted = !!intakeRecord;

  return (
    <PortalShell
      patientName={`${patient.first_name} ${patient.last_name}`}
      patientEmail={patient.email || ""}
      intakeCompleted={intakeCompleted}
    >
      {children}
    </PortalShell>
  );
}
