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

  const licenses = (licensesRaw || []).map((l) => ({
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
  }));

  const stats = {
    total: licenses.length,
    current: licenses.filter((l) => l.status === "current" || l.status === "not_applicable").length,
    expiringSoon: licenses.filter((l) => l.status === "expiring_soon").length,
    expired: licenses.filter((l) => l.status === "expired").length,
  };

  return <LicensingClient licenses={licenses} stats={stats} />;
}
