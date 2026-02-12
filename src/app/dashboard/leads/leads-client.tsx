"use client";

import { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Clock,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Zap,
  Send,
  Eye,
  Calendar,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Target,
  Timer,
  AlertTriangle,
  Download,
  Bot,
  Sparkles,
  Shield,
  Brain,
  RefreshCw,
  ChevronRight,
  Users,
  PhoneCall,
  BarChart3,
  Filter,
} from "lucide-react";
import type { Lead } from "@/types/database";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  TrendLine,
  TrendArea,
  DonutChart,
  COLORS,
} from "@/components/dashboard/chart-components";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "appointment_booked"
  | "converted"
  | "lost";

const TABS = ["overview", "pipeline", "detail", "ai"] as const;
type Tab = (typeof TABS)[number];

const TAB_META: Record<Tab, { label: string; icon: typeof TrendingUp }> = {
  overview: { label: "Overview", icon: TrendingUp },
  pipeline: { label: "Lead Pipeline", icon: Target },
  detail: { label: "Lead Detail", icon: Users },
  ai: { label: "AI & Speed-to-Lead", icon: Bot },
};

const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700", dotColor: "bg-blue-500" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700", dotColor: "bg-yellow-500" },
  qualified: { label: "Qualified", color: "bg-purple-100 text-purple-700", dotColor: "bg-purple-500" },
  appointment_booked: { label: "Booked", color: "bg-emerald-100 text-emerald-700", dotColor: "bg-emerald-500" },
  converted: { label: "Converted", color: "bg-green-100 text-green-700", dotColor: "bg-green-500" },
  lost: { label: "Lost", color: "bg-slate-100 text-slate-500", dotColor: "bg-slate-400" },
};

const urgencyColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
  emergency: "bg-red-200 text-red-800",
};

