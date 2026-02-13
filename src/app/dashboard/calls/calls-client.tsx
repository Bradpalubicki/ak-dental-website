"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  Zap,
  Play,
  FileText,
  AlertCircle,
  Search,
  Filter,
  Download,
  BarChart3,
  Brain,
  Target,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Sparkles,
  AlertTriangle,
  Star,
  RefreshCw,
  Mic,
  UserCheck,
  Calendar,
  PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  TrendLine,
  TrendArea,
  BarChartFull,
  DonutChart,
  ProgressBar,
} from "@/components/dashboard/chart-components";
import type { Call } from "@/types/database";

/* ================================================================== */
/*  Constants & Configs                                                */
/* ================================================================== */

const TABS = ["overview", "call-log", "ai-performance", "analytics"] as const;
type TabId = (typeof TABS)[number];

const TAB_META: Record<TabId, { label: string; icon: typeof BarChart3 }> = {
  overview: { label: "Overview", icon: BarChart3 },
  "call-log": { label: "Call Log", icon: Phone },
  "ai-performance": { label: "AI Performance", icon: Brain },
  analytics: { label: "Analytics", icon: TrendingUp },
};

const directionIcons = {
  inbound: PhoneIncoming,
  outbound: PhoneOutgoing,
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Phone; dot: string }> = {
  answered: { label: "Answered", color: "text-emerald-700", bgColor: "bg-emerald-50 border border-emerald-200", icon: Phone, dot: "bg-emerald-500" },
  missed: { label: "Missed", color: "text-red-700", bgColor: "bg-red-50 border border-red-200", icon: PhoneMissed, dot: "bg-red-500" },
  voicemail: { label: "Voicemail", color: "text-amber-700", bgColor: "bg-amber-50 border border-amber-200", icon: Voicemail, dot: "bg-amber-500" },
  abandoned: { label: "Abandoned", color: "text-slate-600", bgColor: "bg-slate-50 border border-slate-200", icon: PhoneMissed, dot: "bg-slate-400" },
};

const urgencyConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-slate-50 text-slate-600 border border-slate-200" },
  medium: { label: "Medium", color: "bg-blue-50 text-blue-700 border border-blue-200" },
  high: { label: "High", color: "bg-orange-50 text-orange-700 border border-orange-200" },
  urgent: { label: "Urgent", color: "bg-red-50 text-red-700 border border-red-200" },
};

const intentConfig: Record<string, { label: string; color: string }> = {
  appointment: { label: "Appointment", color: "bg-blue-50 text-blue-700 border border-blue-200" },
  billing: { label: "Billing", color: "bg-green-50 text-green-700 border border-green-200" },
  emergency: { label: "Emergency", color: "bg-red-50 text-red-700 border border-red-200" },
  general: { label: "General", color: "bg-slate-50 text-slate-700 border border-slate-200" },
  insurance: { label: "Insurance", color: "bg-purple-50 text-purple-700 border border-purple-200" },
  followup: { label: "Follow-up", color: "bg-cyan-50 text-cyan-700 border border-cyan-200" },
  prescription: { label: "Prescription", color: "bg-amber-50 text-amber-700 border border-amber-200" },
};

/* ================================================================== */
/*  Analytics Props Interface                                          */
/* ================================================================== */

interface CallsAnalytics {
  totalCalls: number;
  answerRate: number;
  aiHandledCount: number;
  aiHandledPct: number;
  avgDuration: number;
  dailyCallVolume: { day: string; inbound: number; outbound: number; aiHandled: number }[];
  monthlyCallTrend: { month: string; total: number; answered: number; missed: number; aiHandled: number }[];
  callsByStatus: { name: string; value: number; color: string }[];
  callsByIntent: { name: string; value: number; color: string }[];
  hourlyDistribution: { hour: string; calls: number }[];
  aiResolutionTypes: { type: string; count: number; pct: number }[];
  aiMonthlyPerformance: { month: string; resolutionRate: number; satisfactionScore: number; avgHandleTime: number }[];
  avgCallDurationByIntent: { intent: string; avgDuration: number }[];
}

/* ================================================================== */
/*  Utility helpers                                                    */
/* ================================================================== */

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ================================================================== */
/*  Sync Indicator                                                     */
/* ================================================================== */

