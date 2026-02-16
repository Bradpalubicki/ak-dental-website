"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  Zap,
  CreditCard,
  FileText,
  Mail,
  AlertTriangle,
  CheckCircle2,
  BadgeDollarSign,
  ChevronRight,
  Download,
  RefreshCw,
  Activity,
  PieChart,
  BarChart3,
  Target,
  Brain,
  Receipt,
  Building2,
  CircleDollarSign,
  Banknote,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  TrendLine,
  TrendArea,
  BarChartFull,
  DonutChart,
  ProgressBar,
} from "@/components/dashboard/chart-components";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

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

interface ExpenseItem {
  label: string;
  amount: number;
  category: string;
  pctOfRev: number;
}

interface APItem {
  vendor: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "upcoming" | "due_soon" | "paid" | "overdue";
  daysUntil: number;
}

interface CashFlowItem {
  [key: string]: string | number;
  name: string;
  inflow: number;
  outflow: number;
  net: number;
}

interface ExpenseCategoryItem {
  name: string;
  value: number;
  color: string;
}

interface DailyCollectionItem {
  [key: string]: unknown;
  name: string;
  amount: number;
  target: number;
}

interface CollectionRateTrendItem {
  [key: string]: unknown;
  name: string;
  rate: number;
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
  expenseItems: ExpenseItem[];
  accountsPayable: APItem[];
  cashFlowData: CashFlowItem[];
  expenseByCategory: ExpenseCategoryItem[];
  dailyCollections: DailyCollectionItem[];
  collectionRateTrend: CollectionRateTrendItem[];
}

/* ================================================================== */
/*  Static Data (daily collections, collection rate - from daily_metrics future) */
/* ================================================================== */

const apStatusConfig: Record<string, { label: string; color: string; border: string }> = {
  paid: { label: "Paid", color: "bg-emerald-50 text-emerald-700", border: "border-emerald-200" },
  due_soon: { label: "Due Soon", color: "bg-amber-50 text-amber-700", border: "border-amber-200" },
  upcoming: { label: "Upcoming", color: "bg-blue-50 text-blue-700", border: "border-blue-200" },
  overdue: { label: "Overdue", color: "bg-red-50 text-red-700", border: "border-red-200" },
};

/* dailyCollections and collectionRateTrend are now passed as props from server */

/* ================================================================== */
/*  Helper Components                                                  */
/* ================================================================== */

