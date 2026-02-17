import type { SupabaseClient } from "@supabase/supabase-js";

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T12:00:00");
  return Math.floor((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function getStatus(days: number | null) {
  if (days === null) return "not_applicable";
  if (days < 0) return "expired";
  if (days <= 90) return "expiring_soon";
  return "current";
}

const licenses = [
  { holder_type: "provider", holder_name: "Dr. Alex Khachaturian", license_type: "DDS License", license_number: "DEN-12345-NV", issued_by: "Nevada State Board of Dental Examiners", issue_date: "2021-06-15", expiration_date: "2027-06-15", category: "state_license" },
  { holder_type: "provider", holder_name: "Dr. Alex Khachaturian", license_type: "DEA Registration", license_number: "BK1234567", issued_by: "U.S. Drug Enforcement Administration", issue_date: "2023-03-28", expiration_date: "2026-03-28", category: "dea" },
  { holder_type: "provider", holder_name: "Dr. Alex Khachaturian", license_type: "NPI Number", license_number: "1234567890", issued_by: "CMS / NPPES", issue_date: "2018-01-01", expiration_date: null, category: "npi" },
  { holder_type: "provider", holder_name: "Dr. Alex Khachaturian", license_type: "Radiation Safety Certificate", license_number: "RAD-NV-5678", issued_by: "Nevada Radiation Control Program", issue_date: "2022-02-10", expiration_date: "2026-02-10", category: "certification" },
  { holder_type: "provider", holder_name: "Dr. Alex Khachaturian", license_type: "Conscious Sedation Permit", license_number: "SED-NV-9012", issued_by: "Nevada State Board of Dental Examiners", issue_date: "2024-08-01", expiration_date: "2027-08-01", category: "permit" },
  { holder_type: "provider", holder_name: "Dr. Alex Khachaturian", license_type: "Malpractice Insurance", license_number: "MP-NV-2024-001", issued_by: "TDIC / The Dentists Insurance Co", issue_date: "2024-01-01", expiration_date: "2027-01-01", category: "insurance" },
  { holder_type: "staff", holder_name: "Maria Santos", license_type: "RDH License", license_number: "HYG-54321-NV", issued_by: "Nevada State Board of Dental Examiners", issue_date: "2022-12-01", expiration_date: "2026-12-01", category: "state_license" },
  { holder_type: "staff", holder_name: "Maria Santos", license_type: "Local Anesthesia Permit", license_number: "LA-NV-6789", issued_by: "Nevada State Board of Dental Examiners", issue_date: "2022-12-01", expiration_date: "2026-12-01", category: "permit" },
  { holder_type: "staff", holder_name: "Jessica Chen", license_type: "DA Certification", license_number: "DA-98765-NV", issued_by: "DANB / Nevada Board", issue_date: "2023-08-15", expiration_date: "2026-08-15", category: "certification" },
  { holder_type: "staff", holder_name: "Jessica Chen", license_type: "Radiology Certificate", license_number: "XR-NV-3456", issued_by: "Nevada Board", issue_date: "2023-08-15", expiration_date: "2026-08-15", category: "certification" },
  { holder_type: "team", holder_name: "All Staff", license_type: "CPR/BLS Certification", license_number: "AHA-GRP-2024", issued_by: "American Heart Association", issue_date: "2024-09-15", expiration_date: "2026-09-15", category: "certification" },
  { holder_type: "team", holder_name: "All Staff", license_type: "OSHA Training", license_number: "OSHA-2025", issued_by: "OSHA / Compliance Provider", issue_date: "2025-01-10", expiration_date: "2027-01-10", category: "training" },
  { holder_type: "team", holder_name: "All Staff", license_type: "HIPAA Training", license_number: "HIPAA-2025", issued_by: "Compliance Provider", issue_date: "2025-01-10", expiration_date: "2026-01-10", category: "training" },
  { holder_type: "practice", holder_name: "AK Ultimate Dental", license_type: "Business License", license_number: "BL-LV-2024-8901", issued_by: "City of Las Vegas", issue_date: "2024-07-01", expiration_date: "2026-06-30", category: "business" },
  { holder_type: "practice", holder_name: "AK Ultimate Dental", license_type: "DEA Registration (Practice)", license_number: "AP1234567", issued_by: "U.S. DEA", issue_date: "2023-05-01", expiration_date: "2026-05-01", category: "dea" },
  { holder_type: "practice", holder_name: "AK Ultimate Dental", license_type: "Facility Permit", license_number: "FP-NV-2024-001", issued_by: "Nevada State Board of Dental Examiners", issue_date: "2024-01-15", expiration_date: "2027-01-15", category: "permit" },
];

export async function seedLicensing(supabase: SupabaseClient) {
  const inserted: Record<string, number> = {};
  const errors: string[] = [];

  // Clear existing
  await supabase.from("oe_licenses").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const rows = licenses.map((l) => {
    const days = daysUntil(l.expiration_date);
    return {
      ...l,
      status: getStatus(days),
      days_until_expiry: days,
      is_required: true,
    };
  });

  const { error } = await supabase.from("oe_licenses").insert(rows);
  if (error) errors.push(`Licenses: ${error.message}`);
  else inserted.oe_licenses = rows.length;

  return { inserted, errors };
}
