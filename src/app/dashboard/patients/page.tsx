export const dynamic = "force-dynamic";

import {
  Users,
  UserPlus,
  FileSignature,
  ClipboardList,
  Clock,
  FileText,
  Activity,
} from "lucide-react";
import { createServiceSupabase } from "@/lib/supabase/server";
import { SectionHub } from "@/components/dashboard/section-hub";
import { PatientsClient } from "./patients-client";
import type { Patient } from "@/types/database";

export default async function PatientsPage() {
  const supabase = createServiceSupabase();

  const [patientsRes, statsRes, leadsRes, consentRes, waitlistRes, proposalsRes, treatmentsRes] =
    await Promise.all([
      supabase.from("oe_patients").select("*").is("deleted_at", null).order("last_name").limit(200),
      supabase.from("oe_patients").select("status", { count: "exact" }).is("deleted_at", null),
      supabase.from("oe_leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("oe_consent_forms").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("oe_waitlist").select("id", { count: "exact", head: true }),
      supabase.from("oe_proposals").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("oe_treatments").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

  const patients = (patientsRes.data || []) as Patient[];
  const allStatuses = (statsRes.data || []) as { status: string }[];
  const stats = {
    active: allStatuses.filter((p) => p.status === "active").length,
    prospect: allStatuses.filter((p) => p.status === "prospect").length,
    inactive: allStatuses.filter((p) => p.status === "inactive").length,
    total: allStatuses.length,
  };

  return (
    <div>
      <SectionHub
        title="Patients"
        description="Patient records, leads, consent, treatments, and proposals"
        icon={Users}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        links={[
          {
            label: "New Leads",
            href: "/dashboard/leads",
            icon: UserPlus,
            description: "Inbound inquiries awaiting follow-up",
            badge: leadsRes.count ?? 0,
            badgeColor: "bg-amber-100 text-amber-700",
          },
          {
            label: "Consent Forms",
            href: "/dashboard/consent-forms",
            icon: FileSignature,
            description: "Pending patient consent & waivers",
            badge: consentRes.count ?? 0,
            badgeColor: "bg-cyan-100 text-cyan-700",
          },
          {
            label: "Treatments",
            href: "/dashboard/treatments",
            icon: ClipboardList,
            description: "Unscheduled & in-progress treatment plans",
            badge: treatmentsRes.count ?? 0,
            badgeColor: "bg-violet-100 text-violet-700",
          },
          {
            label: "Waitlist",
            href: "/dashboard/waitlist",
            icon: Clock,
            description: "Patients waiting for earlier openings",
            badge: waitlistRes.count ?? 0,
            badgeColor: "bg-orange-100 text-orange-700",
          },
          {
            label: "Proposals",
            href: "/dashboard/proposals",
            icon: FileText,
            description: "Treatment proposals sent to patients",
            badge: proposalsRes.count ?? 0,
            badgeColor: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "All Patients",
            href: "/dashboard/patients",
            icon: Activity,
            description: `${stats.active} active · ${stats.total} total`,
          },
        ]}
      />
      <PatientsClient initialPatients={patients} stats={stats} />
    </div>
  );
}