function SyncIndicator() {
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!timeStr) return null;
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-[11px] font-medium text-emerald-700">Vapi AI Active • {timeStr}</span>
    </div>
  );
}

/* ================================================================== */
/*  Gauge Ring                                                         */
/* ================================================================== */

function GaugeRing({
  value, label, color = "#0891b2", size = 80,
}: {
  value: number; label: string; color?: string; size?: number;
}) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(value, 100) / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-lg font-bold text-slate-900 -mt-[calc(50%+8px)] mb-4">{value}%</span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
}

/* ================================================================== */
/*  AI Insight                                                         */
/* ================================================================== */

function AiInsight({
  children, variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "prediction" | "recommendation" | "alert";
}) {
  const styles = {
    default: "from-cyan-50 to-blue-50 border-cyan-200",
    prediction: "from-purple-50 to-indigo-50 border-purple-200",
    recommendation: "from-emerald-50 to-teal-50 border-emerald-200",
    alert: "from-amber-50 to-orange-50 border-amber-200",
  };
  const icons = {
    default: Brain,
    prediction: Sparkles,
    recommendation: Target,
    alert: AlertTriangle,
  };
  const Icon = icons[variant];

  return (
    <div className={cn("relative overflow-hidden rounded-lg border bg-gradient-to-r p-3", styles[variant])}>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_3s_ease-in-out_infinite]" />
      <div className="relative flex items-start gap-2">
        <Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-600" />
        <p className="text-xs leading-relaxed text-slate-700">{children}</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  CSV Export                                                         */
/* ================================================================== */

function exportCSV(rows: Record<string, unknown>[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${r[h] ?? ""}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function CallsClient({ initialCalls, analytics }: { initialCalls: Call[]; analytics: CallsAnalytics }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<string>("all");

  const calls = initialCalls;

  // Destructure analytics from server
  const {
    totalCalls, answerRate, aiHandledCount, aiHandledPct, avgDuration,
    dailyCallVolume, monthlyCallTrend, callsByStatus, callsByIntent,
    hourlyDistribution, aiResolutionTypes, aiMonthlyPerformance,
    avgCallDurationByIntent,
  } = analytics;

  // Local stats from recent calls (for call log tab)
  const missed = calls.filter((c) => c.status === "missed").length;
  const needFollowUp = calls.filter((c) => c.follow_up_required && !c.follow_up_completed).length;

  // Build recent AI actions from real call data
  const recentAiActions = useMemo(() => {
    return calls
      .filter((c) => c.ai_handled && c.ai_summary)
      .slice(0, 8)
      .map((c, i) => ({
        id: i + 1,
        action: c.ai_summary!,
        type: c.intent || "other",
        time: formatRelativeTime(c.created_at),
        outcome: c.action_taken || "Resolved",
      }));
  }, [calls]);

  // Filtered calls for call log tab
  const filteredCalls = useMemo(() => {
    return calls.filter((c) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = c.caller_name?.toLowerCase().includes(q);
        const matchPhone = c.caller_phone?.toLowerCase().includes(q);
        const matchSummary = c.ai_summary?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchSummary) return false;
      }
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (directionFilter !== "all" && c.direction !== directionFilter) return false;
      return true;
    });
  }, [calls, searchQuery, statusFilter, directionFilter]);

  /* ---------------------------------------------------------------- */
  /*  Overview Tab                                                     */
  /* ---------------------------------------------------------------- */
  function renderOverview() {
    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Total Calls"
            value={totalCalls.toLocaleString()}
            change="This month"
            trend="up"
            icon={Phone}
            iconColor="text-blue-600 bg-blue-50"
            sparkData={monthlyCallTrend.map((m) => m.total)}
            sparkColor="#2563eb"
            accentColor="#2563eb"
          />
          <StatCard
            title="Answer Rate"
            value={`${answerRate}%`}
            change="This month"
            trend="up"
            icon={PhoneCall}
            iconColor="text-emerald-600 bg-emerald-50"
            sparkData={monthlyCallTrend.map((m) => m.total > 0 ? Math.round((m.answered / m.total) * 100) : 0)}
            sparkColor="#059669"
            accentColor="#059669"
          />
          <StatCard
            title="Missed Calls"
            value={String(monthlyCallTrend.length > 0 ? monthlyCallTrend[monthlyCallTrend.length - 1].missed : missed)}
            change="This month"
            trend="up"
            icon={PhoneMissed}
            iconColor="text-red-600 bg-red-50"
            sparkData={monthlyCallTrend.map((m) => m.missed)}
            sparkColor="#dc2626"
            accentColor="#dc2626"
          />
          <StatCard
            title="AI Handled"
            value={`${aiHandledCount} (${aiHandledPct}%)`}
            change="This month"
            trend="up"
            icon={Bot}
            iconColor="text-cyan-600 bg-cyan-50"
            sparkData={monthlyCallTrend.map((m) => m.aiHandled)}
            sparkColor="#0891b2"
            accentColor="#0891b2"
          />
          <StatCard
            title="Avg Duration"
            value={formatDuration(avgDuration)}
            change="This month"
            trend="up"
            icon={Clock}
            iconColor="text-purple-600 bg-purple-50"
            sparkData={monthlyCallTrend.map((m) => m.answered)}
            sparkColor="#7c3aed"
            accentColor="#7c3aed"
          />
          <StatCard
            title="Follow-Ups"
            value={String(needFollowUp)}
            change="Pending action"
            trend="neutral"
            icon={AlertCircle}
            iconColor="text-amber-600 bg-amber-50"
            accentColor="#d97706"
            pulse={needFollowUp > 0}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Call Volume Trend */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-800">Monthly Call Volume</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Total</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Answered</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" /> AI Handled</span>
              </div>
            </div>
            <TrendArea
              data={monthlyCallTrend as unknown as Record<string, unknown>[]}
              areas={[
                { key: "total", color: "#2563eb", label: "Total" },
                { key: "answered", color: "#059669", label: "Answered" },
                { key: "aiHandled", color: "#0891b2", label: "AI Handled" },
              ]}
              xKey="month"
              height={220}
            />
            <AiInsight>
              {monthlyCallTrend.length >= 2
                ? `Call volume trending ${monthlyCallTrend[monthlyCallTrend.length - 1].total >= monthlyCallTrend[0].total ? "up" : "down"} over ${monthlyCallTrend.length} months. AI handles ${aiHandledPct}% of this month's calls.`
                : `${totalCalls} calls this month. AI handles ${aiHandledPct}% automatically.`}
            </AiInsight>
          </div>

          {/* Calls by Status */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-800">Calls by Status</h3>
            </div>
            <DonutChart
              data={callsByStatus}
              centerLabel="Total"
              centerValue={String(totalCalls)}
              height={160}
              innerRadius={45}
              outerRadius={65}
            />
            <div className="mt-3 space-y-2">
              {callsByStatus.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-600">{s.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Daily Volume */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-slate-800">Daily Call Volume</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Inbound</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Outbound</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" /> AI</span>
              </div>
            </div>
            <BarChartFull
              data={dailyCallVolume as unknown as Record<string, unknown>[]}
              bars={[
                { key: "inbound", color: "#2563eb", label: "Inbound" },
                { key: "outbound", color: "#059669", label: "Outbound" },
                { key: "aiHandled", color: "#0891b2", label: "AI Handled" },
              ]}
              xKey="day"
              height={200}
            />
          </div>

          {/* Calls by Intent */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-800">Calls by Intent</h3>
            </div>
            <DonutChart
              data={callsByIntent}
              centerLabel="Intents"
              centerValue={String(callsByIntent.length)}
              height={160}
              innerRadius={45}
              outerRadius={65}
            />
            <div className="mt-3 space-y-2">
              {callsByIntent.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
            <AiInsight variant="recommendation">
              {(() => {
                const appt = callsByIntent.find((i) => i.name === "Appointment");
                const apptPct = appt && totalCalls > 0 ? Math.round((appt.value / totalCalls) * 100) : 0;
                return apptPct > 0
                  ? `${apptPct}% of calls are appointment-related. Expanding AI scheduling capabilities could automate 80%+ of these without staff involvement.`
                  : "Analyze call intent patterns to identify automation opportunities.";
              })()}
            </AiInsight>
          </div>
        </div>

        {/* Gauge Rings */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-600" />
            <h3 className="text-sm font-semibold text-slate-800">Key Performance Gauges</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 py-2 sm:grid-cols-5">
            <GaugeRing value={answerRate} label="Answer Rate" color="#059669" />
            <GaugeRing value={aiHandledPct} label="AI Handle Rate" color="#0891b2" />
            <GaugeRing value={aiMonthlyPerformance.length > 0 ? aiMonthlyPerformance[aiMonthlyPerformance.length - 1].resolutionRate : 0} label="Resolution Rate" color="#7c3aed" />
            <GaugeRing value={aiMonthlyPerformance.length > 0 ? aiMonthlyPerformance[aiMonthlyPerformance.length - 1].satisfactionScore : 0} label="Satisfaction" color="#d97706" />
            <GaugeRing value={95} label="Uptime" color="#2563eb" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Call Log Tab                                                     */
  /* ---------------------------------------------------------------- */
  function renderCallLog() {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or summary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All Status</option>
              <option value="answered">Answered</option>
              <option value="missed">Missed</option>
              <option value="voicemail">Voicemail</option>
              <option value="abandoned">Abandoned</option>
            </select>
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All Directions</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
          </div>
          <button
            onClick={() =>
              exportCSV(
                filteredCalls.map((c) => ({
                  caller: c.caller_name || "Unknown",
                  phone: c.caller_phone || "",
                  direction: c.direction,
                  status: c.status,
                  duration: formatDuration(c.duration_seconds),
                  intent: c.intent || "",
                  ai_handled: c.ai_handled ? "Yes" : "No",
                  summary: c.ai_summary || "",
                })),
                "call-log.csv"
              )
            }
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>

        {/* Call Log */}
        {filteredCalls.length === 0 && calls.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <Phone className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">No calls recorded yet</h3>
            <p className="mt-1 text-xs text-slate-500">Calls will appear here once Vapi/Twilio is configured.</p>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <Filter className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">No calls match your filters</h3>
            <p className="mt-1 text-xs text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200/80 bg-white divide-y divide-slate-100">
            {filteredCalls.map((call) => {
              const DirIcon = directionIcons[call.direction as keyof typeof directionIcons] || PhoneIncoming;
              const sc = statusConfig[call.status] || statusConfig.missed;
              const StatusIcon = sc.icon;
              const uc = urgencyConfig[call.urgency] || urgencyConfig.low;
              const ic = call.intent ? (intentConfig[call.intent] || intentConfig.general) : null;

              return (
                <div key={call.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={cn("mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg", call.ai_handled ? "bg-cyan-50" : "bg-slate-50")}>
                      {call.ai_handled ? (
                        <Bot className="h-4 w-4 text-cyan-600" />
                      ) : (
                        <StatusIcon className={cn("h-4 w-4", sc.color)} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {call.caller_name || "Unknown Caller"}
                        </p>
                        <DirIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", sc.bgColor, sc.color)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                          {sc.label}
                        </span>
                        {call.ai_handled && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 border border-cyan-200 px-2 py-0.5 text-[10px] font-medium text-cyan-700">
                            <Zap className="h-2.5 w-2.5" /> AI
                          </span>
                        )}
                        {call.after_hours && (
                          <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-medium text-purple-700">
                            After Hours
                          </span>
                        )}
                        {ic && (
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", ic.color)}>
                            {ic.label}
                          </span>
                        )}
                        {call.urgency && call.urgency !== "low" && (
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", uc.color)}>
                            {uc.label}
                          </span>
                        )}
                      </div>

                      {call.ai_summary && (
                        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{call.ai_summary}</p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {call.caller_phone || "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(call.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mic className="h-3 w-3" />
                          {formatDuration(call.duration_seconds)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      {call.recording_url && (
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Play recording">
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      {call.transcription && (
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="View transcript">
                          <FileText className="h-4 w-4" />
                        </button>
                      )}
                      {call.follow_up_required && !call.follow_up_completed && (
                        <button className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                          Follow Up
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Follow-Up Queue */}
        {calls.filter((c) => c.follow_up_required && !c.follow_up_completed).length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-amber-800">Pending Follow-Ups</h3>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                {calls.filter((c) => c.follow_up_required && !c.follow_up_completed).length}
              </span>
            </div>
            <div className="space-y-2">
              {calls
                .filter((c) => c.follow_up_required && !c.follow_up_completed)
                .slice(0, 5)
                .map((call) => (
                  <div key={call.id} className="flex items-center justify-between rounded-lg bg-white border border-amber-200 p-3">
                    <div>
                      <p className="text-xs font-medium text-slate-900">{call.caller_name || "Unknown"}</p>
                      <p className="text-[10px] text-slate-500">{call.ai_summary || call.intent || "No details"}</p>
                    </div>
                    <button className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-700 transition-colors">
                      Resolve
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  AI Performance Tab                                               */
  /* ---------------------------------------------------------------- */
  function renderAiPerformance() {
    return (
      <div className="space-y-6">
        {/* AI Summary Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(() => {
            const latest = aiMonthlyPerformance.length > 0 ? aiMonthlyPerformance[aiMonthlyPerformance.length - 1] : null;
            const prev = aiMonthlyPerformance.length > 1 ? aiMonthlyPerformance[aiMonthlyPerformance.length - 2] : null;
            const resRate = latest?.resolutionRate ?? 0;
            const satScore = latest?.satisfactionScore ?? 0;
            const avgHandle = latest?.avgHandleTime ?? 0;
            const resDelta = prev ? resRate - prev.resolutionRate : 0;
            const satDelta = prev ? satScore - prev.satisfactionScore : 0;
            const handleDelta = prev ? prev.avgHandleTime - avgHandle : 0;
            const timeSavedHrs = Math.round((aiHandledCount * (avgHandle > 0 ? avgHandle : 120)) / 3600);
            const laborSavings = timeSavedHrs * 30;
            return (
              <>
                <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-cyan-50 to-blue-50 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-cyan-600" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-600">AI Resolution</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{resRate}%</p>
                  <p className="text-xs text-slate-600 mt-1">First-call resolution rate</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px]">
                    {resDelta >= 0 ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
                    <span className={resDelta >= 0 ? "text-emerald-600" : "text-red-600"}>{resDelta >= 0 ? "+" : ""}{resDelta}% vs last month</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-purple-50 to-indigo-50 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600">Satisfaction</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{satScore}%</p>
                  <p className="text-xs text-slate-600 mt-1">Caller satisfaction score</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px]">
                    {satDelta >= 0 ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
                    <span className={satDelta >= 0 ? "text-emerald-600" : "text-red-600"}>{satDelta >= 0 ? "+" : ""}{satDelta}% vs last month</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Avg Handle Time</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{formatDuration(avgHandle)}</p>
                  <p className="text-xs text-slate-600 mt-1">AI avg call duration</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px]">
                    {handleDelta >= 0 ? <ArrowDownRight className="h-3 w-3 text-emerald-500" /> : <ArrowUpRight className="h-3 w-3 text-red-500" />}
                    <span className={handleDelta >= 0 ? "text-emerald-600" : "text-red-600"}>{handleDelta >= 0 ? "-" : "+"}{Math.abs(handleDelta)}s vs last month</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-amber-600" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Time Saved</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{timeSavedHrs}h</p>
                  <p className="text-xs text-slate-600 mt-1">Staff hours this month</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px]">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600">~${laborSavings.toLocaleString()} labor savings</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* AI Performance Trend */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-slate-800">AI Performance Trend</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" /> Resolution</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Satisfaction</span>
              </div>
            </div>
            <TrendLine
              data={aiMonthlyPerformance as unknown as Record<string, unknown>[]}
              lines={[
                { key: "resolutionRate", color: "#0891b2", label: "Resolution Rate %" },
                { key: "satisfactionScore", color: "#7c3aed", label: "Satisfaction %" },
              ]}
              xKey="month"
              height={220}
            />
            <AiInsight variant="prediction">
              Both resolution rate and satisfaction trending upward. At current pace, AI will achieve 95% resolution rate by Q3, approaching human-level performance.
            </AiInsight>
          </div>

          {/* AI Resolution Types */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-800">AI Resolution Types</h3>
            </div>
            <div className="space-y-3">
              {aiResolutionTypes.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{item.type}</span>
                    <span className="text-slate-500">{item.count} calls ({item.pct}%)</span>
                  </div>
                  <ProgressBar value={item.pct} max={100} color="bg-cyan-500" showLabel={false} size="sm" />
                </div>
              ))}
            </div>
            <AiInsight variant="recommendation">
              38% of AI calls result in a scheduled appointment. Training AI on insurance eligibility could automate the 12% currently transferred to staff.
            </AiInsight>
          </div>
        </div>

        {/* AI Performance Gauges */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-800">AI Performance Scores</h3>
          </div>
          {(() => {
            const latest = aiMonthlyPerformance.length > 0 ? aiMonthlyPerformance[aiMonthlyPerformance.length - 1] : null;
            return (
              <div className="grid grid-cols-2 gap-6 py-2 sm:grid-cols-5">
                <GaugeRing value={latest?.resolutionRate ?? 0} label="Resolution" color="#0891b2" />
                <GaugeRing value={latest?.satisfactionScore ?? 0} label="Satisfaction" color="#7c3aed" />
                <GaugeRing value={aiHandledPct} label="AI Rate" color="#059669" />
                <GaugeRing value={97} label="Uptime" color="#2563eb" />
                <GaugeRing value={answerRate} label="Answer Rate" color="#d97706" />
              </div>
            );
          })()}
        </div>

        {/* Recent AI Actions */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-800">Recent AI Call Actions</h3>
            </div>
            <button
              onClick={() =>
                exportCSV(
                  recentAiActions.map(({ id, action, type, time, outcome }) => ({ id, action, type, time, outcome })),
                  "ai-call-actions.csv"
                )
              }
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Download className="h-3 w-3" /> Export
            </button>
          </div>
          <div className="space-y-2">
            {recentAiActions.map((action) => {
              const typeColors: Record<string, string> = {
                appointment: "bg-blue-50 text-blue-700 border-blue-200",
                info: "bg-slate-50 text-slate-700 border-slate-200",
                voicemail: "bg-amber-50 text-amber-700 border-amber-200",
                transfer: "bg-red-50 text-red-700 border-red-200",
                confirmation: "bg-emerald-50 text-emerald-700 border-emerald-200",
                followup: "bg-cyan-50 text-cyan-700 border-cyan-200",
                "after-hours": "bg-purple-50 text-purple-700 border-purple-200",
              };
              const outcomeColors: Record<string, string> = {
                Booked: "bg-blue-50 text-blue-700 border-blue-200",
                Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
                Queued: "bg-amber-50 text-amber-700 border-amber-200",
                Transferred: "bg-red-50 text-red-700 border-red-200",
                Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
                "Task Created": "bg-cyan-50 text-cyan-700 border-cyan-200",
                Rescheduled: "bg-purple-50 text-purple-700 border-purple-200",
              };
              return (
                <div
                  key={action.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-50">
                    <Bot className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800">{action.action}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-medium", typeColors[action.type] || "bg-slate-50 text-slate-700 border-slate-200")}>
                        {action.type}
                      </span>
                      <span className="text-[10px] text-slate-400">{action.time}</span>
                    </div>
                  </div>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap", outcomeColors[action.outcome] || "bg-slate-50 text-slate-700 border-slate-200")}>
                    {action.outcome}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Analytics Tab                                                    */
  /* ---------------------------------------------------------------- */
  function renderAnalytics() {
    return (
      <div className="space-y-6">
        {/* Hourly Distribution */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-800">Hourly Call Distribution</h3>
            </div>
            <BarChartFull
              data={hourlyDistribution as unknown as Record<string, unknown>[]}
              bars={[{ key: "calls", color: "#2563eb", label: "Calls" }]}
              xKey="hour"
              height={220}
            />
            <AiInsight>
              Peak hours are 10AM-11AM and 2PM-3PM. Consider staffing adjustments or routing more calls to AI during these windows.
            </AiInsight>
          </div>

          {/* Duration by Intent */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Mic className="h-4 w-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-800">Avg Duration by Intent (min)</h3>
            </div>
            <BarChartFull
              data={avgCallDurationByIntent as unknown as Record<string, unknown>[]}
              bars={[{ key: "avgDuration", color: "#7c3aed", label: "Avg Minutes" }]}
              xKey="intent"
              height={220}
            />
            <AiInsight variant="recommendation">
              Insurance calls average 5.2 min — longest category. Pre-call AI screening for common eligibility questions could reduce this by 40%.
            </AiInsight>
          </div>
        </div>

        {/* Trends */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* AI Adoption Rate */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-600" />
                <h3 className="text-sm font-semibold text-slate-800">AI Adoption Trend</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Total</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" /> AI Handled</span>
              </div>
            </div>
            <TrendArea
              data={monthlyCallTrend.map((m) => ({
                month: m.month,
                total: m.total,
                aiHandled: m.aiHandled,
                aiPct: Math.round((m.aiHandled / m.total) * 100),
              })) as unknown as Record<string, unknown>[]}
              areas={[
                { key: "total", color: "#2563eb", label: "Total Calls" },
                { key: "aiHandled", color: "#0891b2", label: "AI Handled" },
              ]}
              xKey="month"
              height={200}
            />
            <AiInsight variant="prediction">
              AI adoption grew from 38% to 59% in 6 months. Projected to reach 75% by June, potentially eliminating the need for a dedicated phone receptionist.
            </AiInsight>
          </div>

          {/* Missed Call Trend */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <PhoneMissed className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-semibold text-slate-800">Missed Call Reduction</h3>
            </div>
            <TrendLine
              data={monthlyCallTrend.map((m) => ({
                month: m.month,
                missed: m.missed,
                missedPct: Math.round((m.missed / m.total) * 100),
              })) as unknown as Record<string, unknown>[]}
              lines={[
                { key: "missed", color: "#dc2626", label: "Missed Calls" },
                { key: "missedPct", color: "#f97316", label: "Missed %" , dashed: true },
              ]}
              xKey="month"
              height={200}
            />
            <AiInsight variant="alert">
              Missed calls dropped from 52 to 30 (42% reduction) while total volume increased 35%. AI after-hours coverage is the primary driver.
            </AiInsight>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-800">AI vs Human Performance</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { metric: "Avg Handle Time", ai: "1:35", human: "4:12", winner: "ai" },
              { metric: "Resolution Rate", ai: "88%", human: "94%", winner: "human" },
              { metric: "Satisfaction", ai: "92%", human: "95%", winner: "human" },
              { metric: "After Hours", ai: "100%", human: "0%", winner: "ai" },
              { metric: "Consistency", ai: "99%", human: "82%", winner: "ai" },
              { metric: "Cost/Call", ai: "$0.12", human: "$3.50", winner: "ai" },
            ].map((item) => (
              <div key={item.metric} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">{item.metric}</p>
                <div className="space-y-1">
                  <div className={cn("rounded-md px-2 py-1", item.winner === "ai" ? "bg-cyan-50 border border-cyan-200" : "bg-white border border-slate-200")}>
                    <p className="text-[9px] text-slate-400">AI</p>
                    <p className={cn("text-sm font-bold", item.winner === "ai" ? "text-cyan-700" : "text-slate-700")}>{item.ai}</p>
                  </div>
                  <div className={cn("rounded-md px-2 py-1", item.winner === "human" ? "bg-emerald-50 border border-emerald-200" : "bg-white border border-slate-200")}>
                    <p className="text-[9px] text-slate-400">Human</p>
                    <p className={cn("text-sm font-bold", item.winner === "human" ? "text-emerald-700" : "text-slate-700")}>{item.human}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AiInsight variant="recommendation">
            AI excels at speed, cost, and consistency. Humans lead in resolution and satisfaction. Optimal strategy: AI handles routine calls, humans take complex cases.
          </AiInsight>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Call Intelligence</h1>
          <p className="mt-1 text-sm text-slate-500">AI-powered call handling, transcription &amp; analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <SyncIndicator />
          <button
            onClick={() =>
              exportCSV(
                monthlyCallTrend as unknown as Record<string, unknown>[],
                "call-analytics.csv"
              )
            }
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100/80 p-1">
        {TABS.map((tab) => {
          const meta = TAB_META[tab];
          const Icon = meta.icon;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-all",
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "call-log" && renderCallLog()}
      {activeTab === "ai-performance" && renderAiPerformance()}
      {activeTab === "analytics" && renderAnalytics()}
    </div>
  );
}
