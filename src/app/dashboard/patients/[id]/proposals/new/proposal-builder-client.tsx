"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  GripVertical,
  DollarSign,
  Loader2,
  CheckCircle2,
  Send,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import Link from "next/link";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
}

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
}

const ItemSchema = z.object({
  cdt_code: z.string().max(20).optional().nullable(),
  procedure_name: z.string().min(1, "Procedure name is required").max(200),
  procedure_description: z.string().max(500).optional().nullable(),
  tooth_number: z.string().max(20).optional().nullable(),
  fee: z.number().min(0),
  insurance_pays: z.number().min(0),
  patient_pays: z.number().min(0),
  tier: z.enum(["good", "better", "best"]).optional().nullable(),
});

const BuilderSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  provider_id: z.string().uuid().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  financing_enabled: z.boolean(),
  financing_provider: z.string().optional().nullable(),
  financing_term_months: z.number().int().min(1).max(120).optional().nullable(),
  tier_mode: z.boolean(),
  items: z.array(ItemSchema),
});

type BuilderForm = z.infer<typeof BuilderSchema>;
type ItemForm = z.infer<typeof ItemSchema>;

const DEFAULT_ITEM: ItemForm = {
  cdt_code: "",
  procedure_name: "",
  procedure_description: "",
  tooth_number: "",
  fee: 0,
  insurance_pays: 0,
  patient_pays: 0,
  tier: null,
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function ProposalBuilderClient({
  patientId,
  patient,
  providers,
}: {
  patientId: string;
  patient: Patient;
  providers: Provider[];
}) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFinancing, setShowFinancing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [signToken, setSignToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [addItem, setAddItem] = useState<ItemForm>({ ...DEFAULT_ITEM });
  const [addItemError, setAddItemError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<BuilderForm>({
    resolver: zodResolver(BuilderSchema),
    defaultValues: {
      title: "",
      provider_id: providers[0]?.id ?? null,
      notes: "",
      financing_enabled: false,
      financing_provider: "cherry",
      financing_term_months: 24,
      tier_mode: false,
      items: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");
  const watchFinancing = watch("financing_enabled");
  const watchTierMode = watch("tier_mode");
  const watchFinancingProvider = watch("financing_provider");
  const watchFinancingTerm = watch("financing_term_months");

  const totalFee = (watchItems ?? []).reduce((s, i) => s + (Number(i.fee) || 0), 0);
  const totalIns = (watchItems ?? []).reduce((s, i) => s + (Number(i.insurance_pays) || 0), 0);
  const totalPt = (watchItems ?? []).reduce((s, i) => s + (Number(i.patient_pays) || 0), 0);
  const monthlyEst = watchFinancingTerm && totalPt > 0 ? totalPt / Number(watchFinancingTerm) : null;

  const handleAddItem = () => {
    if (!addItem.procedure_name.trim()) {
      setAddItemError("Procedure name is required");
      return;
    }
    // Auto-compute patient_pays if not set
    const pt =
      addItem.patient_pays > 0
        ? addItem.patient_pays
        : Math.max(0, addItem.fee - addItem.insurance_pays);

    append({ ...addItem, patient_pays: pt });
    setAddItem({ ...DEFAULT_ITEM });
    setAddItemError(null);
    setShowAddForm(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveProposal = async (rawData: any) => {
    const d = rawData as BuilderForm;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        patient_id: patientId,
        provider_id: d.provider_id || null,
        title: d.title,
        notes: d.notes || null,
        financing_provider: d.financing_enabled ? (d.financing_provider || null) : null,
        financing_monthly: d.financing_enabled && monthlyEst ? Math.round(monthlyEst * 100) / 100 : null,
        financing_term_months: d.financing_enabled ? (d.financing_term_months || null) : null,
        tier: null,
        items: (d.items ?? []).map((item, idx) => ({
          sort_order: idx,
          cdt_code: item.cdt_code || null,
          procedure_name: item.procedure_name,
          procedure_description: item.procedure_description || null,
          tooth_number: item.tooth_number || null,
          fee: Number(item.fee) || 0,
          insurance_pays: Number(item.insurance_pays) || 0,
          patient_pays: Number(item.patient_pays) || 0,
          tier: item.tier || null,
        })),
      };

      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Failed to save proposal");
        return null;
      }

      setSavedId(json.proposal.id);
      setSignToken(json.proposal.sign_token);
      return json.proposal;
    } catch {
      setError("Network error — please try again");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = handleSubmit(async (data) => {
    const proposal = await saveProposal(data);
    if (proposal) {
      setSuccess("Draft saved successfully");
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSendToPatient = handleSubmit(async (data: any) => {
    const d = data as BuilderForm;
    if ((d.items ?? []).length === 0) {
      setError("Add at least one procedure before sending");
      return;
    }
    if (!patient.email) {
      setError("This patient has no email address on file. Add an email to their profile first.");
      return;
    }

    setSending(true);
    setError(null);

    // Save first if not saved
    let propId = savedId;
    if (!propId) {
      const proposal = await saveProposal(data);
      if (!proposal) { setSending(false); return; }
      propId = proposal.id;
    }

    try {
      const res = await fetch(`/api/proposals/${propId}/send`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Failed to send");
        return;
      }

      setSuccess(`Sent! Patient link: ${json.proposal_url}`);
      setTimeout(() => {
        router.push(`/dashboard/patients/${patientId}/proposals`);
      }, 2500);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSending(false);
    }
  });

  // appUrl used for preview link in saved state
  const _appUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/dashboard/patients" className="hover:text-slate-700">Patients</Link>
            <span>/</span>
            <Link href={`/dashboard/patients/${patientId}/proposals`} className="hover:text-slate-700">
              {patient.first_name} {patient.last_name}
            </Link>
            <span>/</span>
            <span>New Proposal</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">New Treatment Proposal</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            For {patient.first_name} {patient.last_name}
            {patient.email ? ` · ${patient.email}` : " · No email on file"}
          </p>
        </div>
      </div>

      {/* Success / Error alerts */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-emerald-800">{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-auto">
            <X className="h-4 w-4 text-emerald-600" />
          </button>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => setError(null)}>
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Proposal Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Proposal Details</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Proposal Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Comprehensive Treatment Plan — Fall 2025"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Provider</label>
            <select
              {...register("provider_id")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">— Select provider —</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  Dr. {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Internal Notes <span className="text-slate-400">(not shown to patient)</span>
          </label>
          <textarea
            {...register("notes")}
            rows={2}
            placeholder="Any clinical notes or reminders for this proposal..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          />
        </div>
      </div>

      {/* Procedures */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            Procedures ({fields.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Procedure
          </button>
        </div>

        {/* Add procedure panel */}
        {showAddForm && (
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-cyan-800">Add Procedure</p>
              <button type="button" onClick={() => { setShowAddForm(false); setAddItemError(null); }}>
                <X className="h-4 w-4 text-cyan-600" />
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  CDT Code <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  value={addItem.cdt_code ?? ""}
                  onChange={(e) => setAddItem((p) => ({ ...p, cdt_code: e.target.value }))}
                  placeholder="D1110"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Procedure Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={addItem.procedure_name}
                  onChange={(e) => setAddItem((p) => ({ ...p, procedure_name: e.target.value }))}
                  placeholder="Comprehensive Exam"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Plain-Language Description <span className="text-slate-400">(shown to patient)</span>
              </label>
              <input
                value={addItem.procedure_description ?? ""}
                onChange={(e) => setAddItem((p) => ({ ...p, procedure_description: e.target.value }))}
                placeholder="A thorough examination of your teeth, gums, and bite to identify any issues early."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tooth #</label>
                <input
                  value={addItem.tooth_number ?? ""}
                  onChange={(e) => setAddItem((p) => ({ ...p, tooth_number: e.target.value }))}
                  placeholder="14"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Practice Fee</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addItem.fee || ""}
                    onChange={(e) => {
                      const fee = parseFloat(e.target.value) || 0;
                      setAddItem((p) => ({
                        ...p,
                        fee,
                        patient_pays: Math.max(0, fee - p.insurance_pays),
                      }));
                    }}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Insurance Pays</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addItem.insurance_pays || ""}
                    onChange={(e) => {
                      const ins = parseFloat(e.target.value) || 0;
                      setAddItem((p) => ({
                        ...p,
                        insurance_pays: ins,
                        patient_pays: Math.max(0, p.fee - ins),
                      }));
                    }}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Patient Pays</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addItem.patient_pays || ""}
                    onChange={(e) =>
                      setAddItem((p) => ({ ...p, patient_pays: parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Tier assignment */}
            {watchTierMode && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Assign to Tier</label>
                <select
                  value={addItem.tier ?? ""}
                  onChange={(e) =>
                    setAddItem((p) => ({
                      ...p,
                      tier: (e.target.value as "good" | "better" | "best") || null,
                    }))
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">All tiers</option>
                  <option value="good">Good</option>
                  <option value="better">Better</option>
                  <option value="best">Best</option>
                </select>
              </div>
            )}

            {addItemError && (
              <p className="text-xs text-red-600">{addItemError}</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAddItem}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
              >
                Add to Proposal
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setAddItemError(null); }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items list */}
        {fields.length === 0 && !showAddForm ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center">
            <DollarSign className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No procedures added yet</p>
            <p className="text-xs text-slate-400 mt-1">Click &quot;Add Procedure&quot; to build this plan</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1" />
              <div className="col-span-5">Procedure</div>
              <div className="col-span-2 text-right">Fee</div>
              <div className="col-span-2 text-right">Insurance</div>
              <div className="col-span-1 text-right">Patient</div>
              <div className="col-span-1" />
            </div>

            {fields.map((field, idx) => {
              const item = watchItems?.[idx];
              return (
                <div key={field.id} className="flex items-center gap-2 px-4 py-3">
                  <button
                    type="button"
                    className="text-slate-300 hover:text-slate-500 cursor-grab flex-shrink-0"
                    onClick={() => idx > 0 && move(idx, idx - 1)}
                    title="Move up"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {item?.procedure_name}
                          {item?.tooth_number && (
                            <span className="ml-1.5 text-xs text-slate-400">#{item.tooth_number}</span>
                          )}
                          {item?.cdt_code && (
                            <span className="ml-1.5 text-xs font-mono text-slate-400">{item.cdt_code}</span>
                          )}
                          {item?.tier && (
                            <span className="ml-1.5 inline-flex items-center rounded px-1.5 py-0 text-[10px] font-medium bg-purple-100 text-purple-700">
                              {item.tier}
                            </span>
                          )}
                        </p>
                        {item?.procedure_description && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{item.procedure_description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 text-right">
                    <div className="hidden sm:block">
                      <p className="text-xs text-slate-500">{fmt(Number(item?.fee) || 0)}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-emerald-600">{fmt(Number(item?.insurance_pays) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cyan-600">{fmt(Number(item?.patient_pays) || 0)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Pricing Summary */}
      {fields.length > 0 && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
          <h2 className="text-sm font-semibold text-cyan-900 mb-3">Pricing Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-cyan-700 mb-1">Practice Fee</p>
              <p className="text-xl font-bold text-slate-900">{fmt(totalFee)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-cyan-700 mb-1">Insurance Estimate</p>
              <p className="text-xl font-bold text-emerald-600">{fmt(totalIns)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-cyan-700 mb-1">Patient Cost</p>
              <p className="text-2xl font-extrabold text-cyan-700">{fmt(totalPt)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Options: Financing */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFinancing(!showFinancing)}
          className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
        >
          <div>
            <p className="text-sm font-semibold text-slate-700">Financing Options</p>
            <p className="text-xs text-slate-400">Show monthly payment estimates to the patient</p>
          </div>
          <div className="flex items-center gap-2">
            {watchFinancing && (
              <span className="text-xs text-emerald-600 font-medium">Enabled</span>
            )}
            {showFinancing ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </div>
        </button>

        {showFinancing && (
          <div className="border-t border-slate-100 px-6 py-4 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("financing_enabled")}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm text-slate-700">Show financing options to patient</span>
            </label>

            {watchFinancing && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Financing Provider</label>
                  <select
                    {...register("financing_provider")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="cherry">Cherry Financing</option>
                    <option value="carecredit">CareCredit</option>
                    <option value="sunbit">Sunbit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Term (months)</label>
                  <select
                    {...register("financing_term_months")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="18">18 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>
              </div>
            )}

            {watchFinancing && monthlyEst && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                <p className="text-sm font-semibold text-emerald-800">
                  Estimated: {fmt(monthlyEst)}/mo
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  {watchFinancingTerm}-month term via {
                    watchFinancingProvider === "cherry" ? "Cherry" :
                    watchFinancingProvider === "sunbit" ? "Sunbit" : "CareCredit"
                  } · Subject to credit approval
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Good/Better/Best Toggle */}
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("tier_mode")}
            onChange={(e) => setValue("tier_mode", e.target.checked)}
            className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />
          <div>
            <p className="text-sm font-semibold text-slate-700">Good / Better / Best Tiers</p>
            <p className="text-xs text-slate-400">Assign procedures to tiers to give the patient options</p>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 -mx-6 rounded-b-xl">
        <div className="flex items-center gap-3 flex-wrap max-w-4xl mx-auto">
          {/* Preview */}
          {signToken && (
            <a
              href={`/proposal/${signToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview Patient View
            </a>
          )}

          <div className="flex-1" />

          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || sending}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {savedId ? "Saved" : "Save Draft"}
          </button>

          {/* Send to Patient */}
          <button
            type="button"
            onClick={handleSendToPatient}
            disabled={saving || sending || fields.length === 0}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send to Patient
          </button>
        </div>
      </div>
    </div>
  );
}
