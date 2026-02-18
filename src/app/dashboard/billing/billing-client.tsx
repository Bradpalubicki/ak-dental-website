"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Activity,
  BarChart3,
  PieChart,
  Brain,
  Target,
  Lightbulb,
  RefreshCw,
  ChevronRight,
  Search,
  Filter,
  Send,
  Zap,
  ShieldCheck,
  Building2,
  Percent,
  Receipt,
  CalendarClock,
  ThumbsDown,
  Phone,
  Mail,
  Wallet,
  CreditCard,
  BadgeDollarSign,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import {
  TrendLine,
  TrendArea,
  BarChartFull,
  DonutChart,
  ProgressBar,
  COLORS,
} from "@/components/dashboard/chart-components";
import type { BillingClaim } from "@/types/database";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface BillingData {
  claims: BillingClaim[];
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
}

interface BillingAnalytics {
  monthlyBilling: { month: string; billed: number; collected: number; denied: number }[];
  collectionRateTrend: { month: string; rate: number }[];
  claimsByStatus: { name: string; value: number; color: string }[];
  carrierBreakdown: { carrier: string; claims: number; paid: number; denialRate: number; avgDays: number; volume: string }[];
  carrierDonut: { name: string; value: number; color: string }[];
  denialReasons: { reason: string; count: number; pct: number }[];
  paymentTimeline: { days: string; count: number; pct: number }[];
}

/* ================================================================== */
/*  Config                                                             */
/* ================================================================== */

const statusConfig: Record<string, { label: string; color: string; borderColor: string; icon: typeof CheckCircle2 }> = {
  draft: { label: "Draft", color: "bg-slate-50 text-slate-700", borderColor: "border-slate-200", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-50 text-blue-700", borderColor: "border-blue-200", icon: Send },
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700", borderColor: "border-amber-200", icon: Clock },
  paid: { label: "Paid", color: "bg-emerald-50 text-emerald-700", borderColor: "border-emerald-200", icon: CheckCircle2 },
  denied: { label: "Denied", color: "bg-red-50 text-red-700", borderColor: "border-red-200", icon: XCircle },
  appealed: { label: "Appealed", color: "bg-purple-50 text-purple-700", borderColor: "border-purple-200", icon: AlertTriangle },
  written_off: { label: "Written Off", color: "bg-slate-50 text-slate-500", borderColor: "border-slate-200", icon: XCircle },
};

/* Demo data removed — all analytics now computed server-side from oe_billing_claims */

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "claims", label: "Claims Management", icon: FileText },
  { id: "aging", label: "Aging & Collections", icon: CalendarClock },
  { id: "insurance", label: "Insurance Analytics", icon: ShieldCheck },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* Gauge Ring */
function GaugeRing({
  value,
  max,
  label,
  color,
  size = 100,
  suffix = "%",
}: {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: number;
  suffix?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-lg font-bold text-slate-900">
          {Math.round(pct)}{suffix}
        </span>
      </div>
      <span className="text-[10px] font-medium text-slate-500 text-center leading-tight mt-0.5">{label}</span>
    </div>
  );
}