function AiInsight({
  children,
  actions,
  type = "default",
}: {
  children: React.ReactNode;
  actions?: { label: string; href?: string }[];
  type?: "default" | "prediction" | "recommendation" | "alert";
}) {
  const styles = {
    default: {
      border: "border-purple-200/80",
      gradient: "from-purple-50/80 via-indigo-50/60 to-purple-50/80",
      iconGradient: "from-purple-500 to-indigo-600",
      label: "One Engine Insight",
      labelColor: "text-purple-500",
      actionBg: "bg-purple-600 hover:bg-purple-700",
    },
    prediction: {
      border: "border-amber-300/80",
      gradient: "from-amber-50/80 via-orange-50/60 to-amber-50/80",
      iconGradient: "from-amber-500 to-orange-600",
      label: "One Engine Prediction",
      labelColor: "text-amber-600",
      actionBg: "bg-amber-600 hover:bg-amber-700",
    },
    recommendation: {
      border: "border-emerald-300/80",
      gradient: "from-emerald-50/80 via-teal-50/60 to-emerald-50/80",
      iconGradient: "from-emerald-500 to-teal-600",
      label: "One Engine Recommendation",
      labelColor: "text-emerald-600",
      actionBg: "bg-emerald-600 hover:bg-emerald-700",
    },
    alert: {
      border: "border-red-300/80",
      gradient: "from-red-50/80 via-rose-50/60 to-red-50/80",
      iconGradient: "from-red-500 to-rose-600",
      label: "One Engine Alert",
      labelColor: "text-red-600",
      actionBg: "bg-red-600 hover:bg-red-700",
    },
  };
  const s = styles[type];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${s.border} bg-gradient-to-r ${s.gradient} p-4 shadow-sm transition-all duration-300 hover:shadow-md`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.iconGradient} shadow-md`}
        >
          {type === "prediction" ? (
            <Zap className="h-4 w-4 text-white" />
          ) : type === "alert" ? (
            <AlertTriangle className="h-4 w-4 text-white" />
          ) : (
            <Brain className="h-4 w-4 text-white" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${s.labelColor} mb-1`}>
            {s.label}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{children}</p>
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-2.5">
              {actions.map((action) =>
                action.href ? (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`inline-flex items-center gap-1 rounded-lg ${s.actionBg} px-3 py-1.5 text-xs font-medium text-white transition-colors shadow-sm`}
                  >
                    {action.label}
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <button
                    key={action.label}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/80 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white transition-colors backdrop-blur-sm"
                  >
                    {action.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SyncIndicator() {
  const [lastSync, setLastSync] = useState(new Date());
  const [syncing, setSyncing] = useState(false);
  const [displayTime, setDisplayTime] = useState("Just now");

  useEffect(() => {
    function tick() {
      const diff = Math.floor((Date.now() - lastSync.getTime()) / 60000);
      setDisplayTime(diff < 1 ? "Just now" : `${diff}m ago`);
    }
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [lastSync]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium text-emerald-700">Synced</span>
        <span className="text-emerald-600">{displayTime}</span>
      </div>
      <button
        onClick={() => {
          setSyncing(true);
          setTimeout(() => {
            setLastSync(new Date());
            setSyncing(false);
          }, 1500);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
        title="Refresh data"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}

function GaugeRing({
  value,
  label,
  color,
  size = 80,
  suffix = "%",
}: {
  value: number;
  label: string;
  color: string;
  size?: number;
  suffix?: string;
}) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90 origin-center"
          fill="#1e293b"
          fontSize="13"
          fontWeight="700"
        >
          {value}{suffix}
        </text>
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}

function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================================================================== */
/*  Tab config                                                         */
/* ================================================================== */

const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "pnl", label: "P&L Statement", icon: FileText },
  { id: "ar", label: "A/R & Collections", icon: BadgeDollarSign },
  { id: "ap", label: "A/P & Expenses", icon: Receipt },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function FinancialsClient({ data }: { data: FinancialsData }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [dateRange, setDateRange] = useState("this-month");
  const {
    monthlyRevenue,
    prodVsCollections,
    arAging,
    topOutstandingAccounts,
    totalAR,
    mtdProduction,
    mtdCollections,
    netIncome,
    expenseItems,
    accountsPayable,
    cashFlowData,
    expenseByCategory,
    dailyCollections,
    collectionRateTrend,
  } = data;

  const totalExpenses = expenseItems.reduce((sum, e) => sum + e.amount, 0);
  const collectionRate = mtdProduction > 0 ? ((mtdCollections / mtdProduction) * 100).toFixed(1) : "0";
  const profitMargin = mtdCollections > 0 ? ((netIncome / mtdCollections) * 100).toFixed(1) : "0";
  const totalAPOutstanding = accountsPayable.reduce((sum, a) => sum + a.amount, 0);
  const apDueSoon = accountsPayable.filter((a) => a.status === "due_soon");
  const avgDailyCollections = dailyCollections.reduce((s, d) => s + d.amount, 0) / dailyCollections.length;
  const daysOnTarget = dailyCollections.filter((d) => d.amount >= d.target).length;

  // Recharts-compatible data
  const revenueChartData = monthlyRevenue.map((d) => ({
    name: d.month,
    revenue: d.revenue,
  }));

  const prodCollChartData = prodVsCollections.map((d) => ({
    name: d.month,
    production: d.production,
    collections: d.collections,
    rate: d.production > 0 ? Math.round((d.collections / d.production) * 100) : 0,
  }));

  const handleExportAR = useCallback(() => {
    exportToCSV(
      "accounts-receivable",
      ["Patient", "Insurance", "Amount", "Aging Days"],
      topOutstandingAccounts.map((a) => [
        a.name,
        a.insurance,
        `$${a.amount.toLocaleString()}`,
        String(a.days),
      ])
    );
  }, [topOutstandingAccounts]);

  const handleExportPnL = useCallback(() => {
    const rows: string[][] = [
      ["REVENUE", "", ""],
      ["Gross Production (MTD)", `$${mtdProduction.toLocaleString()}`, "100%"],
      [
        "Collections (MTD)",
        `$${mtdCollections.toLocaleString()}`,
        `${collectionRate}%`,
      ],
      ["", "", ""],
      ["EXPENSES", "", ""],
      ...expenseItems.map((e) => [
        e.label,
        `$${e.amount.toLocaleString()}`,
        `${e.pctOfRev}%`,
      ]),
      ["Total Expenses", `$${totalExpenses.toLocaleString()}`, ""],
      ["", "", ""],
      ["NET INCOME", `$${netIncome.toLocaleString()}`, `${profitMargin}%`],
    ];
    exportToCSV("profit-and-loss", ["Item", "Amount", "% of Rev"], rows);
  }, [mtdProduction, mtdCollections, collectionRate, expenseItems, totalExpenses, netIncome, profitMargin]);

  const handleExportAP = useCallback(() => {
    exportToCSV(
      "accounts-payable",
      ["Vendor", "Description", "Amount", "Due Date", "Status"],
      accountsPayable.map((a) => [
        a.vendor,
        a.description,
        `$${a.amount.toLocaleString()}`,
        a.dueDate,
        a.status,
      ])
    );
  }, [accountsPayable]);

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/*  Header                                                       */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Financial Command Center
          </h1>
          <p className="text-sm text-slate-500">
            Complete practice financial health at a glance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SyncIndicator />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  AI Insight Banner                                            */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-cyan-700 to-slate-800 p-6 text-white shadow-lg shadow-cyan-600/20">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide uppercase opacity-90">
                One Engine Financial Analysis
              </h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-95 max-w-3xl">
            {mtdProduction > 0 ? (
              <>
                MTD production at{" "}
                <span className="font-bold text-emerald-300">
                  ${mtdProduction.toLocaleString()}
                </span>
                . Collection rate of{" "}
                <span className="font-bold text-emerald-300">
                  {collectionRate}%
                </span>
                .
                {totalAR > 0 && (
                  <>
                    {" "}
                    Total accounts receivable:{" "}
                    <span className="font-bold text-amber-300">
                      ${totalAR.toLocaleString()}
                    </span>
                    .
                  </>
                )}{" "}
                Net profit margin:{" "}
                <span className="font-bold text-emerald-300">
                  {profitMargin}%
                </span>
                . Operating expenses at{" "}
                <span className="font-bold">
                  ${totalExpenses.toLocaleString()}
                </span>{" "}
                ({((totalExpenses / (mtdCollections || 1)) * 100).toFixed(1)}%
                of collections).
              </>
            ) : (
              <>
                Financial data will populate as practice activity is recorded.
              </>
            )}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  KPI STRIP                                                    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Revenue (MTD)"
          value={`$${mtdProduction.toLocaleString()}`}
          change="+8.2% vs last month"
          trend="up"
          icon={DollarSign}
          iconColor="bg-emerald-50 text-emerald-600"
          sparkData={monthlyRevenue.map((d) => d.revenue)}
          sparkColor="#059669"
          accentColor="#059669"
        />
        <StatCard
          title="Collections"
          value={`$${mtdCollections.toLocaleString()}`}
          change={`${collectionRate}% rate`}
          trend={Number(collectionRate) >= 95 ? "up" : "down"}
          icon={Wallet}
          iconColor="bg-cyan-50 text-cyan-600"
          sparkData={prodVsCollections.map((d) => d.collections)}
          sparkColor="#0891b2"
          accentColor="#0891b2"
        />
        <StatCard
          title="Net Income"
          value={`$${netIncome.toLocaleString()}`}
          change={`${profitMargin}% margin`}
          trend="up"
          icon={TrendingUp}
          iconColor="bg-violet-50 text-violet-600"
          sparkData={cashFlowData.map((d) => d.net)}
          sparkColor="#7c3aed"
          accentColor="#7c3aed"
        />
        <StatCard
          title="Total A/R"
          value={`$${totalAR.toLocaleString()}`}
          change={arAging.find((a) => a.bucket === "90+ days")?.amount ? `$${arAging.find((a) => a.bucket === "90+ days")?.amount.toLocaleString()} 90+` : "All current"}
          trend={totalAR > 0 ? "down" : "up"}
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
          accentColor="#d97706"
          pulse={totalAR > 10000}
        />
        <StatCard
          title="Expenses (MTD)"
          value={`$${totalExpenses.toLocaleString()}`}
          change={`${((totalExpenses / (mtdCollections || 1)) * 100).toFixed(0)}% of revenue`}
          trend="neutral"
          icon={Receipt}
          iconColor="bg-rose-50 text-rose-600"
          accentColor="#e11d48"
        />
        <StatCard
          title="A/P Outstanding"
          value={`$${totalAPOutstanding.toLocaleString()}`}
          change={apDueSoon.length > 0 ? `${apDueSoon.length} due soon` : "All current"}
          trend={apDueSoon.length > 0 ? "down" : "up"}
          icon={CreditCard}
          iconColor="bg-blue-50 text-blue-600"
          accentColor="#2563eb"
        />
      </div>

      {/* ============================================================ */}
      {/*  TAB NAVIGATION                                               */}
      {/* ============================================================ */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 ${
                  isActive
                    ? "border-cyan-600 text-cyan-700 bg-cyan-50/30"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ============================================================ */}
      {/*  OVERVIEW TAB                                                 */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Revenue + Production vs Collections */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Monthly Revenue */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Monthly Revenue
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Last 6 months</span>
              </div>
              <div className="p-4">
                {revenueChartData.length > 0 ? (
                  <BarChartFull
                    data={revenueChartData}
                    bars={[{ key: "revenue", color: "#0891b2", label: "Revenue" }]}
                    height={220}
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                    No data yet
                  </div>
                )}
              </div>
            </div>

            {/* Production vs Collections */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Production vs Collections
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                    <span className="text-slate-500">Production</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-500">Collections</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                {prodCollChartData.length > 0 ? (
                  <BarChartFull
                    data={prodCollChartData}
                    bars={[
                      { key: "production", color: "#0891b2", label: "Production" },
                      { key: "collections", color: "#059669", label: "Collections" },
                    ]}
                    height={220}
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                    No data yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cash Flow + Collection Rate */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Cash Flow */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-violet-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Cash Flow
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Last 5 months</span>
              </div>
              <div className="p-4">
                <TrendArea
                  data={cashFlowData}
                  areas={[
                    { key: "inflow", color: "#059669", label: "Inflow" },
                    { key: "outflow", color: "#dc2626", label: "Outflow" },
                  ]}
                  height={200}
                />
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-0.5">
                      Avg Inflow
                    </p>
                    <p className="text-sm font-bold text-emerald-700">
                      ${Math.round(cashFlowData.reduce((s, d) => s + d.inflow, 0) / cashFlowData.length / 1000)}K
                    </p>
                  </div>
                  <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600 mb-0.5">
                      Avg Outflow
                    </p>
                    <p className="text-sm font-bold text-red-700">
                      ${Math.round(cashFlowData.reduce((s, d) => s + d.outflow, 0) / cashFlowData.length / 1000)}K
                    </p>
                  </div>
                  <div className="rounded-lg bg-violet-50 border border-violet-200 p-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 mb-0.5">
                      Avg Net
                    </p>
                    <p className="text-sm font-bold text-violet-700">
                      ${Math.round(cashFlowData.reduce((s, d) => s + d.net, 0) / cashFlowData.length / 1000)}K
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Rate Trend */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Collection Rate Trend
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  Target: &ge; 95%
                </span>
              </div>
              <div className="p-4">
                <TrendLine
                  data={collectionRateTrend}
                  lines={[{ key: "rate", color: "#059669", label: "Collection Rate %" }]}
                  height={200}
                />
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight type="recommendation">
                  Your collection rate averaged 93.5% over 6 months. Implementing
                  same-day claim submission could boost this to 96%+, recovering an
                  estimated $2,800/month in delayed collections.
                </AiInsight>
              </div>
            </div>
          </div>

          {/* Quick AR + Daily Collections */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* AR Summary */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    A/R Aging Summary
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("ar")}
                  className="text-xs font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                >
                  Details <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {arAging.length > 0 ? (
                  arAging.map((bucket) => (
                    <div key={bucket.bucket} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">
                          {bucket.bucket}
                        </span>
                        <span className="text-xs font-semibold text-slate-900">
                          ${bucket.amount.toLocaleString()}
                        </span>
                      </div>
                      <ProgressBar
                        value={bucket.percent}
                        max={100}
                        color={bucket.color}
                        showLabel={false}
                        size="sm"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-sm text-slate-400">
                    No outstanding A/R
                  </p>
                )}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Total A/R
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    ${totalAR.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Collections */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Daily Collections This Week
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">
                    Target: $7,500/day
                  </span>
                  <span className={`font-medium ${daysOnTarget >= 3 ? "text-emerald-600" : "text-amber-600"}`}>
                    {daysOnTarget}/{dailyCollections.length} days on target
                  </span>
                </div>
              </div>
              <div className="p-4">
                <BarChartFull
                  data={dailyCollections}
                  bars={[
                    { key: "amount", color: "#059669", label: "Collected" },
                    { key: "target", color: "#e2e8f0", label: "Target" },
                  ]}
                  height={180}
                />
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-0.5">
                      Week Total
                    </p>
                    <p className="text-sm font-bold text-emerald-700">
                      ${dailyCollections.reduce((s, d) => s + d.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                      Daily Avg
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      ${Math.round(avgDailyCollections).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                      vs Target
                    </p>
                    <p className={`text-sm font-bold ${avgDailyCollections >= 7500 ? "text-emerald-700" : "text-amber-700"}`}>
                      {avgDailyCollections >= 7500 ? "+" : ""}
                      {((avgDailyCollections / 7500 - 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  P&L STATEMENT TAB                                            */}
      {/* ============================================================ */}
      {activeTab === "pnl" && (
        <div className="space-y-6">
          {/* Gauges Row */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center">
              <GaugeRing
                value={Number(collectionRate)}
                label="Collection Rate"
                color="#059669"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center">
              <GaugeRing
                value={Number(profitMargin)}
                label="Profit Margin"
                color="#7c3aed"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center">
              <GaugeRing
                value={Math.round((totalExpenses / (mtdCollections || 1)) * 100)}
                label="Expense Ratio"
                color="#dc2626"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center">
              <GaugeRing
                value={Math.min(Math.round((mtdCollections / 75000) * 100), 100)}
                label="Revenue Goal"
                color="#0891b2"
              />
            </div>
          </div>

          {/* P&L Statement */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Profit & Loss Statement
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    Month-to-Date
                  </span>
                  <button
                    onClick={handleExportPnL}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Export
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {/* Revenue Section */}
                <div className="px-6 py-3 bg-emerald-50/30">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Revenue
                  </p>
                </div>
                <div className="px-6 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    Gross Production (MTD)
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    ${mtdProduction.toLocaleString()}
                  </span>
                </div>
                <div className="px-6 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    Adjustments / Write-offs
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    -${Math.round(mtdProduction * 0.05).toLocaleString()}
                  </span>
                </div>
                <div className="px-6 py-3 flex items-center justify-between bg-emerald-50/50">
                  <span className="text-sm font-semibold text-emerald-800">
                    Net Collections
                  </span>
                  <span className="text-sm font-bold text-emerald-800">
                    ${mtdCollections.toLocaleString()}
                  </span>
                </div>

                {/* Expenses Section */}
                <div className="px-6 py-3 bg-red-50/30">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                    Expenses
                  </p>
                </div>
                {expenseItems.map((exp) => (
                  <div
                    key={exp.label}
                    className="px-6 py-3 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700">{exp.label}</span>
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        {exp.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {exp.pctOfRev}%
                      </span>
                      <span className="text-sm font-semibold text-slate-900 w-20 text-right">
                        ${exp.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="px-6 py-3 flex items-center justify-between bg-red-50/50">
                  <span className="text-sm font-semibold text-red-800">
                    Total Expenses
                  </span>
                  <span className="text-sm font-bold text-red-800">
                    ${totalExpenses.toLocaleString()}
                  </span>
                </div>

                {/* Net Income */}
                <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50">
                  <div>
                    <span className="text-base font-bold text-violet-900">
                      Net Income
                    </span>
                    <span className="ml-2 text-xs text-violet-600">
                      ({profitMargin}% margin)
                    </span>
                  </div>
                  <span className="text-xl font-bold text-violet-900">
                    ${netIncome.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <PieChart className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Expense Breakdown
                </h3>
              </div>
              <div className="p-4">
                <DonutChart
                  data={expenseByCategory}
                  height={180}
                  innerRadius={50}
                  outerRadius={70}
                  centerLabel="Total"
                  centerValue={`$${(totalExpenses / 1000).toFixed(1)}K`}
                />
                <div className="mt-4 space-y-2">
                  {expenseByCategory.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-slate-600">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {((cat.value / totalExpenses) * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs font-semibold text-slate-900">
                          ${cat.value.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 px-4 py-3">
                <AiInsight type="recommendation">
                  Labor costs represent 50.5% of expenses. Industry benchmark
                  is 25-30% of collections. Consider reviewing staffing
                  efficiency.
                </AiInsight>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  A/R & COLLECTIONS TAB                                        */}
      {/* ============================================================ */}
      {activeTab === "ar" && (
        <div className="space-y-6">
          {/* AR Aging Buckets */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Accounts Receivable Aging
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Outstanding</p>
                  <p className="font-bold text-slate-900">
                    ${totalAR.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleExportAR}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Export
                </button>
              </div>
            </div>
            <div className="p-6">
              {arAging.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {arAging.map((bucket) => (
                    <div
                      key={bucket.bucket}
                      className={`rounded-xl border ${bucket.bgColor} p-4 transition-all hover:shadow-md`}
                    >
                      <p
                        className={`text-2xl font-bold ${bucket.textColor}`}
                      >
                        ${bucket.amount.toLocaleString()}
                      </p>
                      <p
                        className={`text-xs font-medium ${bucket.textColor} opacity-80`}
                      >
                        {bucket.bucket}
                      </p>
                      <div className="mt-3 h-2 rounded-full bg-white/60 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bucket.color} transition-all duration-500`}
                          style={{ width: `${bucket.percent}%` }}
                        />
                      </div>
                      <p
                        className={`text-[10px] ${bucket.textColor} opacity-60 mt-1`}
                      >
                        {bucket.percent}% of total
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-slate-400">
                  No outstanding accounts receivable
                </div>
              )}
            </div>
          </div>

          {/* Outstanding Accounts Table */}
          {topOutstandingAccounts.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Top Outstanding Accounts
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {topOutstandingAccounts.length} accounts
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30">
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Patient
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Insurance
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Aging
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topOutstandingAccounts.map((acct) => (
                      <tr
                        key={acct.name}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          acct.days > 90 ? "bg-red-50/30" : acct.days > 60 ? "bg-amber-50/20" : ""
                        }`}
                      >
                        <td className="px-6 py-3.5">
                          <p className="text-sm font-medium text-slate-900">
                            {acct.name}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600">
                          {acct.insurance}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-900 text-right">
                          ${acct.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              acct.days > 90
                                ? "bg-red-50 text-red-700 border-red-200"
                                : acct.days > 60
                                  ? "bg-orange-50 text-orange-700 border-orange-200"
                                  : acct.days > 30
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {acct.days} days
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 border border-cyan-200 px-2.5 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors">
                            Follow Up <ChevronRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  type="alert"
                  actions={[{ label: "Generate Statements" }, { label: "Dismiss" }]}
                >
                  {topOutstandingAccounts.filter((a) => a.days > 90).length > 0
                    ? `${topOutstandingAccounts.filter((a) => a.days > 90).length} account(s) over 90 days. One Engine recommends sending final notice statements and considering collections referral for balances over $500.`
                    : "All outstanding accounts are within normal aging ranges. Continue standard follow-up procedures."}
                </AiInsight>
              </div>
            </div>
          )}

          {/* Collection Performance */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Collection Rate Trend
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  6-month trend
                </span>
              </div>
              <div className="p-4">
                <TrendLine
                  data={collectionRateTrend}
                  lines={[{ key: "rate", color: "#059669", label: "Collection %" }]}
                  height={200}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Daily Collections
                  </h3>
                </div>
                <span className="text-xs text-slate-400">This Week</span>
              </div>
              <div className="p-4">
                <BarChartFull
                  data={dailyCollections}
                  bars={[{ key: "amount", color: "#059669", label: "Collected" }]}
                  height={200}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  A/P & EXPENSES TAB                                           */}
      {/* ============================================================ */}
      {activeTab === "ap" && (
        <div className="space-y-6">
          {/* AP Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Expense Donut */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <PieChart className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Expense Distribution
                </h3>
              </div>
              <div className="p-4">
                <DonutChart
                  data={expenseByCategory}
                  height={180}
                  innerRadius={50}
                  outerRadius={70}
                  centerLabel="Total"
                  centerValue={`$${(totalExpenses / 1000).toFixed(1)}K`}
                />
                <div className="mt-4 space-y-2">
                  {expenseByCategory.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-slate-600">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900">
                        ${cat.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AP Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Accounts Payable
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Outstanding</p>
                    <p className="font-bold text-slate-900">
                      ${totalAPOutstanding.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={handleExportAP}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Export
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30">
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Vendor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accountsPayable.map((ap) => {
                      const cfg = apStatusConfig[ap.status];
                      return (
                        <tr
                          key={ap.vendor + ap.description}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <Building2 className="h-3.5 w-3.5" />
                              </div>
                              <p className="text-sm font-medium text-slate-900">
                                {ap.vendor}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-slate-600">
                            {ap.description}
                          </td>
                          <td className="px-4 py-3.5 text-sm font-semibold text-slate-900 text-right">
                            ${ap.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-sm text-slate-900">
                              {ap.dueDate}
                            </p>
                            <p className="text-xs text-slate-400">
                              {ap.daysUntil} days
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`inline-flex items-center rounded-full border ${cfg.border} ${cfg.color} px-2.5 py-0.5 text-xs font-medium`}
                            >
                              {cfg.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-6 py-3 flex items-center justify-between bg-slate-50/30">
                <span className="text-sm font-semibold text-slate-900">
                  Total Outstanding
                </span>
                <span className="text-sm font-bold text-slate-900">
                  ${totalAPOutstanding.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Expense Trend + Invoice Processing */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Expense Trend */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Monthly Expense Trend
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Last 5 months</span>
              </div>
              <div className="p-4">
                <TrendLine
                  data={cashFlowData}
                  lines={[
                    { key: "outflow", color: "#dc2626", label: "Expenses" },
                  ]}
                  height={200}
                />
              </div>
            </div>

            {/* Auto Processing */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Automated Invoice Processing
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
                  Coming Soon
                </span>
              </div>
              <div className="p-6">
                <div className="rounded-xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-sm shadow-cyan-500/25">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900">
                        AI-Powered Invoice Scanning
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Forward invoices to{" "}
                        <span className="font-mono text-cyan-600">
                          ap@akultimatedental.com
                        </span>{" "}
                        and One Engine will automatically extract vendor details,
                        amounts, and due dates. Auto-categorize, set payment
                        reminders, and track spending trends.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 text-xs text-cyan-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Auto-extract
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 text-xs text-cyan-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Auto-categorize
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 text-xs text-cyan-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Payment reminders
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <AiInsight type="prediction">
                    Based on your current AP patterns, implementing automated
                    invoice processing could save approximately 4 hours/week in
                    manual data entry and reduce late payment fees by an estimated
                    $200/month.
                  </AiInsight>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
