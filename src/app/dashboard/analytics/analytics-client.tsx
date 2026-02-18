"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Download,
  Mail,
  Zap,
  Activity,
  Clock,
  BarChart3,
  PieChart,
  Brain,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  UserPlus,
  UserCheck,
  PhoneCall,
  MousePointerClick,
  Percent,
  CalendarCheck,
  CalendarX,
  Star,
  MessageSquare,
  Bot,
  Sparkles,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Timer,
  Lightbulb,
  Wallet,
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

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface WeeklyDay {
  day: string;
  production: number;
  collections: number;
}

interface LeadSource {
  source: string;
  count: number;
  percentage: number;
}

interface AiPerformance {
  totalActions: number;
  approved: number;
  rejected: number;
  pending: number;
  approvalRate: number;
}

interface MonthlyTrendItem {
  [key: string]: unknown;
  month: string;
  production: number;
  collections: number;
  newPatients: number;
}

interface PatientRetentionItem {
  [key: string]: unknown;
  month: string;
  active: number;
  churned: number;
  reactivated: number;
}

interface AppointmentTypeItem {
  [key: string]: unknown;
  name: string;
  value: number;
  color: string;
}

interface AiActionByTypeItem {
  [key: string]: unknown;
  type: string;
  count: number;
  approved: number;
  color: string;
}

interface AiWeeklyTrendItem {
  [key: string]: unknown;
  week: string;
  actions: number;
  approvalRate: number;
}

interface ProcedureMixItem {
  [key: string]: unknown;
  name: string;
  value: number;
  color: string;
}

interface AnalyticsData {
  weeklyData: WeeklyDay[];
  monthlyMetrics: {
    production: number;
    collections: number;
    newPatients: number;
    noShowRate: number;
    treatmentAcceptance: number;
  };
  leadSources: LeadSource[];
  aiPerformance: AiPerformance;
  monthlyTrend: MonthlyTrendItem[];
  patientRetention: PatientRetentionItem[];
  appointmentTypes: AppointmentTypeItem[];
  aiActionsByType: AiActionByTypeItem[];
  aiWeeklyTrend: AiWeeklyTrendItem[];
  procedureMix: ProcedureMixItem[];
  activePatients: number;
}

/* ================================================================== */
/*  Static Data (hourly traffic, reviews, funnel - no DB source yet)   */
/* ================================================================== */

const hourlyTraffic = [
  { hour: "7am", appointments: 2, walkins: 0 },
  { hour: "8am", appointments: 6, walkins: 1 },
  { hour: "9am", appointments: 8, walkins: 2 },
  { hour: "10am", appointments: 10, walkins: 3 },
  { hour: "11am", appointments: 9, walkins: 2 },
  { hour: "12pm", appointments: 4, walkins: 1 },
  { hour: "1pm", appointments: 7, walkins: 2 },
  { hour: "2pm", appointments: 9, walkins: 3 },
  { hour: "3pm", appointments: 8, walkins: 2 },
  { hour: "4pm", appointments: 6, walkins: 1 },
  { hour: "5pm", appointments: 3, walkins: 0 },
];

const reviewMetrics = [
  { month: "Sep", google: 4.6, internal: 4.8, count: 12 },
  { month: "Oct", google: 4.7, internal: 4.9, count: 15 },
  { month: "Nov", google: 4.6, internal: 4.7, count: 11 },
  { month: "Dec", google: 4.8, internal: 4.9, count: 18 },
  { month: "Jan", google: 4.7, internal: 4.8, count: 14 },
  { month: "Feb", google: 4.9, internal: 5.0, count: 20 },
];

const conversionFunnel = [
  { stage: "Website Visits", count: 3420, pct: 100 },
  { stage: "Appointment Page", count: 890, pct: 26 },
  { stage: "Form Started", count: 412, pct: 12 },
  { stage: "Form Submitted", count: 186, pct: 5.4 },
  { stage: "Booked", count: 142, pct: 4.2 },
  { stage: "Showed Up", count: 128, pct: 3.7 },
];

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "production", label: "Production & Collections", icon: DollarSign },
  { id: "patients", label: "Patient Metrics", icon: Users },
  { id: "ai", label: "AI & Automation", icon: Bot },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* Gauge Ring */