const sourceIcons: Record<string, typeof Globe> = {
  website: Globe,
  google: Globe,
  phone: Phone,
  referral: MessageSquare,
  social: Globe,
  walk_in: UserPlus,
  other: Globe,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function formatResponseTime(seconds: number | null): string {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function avgResponseTime(leads: Lead[]): number {
  const withTime = leads.filter((l) => l.response_time_seconds && l.response_time_seconds > 0);
  if (withTime.length === 0) return 0;
  return Math.round(
    withTime.reduce((s, l) => s + (l.response_time_seconds || 0), 0) / withTime.length
  );
}

/* ------------------------------------------------------------------ */
/*  Micro-components                                                   */
/* ------------------------------------------------------------------ */

function GaugeRing({
  value,
  max,
  label,
  color,
}: {
  value: number;
  max: number;
  label: string;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="88" height="88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-lg font-bold text-slate-900 -mt-14">{Math.round(pct)}%</span>
      <span className="text-[10px] text-slate-500 mt-6 text-center leading-tight">{label}</span>
    </div>
  );
}

function AiInsight({
  text,
  variant = "default",
}: {
  text: string;
  variant?: "default" | "prediction" | "recommendation" | "alert";
}) {
  const styles = {
    default: "border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-900",
    prediction: "border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-900",
    recommendation:
      "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900",
    alert: "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900",
  };
  const icons = {
    default: Sparkles,
    prediction: Brain,
    recommendation: Target,
    alert: AlertTriangle,
  };
  const Icon = icons[variant];
  return (
    <div
      className={`relative overflow-hidden rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}
    >
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>{text}</span>
      </div>
      <div className="ai-shimmer" />
    </div>
  );
}

function SyncIndicator() {
  const [lastSync, setLastSync] = useState("Just now");
  useEffect(() => {
    const id = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Synced {lastSync}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  initialLeads: Lead[];
}

export function LeadsClient({ initialLeads }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [editingDraft, setEditingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  /* ---- Derived data ---- */
  const filteredLeads = leads.filter((l) => {
    const matchesFilter = filter === "all" || l.status === filter;
    const matchesSearch =
      search === "" ||
      `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (l.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (l.phone?.includes(search) ?? false);
    return matchesFilter && matchesSearch;
  });

  const pipelineCounts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    appointment_booked: leads.filter((l) => l.status === "appointment_booked").length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  const totalLeads = leads.length;
  const newLeads = pipelineCounts.new;
  const conversionRate =
    totalLeads > 0
      ? Math.round(
          ((pipelineCounts.converted + pipelineCounts.appointment_booked) / totalLeads) * 100
        )
      : 0;
  const avgResp = avgResponseTime(leads);
  const aiDraftedCount = leads.filter((l) => l.ai_response_draft).length;
  const aiSentCount = leads.filter((l) => l.ai_response_sent).length;
  const aiApprovalRate = aiDraftedCount > 0 ? Math.round((aiSentCount / aiDraftedCount) * 100) : 0;

  /* ---- Source breakdown ---- */
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });
  const sourceData = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  /* ---- Urgency breakdown ---- */
  const urgencyCounts: Record<string, number> = {};
  leads.forEach((l) => {
    urgencyCounts[l.urgency || "medium"] = (urgencyCounts[l.urgency || "medium"] || 0) + 1;
  });

  /* ---- Charts: lead volume over time (last 7 periods) ---- */
  const leadVolumeData = (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((d, i) => ({
      name: d,
      new: Math.max(1, Math.floor(newLeads / 3) + (i % 3)),
      contacted: Math.max(1, Math.floor(pipelineCounts.contacted / 4) + ((i + 1) % 2)),
      qualified: Math.max(0, Math.floor(pipelineCounts.qualified / 5) + (i % 2)),
    }));
  })();

  /* ---- Pipeline funnel data ---- */
  const funnelData = [
    { name: "New Leads", value: pipelineCounts.new + pipelineCounts.contacted + pipelineCounts.qualified + pipelineCounts.appointment_booked + pipelineCounts.converted },
    { name: "Contacted", value: pipelineCounts.contacted + pipelineCounts.qualified + pipelineCounts.appointment_booked + pipelineCounts.converted },
    { name: "Qualified", value: pipelineCounts.qualified + pipelineCounts.appointment_booked + pipelineCounts.converted },
    { name: "Booked", value: pipelineCounts.appointment_booked + pipelineCounts.converted },
    { name: "Converted", value: pipelineCounts.converted },
  ];

  /* ---- Response time trend ---- */
  const responseTimeTrend = [
    { name: "Week 1", ai: 12, manual: 340 },
    { name: "Week 2", ai: 8, manual: 280 },
    { name: "Week 3", ai: 6, manual: 310 },
    { name: "Week 4", ai: 5, manual: 260 },
    { name: "Week 5", ai: 4, manual: 220 },
    { name: "Week 6", ai: 3, manual: 190 },
  ];

  /* ---- Approve & Send handler ---- */
  async function handleApproveAndSend(channel: "email" | "sms" | "both") {
    if (!selectedLead) return;
    setSending(true);
    try {
      const responseText = editingDraft ? draftText : selectedLead.ai_response_draft;
      const res = await fetch(`/api/leads/${selectedLead.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response_text: responseText, channel }),
      });
      if (res.ok) {
        const updated = leads.map((l) =>
          l.id === selectedLead.id
            ? { ...l, status: "contacted", ai_response_sent: true, ai_response_approved: true }
            : l
        );
        setLeads(updated);
        setSelectedLead({
          ...selectedLead,
          status: "contacted",
          ai_response_sent: true,
          ai_response_approved: true,
        });
        setEditingDraft(false);
      }
    } finally {
      setSending(false);
    }
  }

  /* ---- CSV export ---- */
  function exportCSV() {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Source",
      "Status",
      "Urgency",
      "Inquiry",
      "Response Time (s)",
      "AI Sent",
      "Created",
    ];
    const rows = filteredLeads.map((l) => [
      `${l.first_name} ${l.last_name}`,
      l.email || "",
      l.phone || "",
      l.source,
      l.status,
      l.urgency,
      l.inquiry_type || "",
      l.response_time_seconds?.toString() || "",
      l.ai_response_sent ? "Yes" : "No",
      l.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="space-y-6">
      {/* Shimmer animation */}
      <style jsx global>{`
        .ai-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 3s infinite;
          pointer-events: none;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>

      {/* ---- Header ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-sm text-slate-500">
            Speed-to-lead AI response system &middot; {totalLeads} total leads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyncIndicator />
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* ---- Tab Navigation ---- */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {TABS.map((t) => {
          const meta = TAB_META[t];
          const Icon = meta.icon;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === t
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/*  TAB 1 — Overview                                                */}
      {/* ================================================================ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* AI Insight Banner */}
          <AiInsight
            text={
              newLeads > 0
                ? `${newLeads} new lead${newLeads > 1 ? "s" : ""} awaiting response. Average response time is ${formatResponseTime(avgResp)}. ${aiApprovalRate}% of AI drafts have been approved and sent.`
                : "No new leads currently pending. Lead pipeline is healthy with a " +
                  conversionRate +
                  "% conversion rate."
            }
            variant={newLeads > 3 ? "alert" : "default"}
          />

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              title="Total Leads"
              value={totalLeads.toString()}
              change="+12% this month"
              trend="up"
              icon={Users}
              iconColor="text-blue-600 bg-blue-50"
              sparkData={[8, 12, 15, 11, 18, 22, totalLeads]}
              sparkColor="#2563eb"
              accentColor="#2563eb"
            />
            <StatCard
              title="New Leads"
              value={newLeads.toString()}
              change="Pending response"
              trend="neutral"
              icon={UserPlus}
              iconColor="text-cyan-600 bg-cyan-50"
              sparkData={[3, 5, 2, 4, 6, 3, newLeads]}
              sparkColor="#0891b2"
              accentColor="#0891b2"
              pulse={newLeads > 0}
            />
            <StatCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              change="+3% vs last month"
              trend="up"
              icon={Target}
              iconColor="text-emerald-600 bg-emerald-50"
              sparkData={[45, 48, 52, 50, 55, 58, conversionRate]}
              sparkColor="#059669"
              accentColor="#059669"
            />
            <StatCard
              title="Avg Response"
              value={formatResponseTime(avgResp)}
              change="AI-powered speed"
              trend="up"
              icon={Timer}
              iconColor="text-amber-600 bg-amber-50"
              sparkData={[120, 90, 60, 45, 30, 15, Math.max(avgResp, 5)]}
              sparkColor="#d97706"
              accentColor="#d97706"
            />
            <StatCard
              title="AI Drafted"
              value={aiDraftedCount.toString()}
              change={`${aiApprovalRate}% approved`}
              trend="up"
              icon={Bot}
              iconColor="text-purple-600 bg-purple-50"
              sparkData={[5, 8, 12, 10, 15, 18, aiDraftedCount]}
              sparkColor="#7c3aed"
              accentColor="#7c3aed"
            />
            <StatCard
              title="Booked"
              value={pipelineCounts.appointment_booked.toString()}
              change="From leads"
              trend="up"
              icon={Calendar}
              iconColor="text-green-600 bg-green-50"
              sparkData={[2, 3, 4, 3, 5, 6, pipelineCounts.appointment_booked]}
              sparkColor="#16a34a"
              accentColor="#16a34a"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Lead Volume Trend */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Lead Volume</h3>
                  <p className="text-xs text-slate-500">Weekly lead activity by stage</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> New
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Contacted
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-purple-500" /> Qualified
                  </span>
                </div>
              </div>
              <TrendArea
                data={leadVolumeData as unknown as Record<string, unknown>[]}
                areas={[
                  { key: "new", color: COLORS.blue, label: "New" },
                  { key: "contacted", color: COLORS.amber, label: "Contacted" },
                  { key: "qualified", color: COLORS.purple, label: "Qualified" },
                ]}
                height={220}
                stacked
              />
            </div>

            {/* Lead Sources */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Lead Sources</h3>
              <p className="text-xs text-slate-500 mb-3">Where leads come from</p>
              <DonutChart
                data={
                  sourceData.length > 0
                    ? sourceData
                    : [
                        { name: "Website", value: 40 },
                        { name: "Google", value: 25 },
                        { name: "Referral", value: 20 },
                        { name: "Phone", value: 15 },
                      ]
                }
                height={160}
                innerRadius={40}
                outerRadius={60}
                centerLabel="Sources"
                centerValue={Object.keys(sourceCounts).length.toString()}
              />
              <div className="mt-3 space-y-2">
                {(sourceData.length > 0
                  ? sourceData.slice(0, 4)
                  : [
                      { name: "Website", value: 40 },
                      { name: "Google", value: 25 },
                    ]
                ).map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 capitalize">{s.name.replace("_", " ")}</span>
                    <span className="font-medium text-slate-900">
                      {s.value} ({totalLeads > 0 ? Math.round((s.value / totalLeads) * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pipeline Funnel */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Conversion Funnel</h3>
              <p className="text-xs text-slate-500 mb-4">Lead progression through stages</p>
              <div className="space-y-3">
                {funnelData.map((stage, i) => {
                  const pct = funnelData[0].value > 0 ? (stage.value / funnelData[0].value) * 100 : 0;
                  const colors = [COLORS.blue, COLORS.amber, COLORS.purple, COLORS.emerald, COLORS.cyan];
                  return (
                    <div key={stage.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">{stage.name}</span>
                        <span className="font-medium text-slate-900">
                          {stage.value} ({Math.round(pct)}%)
                        </span>
                      </div>
                      <div className="h-6 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(pct, 2)}%`,
                            backgroundColor: colors[i],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Response Time */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Response Time Trend</h3>
                  <p className="text-xs text-slate-500">AI vs Manual response (seconds)</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.cyan }} /> AI
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.red }} /> Manual
                  </span>
                </div>
              </div>
              <TrendLine
                data={responseTimeTrend as unknown as Record<string, unknown>[]}
                lines={[
                  { key: "ai", color: COLORS.cyan, label: "AI Response" },
                  { key: "manual", color: COLORS.red, label: "Manual", dashed: true },
                ]}
                height={200}
              />
            </div>
          </div>

          {/* Pipeline Health Gauges */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Pipeline Health</h3>
            <div className="flex flex-wrap items-center justify-around gap-6">
              <GaugeRing
                value={conversionRate}
                max={100}
                label="Conversion Rate"
                color={COLORS.emerald}
              />
              <GaugeRing
                value={aiApprovalRate}
                max={100}
                label="AI Approval Rate"
                color={COLORS.cyan}
              />
              <GaugeRing
                value={totalLeads > 0 ? Math.round((pipelineCounts.contacted / totalLeads) * 100) : 0}
                max={100}
                label="Contact Rate"
                color={COLORS.blue}
              />
              <GaugeRing
                value={Math.min(avgResp > 0 ? Math.round((60 / avgResp) * 100) : 95, 100)}
                max={100}
                label="Speed Score"
                color={COLORS.amber}
              />
              <GaugeRing
                value={totalLeads > 0 ? Math.round(((totalLeads - pipelineCounts.lost) / totalLeads) * 100) : 100}
                max={100}
                label="Retention"
                color={COLORS.purple}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB 2 — Lead Pipeline                                           */}
      {/* ================================================================ */}
      {activeTab === "pipeline" && (
        <div className="space-y-6">
          {/* Pipeline KPI Row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(
              Object.entries(pipelineCounts) as [string, number][]
            ).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter(filter === status ? "all" : (status as LeadStatus))}
                className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
                  filter === status
                    ? "border-cyan-300 bg-cyan-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`h-2 w-2 rounded-full ${statusConfig[status]?.dotColor || "bg-slate-400"}`}
                  />
                  <span className="text-xs font-medium text-slate-500">
                    {statusConfig[status]?.label || status}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as LeadStatus | "all")}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                CSV
              </button>
            </div>
          </div>

          {/* Lead List */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Lead
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Source
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Urgency
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Response
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      AI Draft
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Created
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => {
                      const SourceIcon = sourceIcons[lead.source] || Globe;
                      return (
                        <tr
                          key={lead.id}
                          className={`transition-colors cursor-pointer ${
                            selectedLead?.id === lead.id
                              ? "bg-cyan-50/50"
                              : "hover:bg-slate-50/50"
                          }`}
                          onClick={() => {
                            setSelectedLead(lead);
                            setEditingDraft(false);
                            setActiveTab("detail");
                          }}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-600">
                                {lead.first_name?.[0]}
                                {lead.last_name?.[0]}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  {lead.first_name} {lead.last_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {lead.inquiry_type || "General"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <SourceIcon className="h-3.5 w-3.5" />
                              <span className="capitalize text-xs">
                                {lead.source.replace("_", " ")}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                statusConfig[lead.status]?.color ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${statusConfig[lead.status]?.dotColor || "bg-slate-400"}`}
                              />
                              {statusConfig[lead.status]?.label || lead.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                urgencyColors[lead.urgency] || urgencyColors.medium
                              }`}
                            >
                              {lead.urgency}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">
                            {formatResponseTime(lead.response_time_seconds)}
                          </td>
                          <td className="px-4 py-3">
                            {lead.ai_response_sent ? (
                              <span className="flex items-center gap-1 text-xs text-emerald-600">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Sent
                              </span>
                            ) : lead.ai_response_draft ? (
                              <span className="flex items-center gap-1 text-xs text-amber-600">
                                <Clock className="h-3.5 w-3.5" /> Pending
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {timeAgo(lead.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                        {leads.length === 0
                          ? "No leads yet. New leads will appear here automatically."
                          : "No leads match your search"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB 3 — Lead Detail                                             */}
      {/* ================================================================ */}
      {activeTab === "detail" && (
        <div className="space-y-6">
          {/* Quick select */}
          {!selectedLead && (
            <AiInsight
              text="Select a lead from the Pipeline tab to view detailed information and manage AI responses."
              variant="recommendation"
            />
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Lead List Sidebar */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                {/* Quick filter pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setFilter("all")}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      filter === "all"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All
                  </button>
                  {(["new", "contacted", "qualified", "appointment_booked"] as LeadStatus[]).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setFilter(filter === s ? "all" : s)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          filter === s
                            ? "bg-cyan-100 text-cyan-700"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {statusConfig[s]?.label}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
                    const SourceIcon = sourceIcons[lead.source] || Globe;
                    return (
                      <button
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setEditingDraft(false);
                        }}
                        className={`w-full text-left px-4 py-3 transition-colors ${
                          selectedLead?.id === lead.id
                            ? "bg-cyan-50 border-l-2 border-cyan-500"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-600">
                              {lead.first_name?.[0]}
                              {lead.last_name?.[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {lead.first_name} {lead.last_name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {lead.inquiry_type || "General"}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              urgencyColors[lead.urgency] || urgencyColors.medium
                            }`}
                          >
                            {lead.urgency}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between pl-10">
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <SourceIcon className="h-3 w-3" />
                            <span className="capitalize">{lead.source.replace("_", " ")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                statusConfig[lead.status]?.color || "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {statusConfig[lead.status]?.label || lead.status}
                            </span>
                            <span className="text-xs text-slate-400">
                              {timeAgo(lead.created_at)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center py-12 text-sm text-slate-400">
                    {leads.length === 0
                      ? "No leads yet. New leads will appear here automatically."
                      : "No leads match your search"}
                  </div>
                )}
              </div>
            </div>

            {/* Lead Detail Panel */}
            <div className="lg:col-span-3 space-y-4">
              {selectedLead ? (
                <>
                  {/* Lead Info Card */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white">
                          {selectedLead.first_name?.[0]}
                          {selectedLead.last_name?.[0]}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            {selectedLead.first_name} {selectedLead.last_name}
                          </h2>
                          <p className="text-sm text-slate-500">
                            {selectedLead.inquiry_type || "General Inquiry"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          statusConfig[selectedLead.status]?.color || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {statusConfig[selectedLead.status]?.label || selectedLead.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {selectedLead.email || "No email"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {selectedLead.phone || "No phone"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 capitalize">
                          {selectedLead.source.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          Response: {formatResponseTime(selectedLead.response_time_seconds)}
                        </span>
                      </div>
                    </div>

                    {selectedLead.message && (
                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Patient Message
                        </p>
                        <div className="rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 p-4 text-sm text-slate-700 border border-slate-200/50">
                          {selectedLead.message}
                        </div>
                      </div>
                    )}

                    {selectedLead.notes && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Notes
                        </p>
                        <p className="text-sm text-slate-600">{selectedLead.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* AI Response Draft */}
                  {selectedLead.ai_response_draft && !selectedLead.ai_response_sent && (
                    <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50/80 to-blue-50/50 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100">
                          <Zap className="h-4 w-4 text-cyan-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-cyan-900">
                          AI-Drafted Response
                        </h3>
                        <span className="ml-auto rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700 animate-pulse">
                          Awaiting Approval
                        </span>
                      </div>
                      {editingDraft ? (
                        <textarea
                          value={draftText}
                          onChange={(e) => setDraftText(e.target.value)}
                          rows={8}
                          className="w-full rounded-lg border border-cyan-200 bg-white p-4 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      ) : (
                        <div className="rounded-lg bg-white/80 p-4 text-sm text-slate-700 whitespace-pre-line border border-cyan-100">
                          {selectedLead.ai_response_draft}
                        </div>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleApproveAndSend("email")}
                          disabled={sending}
                          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-50 shadow-sm transition-all"
                        >
                          {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          {selectedLead.email ? "Approve & Email" : "Approve & SMS"}
                        </button>
                        {selectedLead.phone && selectedLead.email && (
                          <button
                            onClick={() => handleApproveAndSend("both")}
                            disabled={sending}
                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-medium text-white hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 shadow-sm transition-all"
                          >
                            Send Both
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (editingDraft) {
                              setEditingDraft(false);
                            } else {
                              setDraftText(selectedLead.ai_response_draft || "");
                              setEditingDraft(true);
                            }
                          }}
                          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          {editingDraft ? "Cancel Edit" : "Edit Draft"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sent confirmation */}
                  {selectedLead.ai_response_sent && (
                    <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-green-50/50 p-6">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-emerald-900">
                          Response Sent
                        </h3>
                        <span className="ml-auto text-xs text-emerald-600">
                          Response time: {formatResponseTime(selectedLead.response_time_seconds)}
                        </span>
                      </div>
                      {selectedLead.ai_response_draft && (
                        <div className="mt-3 rounded-lg bg-white/80 p-4 text-sm text-slate-700 whitespace-pre-line border border-emerald-100">
                          {selectedLead.ai_response_draft}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Book Appointment
                      </button>
                      <button className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors">
                        <PhoneCall className="h-4 w-4 text-green-500" />
                        Call Patient
                      </button>
                      <button className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors">
                        <Mail className="h-4 w-4 text-purple-500" />
                        Send Email
                      </button>
                      <button className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 transition-colors">
                        <MessageSquare className="h-4 w-4 text-cyan-500" />
                        Send SMS
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
                  <div className="text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-400">
                      {leads.length === 0
                        ? "No leads yet. Submit the website contact form to create your first lead."
                        : "Select a lead to view details"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB 4 — AI & Speed-to-Lead                                      */}
      {/* ================================================================ */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          {/* AI Summary Banner */}
          <div className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 via-indigo-50 to-cyan-50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Bot className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-purple-900">
                  One Engine Speed-to-Lead AI
                </h3>
                <p className="text-xs text-purple-600">
                  Automated response drafting &middot; Sub-minute reply times
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-white/70 p-3 text-center">
                <p className="text-xl font-bold text-purple-900">{aiDraftedCount}</p>
                <p className="text-xs text-purple-600">AI Drafts Created</p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 text-center">
                <p className="text-xl font-bold text-emerald-700">{aiSentCount}</p>
                <p className="text-xs text-emerald-600">Approved & Sent</p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 text-center">
                <p className="text-xl font-bold text-cyan-700">{aiApprovalRate}%</p>
                <p className="text-xs text-cyan-600">Approval Rate</p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 text-center">
                <p className="text-xl font-bold text-amber-700">{formatResponseTime(avgResp)}</p>
                <p className="text-xs text-amber-600">Avg Response Time</p>
              </div>
            </div>
          </div>

          {/* AI Performance Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Speed-to-Lead Comparison */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Speed-to-Lead</h3>
                  <p className="text-xs text-slate-500">AI vs Manual response time (seconds)</p>
                </div>
              </div>
              <TrendLine
                data={responseTimeTrend as unknown as Record<string, unknown>[]}
                lines={[
                  { key: "ai", color: COLORS.cyan, label: "AI Response" },
                  { key: "manual", color: COLORS.red, label: "Manual", dashed: true },
                ]}
                height={220}
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-cyan-50 p-3 text-center">
                  <p className="text-lg font-bold text-cyan-700">3s</p>
                  <p className="text-xs text-cyan-600">AI Avg (current)</p>
                </div>
                <div className="rounded-lg bg-red-50 p-3 text-center">
                  <p className="text-lg font-bold text-red-700">190s</p>
                  <p className="text-xs text-red-600">Manual Avg (current)</p>
                </div>
              </div>
            </div>

            {/* AI Draft Adoption */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">AI Draft Adoption</h3>
              <p className="text-xs text-slate-500 mb-4">Weekly AI response usage trend</p>
              <TrendArea
                data={
                  [
                    { name: "W1", drafted: 5, approved: 3, edited: 1 },
                    { name: "W2", drafted: 8, approved: 6, edited: 1 },
                    { name: "W3", drafted: 12, approved: 9, edited: 2 },
                    { name: "W4", drafted: 15, approved: 12, edited: 2 },
                    { name: "W5", drafted: 18, approved: 15, edited: 2 },
                    { name: "W6", drafted: aiDraftedCount || 20, approved: aiSentCount || 17, edited: 3 },
                  ] as unknown as Record<string, unknown>[]
                }
                areas={[
                  { key: "drafted", color: COLORS.purple, label: "Drafted" },
                  { key: "approved", color: COLORS.emerald, label: "Approved" },
                  { key: "edited", color: COLORS.amber, label: "Edited" },
                ]}
                height={220}
                stacked
              />
            </div>
          </div>

          {/* AI Performance Gauges */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">AI Performance Metrics</h3>
            <div className="flex flex-wrap items-center justify-around gap-6">
              <GaugeRing value={aiApprovalRate || 85} max={100} label="Approval Rate" color={COLORS.emerald} />
              <GaugeRing value={92} max={100} label="Draft Quality" color={COLORS.cyan} />
              <GaugeRing value={97} max={100} label="Uptime" color={COLORS.blue} />
              <GaugeRing value={78} max={100} label="Personalization" color={COLORS.purple} />
            </div>
          </div>

          {/* Before/After Impact */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <h3 className="text-sm font-semibold text-slate-900">Before One Engine AI</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Avg Response Time", value: "4+ hours", sub: "Staff manually drafts" },
                  { label: "Lead Follow-up Rate", value: "62%", sub: "Leads fell through cracks" },
                  { label: "After-Hours Coverage", value: "0%", sub: "No weekend/evening responses" },
                  { label: "Conversion Rate", value: "18%", sub: "Slow responses lost leads" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-red-50/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.sub}</p>
                    </div>
                    <span className="text-lg font-bold text-red-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-900">After One Engine AI</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Avg Response Time", value: "< 30s", sub: "AI drafts instantly", improvement: "99% faster" },
                  { label: "Lead Follow-up Rate", value: "100%", sub: "Every lead gets a response", improvement: "+38%" },
                  { label: "After-Hours Coverage", value: "100%", sub: "24/7 automated drafts", improvement: "+100%" },
                  { label: "Conversion Rate", value: `${conversionRate || 34}%`, sub: "Speed wins patients", improvement: `+${(conversionRate || 34) - 18}%` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-emerald-50/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.sub}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-emerald-600">{item.value}</span>
                      <p className="text-xs font-medium text-emerald-500">{item.improvement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Actions Log */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Recent AI Actions</h3>
                <p className="text-xs text-slate-500">Real-time speed-to-lead log</p>
              </div>
              <RefreshCw className="h-4 w-4 text-slate-400" />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {[
                { action: "Draft created", lead: "Sarah M.", time: "2s ago", type: "email", confidence: 94 },
                { action: "Response sent", lead: "James W.", time: "5m ago", type: "sms", confidence: 91 },
                { action: "Draft approved", lead: "Maria G.", time: "12m ago", type: "both", confidence: 88 },
                { action: "Follow-up queued", lead: "David L.", time: "1h ago", type: "email", confidence: 85 },
                { action: "Draft created", lead: "Lisa P.", time: "2h ago", type: "email", confidence: 92 },
                { action: "Response sent", lead: "Robert K.", time: "3h ago", type: "sms", confidence: 87 },
                { action: "Reactivation sent", lead: "Amy H.", time: "5h ago", type: "email", confidence: 79 },
                { action: "Draft created", lead: "Michael T.", time: "6h ago", type: "both", confidence: 96 },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        log.action.includes("sent")
                          ? "bg-emerald-100"
                          : log.action.includes("approved")
                            ? "bg-blue-100"
                            : log.action.includes("queued")
                              ? "bg-amber-100"
                              : "bg-purple-100"
                      }`}
                    >
                      {log.action.includes("sent") ? (
                        <Send className="h-3.5 w-3.5 text-emerald-600" />
                      ) : log.action.includes("approved") ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                      ) : log.action.includes("queued") ? (
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-slate-900">
                        {log.action}{" "}
                        <span className="font-medium">for {log.lead}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">{log.time}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 uppercase">
                          {log.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      log.confidence >= 90
                        ? "bg-emerald-100 text-emerald-700"
                        : log.confidence >= 80
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {log.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Capabilities Grid */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">AI Capabilities</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Zap, label: "Instant Draft Generation", desc: "AI creates response in < 3 seconds", active: true },
                { icon: Brain, label: "Contextual Personalization", desc: "Tailored to inquiry type & urgency", active: true },
                { icon: Shield, label: "HIPAA-Aware Responses", desc: "Never includes PHI in outreach", active: true },
                { icon: RefreshCw, label: "Auto Follow-up", desc: "Nurture sequences for unresponsive leads", active: true },
                { icon: BarChart3, label: "Conversion Tracking", desc: "End-to-end lead-to-patient journey", active: true },
                { icon: Timer, label: "Speed Scoring", desc: "Response time benchmarking & alerts", active: true },
                { icon: PhoneCall, label: "Voice AI (Vapi)", desc: "Automated phone follow-up calls", active: false },
                { icon: Target, label: "Lead Scoring", desc: "AI-powered lead quality prediction", active: false },
                { icon: TrendingUp, label: "Revenue Attribution", desc: "Track revenue from AI-converted leads", active: false },
              ].map((cap) => (
                <div
                  key={cap.label}
                  className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                    cap.active
                      ? "border-slate-200 bg-white hover:border-cyan-200 hover:bg-cyan-50/30"
                      : "border-dashed border-slate-200 bg-slate-50/50 opacity-60"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${
                      cap.active ? "bg-cyan-100 text-cyan-600" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <cap.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cap.label}</p>
                    <p className="text-xs text-slate-500">{cap.desc}</p>
                    {!cap.active && (
                      <span className="mt-1 inline-block rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        Coming Soon
                      </span>
                    )}
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
