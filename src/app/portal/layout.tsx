import { redirect } from "next/navigation";
import { getPortalPatient } from "@/lib/portal-auth";
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

  return (
    <PortalShell
      patientName={`${patient.first_name} ${patient.last_name}`}
      patientEmail={patient.email || ""}
    >
      {children}
    </PortalShell>
  );
}
