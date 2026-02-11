"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Calendar,
  CreditCard,
  Building2,
  FileText,
  Upload,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Users,
  BadgeDollarSign,
  ChevronRight,
  Eye,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

type Period = "daily" | "weekly" | "monthly" | "yearly";

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface ProdVsCollections {
  month: string;
  production: number;
  collections: number;
}

interface ArBucket {
  bucket: string;
  amount: number;
  color: string;
  bgColor: string;
  textColor: string;
  percent: number;
}

interface OutstandingAccount {
  name: string;
  amount: number;
  days: number;
  insurance: string;
}

interface FinancialsData {
  monthlyRevenue: MonthlyRevenue[];
  prodVsCollections: ProdVsCollections[];
  arAging: ArBucket[];
  topOutstandingAccounts: OutstandingAccount[];
  totalAR: number;
  mtdProduction: number;
  mtdCollections: number;
  netIncome: number;
}

// Static P&L items (will be dynamic when expense tracking table is added)
const revenueItems = [
  { label: "Gross Production", category: "revenue" as const },
  { label: "Adjustments / Write-offs", category: "revenue" as const },
  { label: "Net Collections", category: "revenue" as const },
];

const expenseItems = [
  { label: "Payroll & Benefits", amount: 18500 },
  { label: "Dental Supplies", amount: 3200 },
  { label: "Lab Fees", amount: 4800 },
  { label: "Rent / Lease", amount: 5500 },
  { label: "Equipment Leases", amount: 1200 },
  { label: "Insurance (Practice)", amount: 800 },
  { label: "Marketing", amount: 1500 },
  { label: "Utilities", amount: 650 },
  { label: "Other / Miscellaneous", amount: 450 },
];

const accountsPayable = [
  { vendor: "Henry Schein", description: "Dental Supplies", amount: 2340, dueDate: "Next billing cycle", status: "due_soon" as const },
  { vendor: "Patterson Dental", description: "Lab Fees", amount: 1850, dueDate: "Next billing cycle", status: "upcoming" as const },
];

const apStatusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  due_soon: { label: "Due Soon", color: "bg-amber-100 text-amber-700" },
  upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-700" },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700" },
};

