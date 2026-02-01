"use client";

import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Download,
} from "lucide-react";

interface Claim {
  id: string;
  patient: string;
  claimNumber: string;
  provider: string;
  procedures: string;
  billedAmount: number;
  status: "submitted" | "pending" | "paid" | "denied" | "appealed";
  submittedDate: string;
  agingDays: number;
  paidAmount: number | null;
  denialReason: string | null;
}

const claims: Claim[] = [
  { id: "1", patient: "Robert Kim", claimNumber: "CLM-2024-0892", provider: "MetLife", procedures: "D2740 - Crown", billedAmount: 1250, status: "pending", submittedDate: "Jan 28", agingDays: 3, paidAmount: null, denialReason: null },
  { id: "2", patient: "Amanda Patel", claimNumber: "CLM-2024-0891", provider: "Cigna", procedures: "D1110, D0120, D0274", billedAmount: 385, status: "paid", submittedDate: "Jan 15", agingDays: 16, paidAmount: 342, denialReason: null },
  { id: "3", patient: "Tom Baker", claimNumber: "CLM-2024-0890", provider: "Delta Dental", procedures: "D3310 - RCT Anterior", billedAmount: 980, status: "submitted", submittedDate: "Jan 30", agingDays: 1, paidAmount: null, denialReason: null },
  { id: "4", patient: "Karen Davis", claimNumber: "CLM-2024-0885", provider: "Guardian", procedures: "D2750 - Crown PFM", billedAmount: 1350, status: "denied", submittedDate: "Jan 8", agingDays: 23, paidAmount: 0, denialReason: "Missing pre-authorization" },
  { id: "5", patient: "David Park", claimNumber: "CLM-2024-0880", provider: "Aetna", procedures: "D8090 - Ortho Comprehensive", billedAmount: 5500, status: "appealed", submittedDate: "Dec 20", agingDays: 42, paidAmount: null, denialReason: "Waiting period not met" },
  { id: "6", patient: "Lisa Hernandez", claimNumber: "CLM-2024-0878", provider: "United Concordia", procedures: "D1110, D0120", billedAmount: 265, status: "paid", submittedDate: "Jan 10", agingDays: 21, paidAmount: 265, denialReason: null },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: FileText },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  denied: { label: "Denied", color: "bg-red-100 text-red-700", icon: XCircle },
  appealed: { label: "Appealed", color: "bg-purple-100 text-purple-700", icon: AlertTriangle },
};

export default function BillingPage() {
  const totalBilled = claims.reduce((sum, c) => sum + c.billedAmount, 0);
  const totalCollected = claims.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
  const collectionRate = totalBilled > 0 ? (totalCollected / totalBilled * 100).toFixed(1) : "0";
  const deniedCount = claims.filter((c) => c.status === "denied" || c.status === "appealed").length;

  // Aging buckets
  const aging0_30 = claims.filter((c) => c.agingDays <= 30 && c.status !== "paid").length;
  const aging31_60 = claims.filter((c) => c.agingDays > 30 && c.agingDays <= 60 && c.status !== "paid").length;
  const aging61_90 = claims.filter((c) => c.agingDays > 60 && c.agingDays <= 90 && c.status !== "paid").length;
  const aging90plus = claims.filter((c) => c.agingDays > 90 && c.status !== "paid").length;

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <p className="text-sm font-medium text-slate-500">MTD Production</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">$47,850</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600">+8.3% vs last month</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">MTD Collections</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">$43,250</p>
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
              <p className="mt-1 text-2xl font-bold text-slate-900">$12,480</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-sm font-medium text-slate-500">Avg 18 days in A/R</span>
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
          <div className="mt-3 flex items-center gap-1">
            <span className="text-sm font-medium text-red-600">Action required</span>
          </div>
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
              <div className="h-full rounded-full bg-emerald-500" style={{ width: "60%" }} />
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{aging31_60}</p>
            <p className="text-sm text-amber-600">31-60 Days</p>
            <div className="mt-2 h-2 rounded-full bg-amber-200">
              <div className="h-full rounded-full bg-amber-500" style={{ width: "25%" }} />
            </div>
          </div>
          <div className="rounded-lg bg-orange-50 p-4 text-center">
            <p className="text-2xl font-bold text-orange-700">{aging61_90}</p>
            <p className="text-sm text-orange-600">61-90 Days</p>
            <div className="mt-2 h-2 rounded-full bg-orange-200">
              <div className="h-full rounded-full bg-orange-500" style={{ width: "10%" }} />
            </div>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{aging90plus}</p>
            <p className="text-sm text-red-600">90+ Days</p>
            <div className="mt-2 h-2 rounded-full bg-red-200">
              <div className="h-full rounded-full bg-red-500" style={{ width: "5%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Claims</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-6 py-3 text-xs font-medium text-slate-500">Claim #</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500">Patient</th>
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
                const config = statusConfig[claim.status];
                const StatusIcon = config.icon;
                return (
                  <tr key={claim.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm font-mono text-slate-600">{claim.claimNumber}</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">{claim.patient}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{claim.provider}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{claim.procedures}</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">${claim.billedAmount.toLocaleString()}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {claim.paidAmount !== null ? `$${claim.paidAmount.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                      {claim.denialReason && (
                        <p className="mt-0.5 text-xs text-red-500">{claim.denialReason}</p>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-500">{claim.agingDays}d</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
