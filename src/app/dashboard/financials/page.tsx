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
  Target,
  Receipt,
  BadgeDollarSign,
  ChevronRight,
  Eye,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

// ── Period selector options ──
type Period = "daily" | "weekly" | "monthly" | "yearly";

// ── Demo data: Monthly revenue (last 6 months) ──
const monthlyRevenue = [
  { month: "Sep", revenue: 38200 },
  { month: "Oct", revenue: 41500 },
  { month: "Nov", revenue: 39800 },
  { month: "Dec", revenue: 44100 },
  { month: "Jan", revenue: 46300 },
  { month: "Feb", revenue: 47850 },
];

// ── Demo data: Production vs Collections (last 6 months) ──
const prodVsCollections = [
  { month: "Sep", production: 38200, collections: 36100 },
  { month: "Oct", production: 41500, collections: 39200 },
  { month: "Nov", production: 39800, collections: 38500 },
  { month: "Dec", production: 44100, collections: 42300 },
  { month: "Jan", production: 46300, collections: 44100 },
  { month: "Feb", production: 47850, collections: 43250 },
];

// ── Demo data: P&L ──
const revenueItems = [
  { label: "Gross Production", amount: 52400, prior: 48200, category: "revenue" as const },
  { label: "Adjustments / Write-offs", amount: -4550, prior: -3800, category: "revenue" as const },
  { label: "Net Collections", amount: 43250, prior: 40900, category: "revenue" as const },
];

const expenseItems = [
  { label: "Payroll & Benefits", amount: 18500, prior: 18200 },
  { label: "Dental Supplies", amount: 3200, prior: 2950 },
  { label: "Lab Fees", amount: 4800, prior: 4500 },
  { label: "Rent / Lease", amount: 5500, prior: 5500 },
  { label: "Equipment Leases", amount: 1200, prior: 1200 },
  { label: "Insurance (Practice)", amount: 800, prior: 800 },
  { label: "Marketing", amount: 1500, prior: 1200 },
  { label: "Utilities", amount: 650, prior: 620 },
  { label: "Other / Miscellaneous", amount: 450, prior: 380 },
];

// ── Demo data: Daily collections breakdown ──
const dailyCollections = [
  { source: "Insurance Payments", amount: 3420, color: "bg-cyan-500" },
  { source: "Patient Co-pays", amount: 1850, color: "bg-emerald-500" },
  { source: "Credit Card Payments", amount: 980, color: "bg-violet-500" },
  { source: "Cash / Check", amount: 350, color: "bg-amber-500" },
];

// ── Demo data: AR Aging ──
const arAging = [
  { bucket: "0-30 days", amount: 8200, color: "bg-emerald-500", bgColor: "bg-emerald-50", textColor: "text-emerald-700", percent: 52 },
  { bucket: "31-60 days", amount: 4200, color: "bg-amber-500", bgColor: "bg-amber-50", textColor: "text-amber-700", percent: 27 },
  { bucket: "61-90 days", amount: 2100, color: "bg-orange-500", bgColor: "bg-orange-50", textColor: "text-orange-700", percent: 13 },
  { bucket: "90+ days", amount: 1280, color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-700", percent: 8 },
];

const topOutstandingAccounts = [
  { name: "Robert Kim", amount: 2450, days: 42, insurance: "MetLife" },
  { name: "David Park", amount: 1850, days: 67, insurance: "Aetna" },
  { name: "Jennifer Liu", amount: 1200, days: 95, insurance: "Guardian" },
  { name: "Tom Baker", amount: 980, days: 28, insurance: "Delta Dental" },
  { name: "Amanda Patel", amount: 750, days: 35, insurance: "Cigna" },
];

// ── Demo data: Accounts Payable ──
const accountsPayable = [
  { vendor: "Henry Schein", description: "Dental Supplies - Jan", amount: 2340, dueDate: "Feb 15, 2025", status: "due_soon" as const },
  { vendor: "Patterson Dental", description: "Lab Fees - Crown/Bridge", amount: 1850, dueDate: "Feb 20, 2025", status: "upcoming" as const },
  { vendor: "NV Energy", description: "Utilities - January", amount: 650, dueDate: "Feb 10, 2025", status: "overdue" as const },
  { vendor: "Digital Ocean", description: "Cloud Hosting - Feb", amount: 49, dueDate: "Feb 1, 2025", status: "paid" as const },
  { vendor: "ADP", description: "Payroll Service - Feb", amount: 245, dueDate: "Feb 5, 2025", status: "paid" as const },
];

const apStatusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  due_soon: { label: "Due Soon", color: "bg-amber-100 text-amber-700" },
  upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-700" },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700" },
};