export function FinancialsClient({ data }: { data: FinancialsData }) {
  const [period, setPeriod] = useState<Period>("monthly");
  const { monthlyRevenue, prodVsCollections, arAging, topOutstandingAccounts, totalAR, mtdProduction, mtdCollections, netIncome } = data;

  const totalExpenses = expenseItems.reduce((sum, e) => sum + e.amount, 0);
  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.revenue), 1);
  const maxProd = Math.max(...prodVsCollections.map((d) => Math.max(d.production, d.collections)), 1);
  const totalAPOutstanding = accountsPayable.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Command Center</h1>
          <p className="text-sm text-slate-500">Complete practice financial health at a glance</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
          {(["daily", "weekly", "monthly", "yearly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
                period === p
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-cyan-700 to-slate-800 p-6 text-white shadow-lg shadow-cyan-600/20">
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide uppercase opacity-90">One Engine Financial Analysis</h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-95 max-w-3xl">
            {mtdProduction > 0 ? (
              <>
                MTD production at <span className="font-bold text-emerald-300">${mtdProduction.toLocaleString()}</span>.
                Collection rate of <span className="font-bold text-emerald-300">
                  {mtdProduction > 0 ? ((mtdCollections / mtdProduction) * 100).toFixed(1) : 0}%
                </span>.
                {totalAR > 0 && (
                  <> Total accounts receivable: <span className="font-bold text-amber-300">${totalAR.toLocaleString()}</span>.</>
                )}
              </>
            ) : (
              <>Financial data will populate as practice activity is recorded.</>
            )}
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Revenue (MTD)" value={`$${mtdProduction.toLocaleString()}`} change="" trend="up" icon={DollarSign} iconColor="bg-emerald-50 text-emerald-600" />
        <StatCard title="Collections" value={`$${mtdCollections.toLocaleString()}`} change="" trend="up" icon={Wallet} iconColor="bg-cyan-50 text-cyan-600" />
        <StatCard title="Net Income" value={`$${netIncome.toLocaleString()}`} change="" trend="up" icon={TrendingUp} iconColor="bg-violet-50 text-violet-600" />
        <StatCard title="Total A/R" value={`$${totalAR.toLocaleString()}`} change="" trend="down" icon={Clock} iconColor="bg-amber-50 text-amber-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Revenue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Monthly Revenue</h2>
          <p className="text-xs text-slate-400 mb-5">Last 6 months</p>
          {monthlyRevenue.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">No data yet</div>
          ) : (
            <div className="flex items-end gap-3 h-48">
              {monthlyRevenue.map((d, i) => {
                const heightPct = (d.revenue / maxRevenue) * 100;
                const isLatest = i === monthlyRevenue.length - 1;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-700">${(d.revenue / 1000).toFixed(1)}k</span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isLatest ? "bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-sm shadow-cyan-500/30" : "bg-cyan-500/70 hover:bg-cyan-500"
                      }`}
                      style={{ height: `${(heightPct / 100) * 160}px` }}
                    />
                    <span className={`text-xs ${isLatest ? "font-semibold text-cyan-700" : "text-slate-500"}`}>{d.month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Production vs Collections */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Production vs Collections</h2>
          <p className="text-xs text-slate-400 mb-5">Side-by-side comparison</p>
          {prodVsCollections.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">No data yet</div>
          ) : (
            <>
              <div className="flex items-end gap-3 h-48">
                {prodVsCollections.map((d) => {
                  const prodHeight = (d.production / maxProd) * 160;
                  const collHeight = (d.collections / maxProd) * 160;
                  return (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-700">
                        {d.production > 0 ? ((d.collections / d.production) * 100).toFixed(0) : 0}%
                      </span>
                      <div className="w-full flex gap-1">
                        <div className="flex-1 rounded-t-lg bg-cyan-500" style={{ height: `${prodHeight}px` }} />
                        <div className="flex-1 rounded-t-lg bg-emerald-500" style={{ height: `${collHeight}px` }} />
                      </div>
                      <span className="text-xs text-slate-500">{d.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-cyan-500" />
                  <span className="text-slate-500">Production</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-emerald-500" />
                  <span className="text-slate-500">Collections</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Accounts Receivable */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Accounts Receivable</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Total Outstanding</p>
            <p className="font-bold text-slate-900">${totalAR.toLocaleString()}</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {arAging.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {arAging.map((bucket) => (
                <div key={bucket.bucket} className={`rounded-xl ${bucket.bgColor} p-4`}>
                  <p className={`text-2xl font-bold ${bucket.textColor}`}>${bucket.amount.toLocaleString()}</p>
                  <p className={`text-xs font-medium ${bucket.textColor} opacity-80`}>{bucket.bucket}</p>
                  <div className="mt-3 h-2 rounded-full bg-white/60 overflow-hidden">
                    <div className={`h-full rounded-full ${bucket.color}`} style={{ width: `${bucket.percent}%` }} />
                  </div>
                  <p className={`text-[10px] ${bucket.textColor} opacity-60 mt-1`}>{bucket.percent}% of total</p>
                </div>
              ))}
            </div>
          )}

          {topOutstandingAccounts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Top Outstanding Accounts</h3>
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Patient</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Insurance</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Amount</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {topOutstandingAccounts.map((acct) => (
                      <tr key={acct.name} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{acct.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{acct.insurance}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">${acct.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            acct.days > 90 ? "bg-red-100 text-red-700" :
                            acct.days > 60 ? "bg-orange-100 text-orange-700" :
                            acct.days > 30 ? "bg-amber-100 text-amber-700" :
                            "bg-emerald-100 text-emerald-700"
                          }`}>
                            {acct.days} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {arAging.length === 0 && topOutstandingAccounts.length === 0 && (
            <div className="text-center py-8 text-sm text-slate-400">
              No outstanding accounts receivable
            </div>
          )}
        </div>
      </div>

      {/* Accounts Payable (static until expense tracking is built) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Accounts Payable</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400">Outstanding</p>
              <p className="font-bold text-slate-900">${totalAPOutstanding.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="rounded-xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-sm shadow-cyan-500/25">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">Automated Invoice Processing</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Coming soon: Forward invoices to your practice email and One Engine will automatically extract vendor details,
                  amounts, and due dates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
