export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceSupabase } from "@/lib/supabase/server";
import { logPhiAccess } from "@/lib/audit";
import { NoteActions } from "./note-actions";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Shield,
  Stethoscope,
  Hash,
  Pill,
  Activity,
  CheckCircle2,
  Clock,
  PenLine,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft:           { label: "Draft",            color: "bg-slate-100 text-slate-600",   icon: FileText },
  in_progress:     { label: "In Progress",      color: "bg-blue-100 text-blue-700",     icon: Clock },
  completed:       { label: "Completed",        color: "bg-green-100 text-green-700",   icon: CheckCircle2 },
  signed:          { label: "Signed",           color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  amended:         { label: "Amended",          color: "bg-amber-100 text-amber-700",   icon: AlertTriangle },
  locked:          { label: "Locked",           color: "bg-slate-200 text-slate-700",   icon: Lock },
  pending_cosign:  { label: "Pending Co-Sign",  color: "bg-orange-100 text-orange-700", icon: PenLine },
};

const NOTE_TYPE_LABELS: Record<string, string> = {
  progress:     "Progress Note",
  exam:         "Exam",
  consultation: "Consultation",
  procedure:    "Procedure",
  follow_up:    "Follow-Up",
  emergency:    "Emergency",
  phone_call:   "Phone Call",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function SoapSection({
  label,
  content,
  icon: Icon,
}: {
  label: string;
  content: string | null;
  icon: typeof FileText;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
        <Icon className="h-4 w-4 text-cyan-600" />
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
      </div>
      <div className="px-4 py-4">
        {content ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{content}</p>
        ) : (
          <p className="text-sm italic text-slate-400">Not documented</p>
        )}
      </div>
    </div>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default async function ClinicalNoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data: note, error } = await supabase
    .from("oe_clinical_notes")
    .select(
      "*, patient:oe_patients(id, first_name, last_name, email, phone, date_of_birth, insurance_provider)"
    )
    .eq("id", id)
    .single();

  if (error || !note) {
    notFound();
  }

  await logPhiAccess("clinical_notes.view_detail", "clinical_note", id, {
    patientId: note.patient_id,
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const patient = note.patient as any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const patientName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : "Unknown Patient";

  const status = STATUS_CONFIG[note.status as string] ?? STATUS_CONFIG.draft;
  const StatusIcon = status.icon;
  const noteTypeLabel = NOTE_TYPE_LABELS[note.note_type as string] ?? note.note_type;

  const toothNumbers: string[] = note.tooth_numbers || [];
  const procedureCodes: string[] = note.procedure_codes || [];
  const medications: string[] = note.medications || [];
  const vitals: Record<string, string> = note.vitals || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back link */}
      <Link
        href="/dashboard/clinical-notes"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clinical Notes
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {noteTypeLabel}
            </h1>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                status.color
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {patientName} · {formatDateTime(note.created_at as string)}
          </p>
        </div>

        {/* Provider + date metadata */}
        <div className="flex shrink-0 flex-col items-end gap-1 text-right text-sm text-slate-500">
          <span className="font-medium text-slate-700">{note.provider_name as string}</span>
          {note.is_signed && note.signed_at && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-3 w-3" />
              Signed {formatDate(note.signed_at as string)}
            </span>
          )}
        </div>
      </div>

      {/* Patient info card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50">
            <User className="h-4 w-4 text-cyan-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-700">Patient Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Name</p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">{patientName}</p>
          </div>
          {patient?.date_of_birth && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Date of Birth</p>
              <p className="mt-0.5 text-sm text-slate-700">{formatDate(patient.date_of_birth)}</p>
            </div>
          )}
          {patient?.phone && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phone</p>
              <p className="mt-0.5 text-sm text-slate-700">{patient.phone}</p>
            </div>
          )}
          {patient?.insurance_provider && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Insurance</p>
              <p className="mt-0.5 text-sm text-slate-700">{patient.insurance_provider}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chief Complaint */}
      {note.chief_complaint && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
            Chief Complaint
          </p>
          <p className="text-sm text-amber-900">{note.chief_complaint as string}</p>
        </div>
      )}

      {/* SOAP sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SoapSection label="Subjective" content={note.subjective as string | null} icon={FileText} />
        <SoapSection label="Objective" content={note.objective as string | null} icon={Activity} />
        <SoapSection label="Assessment" content={note.assessment as string | null} icon={Stethoscope} />
        <SoapSection label="Plan" content={note.plan as string | null} icon={Calendar} />
      </div>

      {/* Metadata row */}
      {(toothNumbers.length > 0 || procedureCodes.length > 0 || medications.length > 0 || Object.keys(vitals).length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toothNumbers.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Hash className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Teeth</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {toothNumbers.map((t) => <MetaChip key={t} label={`#${t}`} />)}
              </div>
            </div>
          )}

          {procedureCodes.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Shield className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">CDT Codes</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {procedureCodes.map((c) => (
                  <span key={c} className="inline-flex items-center rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-mono font-medium text-cyan-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {medications.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Pill className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Medications</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {medications.map((m) => <MetaChip key={m} label={m} />)}
              </div>
            </div>
          )}

          {Object.keys(vitals).length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vitals</p>
              </div>
              <div className="space-y-1">
                {Object.entries(vitals).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-xs">
                    <span className="capitalize text-slate-500">{k.replace(/_/g, " ")}</span>
                    <span className="font-medium text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions (Sign + AI Assist) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
            <Stethoscope className="h-4 w-4 text-violet-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-700">Note Actions</h2>
        </div>

        <NoteActions
          noteId={id}
          isSigned={note.is_signed as boolean}
          providerName={note.provider_name as string}
          initialAiSummary={(note.ai_summary as string | null) ?? null}
          initialAiSuggestions={
            (note.ai_suggestions as Record<string, unknown> | null) as Parameters<
              typeof NoteActions
            >[0]["initialAiSuggestions"]
          }
        />

        {note.is_signed && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-800">
              Signed by <span className="font-semibold">{note.signed_by as string}</span>
              {note.signed_at && (
                <> on {formatDateTime(note.signed_at as string)}</>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
