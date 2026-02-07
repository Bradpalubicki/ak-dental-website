"use client";

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

export function TreatmentsClient({ treatments }: Props) {
  const totalValue = treatments.reduce((sum, p) => sum + p.totalCost, 0);
  const acceptedValue = treatments.filter((p) => p.status === "accepted" || p.status === "completed").reduce((sum, p) => sum + p.totalCost, 0);
  const pendingValue = treatments.filter((p) => p.status === "presented" || p.status === "draft").reduce((sum, p) => sum + p.totalCost, 0);
  const presentable = treatments.filter((p) => p.status !== "draft");
  const acceptanceRate = presentable.length > 0 ? Math.round((treatments.filter((p) => p.status === "accepted" || p.status === "completed").length / presentable.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Treatment Plans</h1>
          <p className="text-sm text-slate-500">Present treatment plans to patients on tablet with insurance breakdown and financing</p>
        </div>
      </div>

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

                {/* Actions */}
                <div className="mt-4 flex items-center justify-end gap-2">
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
    </div>
  );
}
