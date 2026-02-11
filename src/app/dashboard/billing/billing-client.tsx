"use client";

import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  FileText,
  Download,
} from "lucide-react";
import type { BillingClaim } from "@/types/database";

interface BillingData {
  claims: BillingClaim[];
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: FileText },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  denied: { label: "Denied", color: "bg-red-100 text-red-700", icon: XCircle },
  appealed: { label: "Appealed", color: "bg-purple-100 text-purple-700", icon: AlertTriangle },
  written_off: { label: "Written Off", color: "bg-slate-100 text-slate-500", icon: XCircle },
};

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

function procedureSummary(codes: unknown): string {
  if (!codes || !Array.isArray(codes)) return "—";
  return codes.map((c: { code?: string; description?: string }) => c.code || c.description || "").filter(Boolean).join(", ") || "—";
}

export function BillingClient({ data }: { data: BillingData }) {
  const { claims, totalBilled, totalCollected, totalOutstanding } = data;
  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : "0";
  const deniedCount = claims.filter((c) => c.status === "denied" || c.status === "appealed").length;

  const unpaid = claims.filter((c) => c.status !== "paid" && c.status !== "written_off");
  const aging0_30 = unpaid.filter((c) => (c.aging_days || 0) <= 30).length;
  const aging31_60 = unpaid.filter((c) => (c.aging_days || 0) > 30 && (c.aging_days || 0) <= 60).length;
  const aging61_90 = unpaid.filter((c) => (c.aging_days || 0) > 60 && (c.aging_days || 0) <= 90).length;
  const aging90plus = unpaid.filter((c) => (c.aging_days || 0) > 90).length;
  const totalUnpaid = unpaid.length || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing Dashboard</h1>
          <p className="text-sm text-slate-500">Claims tracking, collections, and revenue analytics</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Billed</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(totalBilled)}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Collections</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(totalCollected)}</p>
            </div>
            <div className="rounded-lg bg-cyan-50 p-2">
              <DollarSign className="h-5 w-5 text-cyan-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-sm font-medium text-slate-500">{collectionRate}% collection rate</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Outstanding A/R</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(totalOutstanding)}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Denied Claims</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{deniedCount}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-2">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          {deniedCount > 0 && (
            <div className="mt-3">
              <span className="text-sm font-medium text-red-600">Action required</span>
            </div>
          )}
        </div>
      </div>

      {/* Aging Buckets */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Aging Report</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-emerald-50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">{aging0_30}</p>
            <p className="text-sm text-emerald-600">0-30 Days</p>
            <div className="mt-2 h-2 rounded-full bg-emerald-200">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(aging0_30 / totalUnpaid) * 100}%` }} />
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{aging31_60}</p>
            <p className="text-sm text-amber-600">31-60 Days</p>
            <div className="mt-2 h-2 rounded-full bg-amber-200">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${(aging31_60 / totalUnpaid) * 100}%` }} />
            </div>
          </div>
          <div className="rounded-lg bg-orange-50 p-4 text-center">
            <p className="text-2xl font-bold text-orange-700">{aging61_90}</p>
            <p className="text-sm text-orange-600">61-90 Days</p>
            <div className="mt-2 h-2 rounded-full bg-orange-200">
              <div className="h-full rounded-full bg-orange-500" style={{ width: `${(aging61_90 / totalUnpaid) * 100}%` }} />
            </div>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{aging90plus}</p>
            <p className="text-sm text-red-600">90+ Days</p>
            <div className="mt-2 h-2 rounded-full bg-red-200">
              <div className="h-full rounded-full bg-red-500" style={{ width: `${(aging90plus / totalUnpaid) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {claims.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-semibold text-slate-900">No claims yet</h3>
          <p className="mt-1 text-sm text-slate-500">Claims will appear here as they are submitted.</p>
        </div>
      )}

      {/* Claims Table */}
      {claims.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Claims</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Claim #</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Insurance</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Procedures</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Billed</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Paid</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => {
                  const config = statusConfig[claim.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  return (
                    <tr key={claim.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm font-mono text-slate-600">{claim.claim_number || "—"}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{claim.insurance_provider}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{procedureSummary(claim.procedure_codes)}</td>
                      <td className="px-6 py-3 text-sm font-medium text-slate-900">{formatCurrency(Number(claim.billed_amount))}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">
                        {Number(claim.insurance_paid) > 0 ? formatCurrency(Number(claim.insurance_paid)) : "—"}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                        {claim.denial_reason && (
                          <p className="mt-0.5 text-xs text-red-500">{claim.denial_reason}</p>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-500">{claim.aging_days || 0}d</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