export default function FinancialsPage() {
  const [period, setPeriod] = useState<Period>("monthly");

  const totalExpenses = expenseItems.reduce((sum, e) => sum + e.amount, 0);
  const totalExpensesPrior = expenseItems.reduce((sum, e) => sum + e.prior, 0);
  const netIncome = 43250 - totalExpenses;
  const netIncomePrior = 40900 - totalExpensesPrior;
  const netIncomeChange = ((netIncome - netIncomePrior) / netIncomePrior * 100).toFixed(1);

  const todayCollectionsTotal = dailyCollections.reduce((sum, d) => sum + d.amount, 0);
  const dailyTarget = 7500;

  const totalAR = arAging.reduce((sum, a) => sum + a.amount, 0);
  const totalAPOutstanding = accountsPayable.filter(a => a.status !== "paid").reduce((sum, a) => sum + a.amount, 0);

  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.revenue));
  const maxProd = Math.max(...prodVsCollections.map((d) => Math.max(d.production, d.collections)));

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
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

      {/* ── AI Insight Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-cyan-700 to-slate-800 p-6 text-white shadow-lg shadow-cyan-600/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6TTAgMzR2MmgydjJIMHYtMnptMC00aDJ2Mkgwdi0yem0wLThoMnYySDB2LTJ6bTAtNGgydjJIMHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide uppercase opacity-90">One Engine Financial Analysis</h2>
              <p className="text-xs opacity-60">Updated 2 minutes ago</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-95 max-w-3xl">
            Revenue is trending <span className="font-bold text-emerald-300">8.3% above last month</span>. Collection rate of{" "}
            <span className="font-bold text-emerald-300">96.1%</span> is excellent - well above the 95% industry benchmark.
            Watch accounts receivable aging - <span className="font-bold text-amber-300">$4,200 has moved into 60+ days</span>.
            Three accounts over 90 days need immediate attention. One Engine has drafted collection follow-up messages and
            flagged two high-risk no-show patients for tomorrow.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <ArrowUpRight className="h-3 w-3 text-emerald-300" />
              Revenue +8.3%
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <CheckCircle2 className="h-3 w-3 text-emerald-300" />
              96.1% Collection Rate
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <AlertTriangle className="h-3 w-3 text-amber-300" />
              3 Aging Accounts
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue (MTD)"
          value="$47,850"
          change="+8.3% vs prior month"
          trend="up"
          icon={DollarSign}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Collections"
          value="$43,250"
          change="+5.7% vs prior month"
          trend="up"
          icon={Wallet}
          iconColor="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          title="Net Income"
          value={`$${netIncome.toLocaleString()}`}
          change={`${Number(netIncomeChange) >= 0 ? "+" : ""}${netIncomeChange}% vs prior month`}
          trend="up"
          icon={TrendingUp}
          iconColor="bg-violet-50 text-violet-600"
        />
        <StatCard
          title="Production / Hour"
          value="$285"
          change="+$18 vs prior month"
          trend="up"
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* ── P&L Statement ── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Profit & Loss Statement</h2>
          </div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {period === "daily" ? "Today" : period === "weekly" ? "This Week" : period === "monthly" ? "February 2025" : "YTD 2025"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Item</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Current</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Prior Period</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue Section */}
              <tr>
                <td colSpan={4} className="px-6 pt-4 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Revenue</span>
                </td>
              </tr>
              {revenueItems.map((item) => {
                const change = ((item.amount - item.prior) / Math.abs(item.prior) * 100);
                const isPositive = item.label === "Adjustments / Write-offs" ? change < 0 : change > 0;
                return (
                  <tr key={item.label} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-sm text-slate-700">{item.label}</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900 text-right">
                      {item.amount < 0 ? `($${Math.abs(item.amount).toLocaleString()})` : `$${item.amount.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-500 text-right">
                      {item.prior < 0 ? `($${Math.abs(item.prior).toLocaleString()})` : `$${item.prior.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(change).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Expenses Section */}
              <tr>
                <td colSpan={4} className="px-6 pt-6 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-500">Expenses</span>
                </td>
              </tr>
              {expenseItems.map((item) => {
                const change = ((item.amount - item.prior) / item.prior * 100);
                const isIncrease = change > 0;
                return (
                  <tr key={item.label} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-sm text-slate-700">{item.label}</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900 text-right">${item.amount.toLocaleString()}</td>
                    <td className="px-6 py-3 text-sm text-slate-500 text-right">${item.prior.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right">
                      {change !== 0 ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${isIncrease ? "text-red-500" : "text-emerald-600"}`}>
                          {isIncrease ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(change).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">--</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Totals */}
              <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                <td className="px-6 py-3 text-sm font-bold text-slate-900">Total Expenses</td>
                <td className="px-6 py-3 text-sm font-bold text-slate-900 text-right">${totalExpenses.toLocaleString()}</td>
                <td className="px-6 py-3 text-sm font-medium text-slate-500 text-right">${totalExpensesPrior.toLocaleString()}</td>
                <td className="px-6 py-3 text-right">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${totalExpenses > totalExpensesPrior ? "text-red-500" : "text-emerald-600"}`}>
                    {totalExpenses > totalExpensesPrior ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(((totalExpenses - totalExpensesPrior) / totalExpensesPrior) * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
              <tr className="bg-gradient-to-r from-emerald-50/80 to-cyan-50/80">
                <td className="px-6 py-4 text-sm font-bold text-emerald-800">Net Income</td>
                <td className="px-6 py-4 text-lg font-bold text-emerald-700 text-right">${netIncome.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-500 text-right">${netIncomePrior.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                    <ArrowUpRight className="h-4 w-4" />
                    {netIncomeChange}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Trending Charts ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Bar Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Monthly Revenue</h2>
          <p className="text-xs text-slate-400 mb-5">Last 6 months</p>
          <div className="flex items-end gap-3 h-48">
            {monthlyRevenue.map((d, i) => {
              const heightPct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
              const isLatest = i === monthlyRevenue.length - 1;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-700">
                    ${(d.revenue / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full relative">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isLatest
                          ? "bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-sm shadow-cyan-500/30"
                          : "bg-cyan-500/70 hover:bg-cyan-500"
                      }`}
                      style={{ height: `${(heightPct / 100) * 160}px` }}
                    />
                  </div>
                  <span className={`text-xs ${isLatest ? "font-semibold text-cyan-700" : "text-slate-500"}`}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Production vs Collections */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Production vs Collections</h2>
          <p className="text-xs text-slate-400 mb-5">Side-by-side comparison</p>
          <div className="flex items-end gap-3 h-48">
            {prodVsCollections.map((d) => {
              const prodHeight = maxProd > 0 ? (d.production / maxProd) * 160 : 0;
              const collHeight = maxProd > 0 ? (d.collections / maxProd) * 160 : 0;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-700">
                    {((d.collections / d.production) * 100).toFixed(0)}%
                  </span>
                  <div className="w-full flex gap-1">
                    <div
                      className="flex-1 rounded-t-lg bg-cyan-500"
                      style={{ height: `${prodHeight}px` }}
                    />
                    <div
                      className="flex-1 rounded-t-lg bg-emerald-500"
                      style={{ height: `${collHeight}px` }}
                    />
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
        </div>
      </div>

      {/* ── Bookings & Shows + Daily Collections ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bookings & Shows */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Bookings & Shows</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Today Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-cyan-50 p-4 text-center">
                <p className="text-2xl font-bold text-cyan-700">8</p>
                <p className="text-xs font-medium text-cyan-600">Scheduled</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700">7</p>
                <p className="text-xs font-medium text-emerald-600">Showed</p>
              </div>
              <div className="rounded-xl bg-red-50 p-4 text-center">
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-xs font-medium text-red-500">No-Show</p>
              </div>
            </div>

            {/* Show Rate */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Today&apos;s Show Rate</span>
                <span className="font-bold text-slate-900">87.5%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: "87.5%" }} />
              </div>
            </div>

            {/* Monthly Show Rate Trend */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Monthly Show Rate Trend</p>
              <div className="flex items-end gap-2 h-16">
                {[91, 88, 93, 87, 90, 88].map((rate, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-slate-500">{rate}%</span>
                    <div
                      className="w-full rounded-t bg-cyan-400/80"
                      style={{ height: `${((rate - 80) / 20) * 48}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Flag */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                  <Zap className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">One Engine flagged 2 patients with high no-show risk for tomorrow</p>
                  <p className="text-xs text-amber-600 mt-1">Automated confirmation messages have been queued. Consider double-booking the 2:00 PM slot.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Collections */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Today&apos;s Collections</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Running Total */}
            <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Running Total</span>
                <span className="text-xs text-slate-400">Target: ${dailyTarget.toLocaleString()}</span>
              </div>
              <p className="text-3xl font-bold">${todayCollectionsTotal.toLocaleString()}</p>
              <div className="mt-3 h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
                  style={{ width: `${Math.min((todayCollectionsTotal / dailyTarget) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {((todayCollectionsTotal / dailyTarget) * 100).toFixed(0)}% of daily target
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              {dailyCollections.map((item) => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-700">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${(item.amount / todayCollectionsTotal) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-16 text-right">${item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-lg font-bold text-slate-900">12</p>
                <p className="text-xs text-slate-500">Transactions</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-lg font-bold text-slate-900">$548</p>
                <p className="text-xs text-slate-500">Avg Transaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Accounts Receivable ── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Accounts Receivable</h2>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right">
              <p className="text-xs text-slate-400">Total Outstanding</p>
              <p className="font-bold text-slate-900">${totalAR.toLocaleString()}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right">
              <p className="text-xs text-slate-400">Avg Days in AR</p>
              <p className="font-bold text-slate-900">24 days</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* AR Aging Buckets */}
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

          {/* Top Outstanding Accounts */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Top Outstanding Accounts</h3>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Patient</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Insurance</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Amount</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Days Outstanding</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {topOutstandingAccounts.map((acct) => (
                    <tr key={acct.name} className="hover:bg-slate-50/50 transition-colors">
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
                      <td className="px-4 py-3 text-right">
                        <button className="text-xs font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1 ml-auto">
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insight for AR */}
          <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100">
                <Zap className="h-4 w-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-800">3 accounts over 90 days need attention</p>
                <p className="text-xs text-cyan-600 mt-1">
                  One Engine has drafted collection follow-up messages for Jennifer Liu ($1,200 / 95 days),
                  and two additional accounts. Review and approve in the{" "}
                  <button className="underline font-medium hover:text-cyan-700">Outreach Queue</button>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Accounts Payable ── */}
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
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Upload className="h-4 w-4" />
              Upload Invoice
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Bills Table */}
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Vendor</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Description</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Due Date</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {accountsPayable.map((bill) => {
                  const config = apStatusConfig[bill.status];
                  return (
                    <tr key={bill.vendor} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                            <Building2 className="h-4 w-4 text-slate-500" />
                          </div>
                          <span className="text-sm font-medium text-slate-900">{bill.vendor}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{bill.description}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">${bill.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{bill.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {bill.status !== "paid" ? (
                          <button className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors">
                            <CheckCircle2 className="h-3 w-3" />
                            Approve
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Scan / Email Invoices Feature Card */}
          <div className="rounded-xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-sm shadow-cyan-500/25">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">Automated Invoice Processing</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Coming soon: Forward invoices to{" "}
                  <span className="font-mono text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">ap@akultimatedental.com</span>
                  {" "}and One Engine will automatically extract vendor details, amounts, and due dates. Invoices will appear here for your review and approval.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                    <Zap className="h-3 w-3 text-cyan-500" />
                    AI-Powered OCR
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    Auto-Categorize
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                    <Users className="h-3 w-3 text-violet-500" />
                    Approval Workflow
                  </span>
                </div>
              </div>
              <button className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Learn More
                <ChevronRight className="inline h-3 w-3 ml-1" />
              </button>
            </div>
          </div>

          {/* Bill Approval Workflow Concept */}
          <div className="rounded-xl bg-slate-50 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Approval Workflow</h3>
            <div className="flex items-center gap-2">
              {[
                { step: "Invoice Received", active: true },
                { step: "AI Reviewed", active: true },
                { step: "Owner Approval", active: false },
                { step: "Scheduled", active: false },
                { step: "Paid", active: false },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center gap-2 flex-1">
                  <div className={`flex-1 rounded-lg p-2.5 text-center text-xs font-medium transition-colors ${
                    s.active
                      ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                      : "bg-white text-slate-400 border border-slate-200"
                  }`}>
                    {s.step}
                  </div>
                  {i < 4 && (
                    <ChevronRight className={`h-4 w-4 shrink-0 ${s.active ? "text-cyan-400" : "text-slate-300"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
