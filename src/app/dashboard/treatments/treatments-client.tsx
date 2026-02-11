"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  Monitor,
  Shield,
  Plus,
  Trash2,
  RotateCcw,
  X,
} from "lucide-react";

interface Treatment {
  id: string;
  patientName: string;
  patientInsurance: string | null;
  title: string;
  procedures: Array<{ name: string; code: string; cost: number; category?: string }>;
  totalCost: number;
  insuranceEstimate: number;
  patientEstimate: number;
  status: string;
  hasAiSummary: boolean;
  createdAt: string;
}

interface Props {
  treatments: Treatment[];
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-600", icon: FileText },
  presented: { label: "Presented", color: "bg-blue-100 text-blue-700", icon: Send },
  accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  partially_accepted: { label: "Partial", color: "bg-amber-100 text-amber-700", icon: Clock },
  declined: { label: "Declined", color: "bg-red-100 text-red-700", icon: XCircle },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

const emptyForm = {
  patient_id: "",
  title: "",
  status: "draft",
  procedures: "",
  total_cost: "",
  insurance_estimate: "",
  patient_estimate: "",
  notes: "",
};

export function TreatmentsClient({ treatments: initialTreatments }: Props) {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [trashItems, setTrashItems] = useState<Treatment[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const totalValue = treatments.reduce((sum, p) => sum + p.totalCost, 0);
  const acceptedValue = treatments.filter((p) => p.status === "accepted" || p.status === "completed").reduce((sum, p) => sum + p.totalCost, 0);
  const pendingValue = treatments.filter((p) => p.status === "presented" || p.status === "draft").reduce((sum, p) => sum + p.totalCost, 0);
  const presentable = treatments.filter((p) => p.status !== "draft");
  const acceptanceRate = presentable.length > 0 ? Math.round((treatments.filter((p) => p.status === "accepted" || p.status === "completed").length / presentable.length) * 100) : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/treatments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: form.patient_id,
          title: form.title,
          status: form.status,
          procedures: form.procedures ? JSON.parse(form.procedures) : [],
          total_cost: parseFloat(form.total_cost) || 0,
          insurance_estimate: parseFloat(form.insurance_estimate) || 0,
          patient_estimate: parseFloat(form.patient_estimate) || 0,
          notes: form.notes || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const newTreatment: Treatment = {
          id: data.id,
          patientName: "New Patient",
          patientInsurance: null,
          title: data.title,
          procedures: data.procedures || [],
          totalCost: Number(data.total_cost),
          insuranceEstimate: Number(data.insurance_estimate),
          patientEstimate: Number(data.patient_estimate),
          status: data.status,
          hasAiSummary: !!data.ai_summary,
          createdAt: data.created_at,
        };
        setTreatments((prev) => [newTreatment, ...prev]);
        setForm(emptyForm);
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/treatments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTreatments((prev) => prev.filter((t) => t.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  async function loadTrash() {
    const res = await fetch("/api/treatments?deleted=true");
    if (res.ok) {
      const data = await res.json();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const items = (data || []).map((p: any) => ({
        id: p.id,
        patientName: p.patient ? `${p.patient.first_name} ${p.patient.last_name}` : "Unknown",
        patientInsurance: p.patient?.insurance_provider || null,
        title: p.title,
        procedures: p.procedures || [],
        totalCost: Number(p.total_cost),
        insuranceEstimate: Number(p.insurance_estimate),
        patientEstimate: Number(p.patient_estimate),
        status: p.status,
        hasAiSummary: !!p.ai_summary,
        createdAt: p.created_at,
      }));
      /* eslint-enable @typescript-eslint/no-explicit-any */
      setTrashItems(items);
    }
    setShowTrash(true);
  }

  async function handleRestore(id: string) {
    const res = await fetch(`/api/treatments/${id}/restore`, { method: "POST" });
    if (res.ok) {
      setTrashItems((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Treatment Plans</h1>
          <p className="text-sm text-slate-500">Present treatment plans to patients on tablet with insurance breakdown and financing</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTrash}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            <Trash2 className="h-4 w-4" /> Trash
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4" /> New Treatment Plan
          </button>
        </div>
      </div>

      {/* New Treatment Form */}
      {showForm && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">New Treatment Plan</h2>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-slate-200">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID *</label>
                <input
                  required
                  value={form.patient_id}
                  onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="Patient UUID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g. Comprehensive Restoration Plan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.total_cost}
                  onChange={(e) => setForm({ ...form, total_cost: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Estimate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.insurance_estimate}
                  onChange={(e) => setForm({ ...form, insurance_estimate: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient Estimate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.patient_estimate}
                  onChange={(e) => setForm({ ...form, patient_estimate: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="presented">Presented</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Procedures (JSON array)</label>
              <textarea
                value={form.procedures}
                onChange={(e) => setForm({ ...form, procedures: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none font-mono"
                rows={3}
                placeholder='[{"name": "Crown", "code": "D2740", "cost": 1200}]'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Create Plan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total Pipeline</p>
          <p className="text-2xl font-bold text-slate-900">${totalValue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Accepted</p>
          <p className="text-2xl font-bold text-emerald-600">${acceptedValue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Pending Decision</p>
          <p className="text-2xl font-bold text-blue-600">${pendingValue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Acceptance Rate</p>
          <p className="text-2xl font-bold text-slate-900">{acceptanceRate}%</p>
        </div>
      </div>

      {/* Treatment Plans List */}
      <div className="space-y-4">
        {treatments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
            <FileText className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">No Treatment Plans</h3>
            <p className="mt-1 text-sm text-slate-500">Treatment plans will appear here once created.</p>
          </div>
        ) : (
          treatments.map((plan) => {
            const config = statusConfig[plan.status] || statusConfig.draft;
            const StatusIcon = config.icon;
            const billable = plan.procedures.filter((p) => p.cost > 0);

            return (
              <div key={plan.id} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-slate-900">{plan.title}</h3>
                      <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                      {plan.hasAiSummary && (
                        <span className="flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-xs text-cyan-700">
                          <Zap className="h-3 w-3" />
                          AI Summary
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <span>{plan.patientName}</span>
                      {plan.patientInsurance && (
                        <>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {plan.patientInsurance}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">${plan.totalCost.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Patient owes: ${plan.patientEstimate.toLocaleString()}</p>
                  </div>
                </div>

                {/* Procedures */}
                {billable.length > 0 && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3">
                    <div className="space-y-1">
                      {billable.map((proc, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{proc.name} <span className="text-slate-400">({proc.code})</span></span>
                          <span className="font-medium text-slate-900">${proc.cost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-sm">
                      <span className="text-emerald-600 font-medium">Insurance est: -${plan.insuranceEstimate.toLocaleString()}</span>
                      <span className="font-bold text-slate-900">Patient: ${plan.patientEstimate.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleDelete(plan.id)}
                    disabled={deleting === plan.id}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/dashboard/treatments/${plan.id}/present`}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 transition-all shadow-sm"
                  >
                    <Monitor className="h-4 w-4" />
                    Present on Tablet
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trash Panel */}
      {showTrash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Trash</h2>
                <p className="text-sm text-slate-500">Deleted treatment plans are kept for 30 days</p>
              </div>
              <button onClick={() => setShowTrash(false)} className="rounded-lg p-1 hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            {trashItems.length > 0 ? (
              <div className="space-y-2">
                {trashItems.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{plan.title}</p>
                      <p className="text-xs text-slate-400">{plan.patientName} &middot; ${plan.totalCost.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleRestore(plan.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-sm text-slate-400">
                Trash is empty
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
