export const dynamic = "force-dynamic";

import {
  Stethoscope,
  CheckSquare,
  ShieldCheck,
  Users,
  FileText,
} from "lucide-react";
import { createServiceSupabase } from "@/lib/supabase/server";
import { SectionHub } from "@/components/dashboard/section-hub";
import { ClinicalNotesClient } from "./clinical-notes-client";

export default async function ClinicalNotesPage() {
  const supabase = createServiceSupabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [notesRes, unsignedRes, todayRes, aiAssistedRes, patientsRes, approvalsRes] =
    await Promise.all([
      supabase
        .from("oe_clinical_notes")
        .select("*, patient:oe_patients(id, first_name, last_name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("oe_clinical_notes")
        .select("id", { count: "exact", head: true })
        .eq("is_signed", false)
        .neq("status", "draft"),
      supabase
        .from("oe_clinical_notes")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayISO),
      supabase
        .from("oe_clinical_notes")
        .select("id", { count: "exact", head: true })
        .not("ai_summary", "is", null),
      supabase
        .from("oe_patients")
        .select("id, first_name, last_name")
        .is("deleted_at", null)
        .eq("status", "active")
        .order("last_name")
        .limit(500),
      supabase
        .from("oe_ai_actions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_approval"),
    ]);

  const stats = {
    total: notesRes.count || 0,
    unsigned: unsignedRes.count || 0,
    today: todayRes.count || 0,
    aiAssisted: aiAssistedRes.count || 0,
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const notes = (notesRes.data || []).map((n: any) => ({
    id: n.id as string,
    patient_id: n.patient_id as string,
    patientName: n.patient ? `${n.patient.first_name} ${n.patient.last_name}` : "Unknown Patient",
    provider_name: n.provider_name as string,
    provider_id: n.provider_id as string | null,
    note_type: n.note_type as string,
    chief_complaint: n.chief_complaint as string | null,
    subjective: n.subjective as string | null,
    objective: n.objective as string | null,
    assessment: n.assessment as string | null,
    plan: n.plan as string | null,
    tooth_numbers: (n.tooth_numbers || []) as string[],
    procedure_codes: (n.procedure_codes || []) as string[],
    medications: (n.medications || []) as string[],
    vitals: (n.vitals || {}) as Record<string, string>,
    ai_summary: n.ai_summary as string | null,
    ai_suggestions: n.ai_suggestions as Record<string, unknown> | null,
    is_signed: n.is_signed as boolean,
    signed_at: n.signed_at as string | null,
    signed_by: n.signed_by as string | null,
    status: n.status as string,
    appointment_id: n.appointment_id as string | null,
    created_at: n.created_at as string,
    updated_at: n.updated_at as string,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const patients = (patientsRes.data || []).map(
    (p: { id: string; first_name: string; last_name: string }) => ({
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
    })
  );

  return (
    <div>
      <SectionHub
        title="Clinical"
        description="Notes, approvals, compliance, and provider management"
        icon={Stethoscope}
        iconBg="bg-cyan-50"
        iconColor="text-cyan-600"
        links={[
          {
            label: "Clinical Notes",
            href: "/dashboard/clinical-notes",
            icon: FileText,
            description: `${stats.unsigned} unsigned · ${stats.today} today`,
            badge: stats.unsigned,
            badgeColor: "bg-cyan-100 text-cyan-700",
          },
          {
            label: "Approvals",
            href: "/dashboard/approvals",
            icon: CheckSquare,
            description: "AI-generated messages pending review",
            badge: approvalsRes.count ?? 0,
            badgeColor: "bg-amber-100 text-amber-700",
          },
          {
            label: "Compliance",
            href: "/dashboard/compliance",
            icon: ShieldCheck,
            description: "HIPAA audit logs and compliance records",
          },
          {
            label: "Providers",
            href: "/dashboard/providers",
            icon: Users,
            description: "Provider profiles, schedules, and time-off",
          },
        ]}
      />
      <ClinicalNotesClient initialNotes={notes} stats={stats} patients={patients} />
    </div>
  );
}
