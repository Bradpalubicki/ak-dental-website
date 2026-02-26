"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Plus,
  Play,
  Pause,
  Settings,
  Users,
  Mail,
  MessageSquare,
  Phone,
  TrendingUp,
  CheckCircle2,
  Send,
  Target,
  BarChart3,
  Zap,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  MousePointerClick,
  Eye,
  Clock,
  Calendar,
  RefreshCw,
  Star,
  AlertTriangle,
  Sparkles,
  Bot,
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

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface Workflow {
  id: string;
  name: string;
  type: string;
  status: "active" | "paused" | "draft";
  enrolled_count: number;
  completed_count: number;
  conversion_rate: number | null;
  steps: unknown[];
  trigger_conditions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/* ================================================================== */
/*  Constants & Configs                                                */
/* ================================================================== */

const TABS = ["overview", "campaigns", "engagement", "ai-automation"] as const;
type TabId = (typeof TABS)[number];

const TAB_META: Record<TabId, { label: string; icon: typeof BarChart3 }> = {
  overview: { label: "Overview", icon: BarChart3 },
  campaigns: { label: "Campaigns & Workflows", icon: Send },
  engagement: { label: "Engagement Analytics", icon: Target },
  "ai-automation": { label: "AI & Automation", icon: Brain },
};

const typeConfig: Record<string, { label: string; color: string; borderColor: string }> = {
  welcome: { label: "Welcome", color: "bg-blue-50 text-blue-700", borderColor: "border-blue-200" },
  recall: { label: "Recall", color: "bg-green-50 text-green-700", borderColor: "border-green-200" },
  treatment_followup: { label: "Treatment", color: "bg-purple-50 text-purple-700", borderColor: "border-purple-200" },
  reactivation: { label: "Reactivation", color: "bg-orange-50 text-orange-700", borderColor: "border-orange-200" },
  no_show: { label: "No-Show", color: "bg-red-50 text-red-700", borderColor: "border-red-200" },
  review_request: { label: "Reviews", color: "bg-cyan-50 text-cyan-700", borderColor: "border-cyan-200" },
  birthday: { label: "Birthday", color: "bg-pink-50 text-pink-700", borderColor: "border-pink-200" },
  custom: { label: "Custom", color: "bg-slate-50 text-slate-700", borderColor: "border-slate-200" },
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: "Active", color: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  paused: { label: "Paused", color: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-500" },
  draft: { label: "Draft", color: "bg-slate-50 text-slate-600 border border-slate-200", dot: "bg-slate-400" },
};

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
};

/* ================================================================== */
/*  Analytics Props Interface                                          */
/* ================================================================== */

interface OutreachAnalytics {
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionCount: number;
  monthlyOutreach: { month: string; sent: number; delivered: number; opened: number; clicked: number; converted: number }[];
  channelPerformance: { name: string; value: number; color: string }[];
  weeklyEngagement: { day: string; openRate: number; clickRate: number; responseRate: number }[];
  campaignTypePerformance: { type: string; volume: number; openRate: number; clickRate: number; convRate: number }[];
  hourlyHeatmap: Record<string, string | number>[];
  conversionFunnel: { stage: string; value: number; pct: number }[];
  automationMetrics: { month: string; manual: number; automated: number; aiGenerated: number }[];
  aiGeneratedCount: number;
  automatedCount: number;
  unsubscribeRate: number;
  bounceRate: number;
}

/* ================================================================== */
/*  Utility helpers                                                    */
/* ================================================================== */

function getChannels(steps: unknown[]): string[] {
  const channels = new Set<string>();
  for (const step of steps) {
    if (step && typeof step === "object" && "channel" in step) {
      channels.add(String((step as { channel: string }).channel));
    }
  }
  return channels.size > 0 ? Array.from(channels) : ["email", "sms"];
}

/* ================================================================== */
/*  Sync Indicator                                                     */
/* ================================================================== */

function SyncIndicator() {
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      );
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
      <span className="text-[11px] font-medium text-emerald-700">
        Synced {timeStr}
      </span>
    </div>
  );
}

/* ================================================================== */
/*  Gauge Ring                                                         */
/* ================================================================== */

