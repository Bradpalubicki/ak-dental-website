"use client";

import { useState, useMemo } from "react";
import {
  Stethoscope,
  Search,
  Plus,
  X,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  PenLine,
  Eye,
  Trash2,
  ChevronDown,
  AlertTriangle,
  Loader2,
  Filter,
  Bot,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface ClinicalNote {
  id: string;
  patient_id: string;
  patientName: string;
  provider_name: string;
  provider_id: string | null;
  note_type: string;
  chief_complaint: string | null;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  tooth_numbers: string[];
  procedure_codes: string[];
  medications: string[];
  vitals: Record<string, string>;
  ai_summary: string | null;
  ai_suggestions: Record<string, unknown> | null;
  is_signed: boolean;
  signed_at: string | null;
  signed_by: string | null;
  status: string;
  appointment_id: string | null;
  created_at: string;
  updated_at: string;
}

interface PatientOption {
  id: string;
  name: string;
}

interface NoteTemplate {
  id: string;
  name: string;
  note_type: string;
  template_data: Record<string, string>;
  is_default: boolean;
}

interface Props {
  initialNotes: ClinicalNote[];
  stats: {
    total: number;
    unsigned: number;
    today: number;
    aiAssisted: number;
  };
  patients: PatientOption[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const NOTE_TYPES = [
  { value: "progress", label: "Progress Note" },
  { value: "exam", label: "Exam" },
  { value: "consultation", label: "Consultation" },
  { value: "procedure", label: "Procedure" },
  { value: "follow_up", label: "Follow-Up" },
  { value: "emergency", label: "Emergency" },
  { value: "phone_call", label: "Phone Call" },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  signed: "bg-emerald-100 text-emerald-700",
  amended: "bg-amber-100 text-amber-700",
};

const TYPE_COLORS: Record<string, string> = {
  progress: "bg-cyan-50 text-cyan-700",
  exam: "bg-blue-50 text-blue-700",
  consultation: "bg-purple-50 text-purple-700",
  procedure: "bg-emerald-50 text-emerald-700",
  follow_up: "bg-amber-50 text-amber-700",
  emergency: "bg-red-50 text-red-700",
  phone_call: "bg-slate-50 text-slate-600",
};

const COMMON_CDT_CODES = [
  "D0120 - Periodic Oral Evaluation",
  "D0140 - Limited Oral Evaluation",
  "D0150 - Comprehensive Oral Evaluation",
  "D0210 - Complete Series X-Rays",
  "D0220 - Periapical X-Ray",
  "D0274 - Bitewing X-Rays",
  "D0330 - Panoramic X-Ray",
  "D1110 - Adult Prophylaxis",
  "D1120 - Child Prophylaxis",
  "D1206 - Fluoride Varnish",
  "D2140 - Amalgam - One Surface",
  "D2150 - Amalgam - Two Surfaces",
  "D2330 - Composite - One Surface",
  "D2331 - Composite - Two Surfaces",
  "D2740 - Crown - Porcelain",
  "D2750 - Crown - PFM",
  "D3310 - Root Canal - Anterior",
  "D3320 - Root Canal - Premolar",
  "D3330 - Root Canal - Molar",
  "D4341 - Periodontal Scaling",
  "D4910 - Periodontal Maintenance",
  "D7140 - Extraction - Erupted",
  "D7210 - Extraction - Surgical",
  "D7240 - Extraction - Impacted",
];

const emptyForm = {
  patient_id: "",
  provider_name: "Dr. Alex Khachaturian",
  note_type: "progress",
  chief_complaint: "",
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
  tooth_numbers: [] as string[],
  procedure_codes: [] as string[],
  medications: "",
  vitals_bp: "",
  vitals_pulse: "",
  vitals_temp: "",
  vitals_o2: "",
  template_id: "",
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

export function ClinicalNotesClient({ initialNotes, stats, patients }: Props) {
  const [notes, setNotes] = useState<ClinicalNote[]>(initialNotes);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [cdtInput, setCdtInput] = useState("");
  const [showCdtSuggestions, setShowCdtSuggestions] = useState(false);

  // Detail/view state
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [signing, setSigning] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filtered notes
  const filtered = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch =
        search === "" ||
        n.patientName.toLowerCase().includes(search.toLowerCase()) ||
        n.provider_name.toLowerCase().includes(search.toLowerCase()) ||
        (n.chief_complaint?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesType = typeFilter === "all" || n.note_type === typeFilter;
      const matchesStatus = statusFilter === "all" || n.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notes, search, typeFilter, statusFilter]);

  // Filtered patients for dropdown
  const filteredPatients = useMemo(() => {
    if (!patientSearch) return patients.slice(0, 20);
    return patients
      .filter((p) => p.name.toLowerCase().includes(patientSearch.toLowerCase()))
      .slice(0, 20);
  }, [patients, patientSearch]);

  // Filtered CDT codes
  const filteredCdtCodes = useMemo(() => {
    if (!cdtInput) return COMMON_CDT_CODES.slice(0, 10);
    return COMMON_CDT_CODES.filter((c) =>
      c.toLowerCase().includes(cdtInput.toLowerCase())
    ).slice(0, 10);
  }, [cdtInput]);

  /* ---- Load templates when note_type changes ---- */
  async function loadTemplates(noteType: string) {
    try {
      const res = await fetch(
        `/api/clinical-notes/templates?note_type=${noteType}`
      );
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch {
      // Silently fail
    }
  }

  /* ---- Apply template ---- */
  function applyTemplate(template: NoteTemplate) {
    const data = template.template_data;
    setForm((prev) => ({
      ...prev,
      template_id: template.id,
      subjective: data.subjective || prev.subjective,
      objective: data.objective || prev.objective,
      assessment: data.assessment || prev.assessment,
      plan: data.plan || prev.plan,
      chief_complaint: data.chief_complaint || prev.chief_complaint,
    }));
  }

  /* ---- Toggle tooth number ---- */
  function toggleTooth(num: string) {
    setForm((prev) => ({
      ...prev,
      tooth_numbers: prev.tooth_numbers.includes(num)
        ? prev.tooth_numbers.filter((t) => t !== num)
        : [...prev.tooth_numbers, num],
    }));
  }

  /* ---- Add procedure code ---- */
  function addProcedureCode(code: string) {
    const codeOnly = code.split(" - ")[0];
    if (!form.procedure_codes.includes(codeOnly)) {
      setForm((prev) => ({
        ...prev,
        procedure_codes: [...prev.procedure_codes, codeOnly],
      }));
    }
    setCdtInput("");
    setShowCdtSuggestions(false);
  }

  /* ---- Remove procedure code ---- */
  function removeProcedureCode(code: string) {
    setForm((prev) => ({
      ...prev,
      procedure_codes: prev.procedure_codes.filter((c) => c !== code),
    }));
  }

  /* ---- Create note ---- */
  async function handleCreate(saveStatus: string) {
    if (!form.patient_id || !form.provider_name) return;
    setSaving(true);
    try {
      const vitals: Record<string, string> = {};
      if (form.vitals_bp) vitals.bp = form.vitals_bp;
      if (form.vitals_pulse) vitals.pulse = form.vitals_pulse;
      if (form.vitals_temp) vitals.temp = form.vitals_temp;
      if (form.vitals_o2) vitals.o2 = form.vitals_o2;

      const res = await fetch("/api/clinical-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: form.patient_id,
          provider_name: form.provider_name,
          note_type: form.note_type,
          chief_complaint: form.chief_complaint || null,
          subjective: form.subjective || null,
          objective: form.objective || null,
          assessment: form.assessment || null,
          plan: form.plan || null,
          tooth_numbers: form.tooth_numbers,
          procedure_codes: form.procedure_codes,
          medications: form.medications
            ? form.medications.split(",").map((m) => m.trim()).filter(Boolean)
            : [],
          vitals: Object.keys(vitals).length > 0 ? vitals : {},
          status: saveStatus,
          template_id: form.template_id || undefined,
        }),
      });

      if (res.ok) {
        const newNote = await res.json();
        const mapped: ClinicalNote = {
          ...newNote,
          patientName:
            newNote.patient
              ? `${newNote.patient.first_name} ${newNote.patient.last_name}`
              : patients.find((p) => p.id === form.patient_id)?.name ||
                "Unknown Patient",
          tooth_numbers: newNote.tooth_numbers || [],
          procedure_codes: newNote.procedure_codes || [],
          medications: newNote.medications || [],
          vitals: newNote.vitals || {},
          ai_suggestions: newNote.ai_suggestions || null,
        };
        setNotes((prev) => [mapped, ...prev]);
        setForm(emptyForm);
        setShowForm(false);
        setPatientSearch("");
      }
    } finally {
      setSaving(false);
    }
  }

  /* ---- Update note ---- */
  async function handleUpdate(noteId: string, updates: Record<string, unknown>) {
    try {
      const res = await fetch(`/api/clinical-notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  ...updated,
                  patientName:
                    updated.patient
                      ? `${updated.patient.first_name} ${updated.patient.last_name}`
                      : n.patientName,
                }
              : n
          )
        );
        if (selectedNote?.id === noteId) {
          setSelectedNote((prev) =>
            prev
              ? {
                  ...prev,
                  ...updated,
                  patientName:
                    updated.patient
                      ? `${updated.patient.first_name} ${updated.patient.last_name}`
                      : prev.patientName,
                }
              : null
          );
        }
      }
    } catch {
      // Silently fail
    }
  }

  /* ---- Sign note ---- */
  async function handleSign(noteId: string) {
    setSigning(true);
    try {
      const res = await fetch(`/api/clinical-notes/${noteId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signer_name: "Dr. Alex Khachaturian" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  ...updated,
                  patientName:
                    updated.patient
                      ? `${updated.patient.first_name} ${updated.patient.last_name}`
                      : n.patientName,
                }
              : n
          )
        );
        if (selectedNote?.id === noteId) {
          setSelectedNote((prev) =>
            prev
              ? {
                  ...prev,
                  ...updated,
                  patientName:
                    updated.patient
                      ? `${updated.patient.first_name} ${updated.patient.last_name}`
                      : prev.patientName,
                }
              : null
          );
        }
      }
    } finally {
      setSigning(false);
    }
  }

  /* ---- AI Assist ---- */
  async function handleAiAssist(noteId: string) {
    setAiLoading(true);
    try {
      const res = await fetch(`/api/clinical-notes/${noteId}/ai-assist`, {
        method: "POST",
      });
      if (res.ok) {
        const result = await res.json();
        const updated = result.note;
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  ...updated,
                  patientName:
                    updated.patient
                      ? `${updated.patient.first_name} ${updated.patient.last_name}`
                      : n.patientName,
                  ai_suggestions: result.ai_suggestions,
                }
              : n
          )
        );
        if (selectedNote?.id === noteId) {
          setSelectedNote((prev) =>
            prev
              ? {
                  ...prev,
                  ...updated,
                  patientName:
                    updated.patient
                      ? `${updated.patient.first_name} ${updated.patient.last_name}`
                      : prev.patientName,
                  ai_suggestions: result.ai_suggestions,
                }
              : null
          );
        }
      }
    } finally {
      setAiLoading(false);
    }
  }

  /* ---- Delete note ---- */
  async function handleDelete(noteId: string) {
    setDeleting(noteId);
    try {
      const res = await fetch(`/api/clinical-notes/${noteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
          setShowDetail(false);
        }
      }
    } finally {
      setDeleting(null);
    }
  }

  /* ---- Open new note form ---- */
  function openNewNote() {
    setForm(emptyForm);
    setShowForm(true);
    setPatientSearch("");
    loadTemplates("progress");
  }

  /* ---- View note detail ---- */
  function viewNote(note: ClinicalNote) {
    setSelectedNote(note);
    setShowDetail(true);
  }

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Clinical Notes
          </h1>
          <p className="text-sm text-slate-500">
            SOAP documentation, AI-assisted charting, and provider signing
          </p>
        </div>
        <button
          onClick={openNewNote}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> New Note
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Notes"
          value={stats.total.toString()}
          icon={FileText}
          iconColor="text-cyan-600 bg-cyan-50"
          accentColor="#0891b2"
        />
        <StatCard
          title="Unsigned"
          value={stats.unsigned.toString()}
          icon={PenLine}
          iconColor="text-amber-600 bg-amber-50"
          accentColor="#d97706"
          pulse={stats.unsigned > 0}
        />
        <StatCard
          title="Today's Notes"
          value={stats.today.toString()}
          icon={Clock}
          iconColor="text-blue-600 bg-blue-50"
          accentColor="#2563eb"
        />
        <StatCard
          title="AI-Assisted"
          value={stats.aiAssisted.toString()}
          icon={Sparkles}
          iconColor="text-purple-600 bg-purple-50"
          accentColor="#7c3aed"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient, provider, or complaint..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
            showFilters
              ? "border-cyan-300 bg-cyan-50 text-cyan-700"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          <Filter className="h-3.5 w-3.5" /> Filters
        </button>
      </div>

      {/* Filter Row */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Note Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              {NOTE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="signed">Signed</option>
              <option value="amended">Amended</option>
            </select>
          </div>
          <button
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("all");
              setSearch("");
            }}
            className="self-end rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-xs text-slate-500">
        {filtered.length} note{filtered.length !== 1 ? "s" : ""}
        {(typeFilter !== "all" || statusFilter !== "all") &&
          " (filtered)"}
      </div>

      {/* Notes Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Patient
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Provider
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Chief Complaint
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((note) => (
                  <tr
                    key={note.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-xs text-slate-600">
                      {new Date(note.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <br />
                      <span className="text-slate-400">
                        {new Date(note.created_at).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-slate-900">
                        {note.patientName}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600">
                      {note.provider_name}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize",
                          TYPE_COLORS[note.note_type] || "bg-slate-100 text-slate-600"
                        )}
                      >
                        {note.note_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600 max-w-[200px] truncate">
                      {note.chief_complaint || (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize",
                          STATUS_COLORS[note.status] || "bg-slate-100 text-slate-600"
                        )}
                      >
                        {note.status.replace("_", " ")}
                      </span>
                      {note.ai_summary && (
                        <Sparkles className="inline-block ml-1 h-3 w-3 text-purple-400" />
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => viewNote(note)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                          title="View Note"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {note.status === "draft" && (
                          <button
                            onClick={() => handleDelete(note.id)}
                            disabled={deleting === note.id}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
                            title="Delete Draft"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-slate-400">
            <Stethoscope className="h-8 w-8 mb-2 text-slate-300" />
            {initialNotes.length === 0
              ? "No clinical notes yet. Create your first note to get started."
              : "No notes match your search criteria"}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/*  NEW NOTE DIALOG                                              */}
      {/* ============================================================ */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  New Clinical Note
                </h2>
                <p className="text-xs text-slate-500">
                  SOAP format documentation
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Patient + Type + Template */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Patient Selector */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Patient *
                  </label>
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value);
                      setShowPatientDropdown(true);
                    }}
                    onFocus={() => setShowPatientDropdown(true)}
                    placeholder="Search patients..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                  {form.patient_id && (
                    <div className="mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600">
                        {patients.find((p) => p.id === form.patient_id)?.name}
                      </span>
                      <button
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            patient_id: "",
                          }));
                          setPatientSearch("");
                        }}
                        className="ml-1 text-slate-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {showPatientDropdown && filteredPatients.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-40 overflow-y-auto">
                      {filteredPatients.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              patient_id: p.id,
                            }));
                            setPatientSearch(p.name);
                            setShowPatientDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Note Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Note Type
                  </label>
                  <select
                    value={form.note_type}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        note_type: e.target.value,
                        template_id: "",
                      }));
                      loadTemplates(e.target.value);
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    {NOTE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Template Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Template
                  </label>
                  <select
                    value={form.template_id}
                    onChange={(e) => {
                      const tmpl = templates.find(
                        (t) => t.id === e.target.value
                      );
                      if (tmpl) applyTemplate(tmpl);
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">No template</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                        {t.is_default ? " (default)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Provider Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Provider Name *
                </label>
                <input
                  value={form.provider_name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      provider_name: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Chief Complaint */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Chief Complaint
                </label>
                <input
                  value={form.chief_complaint}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      chief_complaint: e.target.value,
                    }))
                  }
                  placeholder="Patient's primary concern or reason for visit"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* SOAP Sections */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    S - Subjective
                  </label>
                  <textarea
                    value={form.subjective}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        subjective: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Patient's symptoms, complaints, history..."
                    className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50/30 p-4">
                  <label className="block text-sm font-semibold text-green-800 mb-2">
                    O - Objective
                  </label>
                  <textarea
                    value={form.objective}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        objective: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Clinical findings, exam results, measurements..."
                    className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    A - Assessment
                  </label>
                  <textarea
                    value={form.assessment}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        assessment: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Diagnosis, clinical impression..."
                    className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="rounded-lg border border-purple-200 bg-purple-50/30 p-4">
                  <label className="block text-sm font-semibold text-purple-800 mb-2">
                    P - Plan
                  </label>
                  <textarea
                    value={form.plan}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, plan: e.target.value }))
                    }
                    rows={4}
                    placeholder="Treatment plan, follow-up, prescriptions..."
                    className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Tooth Chart */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teeth Involved
                </label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500 mb-2 text-center">
                    Upper (Right to Left)
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {Array.from({ length: 16 }, (_, i) => (i + 1).toString()).map(
                      (num) => (
                        <button
                          key={`upper-${num}`}
                          onClick={() => toggleTooth(num)}
                          className={cn(
                            "h-8 w-8 rounded text-[11px] font-medium transition-all border",
                            form.tooth_numbers.includes(num)
                              ? "bg-cyan-600 text-white border-cyan-700 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50"
                          )}
                        >
                          {num}
                        </button>
                      )
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 text-center">
                    Lower (Right to Left)
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {Array.from(
                      { length: 16 },
                      (_, i) => (32 - i).toString()
                    ).map((num) => (
                      <button
                        key={`lower-${num}`}
                        onClick={() => toggleTooth(num)}
                        className={cn(
                          "h-8 w-8 rounded text-[11px] font-medium transition-all border",
                          form.tooth_numbers.includes(num)
                            ? "bg-cyan-600 text-white border-cyan-700 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {form.tooth_numbers.length > 0 && (
                    <p className="mt-2 text-xs text-cyan-600 text-center">
                      Selected: {form.tooth_numbers.sort((a, b) => Number(a) - Number(b)).join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* Procedure Codes */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Procedure Codes (CDT)
                </label>
                <input
                  type="text"
                  value={cdtInput}
                  onChange={(e) => {
                    setCdtInput(e.target.value);
                    setShowCdtSuggestions(true);
                  }}
                  onFocus={() => setShowCdtSuggestions(true)}
                  placeholder="Type to search CDT codes..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
                {showCdtSuggestions && filteredCdtCodes.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-40 overflow-y-auto">
                    {filteredCdtCodes.map((code) => (
                      <button
                        key={code}
                        onClick={() => addProcedureCode(code)}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                )}
                {form.procedure_codes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.procedure_codes.map((code) => (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
                      >
                        {code}
                        <button
                          onClick={() => removeProcedureCode(code)}
                          className="hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Medications
                </label>
                <input
                  value={form.medications}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      medications: e.target.value,
                    }))
                  }
                  placeholder="Comma-separated (e.g., Amoxicillin 500mg, Ibuprofen 600mg)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Vitals */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vitals (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">
                      Blood Pressure
                    </label>
                    <input
                      value={form.vitals_bp}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          vitals_bp: e.target.value,
                        }))
                      }
                      placeholder="120/80"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">
                      Pulse (bpm)
                    </label>
                    <input
                      value={form.vitals_pulse}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          vitals_pulse: e.target.value,
                        }))
                      }
                      placeholder="72"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">
                      Temp (F)
                    </label>
                    <input
                      value={form.vitals_temp}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          vitals_temp: e.target.value,
                        }))
                      }
                      placeholder="98.6"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">
                      O2 Sat (%)
                    </label>
                    <input
                      value={form.vitals_o2}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          vitals_o2: e.target.value,
                        }))
                      }
                      placeholder="98"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreate("draft")}
                disabled={saving || !form.patient_id}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={() => handleCreate("completed")}
                disabled={saving || !form.patient_id}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Complete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  NOTE DETAIL DIALOG                                           */}
      {/* ============================================================ */}
      {showDetail && selectedNote && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8">
          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Clinical Note
                  </h2>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize",
                      STATUS_COLORS[selectedNote.status] ||
                        "bg-slate-100 text-slate-600"
                    )}
                  >
                    {selectedNote.status.replace("_", " ")}
                  </span>
                  {selectedNote.is_signed && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                      <ShieldCheck className="h-3 w-3" /> Signed
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {selectedNote.patientName} |{" "}
                  {selectedNote.provider_name} |{" "}
                  {new Date(selectedNote.created_at).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetail(false);
                  setSelectedNote(null);
                }}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 max-h-[75vh] overflow-y-auto">
              {/* Main Content - SOAP Note */}
              <div className="lg:col-span-2 px-6 py-4 space-y-4 border-r border-slate-100">
                {/* Note Info Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize",
                      TYPE_COLORS[selectedNote.note_type] ||
                        "bg-slate-100 text-slate-600"
                    )}
                  >
                    {selectedNote.note_type.replace("_", " ")}
                  </span>
                  {selectedNote.tooth_numbers.length > 0 && (
                    <span className="text-xs text-slate-500">
                      Teeth: {selectedNote.tooth_numbers.join(", ")}
                    </span>
                  )}
                  {selectedNote.procedure_codes.length > 0 && (
                    <span className="text-xs text-slate-500">
                      Codes: {selectedNote.procedure_codes.join(", ")}
                    </span>
                  )}
                </div>

                {/* Chief Complaint */}
                {selectedNote.chief_complaint && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Chief Complaint
                    </p>
                    <p className="text-sm text-slate-900">
                      {selectedNote.chief_complaint}
                    </p>
                  </div>
                )}

                {/* SOAP Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4">
                    <p className="text-xs font-semibold text-blue-800 mb-2">
                      S - Subjective
                    </p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedNote.subjective || (
                        <span className="text-slate-400 italic">
                          Not documented
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50/30 p-4">
                    <p className="text-xs font-semibold text-green-800 mb-2">
                      O - Objective
                    </p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedNote.objective || (
                        <span className="text-slate-400 italic">
                          Not documented
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
                    <p className="text-xs font-semibold text-amber-800 mb-2">
                      A - Assessment
                    </p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedNote.assessment || (
                        <span className="text-slate-400 italic">
                          Not documented
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-purple-200 bg-purple-50/30 p-4">
                    <p className="text-xs font-semibold text-purple-800 mb-2">
                      P - Plan
                    </p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedNote.plan || (
                        <span className="text-slate-400 italic">
                          Not documented
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                {(selectedNote.medications.length > 0 ||
                  Object.keys(selectedNote.vitals).length > 0) && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {selectedNote.medications.length > 0 && (
                      <div className="rounded-lg border border-slate-200 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                          Medications
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedNote.medications.map((med) => (
                            <span
                              key={med}
                              className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700"
                            >
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {Object.keys(selectedNote.vitals).length > 0 && (
                      <div className="rounded-lg border border-slate-200 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                          Vitals
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedNote.vitals.bp && (
                            <div>
                              <span className="text-[10px] text-slate-500">
                                BP:{" "}
                              </span>
                              <span className="text-xs font-medium text-slate-700">
                                {selectedNote.vitals.bp}
                              </span>
                            </div>
                          )}
                          {selectedNote.vitals.pulse && (
                            <div>
                              <span className="text-[10px] text-slate-500">
                                Pulse:{" "}
                              </span>
                              <span className="text-xs font-medium text-slate-700">
                                {selectedNote.vitals.pulse} bpm
                              </span>
                            </div>
                          )}
                          {selectedNote.vitals.temp && (
                            <div>
                              <span className="text-[10px] text-slate-500">
                                Temp:{" "}
                              </span>
                              <span className="text-xs font-medium text-slate-700">
                                {selectedNote.vitals.temp}F
                              </span>
                            </div>
                          )}
                          {selectedNote.vitals.o2 && (
                            <div>
                              <span className="text-[10px] text-slate-500">
                                O2:{" "}
                              </span>
                              <span className="text-xs font-medium text-slate-700">
                                {selectedNote.vitals.o2}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Signed Info */}
                {selectedNote.is_signed && selectedNote.signed_at && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <p className="text-xs font-medium text-emerald-800">
                        Electronically signed by{" "}
                        {selectedNote.signed_by || "Provider"} on{" "}
                        {new Date(selectedNote.signed_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - AI & Actions */}
              <div className="px-4 py-4 space-y-4">
                {/* Actions */}
                <div className="space-y-2">
                  {!selectedNote.is_signed && (
                    <>
                      <button
                        onClick={() => handleAiAssist(selectedNote.id)}
                        disabled={aiLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
                      >
                        {aiLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        {aiLoading ? "Analyzing..." : "AI Assist"}
                      </button>

                      {selectedNote.status !== "signed" && (
                        <button
                          onClick={() => handleSign(selectedNote.id)}
                          disabled={signing}
                          className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                          {signing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <PenLine className="h-4 w-4" />
                          )}
                          {signing ? "Signing..." : "Sign Note"}
                        </button>
                      )}

                      {selectedNote.status !== "completed" &&
                        selectedNote.status !== "signed" && (
                          <button
                            onClick={() =>
                              handleUpdate(selectedNote.id, {
                                status: "completed",
                              })
                            }
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Mark Complete
                          </button>
                        )}
                    </>
                  )}

                  {selectedNote.is_signed && (
                    <button
                      onClick={() => {
                        // Amendment: Create a copy with amended status
                        setForm({
                          ...emptyForm,
                          patient_id: selectedNote.patient_id,
                          provider_name: selectedNote.provider_name,
                          note_type: selectedNote.note_type,
                          chief_complaint:
                            selectedNote.chief_complaint || "",
                          subjective: selectedNote.subjective || "",
                          objective: selectedNote.objective || "",
                          assessment: selectedNote.assessment || "",
                          plan: selectedNote.plan || "",
                          tooth_numbers: selectedNote.tooth_numbers,
                          procedure_codes: selectedNote.procedure_codes,
                          medications:
                            selectedNote.medications.join(", "),
                          vitals_bp: selectedNote.vitals.bp || "",
                          vitals_pulse: selectedNote.vitals.pulse || "",
                          vitals_temp: selectedNote.vitals.temp || "",
                          vitals_o2: selectedNote.vitals.o2 || "",
                          template_id: "",
                        });
                        setPatientSearch(selectedNote.patientName);
                        setShowForm(true);
                        setShowDetail(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Create Amendment
                    </button>
                  )}
                </div>

                {/* AI Summary */}
                {selectedNote.ai_summary && (
                  <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <p className="text-xs font-semibold text-purple-800">
                        AI Clinical Summary
                      </p>
                    </div>
                    <p className="text-xs text-purple-900 leading-relaxed">
                      {selectedNote.ai_summary}
                    </p>
                  </div>
                )}

                {/* AI Suggestions */}
                {selectedNote.ai_suggestions &&
                  typeof selectedNote.ai_suggestions === "object" && (
                    <div className="space-y-3">
                      {/* Coding Suggestions */}
                      {Array.isArray(
                        (
                          selectedNote.ai_suggestions as {
                            coding_suggestions?: unknown[];
                          }
                        ).coding_suggestions
                      ) &&
                        (
                          selectedNote.ai_suggestions as {
                            coding_suggestions: Array<{
                              code: string;
                              description: string;
                              rationale: string;
                            }>;
                          }
                        ).coding_suggestions.length > 0 && (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mb-2">
                              Coding Suggestions
                            </p>
                            <div className="space-y-2">
                              {(
                                selectedNote.ai_suggestions as {
                                  coding_suggestions: Array<{
                                    code: string;
                                    description: string;
                                    rationale: string;
                                  }>;
                                }
                              ).coding_suggestions.map(
                                (
                                  s: {
                                    code: string;
                                    description: string;
                                    rationale: string;
                                  },
                                  i: number
                                ) => (
                                  <div
                                    key={i}
                                    className="rounded border border-emerald-200 bg-white p-2"
                                  >
                                    <p className="text-xs font-semibold text-emerald-700">
                                      {s.code}
                                    </p>
                                    <p className="text-[10px] text-slate-600">
                                      {s.description}
                                    </p>
                                    {s.rationale && (
                                      <p className="text-[10px] text-slate-400 mt-0.5 italic">
                                        {s.rationale}
                                      </p>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Treatment Recommendations */}
                      {Array.isArray(
                        (
                          selectedNote.ai_suggestions as {
                            treatment_recommendations?: unknown[];
                          }
                        ).treatment_recommendations
                      ) &&
                        (
                          selectedNote.ai_suggestions as {
                            treatment_recommendations: string[];
                          }
                        ).treatment_recommendations.length > 0 && (
                          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 mb-2">
                              Treatment Recommendations
                            </p>
                            <ul className="space-y-1">
                              {(
                                selectedNote.ai_suggestions as {
                                  treatment_recommendations: string[];
                                }
                              ).treatment_recommendations.map(
                                (rec: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-[11px] text-slate-700 flex items-start gap-1.5"
                                  >
                                    <ChevronDown className="h-3 w-3 text-blue-400 shrink-0 mt-0.5 rotate-[-90deg]" />
                                    {rec}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {/* Risk Flags */}
                      {Array.isArray(
                        (
                          selectedNote.ai_suggestions as {
                            risk_flags?: unknown[];
                          }
                        ).risk_flags
                      ) &&
                        (
                          selectedNote.ai_suggestions as {
                            risk_flags: string[];
                          }
                        ).risk_flags.length > 0 && (
                          <div className="rounded-lg border border-red-200 bg-red-50/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-700 mb-2">
                              Risk Flags
                            </p>
                            <ul className="space-y-1">
                              {(
                                selectedNote.ai_suggestions as {
                                  risk_flags: string[];
                                }
                              ).risk_flags.map(
                                (flag: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-[11px] text-red-700 flex items-start gap-1.5"
                                  >
                                    <AlertTriangle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
                                    {flag}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {/* Documentation Tips */}
                      {Array.isArray(
                        (
                          selectedNote.ai_suggestions as {
                            documentation_tips?: unknown[];
                          }
                        ).documentation_tips
                      ) &&
                        (
                          selectedNote.ai_suggestions as {
                            documentation_tips: string[];
                          }
                        ).documentation_tips.length > 0 && (
                          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                              Documentation Tips
                            </p>
                            <ul className="space-y-1">
                              {(
                                selectedNote.ai_suggestions as {
                                  documentation_tips: string[];
                                }
                              ).documentation_tips.map(
                                (tip: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-[11px] text-slate-600"
                                  >
                                    {tip}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}

                {/* No AI yet */}
                {!selectedNote.ai_summary && !selectedNote.ai_suggestions && (
                  <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center">
                    <Bot className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">
                      Click &quot;AI Assist&quot; to get coding suggestions,
                      clinical summary, and documentation tips
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