function GaugeRing({
  value,
  max,
  label,
  color,
  size = 100,
}: {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={8}
        />
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
        <span className="text-lg font-bold text-slate-900">{Math.round(pct)}%</span>
      </div>
      <span className="text-[10px] font-medium text-slate-500 text-center leading-tight mt-0.5">
        {label}
      </span>
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
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${c.iconColor}`}>
          {c.label}
        </span>
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

/* Funnel Step */
function FunnelStep({
  stage,
  count,
  pct,
  maxPct,
  color,
  isLast,
}: {
  stage: string;
  count: number;
  pct: number;
  maxPct: number;
  color: string;
  isLast: boolean;
}) {
  const width = Math.max((pct / maxPct) * 100, 8);
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-right">
        <p className="text-xs font-medium text-slate-700">{stage}</p>
        <p className="text-[10px] text-slate-400">{count.toLocaleString()}</p>
      </div>
      <div className="flex-1 relative">
        <div
          className="h-8 rounded-md transition-all duration-500 flex items-center justify-end pr-2"
          style={{ width: `${width}%`, backgroundColor: color }}
        >
          <span className="text-[10px] font-bold text-white">{pct}%</span>
        </div>
        {!isLast && (
          <div className="absolute -bottom-1 left-1/4 text-slate-300">
            <ChevronRight className="h-3 w-3 rotate-90" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const {
    weeklyData,
    monthlyMetrics,
    leadSources,
    aiPerformance,
    monthlyTrend,
    patientRetention,
    appointmentTypes,
    aiActionsByType,
    aiWeeklyTrend,
    procedureMix,
    activePatients,
  } = data;
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [dateRange, setDateRange] = useState("this_month");

  /* CSV Export */
  const exportCSV = useCallback(
    (type: "production" | "patients" | "ai") => {
      let csv = "";
      if (type === "production") {
        csv =
          "Month,Production,Collections,New Patients\n" +
          monthlyTrend
            .map((m) => `${m.month},$${m.production},$${m.collections},${m.newPatients}`)
            .join("\n");
      } else if (type === "patients") {
        csv =
          "Month,Active Patients,Churned,Reactivated\n" +
          patientRetention.map((m) => `${m.month},${m.active},${m.churned},${m.reactivated}`).join("\n");
      } else {
        csv =
          "Type,Total Actions,Approved,Approval Rate\n" +
          aiActionsByType
            .map((a) => `${a.type},${a.count},${a.approved},${Math.round((a.approved / a.count) * 100)}%`)
            .join("\n");
      }

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${type}-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [monthlyTrend, patientRetention, aiActionsByType]
  );

  /* -------------------------------------------------------------- */
  /*  Sparkline data from server weekly data                         */
  /* -------------------------------------------------------------- */
  const prodSparkData = weeklyData.map((d) => d.production);
  const collSparkData = weeklyData.map((d) => d.collections);
  const patientSparkData = monthlyTrend.map((m) => m.newPatients);
  const aiSparkData = aiWeeklyTrend.map((w) => w.actions);

  return (
    <div className="space-y-6">
      <DemoBanner module="Some analytics metrics (hourly traffic, conversion funnel, review metrics)" />
      {/* ============================================================ */}
      {/*  Header                                                       */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reporting</h1>
          <p className="text-sm text-slate-500">
            Practice performance metrics, patient insights, and AI automation
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <SyncIndicator />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 outline-none"
          >
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_90">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
          <button
            onClick={() => exportCSV(activeTab === "ai" ? "ai" : activeTab === "patients" ? "patients" : "production")}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors">
            <Mail className="h-4 w-4" />
            Send Report
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
              title="MTD Production"
              value={`$${monthlyMetrics.production.toLocaleString()}`}
              change="+8.3% vs last month"
              trend="up"
              icon={DollarSign}
              iconColor="bg-emerald-50 text-emerald-600"
              sparkData={prodSparkData}
              sparkColor="#059669"
              accentColor="#059669"
            />
            <StatCard
              title="MTD Collections"
              value={`$${monthlyMetrics.collections.toLocaleString()}`}
              change="+5.1% vs last month"
              trend="up"
              icon={Wallet}
              iconColor="bg-cyan-50 text-cyan-600"
              sparkData={collSparkData}
              sparkColor="#0891b2"
              accentColor="#0891b2"
            />
            <StatCard
              title="New Patients"
              value={monthlyMetrics.newPatients.toString()}
              change="+12.5% vs last month"
              trend="up"
              icon={UserPlus}
              iconColor="bg-blue-50 text-blue-600"
              sparkData={patientSparkData}
              sparkColor="#2563eb"
              accentColor="#2563eb"
            />
            <StatCard
              title="Treatment Accept"
              value={`${monthlyMetrics.treatmentAcceptance}%`}
              change="Above 75% target"
              trend={monthlyMetrics.treatmentAcceptance >= 75 ? "up" : "down"}
              icon={Target}
              iconColor="bg-purple-50 text-purple-600"
              accentColor="#7c3aed"
            />
            <StatCard
              title="No-Show Rate"
              value={`${monthlyMetrics.noShowRate}%`}
              change={monthlyMetrics.noShowRate <= 10 ? "Below 10% goal" : "Above 10% goal"}
              trend={monthlyMetrics.noShowRate <= 10 ? "up" : "down"}
              icon={CalendarX}
              iconColor="bg-orange-50 text-orange-600"
              accentColor="#d97706"
              pulse={monthlyMetrics.noShowRate > 10}
            />
            <StatCard
              title="AI Actions"
              value={aiPerformance.totalActions.toString()}
              change={`${aiPerformance.approvalRate}% approval`}
              trend="up"
              icon={Zap}
              iconColor="bg-indigo-50 text-indigo-600"
              sparkData={aiSparkData}
              sparkColor="#4f46e5"
              accentColor="#4f46e5"
            />
          </div>

          {/* Overview Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Monthly Trend */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-600" />
                  <h3 className="text-sm font-semibold text-slate-900">6-Month Production Trend</h3>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Production vs Collections</span>
              </div>
              <div className="p-6">
                <TrendArea
                  data={monthlyTrend}
                  areas={[
                    { key: "production", color: COLORS.cyan, label: "Production" },
                    { key: "collections", color: COLORS.emerald, label: "Collections" },
                  ]}
                  xKey="month"
                  height={220}
                />
              </div>
            </div>

            {/* Procedure Mix */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Procedure Mix</h3>
                </div>
              </div>
              <div className="p-4">
                <DonutChart
                  data={procedureMix}
                  height={160}
                  innerRadius={45}
                  outerRadius={65}
                  centerLabel="Procedures"
                  centerValue="100%"
                />
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 px-2">
                  {procedureMix.map((p) => (
                    <div key={p.name} className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-[10px] text-slate-500">{p.name}</span>
                      <span className="text-[10px] font-semibold text-slate-700 ml-auto">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Funnel & Quick Gauges */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Conversion Funnel */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Patient Conversion Funnel</h3>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">This Month</span>
              </div>
              <div className="p-6 space-y-2">
                {conversionFunnel.map((step, i) => {
                  const colors = ["#0891b2", "#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626"];
                  return (
                    <FunnelStep
                      key={step.stage}
                      stage={step.stage}
                      count={step.count}
                      pct={step.pct}
                      maxPct={100}
                      color={colors[i % colors.length]}
                      isLast={i === conversionFunnel.length - 1}
                    />
                  );
                })}
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  text="Conversion from form start to submission is 45%. Adding a progress indicator and reducing form fields from 8 to 5 could improve this by 20-30%."
                  variant="recommendation"
                />
              </div>
            </div>

            {/* Key Gauges */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <Activity className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">Key Performance</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative flex justify-center">
                    <GaugeRing
                      value={monthlyMetrics.collections}
                      max={monthlyMetrics.production || 1}
                      label="Collection Rate"
                      color={COLORS.cyan}
                      size={100}
                    />
                  </div>
                  <div className="relative flex justify-center">
                    <GaugeRing
                      value={monthlyMetrics.treatmentAcceptance}
                      max={100}
                      label="Tx Acceptance"
                      color={COLORS.purple}
                      size={100}
                    />
                  </div>
                  <div className="relative flex justify-center">
                    <GaugeRing
                      value={100 - monthlyMetrics.noShowRate}
                      max={100}
                      label="Show Rate"
                      color={COLORS.emerald}
                      size={100}
                    />
                  </div>
                  <div className="relative flex justify-center">
                    <GaugeRing
                      value={aiPerformance.approvalRate}
                      max={100}
                      label="AI Approval"
                      color={COLORS.indigo}
                      size={100}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <AiInsight
                    text="All KPIs are trending positively. Collection rate is strong at above 90% — focus on reducing no-shows for the next efficiency gain."
                    variant="default"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lead Sources & Hourly Traffic */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Lead Sources */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Lead Sources</h3>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {leadSources.reduce((s, l) => s + l.count, 0)} total
                </span>
              </div>
              <div className="p-6 space-y-3">
                {leadSources.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-sm text-slate-400">
                    No leads this month
                  </div>
                ) : (
                  leadSources.map((source, i) => {
                    const colors = ["bg-cyan-500", "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500"];
                    return (
                      <ProgressBar
                        key={source.source}
                        value={source.count}
                        max={leadSources[0]?.count || 1}
                        label={`${source.source} — ${source.count}`}
                        color={colors[i % colors.length]}
                        size="md"
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Hourly Patient Traffic */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Hourly Patient Traffic</h3>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Today</span>
              </div>
              <div className="p-6">
                <BarChartFull
                  data={hourlyTraffic}
                  bars={[
                    { key: "appointments", color: COLORS.cyan, label: "Scheduled", stackId: "a" },
                    { key: "walkins", color: COLORS.amber, label: "Walk-ins", stackId: "a" },
                  ]}
                  xKey="hour"
                  height={200}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB: Production & Collections                                */}
      {/* ============================================================ */}
      {activeTab === "production" && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="MTD Production"
              value={`$${monthlyMetrics.production.toLocaleString()}`}
              change="+8.3% vs last month"
              trend="up"
              icon={DollarSign}
              iconColor="bg-emerald-50 text-emerald-600"
              sparkData={prodSparkData}
              sparkColor="#059669"
              accentColor="#059669"
            />
            <StatCard
              title="MTD Collections"
              value={`$${monthlyMetrics.collections.toLocaleString()}`}
              change="+5.1% vs last month"
              trend="up"
              icon={Wallet}
              iconColor="bg-cyan-50 text-cyan-600"
              sparkData={collSparkData}
              sparkColor="#0891b2"
              accentColor="#0891b2"
            />
            <StatCard
              title="Collection Rate"
              value={`${monthlyMetrics.production > 0 ? Math.round((monthlyMetrics.collections / monthlyMetrics.production) * 100) : 0}%`}
              change="Target: 95%"
              trend={monthlyMetrics.collections / (monthlyMetrics.production || 1) >= 0.95 ? "up" : "neutral"}
              icon={Percent}
              iconColor="bg-purple-50 text-purple-600"
              accentColor="#7c3aed"
            />
            <StatCard
              title="Avg Daily Production"
              value={`$${weeklyData.length > 0 ? Math.round(weeklyData.reduce((s, d) => s + d.production, 0) / weeklyData.length).toLocaleString() : "0"}`}
              change="Past 7 days"
              trend="neutral"
              icon={Activity}
              iconColor="bg-indigo-50 text-indigo-600"
              accentColor="#4f46e5"
            />
          </div>

          {/* Production Trend & Weekly Breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Production vs Collections Trend</h3>
                </div>
                <button
                  onClick={() => exportCSV("production")}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  CSV
                </button>
              </div>
              <div className="p-6">
                <TrendLine
                  data={monthlyTrend}
                  lines={[
                    { key: "production", color: COLORS.cyan, label: "Production" },
                    { key: "collections", color: COLORS.emerald, label: "Collections" },
                  ]}
                  xKey="month"
                  height={240}
                />
              </div>
            </div>

            {/* Weekly Breakdown */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">This Week</h3>
              </div>
              <div className="p-6">
                {weeklyData.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                    No data yet
                  </div>
                ) : (
                  <BarChartFull
                    data={weeklyData as unknown as Record<string, unknown>[]}
                    bars={[
                      { key: "production", color: COLORS.cyan, label: "Production" },
                      { key: "collections", color: COLORS.emerald, label: "Collections" },
                    ]}
                    xKey="day"
                    height={200}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Procedure Mix & Production Goals */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Procedure Revenue */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <PieChart className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-slate-900">Revenue by Procedure</h3>
              </div>
              <div className="p-6 flex items-center gap-6">
                <div className="flex-shrink-0">
                  <DonutChart
                    data={procedureMix}
                    height={180}
                    innerRadius={50}
                    outerRadius={70}
                    centerLabel="Procedures"
                    centerValue="100%"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  {procedureMix.map((p) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-slate-600 flex-1">{p.name}</span>
                      <span className="text-xs font-semibold text-slate-900">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Production Goals */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <Target className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">Monthly Goals</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">Production Goal ($200K)</span>
                    <span className="text-xs font-bold text-slate-900">
                      ${monthlyMetrics.production.toLocaleString()}
                    </span>
                  </div>
                  <ProgressBar
                    value={monthlyMetrics.production}
                    max={200000}
                    color="bg-cyan-500"
                    showLabel={false}
                    size="md"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">Collection Goal ($185K)</span>
                    <span className="text-xs font-bold text-slate-900">
                      ${monthlyMetrics.collections.toLocaleString()}
                    </span>
                  </div>
                  <ProgressBar
                    value={monthlyMetrics.collections}
                    max={185000}
                    color="bg-emerald-500"
                    showLabel={false}
                    size="md"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">New Patients Goal (25)</span>
                    <span className="text-xs font-bold text-slate-900">{monthlyMetrics.newPatients}</span>
                  </div>
                  <ProgressBar
                    value={monthlyMetrics.newPatients}
                    max={25}
                    color="bg-blue-500"
                    showLabel={false}
                    size="md"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">No-Show Target (≤10%)</span>
                    <span className="text-xs font-bold text-slate-900">{monthlyMetrics.noShowRate}%</span>
                  </div>
                  <ProgressBar
                    value={10 - Math.min(monthlyMetrics.noShowRate, 10)}
                    max={10}
                    color={monthlyMetrics.noShowRate <= 10 ? "bg-emerald-500" : "bg-red-500"}
                    showLabel={false}
                    size="md"
                  />
                </div>
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  text="At current pace, you'll hit $189K production by month end. Schedule 3 more high-value procedures to exceed the $200K goal."
                  variant="prediction"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB: Patient Metrics                                         */}
      {/* ============================================================ */}
      {activeTab === "patients" && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Patients"
              value={activePatients.toString()}
              change="Current active"
              trend="up"
              icon={Users}
              iconColor="bg-blue-50 text-blue-600"
              accentColor="#2563eb"
            />
            <StatCard
              title="New Patients"
              value={monthlyMetrics.newPatients.toString()}
              change="+12.5% vs last month"
              trend="up"
              icon={UserPlus}
              iconColor="bg-emerald-50 text-emerald-600"
              sparkData={patientSparkData}
              sparkColor="#059669"
              accentColor="#059669"
            />
            <StatCard
              title="Reactivated"
              value={patientRetention.length > 0 ? patientRetention[patientRetention.length - 1].reactivated.toString() : "0"}
              change="This month"
              trend="up"
              icon={RefreshCw}
              iconColor="bg-purple-50 text-purple-600"
              accentColor="#7c3aed"
            />
            <StatCard
              title="Patient Satisfaction"
              value="4.9"
              change="Google rating"
              trend="up"
              icon={Star}
              iconColor="bg-amber-50 text-amber-600"
              accentColor="#d97706"
            />
          </div>

          {/* Retention & Appointment Types */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Patient Retention Trend */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Patient Retention Trend</h3>
                </div>
                <button
                  onClick={() => exportCSV("patients")}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  CSV
                </button>
              </div>
              <div className="p-6">
                <TrendArea
                  data={patientRetention}
                  areas={[
                    { key: "active", color: COLORS.blue, label: "Active" },
                    { key: "reactivated", color: COLORS.emerald, label: "Reactivated" },
                    { key: "churned", color: COLORS.red, label: "Churned" },
                  ]}
                  xKey="month"
                  height={240}
                />
              </div>
            </div>

            {/* Appointment Types */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <CalendarCheck className="h-4 w-4 text-cyan-600" />
                <h3 className="text-sm font-semibold text-slate-900">Appointment Types</h3>
              </div>
              <div className="p-4">
                <DonutChart
                  data={appointmentTypes}
                  height={160}
                  innerRadius={45}
                  outerRadius={65}
                  centerLabel="Appointments"
                  centerValue="100%"
                />
                <div className="mt-2 space-y-1 px-2">
                  {appointmentTypes.map((t) => (
                    <div key={t.name} className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-[10px] text-slate-500 flex-1">{t.name}</span>
                      <span className="text-[10px] font-semibold text-slate-700">{t.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & No-Show Analysis */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Review Trend */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-slate-900">Review & Satisfaction Trend</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-900">4.9</span>
                  <span className="text-[10px] text-slate-400">avg</span>
                </div>
              </div>
              <div className="p-6">
                <TrendLine
                  data={reviewMetrics}
                  lines={[
                    { key: "google", color: COLORS.amber, label: "Google Rating" },
                    { key: "internal", color: COLORS.blue, label: "Internal Survey" },
                  ]}
                  xKey="month"
                  height={200}
                />
                <div className="mt-3 flex items-center gap-4">
                  {reviewMetrics.slice(-1).map((r) => (
                    <div key={r.month} className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs text-slate-600">
                        <span className="font-semibold">{r.count}</span> reviews this month
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* No-Show & Cancellation Analysis */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <CalendarX className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-semibold text-slate-900">No-Show & Cancellation Analysis</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="rounded-lg bg-red-50 p-3 text-center">
                    <p className="text-xl font-bold text-red-700">{monthlyMetrics.noShowRate}%</p>
                    <p className="text-[10px] text-red-600">No-Show Rate</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 text-center">
                    <p className="text-xl font-bold text-amber-700">4.2%</p>
                    <p className="text-[10px] text-amber-600">Same-Day Cancel</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-700">68%</p>
                    <p className="text-[10px] text-emerald-600">Rescheduled</p>
                  </div>
                </div>

                {/* No-show reasons */}
                <h4 className="text-xs font-semibold text-slate-700 mb-2">Top No-Show Reasons</h4>
                <div className="space-y-2">
                  {[
                    { reason: "Forgot appointment", pct: 35 },
                    { reason: "Transportation issue", pct: 22 },
                    { reason: "Work conflict", pct: 18 },
                    { reason: "Illness", pct: 15 },
                    { reason: "Unknown", pct: 10 },
                  ].map((r) => (
                    <ProgressBar
                      key={r.reason}
                      value={r.pct}
                      max={35}
                      label={`${r.reason} — ${r.pct}%`}
                      color="bg-red-400"
                      size="sm"
                      showLabel
                    />
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  text="35% of no-shows cite 'forgot appointment'. Adding SMS reminders 2 hours before (in addition to 24hr) could reduce no-shows by 15-20%."
                  variant="alert"
                />
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="rounded-xl border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <MousePointerClick className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">Patient Acquisition Funnel</h3>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Website → Booked → Show</span>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                {conversionFunnel.map((step, i) => {
                  const colors = ["#0891b2", "#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626"];
                  return (
                    <FunnelStep
                      key={step.stage}
                      stage={step.stage}
                      count={step.count}
                      pct={step.pct}
                      maxPct={100}
                      color={colors[i % colors.length]}
                      isLast={i === conversionFunnel.length - 1}
                    />
                  );
                })}
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-700">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-cyan-50 p-3 text-center">
                    <p className="text-lg font-bold text-cyan-700">4.2%</p>
                    <p className="text-[10px] text-cyan-600">Visit → Book Rate</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-700">90%</p>
                    <p className="text-[10px] text-emerald-600">Show Rate</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-lg font-bold text-blue-700">$142</p>
                    <p className="text-[10px] text-blue-600">Cost per Lead</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-3 text-center">
                    <p className="text-lg font-bold text-purple-700">$3,420</p>
                    <p className="text-[10px] text-purple-600">LTV per Patient</p>
                  </div>
                </div>
                <AiInsight
                  text="Your cost per lead ($142) is 18% below industry average. Increasing ad spend by 15% could yield 8-10 additional new patients monthly."
                  variant="recommendation"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB: AI & Automation                                         */}
      {/* ============================================================ */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total AI Actions"
              value={aiPerformance.totalActions.toString()}
              change="This month"
              trend="up"
              icon={Zap}
              iconColor="bg-indigo-50 text-indigo-600"
              sparkData={aiSparkData}
              sparkColor="#4f46e5"
              accentColor="#4f46e5"
            />
            <StatCard
              title="Approval Rate"
              value={`${aiPerformance.approvalRate}%`}
              change="+3.2% vs last month"
              trend="up"
              icon={ThumbsUp}
              iconColor="bg-emerald-50 text-emerald-600"
              accentColor="#059669"
            />
            <StatCard
              title="Time Saved"
              value="42hrs"
              change="Estimated this month"
              trend="up"
              icon={Timer}
              iconColor="bg-cyan-50 text-cyan-600"
              accentColor="#0891b2"
            />
            <StatCard
              title="Revenue Impact"
              value="$18.5K"
              change="AI-attributed revenue"
              trend="up"
              icon={DollarSign}
              iconColor="bg-amber-50 text-amber-600"
              accentColor="#d97706"
            />
          </div>

          {/* AI Actions Overview & Trend */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Actions by Type */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-semibold text-slate-900">AI Actions by Category</h3>
                </div>
                <button
                  onClick={() => exportCSV("ai")}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  CSV
                </button>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="text-center py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                        <th className="text-center py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved</th>
                        <th className="text-center py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate</th>
                        <th className="text-right py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {aiActionsByType.map((action) => {
                        const rate = Math.round((action.approved / action.count) * 100);
                        return (
                          <tr key={action.type} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: action.color }} />
                                <span className="font-medium text-slate-700">{action.type}</span>
                              </div>
                            </td>
                            <td className="text-center py-3 font-semibold text-slate-900">{action.count}</td>
                            <td className="text-center py-3">
                              <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-slate-700">{action.approved}</span>
                              </span>
                            </td>
                            <td className="text-center py-3">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                rate >= 95
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : rate >= 85
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}>
                                {rate}%
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="w-24 ml-auto">
                                <div className="h-1.5 rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${rate}%`, backgroundColor: action.color }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* AI Performance Summary */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-slate-900">Performance</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-emerald-50 p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                      <p className="text-xl font-bold text-emerald-700">{aiPerformance.approved}</p>
                    </div>
                    <p className="text-[10px] text-emerald-600">Approved</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ThumbsDown className="h-3.5 w-3.5 text-red-600" />
                      <p className="text-xl font-bold text-red-700">{aiPerformance.rejected}</p>
                    </div>
                    <p className="text-[10px] text-red-600">Rejected</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <p className="text-xl font-bold text-amber-700">{aiPerformance.pending}</p>
                    </div>
                    <p className="text-[10px] text-amber-600">Pending</p>
                  </div>
                  <div className="rounded-lg bg-indigo-50 p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-indigo-600" />
                      <p className="text-xl font-bold text-indigo-700">{aiPerformance.approvalRate}%</p>
                    </div>
                    <p className="text-[10px] text-indigo-600">Approval Rate</p>
                  </div>
                </div>

                <div className="relative flex justify-center pt-2">
                  <GaugeRing
                    value={aiPerformance.approvalRate}
                    max={100}
                    label="Overall Approval Rate"
                    color={COLORS.indigo}
                    size={120}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Trend & Automation Impact */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Weekly AI Activity Trend */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">Weekly AI Activity Trend</h3>
              </div>
              <div className="p-6">
                <TrendLine
                  data={aiWeeklyTrend}
                  lines={[
                    { key: "actions", color: COLORS.indigo, label: "Actions" },
                    { key: "approvalRate", color: COLORS.emerald, label: "Approval %" },
                  ]}
                  xKey="week"
                  height={200}
                />
              </div>
            </div>

            {/* Automation Impact */}
            <div className="rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
                <Sparkles className="h-4 w-4 text-cyan-600" />
                <h3 className="text-sm font-semibold text-slate-900">Automation Impact</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  {
                    label: "Lead Response Time",
                    before: "4.2 hours",
                    after: "12 minutes",
                    improvement: "95% faster",
                    icon: PhoneCall,
                    color: "text-cyan-600",
                  },
                  {
                    label: "Recall Outreach",
                    before: "Manual calls",
                    after: "Auto SMS + Email",
                    improvement: "38 hrs/mo saved",
                    icon: RefreshCw,
                    color: "text-blue-600",
                  },
                  {
                    label: "Insurance Verification",
                    before: "15 min/patient",
                    after: "Auto-verified",
                    improvement: "85% automated",
                    icon: FileText,
                    color: "text-emerald-600",
                  },
                  {
                    label: "Treatment Follow-up",
                    before: "Often missed",
                    after: "Auto-scheduled",
                    improvement: "22% more accepted",
                    icon: CheckCircle2,
                    color: "text-purple-600",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                    <item.icon className={`h-5 w-5 ${item.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 line-through">{item.before}</span>
                        <ChevronRight className="h-3 w-3 text-slate-300" />
                        <span className="text-[10px] font-medium text-slate-600">{item.after}</span>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {item.improvement}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 px-6 py-3">
                <AiInsight
                  text="One Engine has saved an estimated 42 staff-hours this month. The highest-impact automation is appointment reminders with a 98% delivery rate."
                  variant="prediction"
                />
              </div>
            </div>
          </div>

          {/* Recent AI Actions Log */}
          <div className="rounded-xl border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">Recent AI Actions</h3>
              </div>
              <a
                href="/dashboard/approvals"
                className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
              >
                View All
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                {
                  action: "Sent recall reminder to Maria Santos",
                  type: "Recall Outreach",
                  time: "2 min ago",
                  status: "approved",
                },
                {
                  action: "Generated treatment plan for John Davis",
                  type: "Treatment Plans",
                  time: "15 min ago",
                  status: "approved",
                },
                {
                  action: "Verified insurance for upcoming appointment",
                  type: "Insurance Verification",
                  time: "32 min ago",
                  status: "approved",
                },
                {
                  action: "Follow-up email to website lead (David Kim)",
                  type: "Lead Follow-up",
                  time: "1 hr ago",
                  status: "pending",
                },
                {
                  action: "Reactivation campaign to dormant patients (batch)",
                  type: "Reactivation",
                  time: "2 hrs ago",
                  status: "approved",
                },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50/50 transition-colors">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    log.status === "approved" ? "bg-emerald-50" : "bg-amber-50"
                  }`}>
                    {log.status === "approved" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{log.action}</p>
                    <p className="text-[10px] text-slate-400">{log.type}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      log.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {log.status === "approved" ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
