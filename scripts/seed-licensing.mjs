import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local
const envContent = readFileSync(".env.local", "utf-8");
const envVars = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

function daysBetween(dateStr) {
  const target = new Date(dateStr + "T12:00:00");
  const today = new Date();
  return Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getStatus(days) {
  if (days < 0) return "expired";
  if (days <= 90) return "expiring_soon";
  return "current";
}

async function seed() {
  console.log("Seeding licensing data...");

  const licenses = [
    {
      holder_type: "provider",
      holder_name: "Dr. Alex Khachaturian",
      license_type: "DDS License",
      license_number: "DEN-12345-NV",
      issued_by: "Nevada State Board of Dental Examiners",
      issue_date: "2021-06-15",
      expiration_date: "2027-06-15",
      category: "state_license",
      is_required: true,
    },
    {
      holder_type: "provider",
      holder_name: "Dr. Alex Khachaturian",
      license_type: "DEA Registration",
      license_number: "BK1234567",
      issued_by: "U.S. Drug Enforcement Administration",
      issue_date: "2023-03-28",
      expiration_date: "2026-03-28",
      category: "dea",
      is_required: true,
    },
    {
      holder_type: "provider",
      holder_name: "Dr. Alex Khachaturian",
      license_type: "NPI Number",
      license_number: "1234567890",
      issued_by: "CMS / NPPES",
      issue_date: "2018-01-01",
      expiration_date: null,
      category: "npi",
      is_required: true,
    },
    {
      holder_type: "provider",
      holder_name: "Dr. Alex Khachaturian",
      license_type: "Radiation Safety Certificate",
      license_number: "RAD-NV-5678",
      issued_by: "Nevada Radiation Control Program",
      issue_date: "2022-02-10",
      expiration_date: "2026-02-10",
      category: "certification",
      is_required: true,
    },
    {
      holder_type: "provider",
      holder_name: "Dr. Alex Khachaturian",
      license_type: "Conscious Sedation Permit",
      license_number: "SED-NV-9012",
      issued_by: "Nevada State Board of Dental Examiners",
      issue_date: "2024-08-01",
      expiration_date: "2027-08-01",
      category: "permit",
      is_required: true,
    },
    {
      holder_type: "staff",
      holder_name: "Maria Santos",
      license_type: "RDH License",
      license_number: "HYG-54321-NV",
      issued_by: "Nevada State Board of Dental Examiners",
      issue_date: "2022-12-01",
      expiration_date: "2026-12-01",
      category: "state_license",
      is_required: true,
    },
    {
      holder_type: "staff",
      holder_name: "Maria Santos",
      license_type: "Local Anesthesia Permit",
      license_number: "LA-NV-6789",
      issued_by: "Nevada State Board of Dental Examiners",
      issue_date: "2022-12-01",
      expiration_date: "2026-12-01",
      category: "permit",
      is_required: true,
    },
    {
      holder_type: "staff",
      holder_name: "Jessica Chen",
      license_type: "DA Certification",
      license_number: "DA-98765-NV",
      issued_by: "DANB / Nevada Board",
      issue_date: "2023-08-15",
      expiration_date: "2026-08-15",
      category: "certification",
      is_required: true,
    },
    {
      holder_type: "staff",
      holder_name: "Jessica Chen",
      license_type: "Radiology Certificate",
      license_number: "XR-NV-3456",
      issued_by: "Nevada Board",
      issue_date: "2023-08-15",
      expiration_date: "2026-08-15",
      category: "certification",
      is_required: true,
    },
    {
      holder_type: "team",
      holder_name: "All Staff",
      license_type: "CPR/BLS Certification",
      license_number: "AHA-GRP-2024",
      issued_by: "American Heart Association",
      issue_date: "2024-09-15",
      expiration_date: "2026-09-15",
      category: "certification",
      is_required: true,
    },
    {
      holder_type: "team",
      holder_name: "All Staff",
      license_type: "OSHA Training",
      license_number: "OSHA-2025",
      issued_by: "OSHA / Compliance Provider",
      issue_date: "2025-01-10",
      expiration_date: "2027-01-10",
      category: "training",
      is_required: true,
    },
    {
      holder_type: "team",
      holder_name: "All Staff",
      license_type: "HIPAA Training",
      license_number: "HIPAA-2025",
      issued_by: "Compliance Provider",
      issue_date: "2025-01-10",
      expiration_date: "2026-01-10",
      category: "training",
      is_required: true,
    },
    {
      holder_type: "practice",
      holder_name: "AK Ultimate Dental",
      license_type: "Business License",
      license_number: "BL-LV-2024-8901",
      issued_by: "City of Las Vegas",
      issue_date: "2024-07-01",
      expiration_date: "2026-06-30",
      category: "business",
      is_required: true,
    },
    {
      holder_type: "practice",
      holder_name: "AK Ultimate Dental",
      license_type: "DEA Registration (Practice)",
      license_number: "AP1234567",
      issued_by: "U.S. DEA",
      issue_date: "2023-05-01",
      expiration_date: "2026-05-01",
      category: "dea",
      is_required: true,
    },
  ];

  // Compute status and days_until_expiry
  const enriched = licenses.map((l) => {
    const days = l.expiration_date ? daysBetween(l.expiration_date) : null;
    return {
      ...l,
      status: l.expiration_date ? getStatus(days) : "not_applicable",
      days_until_expiry: days,
    };
  });

  const { error } = await supabase
    .from("oe_licenses")
    .upsert(enriched, { onConflict: "id" });

  if (error) {
    console.error("Error seeding licenses:", error.message);
  } else {
    console.log(`Seeded ${enriched.length} license records`);
    const current = enriched.filter((l) => l.status === "current" || l.status === "not_applicable").length;
    const expiring = enriched.filter((l) => l.status === "expiring_soon").length;
    const expired = enriched.filter((l) => l.status === "expired").length;
    console.log(`  Current: ${current} | Expiring Soon: ${expiring} | Expired: ${expired}`);
  }

  console.log("Done!");
}

seed().catch(console.error);