/* AI Insight */
function AiInsight({
  text,
  variant = "default",
}: {
  text: string;
  variant?: "default" | "prediction" | "recommendation" | "alert";
}) {
  const config = {
    default: {
      icon: Brain,
      bg: "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      textColor: "text-cyan-900",
      label: "AI Insight",
    },
    prediction: {
      icon: Lightbulb,
      bg: "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-900",
      label: "Prediction",
    },
    recommendation: {
      icon: Target,
      bg: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-900",
      label: "Recommendation",
    },
    alert: {
      icon: AlertTriangle,
      bg: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      textColor: "text-amber-900",
      label: "Alert",
    },
  };
  const c = config[variant];
  const Icon = c.icon;
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 ${c.bg} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_3s_infinite] pointer-events-none" />
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}>
        <Icon className={`h-4 w-4 ${c.iconColor}`} />
      </div>
      <div className="min-w-0 relative">
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${c.iconColor}`}>{c.label}</span>
        <p className={`text-xs leading-relaxed ${c.textColor}`}>{text}</p>
      </div>
    </div>
  );
}

/* Sync Indicator */
function SyncIndicator() {
  const [displayTime, setDisplayTime] = useState("Just now");

  useEffect(() => {
    const start = Date.now();
    const iv = setInterval(() => {
      const mins = Math.floor((Date.now() - start) / 60000);
      setDisplayTime(mins < 1 ? "Just now" : `${mins}m ago`);
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </div>
      <span>Synced {displayTime}</span>
    </div>
  );
}

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

function procedureSummary(codes: unknown): string {
  if (!codes || !Array.isArray(codes)) return "—";
  return (
    codes
      .map((c: { code?: string; description?: string }) => c.code || c.description || "")
      .filter(Boolean)
      .join(", ") || "—"
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function BillingClient({ data, analytics }: { data: BillingData; analytics: BillingAnalytics }) {
  const { claims, totalBilled, totalCollected, totalOutstanding } = data;
  const { monthlyBilling, collectionRateTrend, claimsByStatus, carrierBreakdown, carrierDonut, denialReasons, paymentTimeline } = analytics;
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [dateRange, setDateRange] = useState("this_month");
  const [claimFilter, setClaimFilter] = useState("all");
  const [claimSearch, setClaimSearch] = useState("");

  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100) : 0;
  const deniedCount = claims.filter((c) => c.status === "denied" || c.status === "appealed").length;
  const denialRate = claims.length > 0 ? ((deniedCount / claims.length) * 100) : 0;
  const avgAgingDays = claims.length > 0
    ? Math.round(claims.reduce((s, c) => s + (c.aging_days || 0), 0) / claims.length)
    : 0;

  const unpaid = claims.filter((c) => c.status !== "paid" && c.status !== "written_off");
  const aging0_30 = unpaid.filter((c) => (c.aging_days || 0) <= 30);
  const aging31_60 = unpaid.filter((c) => (c.aging_days || 0) > 30 && (c.aging_days || 0) <= 60);
  const aging61_90 = unpaid.filter((c) => (c.aging_days || 0) > 60 && (c.aging_days || 0) <= 90);
  const aging90plus = unpaid.filter((c) => (c.aging_days || 0) > 90);

  const aging0_30Amt = aging0_30.reduce((s, c) => s + Number(c.billed_amount || 0) - Number(c.insurance_paid || 0), 0);
  const aging31_60Amt = aging31_60.reduce((s, c) => s + Number(c.billed_amount || 0) - Number(c.insurance_paid || 0), 0);
  const aging61_90Amt = aging61_90.reduce((s, c) => s + Number(c.billed_amount || 0) - Number(c.insurance_paid || 0), 0);
  const aging90plusAmt = aging90plus.reduce((s, c) => s + Number(c.billed_amount || 0) - Number(c.insurance_paid || 0), 0);

  /* Sparkline data */
  const billedSparkData = monthlyBilling.map((m) => m.billed);
  const collectedSparkData = monthlyBilling.map((m) => m.collected);
  const rateSparkData = collectionRateTrend.map((m) => m.rate);

  /* Filtered claims */
  const filteredClaims = claims.filter((c) => {
    if (claimFilter !== "all" && c.status !== claimFilter) return false;
    if (claimSearch) {
      const term = claimSearch.toLowerCase();
      return (
        (c.claim_number || "").toLowerCase().includes(term) ||
        c.insurance_provider.toLowerCase().includes(term) ||
        procedureSummary(c.procedure_codes).toLowerCase().includes(term)
      );
    }
    return true;
  });

  /* CSV Export */
  const exportCSV = useCallback(
    (type: "claims" | "aging" | "carriers") => {
      let csv = "";
      if (type === "claims") {
        csv =
          "Claim #,Insurance,Billed,Paid,Status,Aging Days\n" +
          claims
            .map(
              (c) =>
                `${c.claim_number || ""},${c.insurance_provider},${c.billed_amount},${c.insurance_paid},${c.status},${c.aging_days || 0}`
            )
            .join("\n");
      } else if (type === "aging") {
        csv = `Aging Bucket,Claims,Amount\n0-30 Days,${aging0_30.length},${aging0_30Amt}\n31-60 Days,${aging31_60.length},${aging31_60Amt}\n61-90 Days,${aging61_90.length},${aging61_90Amt}\n90+ Days,${aging90plus.length},${aging90plusAmt}`;
      } else {
        csv =
          "Carrier,Claims,Paid,Denial Rate,Avg Days,Volume\n" +
          carrierBreakdown.map((c) => `${c.carrier},${c.claims},${c.paid},${c.denialRate}%,${c.avgDays},${c.volume}`).join("\n");
      }

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `billing-${type}-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [claims, aging0_30, aging31_60, aging61_90, aging90plus, aging0_30Amt, aging31_60Amt, aging61_90Amt, aging90plusAmt, carrierBreakdown]
  );

  return (
    <div className="space-y-6">
      <DemoBanner module="Billing claims and payment data" />
      {/* ============================================================ */}
      {/*  Header                                                       */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing Dashboard</h1>
          <p className="text-sm text-slate-500">Claims tracking, collections, aging, and insurance analytics</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <SyncIndicator />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 outline-none"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_90">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
          <button
            onClick={() =>
              exportCSV(activeTab === "insurance" ? "carriers" : activeTab === "aging" ? "aging" : "claims")
            }
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Tab Navigation                                               */}
      {/* ============================================================ */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  TAB: Overview                                                */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              title="Total Billed"
              value={formatCurrency(totalBilled)}
              change="+7.6% vs last month"
              trend="up"
              icon={Receipt}
              iconColor="bg-emerald-50 text-emerald-600"
              sparkData={billedSparkData}
              sparkColor="#059669"
              accentColor="#059669"
            />
            <StatCard
              title="Collections"
              value={formatCurrency(totalCollected)}
              change="+5.8% vs last month"
              trend="up"
              icon={DollarSign}
              iconColor="bg-cyan-50 text-cyan-600"
              sparkData={collectedSparkData}
              sparkColor="#0891b2"
              accentColor="#0891b2"
            />
            <StatCard
              title="Collection Rate"
              value={`${collectionRate.toFixed(1)}%`}
              change="Target: 95%"
              trend={collectionRate >= 90 ? "up" : "down"}
              icon={Percent}
              iconColor="bg-blue-50 text-blue-600"
              sparkData={rateSparkData}
              sparkColor="#2563eb"
              accentColor="#2563eb"
            />
            <StatCard
              title="Outstanding A/R"
              value={formatCurrency(totalOutstanding)}
              change={`${unpaid.length} claims`}
              trend="neutral"
              icon={Wallet}
              iconColor="bg-amber-50 text-amber-600"
              accentColor="#d97706"
              pulse={totalOutstanding > 50000}
            />
            <StatCard
              title="Denied Claims"
              value={deniedCount.toString()}
              change={`${denialRate.toFixed(1)}% denial rate`}
              trend={denialRate <= 5 ? "up" : "down"}
              icon={XCircle}
              iconColor="bg-red-50 text-red-600"
              accentColor="#dc2626"
              pulse={deniedCount > 0}
            />
            <StatCard
              title="Avg Days to Pay"
              value={`${avgAgingDays}d`}
              change="Industry avg: 32d"
              trend={avgAgingDays <= 30 ? "up" : "down"}
              icon={CalendarClock}
              iconColor="bg-indigo-50 text-indigo-600"
              accentColor="#4f46e5"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Billing Trend */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-600" />
                  <h3 className="text-sm font-semibold text-slate-900">6-Month Billing Trend</h3>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Billed vs Collected</span>
              </div>
              <div className="p-6">
                <TrendArea
                  data={monthlyBilling as unknown as Record<string, unknown>[]}
                  areas={[
                    { key: "billed", color: COLORS.cyan, label: "Billed" },
                    { key: "collected", color: COLORS.emerald, label: "Collected" },
                  ]}
                  xKey="month"
                  height={220}
                />
              </div>
            </div>

            {/* Claims by Status */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <PieChart className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-slate-900">Claims by Status</h3>
              </div>
              <div className="p-4">
                <DonutChart
                  data={claimsByStatus}
                  height={160}
                  innerRadius={45}
                  outerRadius={65}
                  centerLabel="Claims"
                  centerValue={`${claims.length}`}
                />
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 px-2">
                  {claimsByStatus.map((s) => (
                    <div key={s.name} className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[10px] text-slate-500">{s.name}</span>
                      <span className="text-[10px] font-semibold text-slate-700 ml-auto">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Aging Quick View & Gauges */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Aging Summary */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-slate-900">A/R Aging Summary</h3>
                </div>
                <button
                  onClick={() => setActiveTab("aging")}
                  className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                >
                  Full Report <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "0-30 Days", count: aging0_30.length, amt: aging0_30Amt, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" },
                    { label: "31-60 Days", count: aging31_60.length, amt: aging31_60Amt, color: "amber", bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500" },
                    { label: "61-90 Days", count: aging61_90.length, amt: aging61_90Amt, color: "orange", bg: "bg-orange-50", text: "text-orange-700", bar: "bg-orange-500" },
                    { label: "90+ Days", count: aging90plus.length, amt: aging90plusAmt, color: "red", bg: "bg-red-50", text: "text-red-700", bar: "bg-red-500" },
                  ].map((bucket) => (
                    <div key={bucket.label} className={`rounded-lg ${bucket.bg} p-4`}>
                      <p className={`text-2xl font-bold ${bucket.text}`}>{bucket.count}</p>
                      <p className={`text-xs ${bucket.text} opacity-80`}>{bucket.label}</p>
                      <p className="text-[10px] font-medium text-slate-500 mt-1">
                        {formatCurrency(bucket.amt)}
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-white/60">
                        <div
                          className={`h-full rounded-full ${bucket.bar} transition-all duration-500`}
                          style={{ width: `${unpaid.length > 0 ? (bucket.count / unpaid.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  text={`${aging90plus.length > 0 ? `${aging90plus.length} claims over 90 days need immediate attention. ` : ""}Collection rate is ${collectionRate.toFixed(1)}% — ${collectionRate >= 90 ? "strong performance, maintain current follow-up cadence." : "below 90% target. Increase follow-up frequency on 30+ day claims."}`}
                  variant={aging90plus.length > 2 ? "alert" : "default"}
                />
              </div>
            </div>

            {/* Key Gauges */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <Activity className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">Key Metrics</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative flex justify-center">
                    <GaugeRing
                      value={collectionRate}
                      max={100}
                      label="Collection Rate"
                      color={COLORS.cyan}
                    />
                  </div>
                  <div className="relative flex justify-center">
                    <GaugeRing
                      value={100 - denialRate}
                      max={100}
                      label="Clean Claim Rate"
                      color={COLORS.emerald}
                    />
                  </div>
                  <div className="relative flex justify-center">
                    <GaugeRing
                      value={Math.max(0, 45 - avgAgingDays)}
                      max={45}
                      label="Days-to-Pay Score"
                      color={COLORS.blue}
                    />
                  </div>
                  <div className="relative flex justify-center">
                    <GaugeRing
                      value={claims.filter((c) => c.status === "paid").length}
                      max={claims.length || 1}
                      label="Paid Rate"
                      color={COLORS.purple}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Denial Reasons & Collection Rate Trend */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Denial Reasons */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <ThumbsDown className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-semibold text-slate-900">Top Denial Reasons</h3>
              </div>
              <div className="p-6 space-y-3">
                {denialReasons.map((r, i) => {
                  const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-slate-400", "bg-slate-300"];
                  return (
                    <ProgressBar
                      key={r.reason}
                      value={r.count}
                      max={denialReasons[0]?.count || 1}
                      label={`${r.reason} — ${r.count} (${r.pct}%)`}
                      color={colors[i % colors.length]}
                      size="md"
                    />
                  );
                })}
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  text="53% of denials are preventable (missing info + pre-auth). Implementing automated eligibility checks could reduce denials by 40%."
                  variant="recommendation"
                />
              </div>
            </div>

            {/* Collection Rate Trend */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">Collection Rate Trend</h3>
              </div>
              <div className="p-6">
                <TrendLine
                  data={collectionRateTrend as unknown as Record<string, unknown>[]}
                  lines={[{ key: "rate", color: COLORS.blue, label: "Collection %" }]}
                  xKey="month"
                  height={200}
                />
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-0.5 w-6 bg-slate-300" style={{ borderTop: "2px dashed #94a3b8" }} />
                    <span className="text-slate-400">95% Target</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-blue-600">{collectionRate.toFixed(1)}%</span>
                    <span className="text-slate-400">Current</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB: Claims Management                                       */}
      {/* ============================================================ */}
      {activeTab === "claims" && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Claims"
              value={claims.length.toString()}
              change="This period"
              trend="neutral"
              icon={FileText}
              iconColor="bg-blue-50 text-blue-600"
              accentColor="#2563eb"
            />
            <StatCard
              title="Pending Review"
              value={claims.filter((c) => c.status === "pending" || c.status === "submitted").length.toString()}
              change="Awaiting response"
              trend="neutral"
              icon={Clock}
              iconColor="bg-amber-50 text-amber-600"
              accentColor="#d97706"
            />
            <StatCard
              title="Paid This Month"
              value={claims.filter((c) => c.status === "paid").length.toString()}
              change={formatCurrency(totalCollected)}
              trend="up"
              icon={CheckCircle2}
              iconColor="bg-emerald-50 text-emerald-600"
              accentColor="#059669"
            />
            <StatCard
              title="Needs Action"
              value={deniedCount.toString()}
              change="Denied / Appealed"
              trend={deniedCount > 0 ? "down" : "up"}
              icon={AlertTriangle}
              iconColor="bg-red-50 text-red-600"
              accentColor="#dc2626"
              pulse={deniedCount > 0}
            />
          </div>

          {/* Claims Table */}
          <div className="rounded-xl border border-slate-200/80 bg-white">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">Claims ({filteredClaims.length})</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search claims..."
                    value={claimSearch}
                    onChange={(e) => setClaimSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 outline-none w-48"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={claimFilter}
                    onChange={(e) => setClaimFilter(e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 bg-white px-2 py-1.5 focus:border-cyan-300 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="paid">Paid</option>
                    <option value="denied">Denied</option>
                    <option value="appealed">Appealed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <button
                  onClick={() => exportCSV("claims")}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors px-2 py-1.5"
                >
                  <Download className="h-3 w-3" />
                  CSV
                </button>
              </div>
            </div>

            {filteredClaims.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-10 w-10 text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">
                  {claims.length === 0 ? "No claims yet" : "No claims match your filter"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim #</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Insurance</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Procedures</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Billed</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Age</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredClaims.map((claim) => {
                      const config = statusConfig[claim.status] || statusConfig.pending;
                      const StatusIcon = config.icon;
                      const needsAction = claim.status === "denied" || claim.status === "appealed";
                      return (
                        <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3">
                            <span className="font-mono text-xs text-slate-600">{claim.claim_number || "—"}</span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3.5 w-3.5 text-slate-400" />
                              <span className="text-xs text-slate-700">{claim.insurance_provider}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span className="text-xs text-slate-600 max-w-[150px] truncate block">
                              {procedureSummary(claim.procedure_codes)}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <span className="text-xs font-semibold text-slate-900">
                              {formatCurrency(Number(claim.billed_amount))}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <span className="text-xs text-slate-600">
                              {Number(claim.insurance_paid) > 0 ? formatCurrency(Number(claim.insurance_paid)) : "—"}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.color} ${config.borderColor}`}>
                              <StatusIcon className="h-3 w-3" />
                              {config.label}
                            </span>
                            {claim.denial_reason && (
                              <p className="text-[10px] text-red-500 mt-0.5 max-w-[120px] truncate mx-auto">
                                {claim.denial_reason}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className={`text-xs font-medium ${
                              (claim.aging_days || 0) > 90
                                ? "text-red-600"
                                : (claim.aging_days || 0) > 60
                                ? "text-orange-600"
                                : (claim.aging_days || 0) > 30
                                ? "text-amber-600"
                                : "text-slate-500"
                            }`}>
                              {claim.aging_days || 0}d
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            {needsAction ? (
                              <button className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-700 hover:bg-red-100 transition-colors">
                                Appeal <ArrowRight className="h-3 w-3" />
                              </button>
                            ) : claim.status === "pending" || claim.status === "submitted" ? (
                              <button className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
                                Follow Up
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB: Aging & Collections                                     */}
      {/* ============================================================ */}
      {activeTab === "aging" && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Outstanding"
              value={formatCurrency(totalOutstanding)}
              change={`${unpaid.length} unpaid claims`}
              trend="neutral"
              icon={Wallet}
              iconColor="bg-amber-50 text-amber-600"
              accentColor="#d97706"
            />
            <StatCard
              title="Collection Rate"
              value={`${collectionRate.toFixed(1)}%`}
              change="Target: 95%"
              trend={collectionRate >= 90 ? "up" : "down"}
              icon={Percent}
              iconColor="bg-cyan-50 text-cyan-600"
              sparkData={rateSparkData}
              sparkColor="#0891b2"
              accentColor="#0891b2"
            />
            <StatCard
              title="Avg Days to Pay"
              value={`${avgAgingDays}d`}
              change="Industry avg: 32d"
              trend={avgAgingDays <= 30 ? "up" : "down"}
              icon={CalendarClock}
              iconColor="bg-blue-50 text-blue-600"
              accentColor="#2563eb"
            />
            <StatCard
              title="90+ Day Claims"
              value={aging90plus.length.toString()}
              change={formatCurrency(aging90plusAmt)}
              trend={aging90plus.length === 0 ? "up" : "down"}
              icon={AlertTriangle}
              iconColor="bg-red-50 text-red-600"
              accentColor="#dc2626"
              pulse={aging90plus.length > 0}
            />
          </div>

          {/* Aging Detail & Collection Trend */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Detailed Aging Buckets */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Aging Buckets Detail</h3>
                </div>
                <button
                  onClick={() => exportCSV("aging")}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  CSV
                </button>
              </div>
              <div className="p-6">
                <BarChartFull
                  data={[
                    { bucket: "0-30d", claims: aging0_30.length, amount: Math.round(aging0_30Amt / 1000) },
                    { bucket: "31-60d", claims: aging31_60.length, amount: Math.round(aging31_60Amt / 1000) },
                    { bucket: "61-90d", claims: aging61_90.length, amount: Math.round(aging61_90Amt / 1000) },
                    { bucket: "90+d", claims: aging90plus.length, amount: Math.round(aging90plusAmt / 1000) },
                  ] as unknown as Record<string, unknown>[]}
                  bars={[
                    { key: "claims", color: COLORS.cyan, label: "Claims" },
                    { key: "amount", color: COLORS.amber, label: "Amount ($K)" },
                  ]}
                  xKey="bucket"
                  height={220}
                />
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {[
                    { label: "0-30 Days", count: aging0_30.length, amt: aging0_30Amt, bg: "bg-emerald-50", text: "text-emerald-700" },
                    { label: "31-60 Days", count: aging31_60.length, amt: aging31_60Amt, bg: "bg-amber-50", text: "text-amber-700" },
                    { label: "61-90 Days", count: aging61_90.length, amt: aging61_90Amt, bg: "bg-orange-50", text: "text-orange-700" },
                    { label: "90+ Days", count: aging90plus.length, amt: aging90plusAmt, bg: "bg-red-50", text: "text-red-700" },
                  ].map((b) => (
                    <div key={b.label} className={`rounded-lg ${b.bg} p-3 text-center`}>
                      <p className={`text-lg font-bold ${b.text}`}>{b.count}</p>
                      <p className="text-[10px] text-slate-500">{b.label}</p>
                      <p className="text-[10px] font-medium text-slate-600 mt-0.5">{formatCurrency(b.amt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Timeline */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <Clock className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">Payment Timeline</h3>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Days from submission to payment</p>
                {paymentTimeline.map((p) => (
                  <div key={p.days} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-600 w-12">{p.days}d</span>
                    <div className="flex-1">
                      <div className="h-5 rounded-md bg-slate-100 relative overflow-hidden">
                        <div
                          className="h-full rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 flex items-center justify-end pr-1.5"
                          style={{ width: `${p.pct}%` }}
                        >
                          {p.pct >= 15 && (
                            <span className="text-[9px] font-bold text-white">{p.pct}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 w-8 text-right">{p.count}</span>
                  </div>
                ))}
                <div className="mt-3 rounded-lg bg-blue-50 p-2.5 text-center">
                  <p className="text-xs text-blue-700">
                    <span className="font-bold">65%</span> of claims paid within 30 days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Collection Rate & Actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Collection Rate Trend */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">Collection Rate Trend</h3>
              </div>
              <div className="p-6">
                <TrendLine
                  data={collectionRateTrend as unknown as Record<string, unknown>[]}
                  lines={[{ key: "rate", color: COLORS.emerald, label: "Collection %" }]}
                  xKey="month"
                  height={200}
                />
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  text="Collection rate has stabilized at ~91.5%. To reach 95%: (1) implement 14-day auto-follow-up, (2) reduce denials with pre-submission checks, (3) offer patient payment plans for balances over $500."
                  variant="recommendation"
                />
              </div>
            </div>

            {/* Collection Actions */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <Zap className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">Collection Actions Queue</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { action: "Follow up on 31-60 day claims", count: aging31_60.length, priority: "medium", icon: Phone, color: "text-amber-600", bg: "bg-amber-50" },
                  { action: "Appeal denied claims", count: deniedCount, priority: "high", icon: Send, color: "text-red-600", bg: "bg-red-50" },
                  { action: "Send patient statements (90+)", count: aging90plus.length, priority: "high", icon: Mail, color: "text-red-600", bg: "bg-red-50" },
                  { action: "Verify pending claim status", count: claims.filter((c) => c.status === "submitted").length, priority: "low", icon: RefreshCw, color: "text-blue-600", bg: "bg-blue-50" },
                  { action: "Process payment postings", count: 8, priority: "medium", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((item) => (
                  <div key={item.action} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50/50 transition-colors">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg}`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700">{item.action}</p>
                      <p className="text-[10px] text-slate-400">{item.count} items</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      item.priority === "high"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : item.priority === "medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB: Insurance Analytics                                     */}
      {/* ============================================================ */}
      {activeTab === "insurance" && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Carriers"
              value={carrierBreakdown.length.toString()}
              change="Insurance providers"
              trend="neutral"
              icon={ShieldCheck}
              iconColor="bg-blue-50 text-blue-600"
              accentColor="#2563eb"
            />
            <StatCard
              title="Overall Denial Rate"
              value={`${denialRate.toFixed(1)}%`}
              change="Target: <5%"
              trend={denialRate <= 5 ? "up" : "down"}
              icon={ThumbsDown}
              iconColor="bg-red-50 text-red-600"
              accentColor="#dc2626"
            />
            <StatCard
              title="Avg Reimbursement"
              value="$1,340"
              change="Per claim"
              trend="up"
              icon={BadgeDollarSign}
              iconColor="bg-emerald-50 text-emerald-600"
              accentColor="#059669"
            />
            <StatCard
              title="Total Insurance Volume"
              value="$204.6K"
              change="This period"
              trend="up"
              icon={DollarSign}
              iconColor="bg-cyan-50 text-cyan-600"
              accentColor="#0891b2"
            />
          </div>

          {/* Carrier Table & Donut */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Carrier Performance Table */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Carrier Performance</h3>
                </div>
                <button
                  onClick={() => exportCSV("carriers")}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-6 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Carrier</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Claims</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Denial %</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Days</th>
                      <th className="text-right px-6 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {carrierBreakdown.map((carrier) => (
                      <tr key={carrier.carrier} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                              <Building2 className="h-3.5 w-3.5 text-blue-600" />
                            </div>
                            <span className="text-xs font-medium text-slate-700">{carrier.carrier}</span>
                          </div>
                        </td>
                        <td className="text-center px-4 py-3 text-xs font-semibold text-slate-900">{carrier.claims}</td>
                        <td className="text-center px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-xs text-slate-700">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            {carrier.paid}
                          </span>
                        </td>
                        <td className="text-center px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                            carrier.denialRate <= 5
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : carrier.denialRate <= 8
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {carrier.denialRate}%
                          </span>
                        </td>
                        <td className="text-center px-4 py-3">
                          <span className={`text-xs font-medium ${
                            carrier.avgDays <= 20 ? "text-emerald-600" : carrier.avgDays <= 25 ? "text-amber-600" : "text-red-600"
                          }`}>
                            {carrier.avgDays}d
                          </span>
                        </td>
                        <td className="text-right px-6 py-3 text-xs font-semibold text-slate-900">{carrier.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Carrier Mix Donut */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <PieChart className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-slate-900">Carrier Mix</h3>
              </div>
              <div className="p-4">
                <DonutChart
                  data={carrierDonut}
                  height={160}
                  innerRadius={45}
                  outerRadius={65}
                  centerLabel="Carriers"
                  centerValue="6"
                />
                <div className="mt-2 space-y-1 px-2">
                  {carrierDonut.map((c) => (
                    <div key={c.name} className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-[10px] text-slate-500 flex-1">{c.name}</span>
                      <span className="text-[10px] font-semibold text-slate-700">{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Denial Analysis & Billing Trend */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Denial Analysis */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <XCircle className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-semibold text-slate-900">Denial Pattern Analysis</h3>
              </div>
              <div className="p-6 space-y-3">
                {denialReasons.map((r, i) => {
                  const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-slate-400", "bg-slate-300"];
                  return (
                    <ProgressBar
                      key={r.reason}
                      value={r.count}
                      max={denialReasons[0]?.count || 1}
                      label={`${r.reason} — ${r.count} (${r.pct}%)`}
                      color={colors[i % colors.length]}
                      size="md"
                    />
                  );
                })}
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  text="Aetna has the highest denial rate at 11.1%. Most denials are for pre-authorization. Recommend implementing automated pre-auth verification for all Aetna claims."
                  variant="alert"
                />
              </div>
            </div>

            {/* Monthly Billing by Carrier */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <BarChart3 className="h-4 w-4 text-cyan-600" />
                <h3 className="text-sm font-semibold text-slate-900">Billing vs Denials Trend</h3>
              </div>
              <div className="p-6">
                <BarChartFull
                  data={monthlyBilling as unknown as Record<string, unknown>[]}
                  bars={[
                    { key: "collected", color: COLORS.emerald, label: "Collected" },
                    { key: "denied", color: COLORS.red, label: "Denied" },
                  ]}
                  xKey="month"
                  height={220}
                />
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  text="Denials trending down from $9.4K (Nov) to $6.1K (Feb) — a 35% improvement. Continue the pre-submission verification protocol."
                  variant="prediction"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
