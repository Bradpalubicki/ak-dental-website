export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { LicensingClient } from "./licensing-client";

export default async function LicensingPage() {
  const supabase = createServiceSupabase();

  const { data: licensesRaw } = await supabase
    .from("oe_licenses")
    .select("*")
    .order("status", { ascending: true })
    .order("days_until_expiry", { ascending: true });

  // If no DB records yet, use seed data for demo
  const licenses = (licensesRaw && licensesRaw.length > 0)
    ? licensesRaw.map((l) => ({
        id: l.id,
        holderType: l.holder_type,
        holderName: l.holder_name,
        licenseType: l.license_type,
        licenseNumber: l.license_number,
        issuedBy: l.issued_by,
        issueDate: l.issue_date,
        expirationDate: l.expiration_date,
        status: l.status,
        daysUntilExpiry: l.days_until_expiry,
        category: l.category,
        isRequired: l.is_required,
        documentUrl: l.document_url,
        renewalSubmitted: l.renewal_submitted || false,
        alertExpiredSent: l.alert_expired_sent || false,
      }))
    : getDemoLicenses();

  const stats = {
    total: licenses.length,
    current: licenses.filter((l) => l.status === "current" || l.status === "not_applicable").length,
    expiringSoon: licenses.filter((l) => l.status === "expiring_soon").length,
    expired: licenses.filter((l) => l.status === "expired").length,
  };

  return <LicensingClient licenses={licenses} stats={stats} />;
}

function getDemoLicenses() {
  const today = new Date();
  const daysBetween = (d: string) => {
    const target = new Date(d + "T12:00:00");
    return Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };
  const getStatus = (days: number) => {
    if (days < 0) return "expired";
    if (days <= 90) return "expiring_soon";
    return "current";
  };

  const demoData = [
    { holder: "Dr. Alexandru Chireu", type: "provider", licType: "DDS License", num: "DEN-12345-NV", issuer: "Nevada State Board of Dental Examiners", issued: "2021-06-15", expires: "2027-06-15", cat: "state_license" },
    { holder: "Dr. Alexandru Chireu", type: "provider", licType: "DEA Registration", num: "BK1234567", issuer: "U.S. Drug Enforcement Administration", issued: "2023-03-28", expires: "2026-03-28", cat: "dea" },
    { holder: "Dr. Alexandru Chireu", type: "provider", licType: "NPI Number", num: "1234567890", issuer: "CMS / NPPES", issued: "2018-01-01", expires: null, cat: "npi" },
    { holder: "Dr. Alexandru Chireu", type: "provider", licType: "Radiation Safety Certificate", num: "RAD-NV-5678", issuer: "Nevada Radiation Control Program", issued: "2022-02-10", expires: "2026-02-10", cat: "certification" },
    { holder: "Dr. Alexandru Chireu", type: "provider", licType: "Conscious Sedation Permit", num: "SED-NV-9012", issuer: "Nevada State Board of Dental Examiners", issued: "2024-08-01", expires: "2027-08-01", cat: "permit" },
    { holder: "Maria Santos", type: "staff", licType: "RDH License", num: "HYG-54321-NV", issuer: "Nevada State Board of Dental Examiners", issued: "2022-12-01", expires: "2026-12-01", cat: "state_license" },
    { holder: "Maria Santos", type: "staff", licType: "Local Anesthesia Permit", num: "LA-NV-6789", issuer: "Nevada State Board of Dental Examiners", issued: "2022-12-01", expires: "2026-12-01", cat: "permit" },
    { holder: "Jessica Chen", type: "staff", licType: "DA Certification", num: "DA-98765-NV", issuer: "DANB / Nevada Board", issued: "2023-08-15", expires: "2026-08-15", cat: "certification" },
    { holder: "Jessica Chen", type: "staff", licType: "Radiology Certificate", num: "XR-NV-3456", issuer: "Nevada Board", issued: "2023-08-15", expires: "2026-08-15", cat: "certification" },
    { holder: "All Staff", type: "team", licType: "CPR/BLS Certification", num: "AHA-GRP-2024", issuer: "American Heart Association", issued: "2024-09-15", expires: "2026-09-15", cat: "certification" },
    { holder: "All Staff", type: "team", licType: "OSHA Training", num: "OSHA-2025", issuer: "OSHA / Compliance Provider", issued: "2025-01-10", expires: "2027-01-10", cat: "training" },
    { holder: "All Staff", type: "team", licType: "HIPAA Training", num: "HIPAA-2025", issuer: "Compliance Provider", issued: "2025-01-10", expires: "2026-01-10", cat: "training" },
    { holder: "Practice", type: "practice", licType: "Business License", num: "BL-LV-2024-8901", issuer: "City of Las Vegas", issued: "2024-07-01", expires: "2026-06-30", cat: "business" },
    { holder: "Practice", type: "practice", licType: "DEA Registration (Practice)", num: "AP1234567", issuer: "U.S. DEA", issued: "2023-05-01", expires: "2026-05-01", cat: "dea" },
  ];

  return demoData.map((d, i) => {
    const days = d.expires ? daysBetween(d.expires) : 9999;
    return {
      id: `demo-${i + 1}`,
      holderType: d.type,
      holderName: d.holder,
      licenseType: d.licType,
      licenseNumber: d.num,
      issuedBy: d.issuer,
      issueDate: d.issued,
      expirationDate: d.expires,
      status: d.expires ? getStatus(days) : "not_applicable",
      daysUntilExpiry: d.expires ? days : null,
      category: d.cat,
      isRequired: true,
      documentUrl: null,
      renewalSubmitted: false,
      alertExpiredSent: false,
    };
  });
}
