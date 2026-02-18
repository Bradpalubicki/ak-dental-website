import type { SupabaseClient } from "@supabase/supabase-js";

export async function seedBenefits(supabase: SupabaseClient) {
  const inserted: Record<string, number> = {};
  const errors: string[] = [];

  // Get employees for enrollment references
  const { data: employees } = await supabase
    .from("oe_employees")
    .select("id, first_name, last_name")
    .eq("status", "active")
    .limit(10);

  if (!employees || employees.length === 0) {
    errors.push("No employees found — run demo + hr seed first");
    return { inserted, errors };
  }

  // Employee benefit enrollments
  const enrollments = employees.flatMap((emp) => [
    {
      employee_id: emp.id,
      benefit_type: "ichra_health",
      plan_name: "Silver HMO 3000",
      carrier_name: "Health Plan of Nevada",
      policy_number: `HPN-${emp.first_name.substring(0, 3).toUpperCase()}-2026`,
      monthly_premium: 485.0,
      employer_contribution: 400.0,
      employee_contribution: 85.0,
      coverage_tier: "employee",
      enrollment_status: "enrolled",
      effective_date: "2026-01-01",
      ichra_allowance_monthly: 400.0,
    },
    {
      employee_id: emp.id,
      benefit_type: "dental",
      plan_name: "Delta Dental PPO",
      carrier_name: "Delta Dental",
      policy_number: "DD-AK-2026-GRP",
      monthly_premium: 45.0,
      employer_contribution: 45.0,
      employee_contribution: 0,
      coverage_tier: "employee",
      enrollment_status: "enrolled",
      effective_date: "2026-01-01",
      ichra_allowance_monthly: null,
    },
    {
      employee_id: emp.id,
      benefit_type: "vision",
      plan_name: "VSP Choice",
      carrier_name: "VSP Vision Care",
      monthly_premium: 18.0,
      employer_contribution: 18.0,
      employee_contribution: 0,
      coverage_tier: "employee",
      enrollment_status: employees.indexOf(emp) < 3 ? "enrolled" : "waived",
      effective_date: "2026-01-01",
      ichra_allowance_monthly: null,
    },
  ]);

  const { error: enrollErr } = await supabase
    .from("oe_employee_benefit_enrollments")
    .upsert(enrollments, { onConflict: "id" });
  if (enrollErr) errors.push(`Enrollments: ${enrollErr.message}`);
  else inserted.oe_employee_benefit_enrollments = enrollments.length;

  // Business insurance policies
  const policies = [
    {
      policy_type: "general_liability",
      carrier_name: "The Hartford",
      policy_number: "GL-NV-2025-4521",
      coverage_amount: 2000000,
      deductible: 1000,
      annual_premium: 3200,
      monthly_premium: 266.67,
      effective_date: "2025-06-01",
      expiration_date: "2026-06-01",
      status: "active",
      agent_name: "Mark Stevens",
      agent_phone: "(702) 555-0180",
      agent_email: "mstevens@hartfordagent.com",
      broker_company: "Nevada Business Insurance Group",
      auto_renew: true,
    },
    {
      policy_type: "professional_liability",
      carrier_name: "TDIC - The Dentists Insurance Company",
      policy_number: "PL-TDIC-2025-8892",
      coverage_amount: 1000000,
      deductible: 5000,
      annual_premium: 4800,
      monthly_premium: 400,
      effective_date: "2025-03-15",
      expiration_date: "2026-03-15",
      status: "active",
      agent_name: "Mark Stevens",
      agent_phone: "(702) 555-0180",
      agent_email: "mstevens@hartfordagent.com",
      broker_company: "Nevada Business Insurance Group",
      auto_renew: true,
    },
    {
      policy_type: "workers_comp",
      carrier_name: "Employers Holdings Inc",
      policy_number: "WC-NV-2025-3301",
      coverage_amount: 500000,
      deductible: 0,
      annual_premium: 5200,
      monthly_premium: 433.33,
      effective_date: "2025-01-01",
      expiration_date: "2026-01-01",
      renewal_date: "2026-01-01",
      status: "expired",
      agent_name: "Mark Stevens",
      agent_phone: "(702) 555-0180",
      agent_email: "mstevens@hartfordagent.com",
      broker_company: "Nevada Business Insurance Group",
      auto_renew: false,
      notes: "Renewal quote requested — awaiting updated payroll data from ADP.",
    },
    {
      policy_type: "cyber_liability",
      carrier_name: "Coalition Inc",
      policy_number: "CY-COA-2025-1147",
      coverage_amount: 1000000,
      deductible: 2500,
      annual_premium: 1800,
      monthly_premium: 150,
      effective_date: "2025-09-01",
      expiration_date: "2026-09-01",
      status: "active",
      agent_name: "Sarah Lin",
      agent_phone: "(415) 555-0220",
      agent_email: "slin@coalition.com",
      broker_company: "Coalition Inc",
      auto_renew: true,
    },
    {
      policy_type: "property",
      carrier_name: "State Farm",
      policy_number: "PR-SF-2025-7789",
      coverage_amount: 750000,
      deductible: 2500,
      annual_premium: 2400,
      monthly_premium: 200,
      effective_date: "2025-04-01",
      expiration_date: "2026-04-01",
      status: "active",
      agent_name: "David Chen",
      agent_phone: "(702) 555-0199",
      agent_email: "dchen@statefarm.com",
      broker_company: "State Farm",
      auto_renew: true,
    },
  ];

  const { error: polErr } = await supabase
    .from("oe_business_insurance_policies")
    .upsert(policies, { onConflict: "id" });
  if (polErr) errors.push(`Policies: ${polErr.message}`);
  else inserted.oe_business_insurance_policies = policies.length;

  // Corporate filings
  const filings = [
    {
      filing_type: "state_business_registration",
      title: "Nevada LLC Annual List",
      filing_entity: "AK Ultimate Dental LLC",
      jurisdiction: "Nevada Secretary of State",
      filing_number: "NV20231234567",
      status: "current",
      effective_date: "2023-05-15",
      expiration_date: "2026-05-15",
      renewal_frequency: "Annual",
      cost: 150,
      responsible_party: "Dr. Alex Khachaturian",
    },
    {
      filing_type: "business_license",
      title: "City of Las Vegas Business License",
      filing_entity: "AK Ultimate Dental LLC",
      jurisdiction: "City of Las Vegas",
      filing_number: "BL-LV-2025-08821",
      status: "current",
      effective_date: "2025-07-01",
      expiration_date: "2026-06-30",
      renewal_frequency: "Annual",
      cost: 200,
      responsible_party: "Dr. Alex Khachaturian",
    },
    {
      filing_type: "tax_registration",
      title: "Nevada State Business License",
      filing_entity: "AK Ultimate Dental LLC",
      jurisdiction: "Nevada Department of Taxation",
      filing_number: "NV-TAX-2023-88901",
      status: "current",
      effective_date: "2023-05-15",
      expiration_date: null,
      renewal_frequency: "Annual renewal",
      cost: 200,
      responsible_party: "Dr. Alex Khachaturian",
    },
    {
      filing_type: "annual_report",
      title: "Nevada Annual Report 2026",
      filing_entity: "AK Ultimate Dental LLC",
      jurisdiction: "Nevada Secretary of State",
      filing_number: null,
      status: "pending",
      effective_date: null,
      expiration_date: "2026-05-15",
      renewal_frequency: "Annual",
      cost: 150,
      responsible_party: "Dr. Alex Khachaturian",
      notes: "Due May 15 — file online via SilverFlume.",
    },
  ];

  const { error: filErr } = await supabase
    .from("oe_corporate_filings")
    .upsert(filings, { onConflict: "id" });
  if (filErr) errors.push(`Filings: ${filErr.message}`);
  else inserted.oe_corporate_filings = filings.length;

  return { inserted, errors };
}
