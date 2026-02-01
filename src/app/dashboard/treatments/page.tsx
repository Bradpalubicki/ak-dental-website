"use client";

import {
  FileText,
  Plus,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Zap,
  TrendingUp,
} from "lucide-react";

interface TreatmentPlan {
  id: string;
  patient: string;
  title: string;
  procedures: { name: string; code: string; cost: number }[];
  totalCost: number;
  insuranceEstimate: number;
  patientEstimate: number;
  status: "draft" | "presented" | "accepted" | "partially_accepted" | "declined";
  presentedDate: string | null;
  followupCount: number;
  hasAiSummary: boolean;
}

const plans: TreatmentPlan[] = [
  {
    id: "1", patient: "David Park", title: "Orthodontic Treatment - Invisalign",
    procedures: [{ name: "Comprehensive Orthodontics", code: "D8090", cost: 5500 }],
    totalCost: 5500, insuranceEstimate: 1500, patientEstimate: 4000,
    status: "presented", presentedDate: "Jan 25", followupCount: 1, hasAiSummary: true,
  },
  {
    id: "2", patient: "Robert Kim", title: "Crown Restoration - #14",
    procedures: [{ name: "Crown - Porcelain/Ceramic", code: "D2740", cost: 1250 }, { name: "Core Buildup", code: "D2950", cost: 350 }],
    totalCost: 1600, insuranceEstimate: 960, patientEstimate: 640,
    status: "accepted", presentedDate: "Jan 20", followupCount: 0, hasAiSummary: true,
  },
  {
    id: "3", patient: "Jennifer Liu", title: "Implant - Single Tooth #8",
    procedures: [{ name: "Implant Body", code: "D6010", cost: 2200 }, { name: "Abutment", code: "D6056", cost: 800 }, { name: "Crown on Implant", code: "D6065", cost: 1500 }],
    totalCost: 4500, insuranceEstimate: 1800, patientEstimate: 2700,
    status: "draft", presentedDate: null, followupCount: 0, hasAiSummary: false,
  },
  {
    id: "4", patient: "Karen Davis", title: "Periodontal Treatment",
    procedures: [{ name: "SRP - Per Quadrant", code: "D4341", cost: 300 }, { name: "SRP - Per Quadrant", code: "D4341", cost: 300 }],
    totalCost: 600, insuranceEstimate: 480, patientEstimate: 120,
    status: "declined", presentedDate: "Jan 10", followupCount: 2, hasAiSummary: true,
  },
  {
    id: "5", patient: "Michael Rodriguez", title: "Comprehensive Restorative",
    procedures: [{ name: "Crown", code: "D2740", cost: 1250 }, { name: "Filling - Composite", code: "D2392", cost: 250 }, { name: "Filling - Composite", code: "D2391", cost: 200 }],
    totalCost: 1700, insuranceEstimate: 1020, patientEstimate: 680,
    status: "presented", presentedDate: "Jan 28", followupCount: 0, hasAiSummary: true,
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-600", icon: FileText },
  presented: { label: "Presented", color: "bg-blue-100 text-blue-700", icon: Send },
  accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  partially_accepted: { label: "Partial", color: "bg-amber-100 text-amber-700", icon: Clock },
  declined: { label: "Declined", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function TreatmentsPage() {
  const totalValue = plans.reduce((sum, p) => sum + p.totalCost, 0);
  const acceptedValue = plans.filter((p) => p.status === "accepted").reduce((sum, p) => sum + p.totalCost, 0);
  const pendingValue = plans.filter((p) => p.status === "presented" || p.status === "draft").reduce((sum, p) => sum + p.totalCost, 0);
  const acceptanceRate = plans.length > 0 ? Math.round((plans.filter((p) => p.status === "accepted").length / plans.filter((p) => p.status !== "draft").length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Treatment Plans</h1>
          <p className="text-sm text-slate-500">AI-enhanced treatment presentation and follow-up</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
          <Plus className="h-4 w-4" />
          New Treatment Plan
        </button>
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
        {plans.map((plan) => {
          const config = statusConfig[plan.status];
          const StatusIcon = config.icon;
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
                  <p className="mt-1 text-sm text-slate-500">{plan.patient}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">${plan.totalCost.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Patient: ${plan.patientEstimate.toLocaleString()}</p>
                </div>
              </div>

              {/* Procedures */}
              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <div className="space-y-1">
                  {plan.procedures.map((proc, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{proc.name} <span className="text-slate-400">({proc.code})</span></span>
                      <span className="font-medium text-slate-900">${proc.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="text-slate-500">Insurance est: ${plan.insuranceEstimate.toLocaleString()}</span>
                  <span className="font-semibold text-slate-900">Patient est: ${plan.patientEstimate.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {plan.presentedDate && `Presented: ${plan.presentedDate}`}
                  {plan.followupCount > 0 && ` · ${plan.followupCount} follow-ups sent`}
                </div>
                <div className="flex items-center gap-2">
                  {!plan.hasAiSummary && (
                    <button className="flex items-center gap-1 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100">
                      <Zap className="h-3 w-3" />
                      Generate AI Summary
                    </button>
                  )}
                  {plan.status === "draft" && (
                    <button className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                      <Send className="h-3 w-3" />
                      Present to Patient
                    </button>
                  )}
                  {(plan.status === "presented" || plan.status === "declined") && (
                    <button className="flex items-center gap-1 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100">
                      <Send className="h-3 w-3" />
                      Send Follow-Up
                    </button>
                  )}
                  <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
