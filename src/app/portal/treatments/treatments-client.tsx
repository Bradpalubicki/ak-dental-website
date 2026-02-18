"use client";

import { useState } from "react";
import {
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Shield,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Procedure {
  name: string;
  code?: string;
  fee: number;
  insurance_pays?: number;
  patient_pays?: number;
  tooth?: string;
}

interface TreatmentPlan {
  id: string;
  title: string;
  status: string;
  procedures: Procedure[];
  total_cost: number;
  insurance_estimate: number;
  patient_estimate: number;
  ai_summary: string | null;
  created_at: string;
  accepted_at: string | null;
  provider_name: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-slate-600", bgColor: "bg-slate-50 border-slate-200" },
  presented: { label: "Presented", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  accepted: { label: "Accepted", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  partially_accepted: { label: "Partially Accepted", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  declined: { label: "Declined", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  completed: { label: "Completed", color: "text-slate-600", bgColor: "bg-slate-50 border-slate-200" },
};

export function TreatmentsClient({ treatments }: { treatments: TreatmentPlan[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const active = treatments.filter((t) => ["presented", "accepted", "partially_accepted"].includes(t.status));
  const completed = treatments.filter((t) => t.status === "completed");
  const totalEstimate = active.reduce((sum, t) => sum + t.patient_estimate, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Treatment Plans</h1>
        <p className="mt-1 text-sm text-slate-500">
          {active.length} active plan{active.length !== 1 ? "s" : ""} &middot; {completed.length} completed
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <FileText className="h-5 w-5 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{treatments.length}</p>
          <p className="text-xs text-slate-500">Total Plans</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <DollarSign className="h-5 w-5 text-emerald-600 mb-2" />
          <p className="text-2xl font-bold text-slate-900">${totalEstimate.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Your Estimated Cost</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Shield className="h-5 w-5 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-slate-900">
            ${active.reduce((sum, t) => sum + t.insurance_estimate, 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Insurance Coverage Est.</p>
        </div>
      </div>

      {/* Treatment Plans List */}
      <div className="space-y-4">
        {treatments.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No treatment plans yet</p>
            <p className="text-xs text-slate-400 mt-1">Your treatment plans will appear here after your next visit</p>
          </div>
        ) : (
          treatments.map((tp) => {
            const status = statusConfig[tp.status] || statusConfig.draft;
            const isExpanded = expandedId === tp.id;
            const procedures = Array.isArray(tp.procedures) ? tp.procedures : [];

            return (
              <div key={tp.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : tp.id)}
                  className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{tp.title}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span>{tp.provider_name}</span>
                        <span>&middot;</span>
                        <span>{new Date(tp.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span>&middot;</span>
                        <span>{procedures.length} procedure{procedures.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">${tp.patient_estimate.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500">Your cost</p>
                    </div>
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-medium", status.bgColor, status.color)}>
                      {status.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    {/* AI Summary */}
                    {tp.ai_summary && (
                      <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-3">
                        <div className="flex items-start gap-2">
                          <Brain className="mt-0.5 h-4 w-4 text-purple-600 flex-shrink-0" />
                          <p className="text-xs leading-relaxed text-purple-800">{tp.ai_summary}</p>
                        </div>
                      </div>
                    )}

                    {/* Procedures Table */}
                    {procedures.length > 0 && (
                      <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 text-left">
                              <th className="px-4 py-2 text-[10px] font-semibold uppercase text-slate-500">Procedure</th>
                              <th className="px-4 py-2 text-[10px] font-semibold uppercase text-slate-500">Code</th>
                              <th className="px-4 py-2 text-[10px] font-semibold uppercase text-slate-500 text-right">Fee</th>
                              <th className="px-4 py-2 text-[10px] font-semibold uppercase text-slate-500 text-right">Insurance</th>
                              <th className="px-4 py-2 text-[10px] font-semibold uppercase text-slate-500 text-right">Your Cost</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {procedures.map((proc, i) => (
                              <tr key={i} className="text-xs">
                                <td className="px-4 py-2.5 font-medium text-slate-900">
                                  {proc.name}
                                  {proc.tooth && <span className="ml-1 text-slate-400">(#{proc.tooth})</span>}
                                </td>
                                <td className="px-4 py-2.5 text-slate-500 font-mono">{proc.code || "—"}</td>
                                <td className="px-4 py-2.5 text-right text-slate-600">${(proc.fee || 0).toLocaleString()}</td>
                                <td className="px-4 py-2.5 text-right text-emerald-600">${(proc.insurance_pays || 0).toLocaleString()}</td>
                                <td className="px-4 py-2.5 text-right font-semibold text-slate-900">${(proc.patient_pays || 0).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-slate-50 font-semibold text-xs">
                              <td colSpan={2} className="px-4 py-2.5 text-slate-700">Total</td>
                              <td className="px-4 py-2.5 text-right text-slate-700">${tp.total_cost.toLocaleString()}</td>
                              <td className="px-4 py-2.5 text-right text-emerald-600">${tp.insurance_estimate.toLocaleString()}</td>
                              <td className="px-4 py-2.5 text-right text-slate-900">${tp.patient_estimate.toLocaleString()}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}

                    {/* Status Info */}
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                      {tp.accepted_at && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Accepted {new Date(tp.accepted_at).toLocaleDateString()}
                        </span>
                      )}
                      {tp.status === "presented" && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-amber-500" />
                          Awaiting your decision
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
