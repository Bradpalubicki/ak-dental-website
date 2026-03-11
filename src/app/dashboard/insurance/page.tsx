export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { InsuranceClient } from "./insurance-client";

export default async function InsurancePage() {
  const supabase = createServiceSupabase();

  const { data } = await supabase
    .from("oe_insurance_verifications")
    .select(
      "*, patient:oe_patients(first_name, last_name), appointment:oe_appointments(appointment_date, appointment_time)"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const verifications = (data || []).map((v: any) => ({
    id: v.id as string,
    patientName: v.patient
      ? `${v.patient.first_name} ${v.patient.last_name}`
      : "Unknown",
    provider: v.insurance_provider as string,
    memberId: v.member_id as string,
    groupNumber: v.group_number as string | null,
    status: v.status as string,
    appointmentDate: v.appointment?.appointment_date || null,
    appointmentTime: v.appointment?.appointment_time || null,
    preventiveCoverage: v.preventive_coverage as number | null,
    basicCoverage: v.basic_coverage as number | null,
    majorCoverage: v.major_coverage as number | null,
    deductible: v.deductible as number | null,
    deductibleMet: v.deductible_met as number | null,
    annualMax: v.annual_maximum as number | null,
    annualUsed: v.annual_used as number | null,
    flags: (v.flags || []) as string[],
    verifiedAt: v.verified_at as string | null,
    notes: v.notes as string | null,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const { data: carriersData } = await supabase
    .from("oe_insurance_carriers")
    .select("id, name, source, is_active")
    .eq("is_active", true)
    .order("name");

  const carriers = (carriersData || []).map((c) => c.name as string);

  const { data: patientsData } = await supabase
    .from("oe_patients")
    .select("id, first_name, last_name")
    .eq("status", "active")
    .order("last_name")
    .limit(500);

  const patients = (patientsData || []).map((p: { id: string; first_name: string; last_name: string }) => ({
    id: p.id,
    name: `${p.first_name} ${p.last_name}`,
  }));

  return <InsuranceClient initialVerifications={verifications} dbCarriers={carriers} patients={patients} />;
}
