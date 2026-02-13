export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getPortalPatient } from "@/lib/portal-auth";
import { ProfileClient } from "./profile-client";

export default async function PortalProfilePage() {
  const patient = await getPortalPatient();
  if (!patient) redirect("/portal/login");

  return (
    <ProfileClient
      patient={{
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email || "",
        phone: patient.phone || "",
        date_of_birth: patient.date_of_birth || "",
        address: patient.address || "",
        city: patient.city || "",
        state: patient.state || "",
        zip: patient.zip || "",
        insurance_provider: patient.insurance_provider || "",
        insurance_member_id: patient.insurance_member_id || "",
        insurance_group_number: patient.insurance_group_number || "",
      }}
    />
  );
}
