export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { BenefitsClient } from "./benefits-client";

const REQUIRED_POLICIES = [
  "general_liability",
  "professional_liability",
  "workers_comp",
  "cyber_liability",
  "property",
] as const;

const POLICY_TYPE_LABELS: Record<string, string> = {
  general_liability: "General Liability",
  professional_liability: "Professional Liability / Malpractice",
  workers_comp: "Workers' Compensation",
  cyber_liability: "Cyber Liability",
  property: "Property Insurance",
  directors_officers: "Directors & Officers (D&O)",
  management_liability: "Management Liability",
  umbrella: "Umbrella / Excess",
  business_auto: "Business Auto",
  employment_practices: "Employment Practices Liability (EPL)",
  crime_fidelity: "Crime / Fidelity",
  business_interruption: "Business Interruption",
  unemployment_insurance: "Unemployment Insurance",
  other: "Other",
};

function computePolicyStatus(expirationDate: string): string {
  const now = new Date();
  const expiry = new Date(expirationDate + "T12:00:00");
  const daysUntil = Math.floor(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntil < 0) return "expired";
  if (daysUntil <= 60) return "expiring_soon";
  return "active";
}

export default async function BenefitsPage() {
  const supabase = createServiceSupabase();

  const [enrollmentsRes, policiesRes, filingsRes, employeesRes, docsRes] =
    await Promise.all([
      supabase
        .from("oe_employee_benefit_enrollments")
        .select("*, employee:oe_employees(first_name, last_name)")
        .order("created_at", { ascending: false }),
      supabase
        .from("oe_business_insurance_policies")
        .select("*")
        .neq("status", "cancelled")
        .order("expiration_date", { ascending: true }),
      supabase
        .from("oe_corporate_filings")
        .select("*")
        .order("expiration_date", { ascending: true }),
      supabase
        .from("oe_employees")
        .select("id, first_name, last_name, status")
        .eq("status", "active"),
      supabase
        .from("oe_policy_documents")
        .select("id, policy_id"),
    ]);

  const enrollments = enrollmentsRes.data || [];
  const policies = (policiesRes.data || []).map((p) => ({
    ...p,
    status: computePolicyStatus(p.expiration_date),
  }));
  const filings = filingsRes.data || [];
  const employees = employeesRes.data || [];
  const docs = docsRes.data || [];

  // Count documents per policy
  const docCountByPolicy: Record<string, number> = {};
  docs.forEach((d) => {
    if (d.policy_id) {
      docCountByPolicy[d.policy_id] = (docCountByPolicy[d.policy_id] || 0) + 1;
    }
  });

  // Detect missing required policies
  const activePolicyTypes = policies
    .filter((p) => p.status === "active" || p.status === "expiring_soon")
    .map((p) => p.policy_type);

  const missingPolicies = REQUIRED_POLICIES.filter(
    (type) => !activePolicyTypes.includes(type)
  ).map((type) => ({
    policy_type: type,
    label: POLICY_TYPE_LABELS[type] || type,
  }));

  // Stats
  const enrolledCount = enrollments.filter(
    (e) => e.enrollment_status === "enrolled"
  ).length;
  const activePolicies = policies.filter(
    (p) => p.status === "active"
  ).length;
  const expiringSoon = policies.filter(
    (p) => p.status === "expiring_soon"
  ).length;
  const expiredPolicies = policies.filter(
    (p) => p.status === "expired"
  ).length;
  const totalAnnualPremium = policies.reduce(
    (sum, p) => sum + (p.annual_premium || 0),
    0
  );

  return (
    <BenefitsClient
      enrollments={enrollments}
      policies={policies}
      filings={filings}
      employees={employees}
      missingPolicies={missingPolicies}
      docCountByPolicy={docCountByPolicy}
      policyTypeLabels={POLICY_TYPE_LABELS}
      stats={{
        enrolledCount,
        totalEmployees: employees.length,
        activePolicies,
        expiringSoon,
        expiredPolicies,
        missingCount: missingPolicies.length,
        totalAnnualPremium,
      }}
    />
  );
}