function GaugeRing({
  value,
  label,
  color = "#0891b2",
  size = 80,
}: {
  value: number;
  label: string;
  color?: string;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(value, 100) / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={6} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-lg font-bold text-slate-900 -mt-[calc(50%+8px)] mb-4">
        {value}%
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}

/* ================================================================== */
/*  AI Insight Component                                               */
/* ================================================================== */

function AiInsight({
  children,
  variant = "default",
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
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-gradient-to-r p-3",
        styles[variant]
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_3s_ease-in-out_infinite]" />
      <div className="relative flex items-start gap-2">
        <Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-600" />
        <p className="text-xs leading-relaxed text-slate-700">{children}</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Funnel Step                                                        */
/* ================================================================== */

function FunnelStep({
  stage,
  value,
  pct,
  maxValue,
  color,
}: {
  stage: string;
  value: number;
  pct: number;
  maxValue: number;
  color: string;
}) {
  const width = Math.max((value / maxValue) * 100, 12);
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-right">
        <p className="text-xs font-medium text-slate-700">{stage}</p>
      </div>
      <div className="flex-1">
        <div
          className="h-7 rounded-md flex items-center px-2 transition-all duration-500"
          style={{ width: `${width}%`, backgroundColor: color }}
        >
          <span className="text-[10px] font-bold text-white whitespace-nowrap">
            {value.toLocaleString()}
          </span>
        </div>
      </div>
      <span className="w-10 text-right text-xs font-semibold text-slate-600">{pct}%</span>
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

export function OutreachClient({ initialWorkflows, analytics }: { initialWorkflows: Workflow[]; analytics: OutreachAnalytics }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const workflows = initialWorkflows;

  // Destructure analytics
  const {
    totalSent, deliveryRate, openRate, clickRate, conversionCount,
    monthlyOutreach, channelPerformance, weeklyEngagement,
    campaignTypePerformance, hourlyHeatmap, conversionFunnel,
    automationMetrics, aiGeneratedCount, automatedCount,
    unsubscribeRate, bounceRate,
  } = analytics;

  // Computed metrics
  const activeWorkflows = workflows.filter((w) => w.status === "active").length;

  // Filtered workflows for campaigns tab
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (statusFilter !== "all" && w.status !== statusFilter) return false;
      if (typeFilter !== "all" && w.type !== typeFilter) return false;
      return true;
    });
  }, [workflows, searchQuery, statusFilter, typeFilter]);

  // Workflow CRUD state
  const [showModal, setShowModal] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("recall");
  const [formSteps, setFormSteps] = useState<{ channel: string; delay_days: number; subject: string; body: string }[]>([
    { channel: "email", delay_days: 0, subject: "", body: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingWorkflow(null);
    setFormName("");
    setFormType("recall");
    setFormSteps([{ channel: "email", delay_days: 0, subject: "", body: "" }]);
    setShowModal(true);
  };

  const openEdit = (w: Workflow) => {
    setEditingWorkflow(w);
    setFormName(w.name);
    setFormType(w.type);
    const steps = Array.isArray(w.steps) && w.steps.length > 0
      ? (w.steps as { channel: string; delay_days: number; subject: string; body: string }[])
      : [{ channel: "email", delay_days: 0, subject: "", body: "" }];
    setFormSteps(steps);
    setShowModal(true);
  };

  const addStep = () => {
    setFormSteps((prev) => [...prev, { channel: "email", delay_days: prev.length > 0 ? (prev[prev.length - 1].delay_days + 3) : 0, subject: "", body: "" }]);
  };

  const removeStep = (index: number) => {
    setFormSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: string, value: string | number) => {
    setFormSteps((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      if (editingWorkflow) {
        await fetch("/api/outreach", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingWorkflow.id, name: formName, type: formType, steps: formSteps }),
        });
      } else {
        await fetch("/api/outreach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName, type: formType, steps: formSteps }),
        });
      }
      setShowModal(false);
      window.location.reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/outreach?id=${id}`, { method: "DELETE" });
    setPendingDeleteId(null);
    toast.success("Workflow deleted.");
    window.location.reload();
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    await fetch("/api/outreach", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    window.location.reload();
  };

  /* ---------------------------------------------------------------- */
  /*  Overview Tab                                                     */
  /* ---------------------------------------------------------------- */
  function renderOverview() {
    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Messages Sent"
            value={totalSent.toLocaleString()}
            change="This month"
            trend="up"
            icon={Send}
            iconColor="text-blue-600 bg-blue-50"
            sparkData={monthlyOutreach.map((m) => m.sent)}
            sparkColor="#2563eb"
            accentColor="#2563eb"
          />
          <StatCard
            title="Delivery Rate"
            value={`${deliveryRate}%`}
            change="This month"
            trend="up"
            icon={CheckCircle2}
            iconColor="text-emerald-600 bg-emerald-50"
            sparkData={monthlyOutreach.map((m) => m.sent > 0 ? Math.round((m.delivered / m.sent) * 100) : 0)}
            sparkColor="#059669"
            accentColor="#059669"
          />
          <StatCard
            title="Open Rate"
            value={`${openRate}%`}
            change="This month"
            trend="up"
            icon={Eye}
            iconColor="text-cyan-600 bg-cyan-50"
            sparkData={monthlyOutreach.map((m) => m.delivered > 0 ? Math.round((m.opened / m.delivered) * 100) : 0)}
            sparkColor="#0891b2"
            accentColor="#0891b2"
          />
          <StatCard
            title="Click Rate"
            value={`${clickRate}%`}
            change="This month"
            trend="up"
            icon={MousePointerClick}
            iconColor="text-purple-600 bg-purple-50"
            sparkData={monthlyOutreach.map((m) => m.delivered > 0 ? Math.round((m.clicked / m.delivered) * 100) : 0)}
            sparkColor="#7c3aed"
            accentColor="#7c3aed"
          />
          <StatCard
            title="Conversions"
            value={String(conversionCount)}
            change="This month"
            trend="up"
            icon={Target}
            iconColor="text-amber-600 bg-amber-50"
            sparkData={monthlyOutreach.map((m) => m.converted)}
            sparkColor="#d97706"
            accentColor="#d97706"
          />
          <StatCard
            title="Active Workflows"
            value={String(activeWorkflows)}
            change={`${workflows.length} total`}
            trend="neutral"
            icon={Zap}
            iconColor="text-orange-600 bg-orange-50"
            accentColor="#ea580c"
            pulse={activeWorkflows > 0}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Outreach Volume Trend */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-800">Outreach Volume Trend</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Sent</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Opened</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Clicked</span>
              </div>
            </div>
            <TrendArea
              data={monthlyOutreach as unknown as Record<string, unknown>[]}
              areas={[
                { key: "sent", color: "#2563eb", label: "Sent" },
                { key: "opened", color: "#059669", label: "Opened" },
                { key: "clicked", color: "#7c3aed", label: "Clicked" },
              ]}
              xKey="month"
              height={220}
              stacked={false}
            />
            <AiInsight>
              Outreach volume up 47% over 6 months. February shows highest engagement — consider increasing campaign frequency during Q1.
            </AiInsight>
          </div>

          {/* Channel Mix */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-800">Channel Mix</h3>
            </div>
            <DonutChart
              data={channelPerformance}
              centerLabel="Channels"
              centerValue="3"
              height={160}
              innerRadius={45}
              outerRadius={65}
            />
            <div className="mt-3 space-y-2">
              {channelPerformance.map((ch) => (
                <div key={ch.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                    <span className="text-slate-600">{ch.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{ch.value}%</span>
                </div>
              ))}
            </div>
            <AiInsight variant="recommendation">
              SMS has 2.3x higher response rate than email. Consider shifting 10% of email volume to SMS for recall campaigns.
            </AiInsight>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Conversion Funnel */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-800">Conversion Funnel</h3>
            </div>
            <div className="space-y-2">
              {conversionFunnel.map((step, i) => {
                const colors = ["#2563eb", "#0891b2", "#059669", "#7c3aed", "#d97706"];
                return (
                  <FunnelStep
                    key={step.stage}
                    stage={step.stage}
                    value={step.value}
                    pct={step.pct}
                    maxValue={conversionFunnel[0].value}
                    color={colors[i]}
                  />
                );
              })}
            </div>
          </div>

          {/* Gauge Rings */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-600" />
              <h3 className="text-sm font-semibold text-slate-800">Key Performance Gauges</h3>
            </div>
            <div className="grid grid-cols-2 gap-6 py-2 sm:grid-cols-4">
              <GaugeRing value={Math.round(deliveryRate)} label="Delivery" color="#059669" />
              <GaugeRing value={Math.round(openRate)} label="Open Rate" color="#0891b2" />
              <GaugeRing value={Math.round(clickRate)} label="Click Rate" color="#7c3aed" />
              <GaugeRing value={totalSent > 0 ? Math.round((conversionCount / totalSent) * 100) : 0} label="Conversion" color="#d97706" />
            </div>
            <AiInsight variant="prediction">
              At current trajectory, you&apos;ll reach 10% conversion rate by April. Welcome sequences are your highest converting workflow type at 18%.
            </AiInsight>
          </div>
        </div>

        {/* Workflow Status Summary */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <h3 className="text-sm font-semibold text-slate-800">Workflow Status Summary</h3>
            </div>
            <button
              onClick={() => setActiveTab("campaigns")}
              className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
            >
              View All →
            </button>
          </div>
          {workflows.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <Mail className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-sm font-semibold text-slate-900">No workflows yet</h3>
              <p className="mt-1 text-xs text-slate-500">Create your first patient outreach workflow to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pr-4">Workflow</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4 text-right">Enrolled</th>
                    <th className="pb-3 pr-4 text-right">Completed</th>
                    <th className="pb-3 text-right">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {workflows.slice(0, 5).map((w) => {
                    const tc = typeConfig[w.type] || typeConfig.custom;
                    const sc = statusConfig[w.status] || statusConfig.draft;
                    return (
                      <tr key={w.id} className="hover:bg-slate-50/50">
                        <td className="py-3 pr-4 font-medium text-slate-900">{w.name}</td>
                        <td className="py-3 pr-4">
                          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", tc.color, tc.borderColor)}>
                            {tc.label}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium", sc.color)}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right font-medium text-slate-700">{w.enrolled_count || 0}</td>
                        <td className="py-3 pr-4 text-right font-medium text-slate-700">{w.completed_count || 0}</td>
                        <td className="py-3 text-right font-semibold text-slate-900">
                          {w.conversion_rate != null ? `${w.conversion_rate}%` : "—"}
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
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Campaigns & Workflows Tab                                        */
  /* ---------------------------------------------------------------- */
  function renderCampaigns() {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search workflows..."
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
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All Types</option>
              {Object.entries(typeConfig).map(([key, conf]) => (
                <option key={key} value={key}>{conf.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Workflow
          </button>
        </div>

        {/* Workflow Cards */}
        {filteredWorkflows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <Filter className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">No workflows match your filters</h3>
            <p className="mt-1 text-xs text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorkflows.map((workflow) => {
              const tc = typeConfig[workflow.type] || typeConfig.custom;
              const sc = statusConfig[workflow.status] || statusConfig.draft;
              const channels = getChannels(workflow.steps as unknown[]);
              const stepCount = Array.isArray(workflow.steps) ? workflow.steps.length : 0;
              const completionRate = workflow.enrolled_count > 0
                ? Math.round((workflow.completed_count / workflow.enrolled_count) * 100)
                : 0;

              return (
                <div
                  key={workflow.id}
                  className="group rounded-xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/80"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{workflow.name}</h3>
                        <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-medium", tc.color, tc.borderColor)}>
                          {tc.label}
                        </span>
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium", sc.color)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                          {sc.label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stepCount} steps
                        </span>
                        <span className="flex items-center gap-1.5">
                          {channels.map((ch) => {
                            const Icon = channelIcons[ch];
                            return Icon ? (
                              <span key={ch} className="flex items-center gap-0.5">
                                <Icon className="h-3 w-3" />
                                <span className="capitalize">{ch}</span>
                              </span>
                            ) : null;
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created {new Date(workflow.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {workflow.status === "active" ? (
                        <button
                          onClick={() => handleToggleStatus(workflow.id, workflow.status)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Pause className="h-3 w-3" /> Pause
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(workflow.id, workflow.status)}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <Play className="h-3 w-3" /> Activate
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(workflow)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
                        title="Edit workflow"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-slate-50/80 p-4 sm:grid-cols-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{workflow.enrolled_count || 0}</p>
                        <p className="text-[10px] text-slate-500">Enrolled</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{workflow.completed_count || 0}</p>
                        <p className="text-[10px] text-slate-500">Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50">
                        <TrendingUp className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {workflow.conversion_rate != null ? `${workflow.conversion_rate}%` : "—"}
                        </p>
                        <p className="text-[10px] text-slate-500">Conversion</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500">Completion</span>
                        <span className="text-xs font-bold text-slate-900">{completionRate}%</span>
                      </div>
                      <ProgressBar value={completionRate} max={100} color="bg-cyan-500" showLabel={false} size="md" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Campaign Type Performance Table */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-800">Campaign Type Performance</h3>
            </div>
            <button
              onClick={() => exportCSV(campaignTypePerformance as unknown as Record<string, unknown>[], "campaign-performance.csv")}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Download className="h-3 w-3" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Campaign Type</th>
                  <th className="pb-3 pr-4 text-right">Volume</th>
                  <th className="pb-3 pr-4 text-right">Open Rate</th>
                  <th className="pb-3 pr-4 text-right">Click Rate</th>
                  <th className="pb-3 text-right">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {campaignTypePerformance.map((row) => (
                  <tr key={row.type} className="hover:bg-slate-50/50">
                    <td className="py-3 pr-4 font-medium text-slate-900">{row.type}</td>
                    <td className="py-3 pr-4 text-right text-slate-700">{row.volume}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className={cn("font-medium", row.openRate >= 50 ? "text-emerald-600" : "text-slate-700")}>
                        {row.openRate}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className={cn("font-medium", row.clickRate >= 25 ? "text-emerald-600" : "text-slate-700")}>
                        {row.clickRate}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={cn("font-semibold", row.convRate >= 15 ? "text-emerald-600" : "text-slate-700")}>
                        {row.convRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AiInsight variant="recommendation">
            Welcome sequences outperform all other types at 18% conversion. Consider creating personalized welcome variants for different patient segments.
          </AiInsight>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Engagement Analytics Tab                                         */
  /* ---------------------------------------------------------------- */
  function renderEngagement() {
    return (
      <div className="space-y-6">
        {/* Weekly Engagement Trend */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-600" />
                <h3 className="text-sm font-semibold text-slate-800">Weekly Engagement by Day</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Open</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Click</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Response</span>
              </div>
            </div>
            <TrendLine
              data={weeklyEngagement as unknown as Record<string, unknown>[]}
              lines={[
                { key: "openRate", color: "#2563eb", label: "Open Rate %" },
                { key: "clickRate", color: "#059669", label: "Click Rate %" },
                { key: "responseRate", color: "#7c3aed", label: "Response Rate %" },
              ]}
              xKey="day"
              height={220}
            />
            <AiInsight>
              Wednesdays show peak engagement across all metrics. Schedule high-priority campaigns for mid-week delivery.
            </AiInsight>
          </div>

          {/* Send Time Heatmap */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-800">Best Send Times (Open Rate %)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-2 text-left">Time</th>
                    <th className="pb-2 text-center">Mon</th>
                    <th className="pb-2 text-center">Tue</th>
                    <th className="pb-2 text-center">Wed</th>
                    <th className="pb-2 text-center">Thu</th>
                    <th className="pb-2 text-center">Fri</th>
                  </tr>
                </thead>
                <tbody>
                  {hourlyHeatmap.map((row) => (
                    <tr key={row.hour}>
                      <td className="py-1.5 font-medium text-slate-600">{row.hour}</td>
                      {(["mon", "tue", "wed", "thu", "fri"] as const).map((day) => {
                        const val = Number(row[day]) || 0;
                        const intensity = Math.min(val / 65, 1);
                        return (
                          <td key={day} className="py-1.5 text-center">
                            <div
                              className="mx-auto flex h-8 w-10 items-center justify-center rounded-md text-[10px] font-bold transition-colors"
                              style={{
                                backgroundColor: `rgba(8, 145, 178, ${intensity * 0.6 + 0.05})`,
                                color: intensity > 0.5 ? "#fff" : "#334155",
                              }}
                            >
                              {val}%
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AiInsight variant="recommendation">
              10AM is the optimal send time across all weekdays. Wednesday at 10AM is the single best slot with 65% open rate.
            </AiInsight>
          </div>
        </div>

        {/* Channel Comparison */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-800">Channel Comparison</h3>
            </div>
            <BarChartFull
              data={[
                { channel: "Email", openRate: 58, clickRate: 24, responseRate: 8 },
                { channel: "SMS", openRate: 92, clickRate: 38, responseRate: 18 },
                { channel: "Phone", openRate: 0, clickRate: 0, responseRate: 45 },
              ] as unknown as Record<string, unknown>[]}
              bars={[
                { key: "openRate", color: "#2563eb", label: "Open Rate %" },
                { key: "clickRate", color: "#059669", label: "Click Rate %" },
                { key: "responseRate", color: "#7c3aed", label: "Response Rate %" },
              ]}
              xKey="channel"
              height={200}
            />
            <AiInsight variant="prediction">
              Phone calls have the highest response rate (45%) but lowest volume. Adding automated voice outreach via Vapi could increase conversions by 25%.
            </AiInsight>
          </div>

          {/* Monthly Engagement Trend */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-800">Monthly Engagement Trend</h3>
            </div>
            <TrendLine
              data={monthlyOutreach.map((m) => ({
                month: m.month,
                openRate: Math.round((m.opened / m.delivered) * 100),
                clickRate: Math.round((m.clicked / m.delivered) * 100),
                convRate: Math.round((m.converted / m.delivered) * 100),
              })) as unknown as Record<string, unknown>[]}
              lines={[
                { key: "openRate", color: "#0891b2", label: "Open Rate %" },
                { key: "clickRate", color: "#7c3aed", label: "Click Rate %" },
                { key: "convRate", color: "#d97706", label: "Conv. Rate %" },
              ]}
              xKey="month"
              height={200}
            />
          </div>
        </div>

        {/* Engagement by Campaign Type */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-800">Engagement by Campaign Type</h3>
            </div>
            <button
              onClick={() => exportCSV(campaignTypePerformance as unknown as Record<string, unknown>[], "engagement-by-type.csv")}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Download className="h-3 w-3" /> Export
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {campaignTypePerformance.map((ctp) => (
              <div key={ctp.type} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center">
                <p className="text-xs font-semibold text-slate-800 mb-2">{ctp.type}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{ctp.openRate}%</p>
                    <p className="text-[9px] text-slate-500 uppercase">Open</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-600">{ctp.clickRate}%</p>
                    <p className="text-[9px] text-slate-500 uppercase">Click</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-600">{ctp.convRate}%</p>
                    <p className="text-[9px] text-slate-500 uppercase">Convert</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unsubscribe & Bounce Rates */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-slate-800">Health Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-100 p-4">
              <p className="text-xs text-slate-500 mb-1">Bounce Rate</p>
              <p className="text-xl font-bold text-slate-900">{bounceRate}%</p>
              <div className="mt-2 flex items-center gap-1 text-[10px]">
                <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600">{bounceRate < 3 ? "Within healthy range" : "Needs attention"}</span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 p-4">
              <p className="text-xs text-slate-500 mb-1">Unsubscribe Rate</p>
              <p className="text-xl font-bold text-slate-900">{unsubscribeRate}%</p>
              <div className="mt-2 flex items-center gap-1 text-[10px]">
                <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600">{unsubscribeRate < 1 ? "Well below threshold" : "Monitor closely"}</span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 p-4">
              <p className="text-xs text-slate-500 mb-1">Spam Reports</p>
              <p className="text-xl font-bold text-slate-900">0.02%</p>
              <div className="mt-2 flex items-center gap-1 text-[10px]">
                <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600">Well below threshold</span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 p-4">
              <p className="text-xs text-slate-500 mb-1">List Growth Rate</p>
              <p className="text-xl font-bold text-emerald-600">+3.2%</p>
              <div className="mt-2 flex items-center gap-1 text-[10px]">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600">+48 new contacts/mo</span>
              </div>
            </div>
          </div>
          <AiInsight variant="alert">
            All health metrics are within excellent ranges. Bounce rate is below 2% and unsubscribe rate below 0.5% — your list hygiene is strong.
          </AiInsight>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  AI & Automation Tab                                              */
  /* ---------------------------------------------------------------- */
  function renderAiAutomation() {
    return (
      <div className="space-y-6">
        {/* AI Summary Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-purple-50 to-indigo-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4 text-purple-600" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600">AI-Generated</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{aiGeneratedCount.toLocaleString()}</p>
            <p className="text-xs text-slate-600 mt-1">Messages this month</p>
            <div className="mt-2 flex items-center gap-1 text-[10px]">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600">{totalSent > 0 ? Math.round((aiGeneratedCount / totalSent) * 100) : 0}% of total</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-cyan-50 to-blue-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-cyan-600" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-600">Automated</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{automatedCount.toLocaleString()}</p>
            <p className="text-xs text-slate-600 mt-1">Auto-sent messages</p>
            <div className="mt-2 flex items-center gap-1 text-[10px]">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600">{totalSent > 0 ? Math.round((automatedCount / totalSent) * 100) : 0}% automation rate</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Time Saved</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{Math.round(automatedCount * 2 / 60)}h</p>
            <p className="text-xs text-slate-600 mt-1">Staff hours this month</p>
            <div className="mt-2 flex items-center gap-1 text-[10px]">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600">~${(Math.round(automatedCount * 2 / 60) * 30).toLocaleString()} labor savings</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-amber-600" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">AI Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">94%</p>
            <p className="text-xs text-slate-600 mt-1">Message quality score</p>
            <div className="mt-2 flex items-center gap-1 text-[10px]">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600">Consistent performance</span>
            </div>
          </div>
        </div>

        {/* Automation vs Manual Trend */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-600" />
                <h3 className="text-sm font-semibold text-slate-800">Automation vs Manual Trend</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-400" /> Manual</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" /> Automated</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> AI-Generated</span>
              </div>
            </div>
            <TrendArea
              data={automationMetrics as unknown as Record<string, unknown>[]}
              areas={[
                { key: "manual", color: "#94a3b8", label: "Manual" },
                { key: "automated", color: "#0891b2", label: "Automated" },
                { key: "aiGenerated", color: "#7c3aed", label: "AI-Generated" },
              ]}
              xKey="month"
              height={220}
              stacked
            />
            <AiInsight variant="prediction">
              Automation ratio increased from 34% to 73% in 6 months. At this rate, manual outreach will drop below 15% by May — freeing up ~50 staff hours/month.
            </AiInsight>
          </div>

          {/* Automation Impact */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-800">Automation Impact</h3>
            </div>
            <div className="space-y-4">
              {[
                { metric: "Response Time", before: "4.2 hours", after: "< 5 min", improvement: "98% faster", color: "bg-emerald-500" },
                { metric: "Patient Reactivation", before: "8%", after: "22%", improvement: "+175%", color: "bg-blue-500" },
                { metric: "Appointment Booking", before: "12/week", after: "28/week", improvement: "+133%", color: "bg-purple-500" },
                { metric: "Review Requests", before: "15/month", after: "42/month", improvement: "+180%", color: "bg-amber-500" },
                { metric: "No-Show Follow-up", before: "45% missed", after: "100% covered", improvement: "0 missed", color: "bg-cyan-500" },
              ].map((item) => (
                <div key={item.metric} className="flex items-center gap-4">
                  <div className={cn("h-2 w-2 rounded-full flex-shrink-0", item.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800">{item.metric}</p>
                    <p className="text-[10px] text-slate-500">
                      Before: {item.before} → After: {item.after}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">{item.improvement}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <AiInsight variant="recommendation">
                Biggest wins are in response time and no-show follow-up. Consider expanding AI to handle insurance verification reminders next.
              </AiInsight>
            </div>
          </div>
        </div>

        {/* AI Gauge Rings */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-800">AI Performance Scores</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 py-2 sm:grid-cols-5">
            <GaugeRing value={94} label="Quality" color="#7c3aed" />
            <GaugeRing value={totalSent > 0 ? Math.round((automatedCount / totalSent) * 100) : 0} label="Automation" color="#0891b2" />
            <GaugeRing value={88} label="Relevance" color="#059669" />
            <GaugeRing value={91} label="Timing" color="#d97706" />
            <GaugeRing value={Math.round(deliveryRate)} label="Delivery" color="#2563eb" />
          </div>
        </div>

        {/* Recent AI Actions */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-800">AI Automation Summary</h3>
          </div>
          <div className="space-y-3">
            {(() => {
              const typeColors: Record<string, string> = {
                recall: "bg-green-50 text-green-700 border-green-200",
                automation: "bg-blue-50 text-blue-700 border-blue-200",
                content: "bg-purple-50 text-purple-700 border-purple-200",
                delivery: "bg-cyan-50 text-cyan-700 border-cyan-200",
              };
              const summaryItems = [
                { id: 1, action: `${automatedCount.toLocaleString()} messages auto-sent this month across all workflows`, type: "automation", impact: `${totalSent > 0 ? Math.round((automatedCount / totalSent) * 100) : 0}% automation rate` },
                { id: 2, action: `${aiGeneratedCount.toLocaleString()} messages were AI-generated with personalized content`, type: "content", impact: `${totalSent > 0 ? Math.round((aiGeneratedCount / totalSent) * 100) : 0}% AI-written` },
                { id: 3, action: `${conversionCount.toLocaleString()} patient conversions driven by outreach campaigns`, type: "recall", impact: `${totalSent > 0 ? Math.round((conversionCount / totalSent) * 100) : 0}% conversion rate` },
                { id: 4, action: `${Math.round(deliveryRate)}% delivery rate maintained across all channels`, type: "delivery", impact: `${bounceRate}% bounce rate` },
              ];
              return summaryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800">{item.action}</p>
                    <div className="mt-1">
                      <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-medium", typeColors[item.type] || "bg-slate-50 text-slate-700 border-slate-200")}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span className="text-[10px] font-medium text-emerald-700 whitespace-nowrap">{item.impact}</span>
                  </div>
                </div>
              ));
            })()}
          </div>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Patient Outreach
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Automated workflow sequences &amp; engagement analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyncIndicator />
          <button
            onClick={() =>
              exportCSV(
                monthlyOutreach as unknown as Record<string, unknown>[],
                "outreach-data.csv"
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
      {activeTab === "campaigns" && renderCampaigns()}
      {activeTab === "engagement" && renderEngagement()}
      {activeTab === "ai-automation" && renderAiAutomation()}

      {/* Create/Edit Workflow Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 rounded-t-xl">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingWorkflow ? "Edit Workflow" : "Create Workflow"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Workflow Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., 6-Month Recall Reminder"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Campaign Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                >
                  {Object.entries(typeConfig).map(([key, conf]) => (
                    <option key={key} value={key}>{conf.label}</option>
                  ))}
                </select>
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-700">Workflow Steps</label>
                  <button
                    onClick={addStep}
                    className="flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-700"
                  >
                    <Plus className="h-3 w-3" /> Add Step
                  </button>
                </div>
                <div className="space-y-3">
                  {formSteps.map((step, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-600">Step {i + 1}</span>
                        {formSteps.length > 1 && (
                          <button
                            onClick={() => removeStep(i)}
                            className="text-[10px] text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-500 mb-1">Channel</label>
                          <select
                            value={step.channel}
                            onChange={(e) => updateStep(i, "channel", e.target.value)}
                            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-700"
                          >
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="phone">Phone Call</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-500 mb-1">Delay (days)</label>
                          <input
                            type="number"
                            min={0}
                            value={step.delay_days}
                            onChange={(e) => updateStep(i, "delay_days", parseInt(e.target.value) || 0)}
                            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-700"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-[10px] font-medium text-slate-500 mb-1">Subject</label>
                        <input
                          type="text"
                          value={step.subject}
                          onChange={(e) => updateStep(i, "subject", e.target.value)}
                          placeholder="Message subject..."
                          className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-700"
                        />
                      </div>
                      <div className="mt-2">
                        <label className="block text-[10px] font-medium text-slate-500 mb-1">Message Body</label>
                        <textarea
                          value={step.body}
                          onChange={(e) => updateStep(i, "body", e.target.value)}
                          placeholder="Hi {{patient_name}}, it's time for your..."
                          rows={3}
                          className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-700 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 rounded-b-xl">
              {editingWorkflow && (
                pendingDeleteId === editingWorkflow.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Delete this workflow?</span>
                    <button
                      onClick={() => { setShowModal(false); handleDelete(editingWorkflow.id); }}
                      className="text-xs font-semibold text-red-600 hover:text-red-800"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setPendingDeleteId(null)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setPendingDeleteId(editingWorkflow.id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700"
                  >
                    Delete Workflow
                  </button>
                )
              )}
              <div className={cn("flex items-center gap-3", !editingWorkflow && "ml-auto")}>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formName.trim()}
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-medium text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving..." : editingWorkflow ? "Save Changes" : "Create Workflow"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
