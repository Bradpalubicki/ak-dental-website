"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Inbox,
  Search,
  Mail,
  MessageSquare,
  Phone,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  User,
  Filter,
  Download,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Send,
  Bot,
  Zap,
  Target,
  Activity,
  Globe,
  ChevronRight,
  Star,
  CheckCircle2,
  RefreshCw,
  Users,
  Eye,
  Reply,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  TrendLine,
  TrendArea,
  DonutChart,
  ProgressBar,
} from "@/components/dashboard/chart-components";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  id: string;
  createdAt: string;
  channel: string;
  direction: string;
  status: string;
  subject: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  patientId: string | null;
  patientName: string;
  patientPhone: string | null;
  patientEmail: string | null;
}

interface Conversation {
  patientId: string | null;
  patientName: string;
  patientPhone: string | null;
  patientEmail: string | null;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

interface Props {
  conversations: Conversation[];
}

/* ------------------------------------------------------------------ */
/*  Tabs                                                               */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "overview" as const, label: "Overview" },
  { id: "conversations" as const, label: "Conversations" },
  { id: "channels" as const, label: "Channel Analytics" },
  { id: "ai" as const, label: "AI & Automation" },
];
type TabId = (typeof TABS)[number]["id"];

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

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
  portal: Inbox,
};

const channelColors: Record<string, string> = {
  email: "#2563eb",
  sms: "#059669",
  call: "#d97706",
  portal: "#7c3aed",
};

/* ------------------------------------------------------------------ */
/*  Shared Components                                                  */
/* ------------------------------------------------------------------ */

function SyncIndicator() {
  const [lastSync, setLastSync] = useState("Just now");
  useEffect(() => {
    const iv = setInterval(() => setLastSync("Just now"), 30000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Live · {lastSync}
    </div>
  );
}

function GaugeRing({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  color = "#0891b2",
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-sm font-bold text-slate-900">{Math.round(pct * 100)}%</span>
      </div>
      {label && <span className="text-[10px] font-medium text-slate-500 text-center leading-tight">{label}</span>}
    </div>
  );
}

function AiInsight({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "prediction" | "recommendation" | "alert";
}) {
  const styles = {
    default: "from-cyan-50 to-blue-50 border-cyan-200/60 text-cyan-900",
    prediction: "from-purple-50 to-indigo-50 border-purple-200/60 text-purple-900",
    recommendation: "from-emerald-50 to-teal-50 border-emerald-200/60 text-emerald-900",
    alert: "from-amber-50 to-orange-50 border-amber-200/60 text-amber-900",
  };
  const icons = {
    default: Sparkles,
    prediction: TrendingUp,
    recommendation: Target,
    alert: AlertTriangle,
  };
  const Icon = icons[variant];
  return (
    <div className={cn("relative overflow-hidden rounded-lg border bg-gradient-to-r p-3", styles[variant])}>
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 mt-0.5 shrink-0 opacity-70" />
        <p className="text-xs leading-relaxed">{children}</p>
      </div>
      <div className="ai-shimmer" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo Data                                                          */
/* ------------------------------------------------------------------ */

const messageVolumeData = [
  { day: "Mon", inbound: 24, outbound: 18, ai: 12 },
  { day: "Tue", inbound: 31, outbound: 22, ai: 16 },
  { day: "Wed", inbound: 28, outbound: 25, ai: 18 },
  { day: "Thu", inbound: 35, outbound: 29, ai: 22 },
  { day: "Fri", inbound: 42, outbound: 34, ai: 26 },
  { day: "Sat", inbound: 15, outbound: 10, ai: 8 },
  { day: "Sun", inbound: 8, outbound: 5, ai: 3 },
];

const responseTimeData = [
  { hour: "8am", avg: 4.2, ai: 0.3 },
  { hour: "9am", avg: 6.1, ai: 0.2 },
  { hour: "10am", avg: 8.5, ai: 0.4 },
  { hour: "11am", avg: 5.3, ai: 0.3 },
  { hour: "12pm", avg: 12.4, ai: 0.5 },
  { hour: "1pm", avg: 9.8, ai: 0.3 },
  { hour: "2pm", avg: 7.2, ai: 0.2 },
  { hour: "3pm", avg: 5.6, ai: 0.3 },
  { hour: "4pm", avg: 8.9, ai: 0.4 },
  { hour: "5pm", avg: 11.2, ai: 0.6 },
];

const weeklyTrendData = [
  { week: "W1", messages: 142, responses: 128, satisfaction: 92 },
  { week: "W2", messages: 156, responses: 148, satisfaction: 94 },
  { week: "W3", messages: 168, responses: 160, satisfaction: 91 },
  { week: "W4", messages: 183, responses: 175, satisfaction: 95 },
];

const channelPerformance = [
  { channel: "Email", sent: 245, delivered: 238, opened: 186, replied: 67, rate: 28.2, color: "#2563eb" },
  { channel: "SMS", sent: 412, delivered: 405, opened: 398, replied: 156, rate: 38.5, color: "#059669" },
  { channel: "Phone", sent: 0, received: 89, answered: 72, voicemail: 17, rate: 80.9, color: "#d97706" },
  { channel: "Portal", sent: 34, viewed: 28, replied: 12, rate: 42.9, color: "#7c3aed" },
];

const sentimentData = [
  { name: "Positive", value: 58, color: "#059669" },
  { name: "Neutral", value: 28, color: "#64748b" },
  { name: "Negative", value: 14, color: "#dc2626" },
];

const aiAutomationTrend = [
  { month: "Sep", manual: 82, aiAssisted: 14, fullyAuto: 4 },
  { month: "Oct", manual: 74, aiAssisted: 18, fullyAuto: 8 },
  { month: "Nov", manual: 65, aiAssisted: 22, fullyAuto: 13 },
  { month: "Dec", manual: 58, aiAssisted: 26, fullyAuto: 16 },
  { month: "Jan", manual: 48, aiAssisted: 30, fullyAuto: 22 },
  { month: "Feb", manual: 40, aiAssisted: 34, fullyAuto: 26 },
];

const recentAiActions = [
  { time: "2m ago", action: "Auto-replied to appointment inquiry", patient: "Sarah M.", channel: "sms", confidence: 96 },
  { time: "8m ago", action: "Drafted insurance pre-auth follow-up", patient: "James K.", channel: "email", confidence: 91 },
  { time: "15m ago", action: "Flagged urgent: post-op complaint", patient: "Maria L.", channel: "portal", confidence: 98 },
  { time: "22m ago", action: "Routed billing question to front desk", patient: "David R.", channel: "email", confidence: 88 },
  { time: "35m ago", action: "Auto-confirmed appointment reminder reply", patient: "Lisa P.", channel: "sms", confidence: 94 },
  { time: "48m ago", action: "Classified & tagged recall message", patient: "Robert W.", channel: "email", confidence: 92 },
];

const hourlyHeatmap = [
  { hour: "8am", mon: 3, tue: 5, wed: 4, thu: 6, fri: 8, sat: 2, sun: 1 },
  { hour: "9am", mon: 8, tue: 10, wed: 9, thu: 11, fri: 12, sat: 4, sun: 2 },
  { hour: "10am", mon: 12, tue: 14, wed: 11, thu: 13, fri: 15, sat: 5, sun: 2 },
  { hour: "11am", mon: 10, tue: 11, wed: 13, thu: 12, fri: 14, sat: 4, sun: 1 },
  { hour: "12pm", mon: 6, tue: 7, wed: 8, thu: 7, fri: 9, sat: 3, sun: 1 },
  { hour: "1pm", mon: 9, tue: 10, wed: 11, thu: 10, fri: 13, sat: 4, sun: 2 },
  { hour: "2pm", mon: 11, tue: 12, wed: 10, thu: 14, fri: 12, sat: 3, sun: 1 },
  { hour: "3pm", mon: 8, tue: 9, wed: 10, thu: 11, fri: 10, sat: 2, sun: 1 },
  { hour: "4pm", mon: 7, tue: 8, wed: 7, thu: 9, fri: 8, sat: 2, sun: 0 },
  { hour: "5pm", mon: 4, tue: 5, wed: 6, thu: 5, fri: 6, sat: 1, sun: 0 },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function InboxClient({ conversations }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selected, setSelected] = useState<Conversation | null>(conversations[0] || null);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  );

  const totalMessages = useMemo(
    () => conversations.reduce((sum, c) => sum + c.messages.length, 0),
    [conversations]
  );

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch =
        search === "" ||
        c.patientName.toLowerCase().includes(search.toLowerCase()) ||
        c.patientPhone?.includes(search) ||
        c.patientEmail?.toLowerCase().includes(search.toLowerCase());
      const matchesChannel =
        channelFilter === "all" || c.lastMessage.channel === channelFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "unread" && c.unreadCount > 0) ||
        (statusFilter === "replied" && c.lastMessage.status === "replied") ||
        (statusFilter === "pending" && c.lastMessage.status !== "replied");
      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [conversations, search, channelFilter, statusFilter]);

  const channelBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    conversations.forEach((c) => {
      c.messages.forEach((m) => {
        counts[m.channel] = (counts[m.channel] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: channelColors[name] || "#64748b",
    }));
  }, [conversations]);

  const exportCSV = () => {
    const rows = conversations.flatMap((c) =>
      c.messages.map((m) => ({
        patient: c.patientName,
        channel: m.channel,
        direction: m.direction,
        status: m.status,
        content: m.content.substring(0, 100),
        date: m.createdAt,
      }))
    );
    const header = Object.keys(rows[0] || {}).join(",");
    const csv = [header, ...rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inbox-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------------------------------------------------------- */
  /*  OVERVIEW TAB                                                     */
  /* ---------------------------------------------------------------- */
  const renderOverview = () => (
    <div className="space-y-6">
      <AiInsight variant="recommendation">
        <strong>One Engine Inbox Analysis:</strong> Response times improved 23% this week. SMS has the highest engagement rate at 38.5%.
        Consider shifting more appointment confirmations to SMS for faster patient responses.
      </AiInsight>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-6">
        <StatCard
          title="Total Messages"
          value={totalMessages > 0 ? totalMessages.toLocaleString() : "183"}
          change="+12% vs last week"
          trend="up"
          icon={MessageSquare}
          iconColor="text-cyan-600 bg-cyan-50"
          sparkData={[120, 135, 142, 156, 168, 183]}
          sparkColor="#0891b2"
          accentColor="#0891b2"
        />
        <StatCard
          title="Unread"
          value={totalUnread > 0 ? totalUnread.toString() : "7"}
          change="3 urgent"
          trend="down"
          icon={Inbox}
          iconColor="text-red-600 bg-red-50"
          sparkData={[15, 12, 9, 11, 8, 7]}
          sparkColor="#dc2626"
          accentColor="#dc2626"
          pulse={totalUnread > 0}
        />
        <StatCard
          title="Conversations"
          value={conversations.length > 0 ? conversations.length.toString() : "48"}
          change="+6 new today"
          trend="up"
          icon={Users}
          iconColor="text-blue-600 bg-blue-50"
          sparkData={[32, 36, 38, 42, 45, 48]}
          sparkColor="#2563eb"
          accentColor="#2563eb"
        />
        <StatCard
          title="Avg Response"
          value="4.2m"
          change="-1.8m from avg"
          trend="up"
          icon={Clock}
          iconColor="text-emerald-600 bg-emerald-50"
          sparkData={[8.5, 7.2, 6.1, 5.3, 4.8, 4.2]}
          sparkColor="#059669"
          accentColor="#059669"
        />
        <StatCard
          title="AI Handled"
          value="62%"
          change="+8% this month"
          trend="up"
          icon={Bot}
          iconColor="text-purple-600 bg-purple-50"
          sparkData={[42, 48, 52, 56, 59, 62]}
          sparkColor="#7c3aed"
          accentColor="#7c3aed"
        />
        <StatCard
          title="Satisfaction"
          value="94%"
          change="+2% vs last month"
          trend="up"
          icon={Star}
          iconColor="text-amber-600 bg-amber-50"
          sparkData={[88, 90, 91, 92, 93, 94]}
          sparkColor="#d97706"
          accentColor="#d97706"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Message Volume */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Message Volume</h3>
              <p className="text-xs text-slate-500">Daily inbound vs outbound vs AI-handled</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" />Inbound</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" />Outbound</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" />AI</span>
            </div>
          </div>
          <TrendArea
            data={messageVolumeData as unknown as Record<string, unknown>[]}
            areas={[
              { key: "inbound", color: "#0891b2", label: "Inbound" },
              { key: "outbound", color: "#2563eb", label: "Outbound" },
              { key: "ai", color: "#7c3aed", label: "AI Handled" },
            ]}
            xKey="day"
            height={220}
            stacked
          />
        </div>

        {/* Channel Mix */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Channel Mix</h3>
              <p className="text-xs text-slate-500">Messages by communication channel</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <DonutChart
                data={channelBreakdown.length > 0 ? channelBreakdown : [
                  { name: "Email", value: 245, color: "#2563eb" },
                  { name: "SMS", value: 412, color: "#059669" },
                  { name: "Phone", value: 89, color: "#d97706" },
                  { name: "Portal", value: 34, color: "#7c3aed" },
                ]}
                height={200}
                innerRadius={55}
                outerRadius={80}
                centerLabel="total"
                centerValue={totalMessages > 0 ? totalMessages.toString() : "780"}
              />
            </div>
            <div className="space-y-3">
              {(channelBreakdown.length > 0 ? channelBreakdown : [
                { name: "SMS", value: 412, color: "#059669" },
                { name: "Email", value: 245, color: "#2563eb" },
                { name: "Phone", value: 89, color: "#d97706" },
                { name: "Portal", value: 34, color: "#7c3aed" },
              ]).map((ch) => (
                <div key={ch.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                  <span className="text-xs text-slate-600 w-14">{ch.name}</span>
                  <span className="text-xs font-semibold text-slate-900">{ch.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Response Time by Hour */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Response Time by Hour</h3>
              <p className="text-xs text-slate-500">Average response time (minutes) - Staff vs AI</p>
            </div>
          </div>
          <TrendLine
            data={responseTimeData as unknown as Record<string, unknown>[]}
            lines={[
              { key: "avg", color: "#0891b2", label: "Staff Avg" },
              { key: "ai", color: "#7c3aed", label: "AI Response", dashed: true },
            ]}
            xKey="hour"
            height={200}
          />
        </div>

        {/* Patient Sentiment */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Patient Sentiment</h3>
              <p className="text-xs text-slate-500">AI-analyzed message tone this week</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <DonutChart
              data={sentimentData}
              height={180}
              innerRadius={50}
              outerRadius={70}
              centerLabel="positive"
              centerValue="58%"
            />
            <div className="space-y-3 flex-1">
              {sentimentData.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">{s.name}</span>
                    <span className="text-xs font-semibold text-slate-900">{s.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${s.value}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AiInsight variant="prediction">
            Patient sentiment trending 4% more positive month-over-month. Faster AI response times correlate with higher satisfaction scores.
          </AiInsight>
        </div>
      </div>

      {/* Gauge Rings */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Inbox Health Metrics</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          <div className="relative flex flex-col items-center">
            <GaugeRing value={94} color="#059669" label="Response Rate" />
          </div>
          <div className="relative flex flex-col items-center">
            <GaugeRing value={62} color="#7c3aed" label="AI Handling" />
          </div>
          <div className="relative flex flex-col items-center">
            <GaugeRing value={88} color="#0891b2" label="SLA Compliance" />
          </div>
          <div className="relative flex flex-col items-center">
            <GaugeRing value={96} color="#2563eb" label="Delivery Rate" />
          </div>
          <div className="relative flex flex-col items-center">
            <GaugeRing value={78} color="#d97706" label="First Contact Res." />
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  CONVERSATIONS TAB                                                */
  /* ---------------------------------------------------------------- */
  const renderConversations = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Channels</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="call">Phone</option>
          <option value="portal">Portal</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="replied">Replied</option>
          <option value="pending">Pending</option>
        </select>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="text-xs text-slate-500">
        {filteredConversations.length} conversation{filteredConversations.length !== 1 ? "s" : ""}
        {totalUnread > 0 && <span className="ml-1 font-medium text-cyan-600">· {totalUnread} unread</span>}
      </div>

      {/* Two-panel layout */}
      <div
        className="grid grid-cols-1 gap-0 lg:grid-cols-5 rounded-xl border border-slate-200 bg-white overflow-hidden"
        style={{ height: "calc(100vh - 340px)" }}
      >
        {/* Conversation List */}
        <div className="lg:col-span-2 border-r border-slate-200 flex flex-col">
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const ChannelIcon = channelIcons[conv.lastMessage.channel] || MessageSquare;
                const isSelected =
                  selected?.patientId === conv.patientId &&
                  selected?.patientName === conv.patientName;

                return (
                  <button
                    key={conv.patientId || conv.patientName}
                    onClick={() => setSelected(conv)}
                    className={cn(
                      "w-full text-left px-4 py-3 transition-all duration-200",
                      isSelected
                        ? "bg-cyan-50 border-l-2 border-l-cyan-500"
                        : "hover:bg-slate-50 border-l-2 border-l-transparent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                        conv.unreadCount > 0 ? "bg-cyan-100" : "bg-slate-100"
                      )}>
                        <User className={cn("h-5 w-5", conv.unreadCount > 0 ? "text-cyan-600" : "text-slate-400")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-sm truncate",
                            conv.unreadCount > 0 ? "font-bold text-slate-900" : "font-medium text-slate-700"
                          )}>
                            {conv.patientName}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                            {timeAgo(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <ChannelIcon className="h-3 w-3 text-slate-400 shrink-0" />
                          <p className={cn(
                            "text-xs truncate",
                            conv.unreadCount > 0 ? "text-slate-700" : "text-slate-500"
                          )}>
                            {conv.lastMessage.direction === "inbound" ? "" : "You: "}
                            {conv.lastMessage.content.substring(0, 55)}
                            {conv.lastMessage.content.length > 55 ? "..." : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          {conv.unreadCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1.5 text-[10px] font-bold text-white">
                              {conv.unreadCount}
                            </span>
                          )}
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor: `${channelColors[conv.lastMessage.channel] || "#64748b"}15`,
                              color: channelColors[conv.lastMessage.channel] || "#64748b",
                            }}
                          >
                            {conv.lastMessage.channel}
                          </span>
                          {conv.lastMessage.status === "replied" && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" /> Replied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-sm text-slate-400">
                <Inbox className="h-8 w-8 mb-2" />
                {conversations.length === 0
                  ? "No messages yet"
                  : "No conversations match your filters"}
              </div>
            )}
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-3 flex flex-col">
          {selected ? (
            <>
              {/* Conversation Header */}
              <div className="border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                      <User className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        {selected.patientName}
                      </h2>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-500">
                        {selected.patientPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {selected.patientPhone}
                          </span>
                        )}
                        {selected.patientEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {selected.patientEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">
                      {selected.messages.length} message{selected.messages.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {[...selected.messages].reverse().map((msg) => {
                  const isInbound = msg.direction === "inbound";
                  const ChannelIcon = channelIcons[msg.channel] || MessageSquare;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isInbound ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                          isInbound
                            ? "bg-white border border-slate-200 text-slate-900"
                            : "bg-gradient-to-br from-cyan-600 to-cyan-700 text-white"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          {isInbound ? (
                            <ArrowDownLeft className="h-3 w-3 opacity-50" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 opacity-50" />
                          )}
                          <ChannelIcon className="h-3 w-3 opacity-50" />
                          <span
                            className={cn(
                              "text-[10px] uppercase font-medium",
                              isInbound ? "text-slate-400" : "text-cyan-100"
                            )}
                          >
                            {msg.channel} · {isInbound ? "received" : "sent"}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-2",
                            isInbound ? "text-slate-400" : "text-cyan-100"
                          )}
                        >
                          {formatDateTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-slate-200 px-6 py-3 flex items-center gap-3 bg-white">
                <a
                  href="/dashboard/approvals"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <CheckCircle2 className="h-3 w-3" /> Approvals
                </a>
                <a
                  href="/dashboard/patients"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-3 w-3" /> Patient Record
                </a>
                <a
                  href="/dashboard/outreach"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Send className="h-3 w-3" /> Outreach
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-sm text-slate-400">
              <Inbox className="h-10 w-10 mb-3 text-slate-300" />
              <p className="font-medium text-slate-500">Select a conversation</p>
              <p className="text-xs mt-1">Choose from the list to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  CHANNEL ANALYTICS TAB                                            */
  /* ---------------------------------------------------------------- */
  const renderChannels = () => (
    <div className="space-y-6">
      <AiInsight variant="default">
        <strong>Channel Intelligence:</strong> SMS consistently outperforms email with 38.5% reply rate vs 28.2%.
        Peak inbox activity is 10am-2pm on weekdays. After-hours messages are 94% AI-handled.
      </AiInsight>

      {/* Channel Performance Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channelPerformance.map((ch) => {
          const Icon = channelIcons[ch.channel.toLowerCase()] || MessageSquare;
          return (
            <div key={ch.channel} className="rounded-xl border border-slate-200/80 bg-white p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${ch.color}15`, color: ch.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{ch.channel}</h4>
                  <p className="text-[11px] text-slate-500">{ch.rate}% engagement</p>
                </div>
              </div>
              <div className="space-y-2">
                <ProgressBar value={ch.rate} max={100} color={`bg-[${ch.color}]`} label="Engagement Rate" size="md" />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="text-center rounded-lg bg-slate-50 p-2">
                    <p className="text-lg font-bold text-slate-900">{ch.sent || ch.received || 0}</p>
                    <p className="text-[10px] text-slate-500">{ch.sent ? "Sent" : "Received"}</p>
                  </div>
                  <div className="text-center rounded-lg bg-slate-50 p-2">
                    <p className="text-lg font-bold text-slate-900">{ch.replied || ch.answered || 0}</p>
                    <p className="text-[10px] text-slate-500">{ch.replied ? "Replied" : "Answered"}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Trend */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Weekly Trend</h3>
              <p className="text-xs text-slate-500">Messages, responses, and satisfaction</p>
            </div>
          </div>
          <TrendLine
            data={weeklyTrendData as unknown as Record<string, unknown>[]}
            lines={[
              { key: "messages", color: "#0891b2", label: "Messages" },
              { key: "responses", color: "#059669", label: "Responses" },
              { key: "satisfaction", color: "#d97706", label: "Satisfaction %", dashed: true },
            ]}
            xKey="week"
            height={220}
          />
        </div>

        {/* Message Volume Heatmap */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Activity Heatmap</h3>
              <p className="text-xs text-slate-500">Messages by hour and day of week</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr>
                  <th className="text-left text-slate-500 font-medium pb-2 pr-2">Hour</th>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <th key={d} className="text-center text-slate-500 font-medium pb-2 px-1">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hourlyHeatmap.map((row) => (
                  <tr key={row.hour}>
                    <td className="text-slate-500 py-0.5 pr-2 font-medium">{row.hour}</td>
                    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => {
                      const val = row[day as keyof typeof row] as number;
                      const maxVal = 15;
                      const intensity = Math.min(val / maxVal, 1);
                      return (
                        <td key={day} className="p-0.5">
                          <div
                            className="h-6 w-full rounded-sm flex items-center justify-center text-[9px] font-medium transition-colors"
                            style={{
                              backgroundColor: intensity > 0
                                ? `rgba(8, 145, 178, ${0.1 + intensity * 0.7})`
                                : "#f8fafc",
                              color: intensity > 0.5 ? "#fff" : "#64748b",
                            }}
                          >
                            {val > 0 ? val : ""}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Funnel: Message to Resolution */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Message Resolution Funnel</h3>
        <p className="text-xs text-slate-500 mb-4">From received to resolved — this month</p>
        <div className="space-y-3">
          {[
            { label: "Messages Received", value: 780, pct: 100, color: "#0891b2" },
            { label: "Acknowledged", value: 742, pct: 95.1, color: "#2563eb" },
            { label: "Responded To", value: 698, pct: 89.5, color: "#059669" },
            { label: "Resolved (1st Contact)", value: 542, pct: 69.5, color: "#7c3aed" },
            { label: "Fully Closed", value: 486, pct: 62.3, color: "#d97706" },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 w-40 shrink-0">{step.label}</span>
              <div className="flex-1 h-7 rounded-lg bg-slate-50 overflow-hidden relative">
                <div
                  className="h-full rounded-lg transition-all duration-700 flex items-center"
                  style={{ width: `${step.pct}%`, backgroundColor: step.color }}
                >
                  <span className="text-[10px] font-bold text-white ml-2">{step.value}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-700 w-12 text-right">{step.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  AI & AUTOMATION TAB                                              */
  /* ---------------------------------------------------------------- */
  const renderAi = () => (
    <div className="space-y-6">
      {/* AI Summary Banner */}
      <div className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-5 w-5" />
          <h3 className="text-base font-semibold">One Engine Inbox AI</h3>
          <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
            Active
          </span>
        </div>
        <p className="text-sm text-white/80 mb-4">
          AI processed 483 messages this month — auto-replied to 186, drafted 142, classified 155.
          Average confidence: 93.2%. Zero false-positive escalations.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Auto-Replied", value: "186", sub: "38.5%" },
            { label: "AI Drafted", value: "142", sub: "29.4%" },
            { label: "Classified", value: "155", sub: "32.1%" },
            { label: "Escalated", value: "12", sub: "2.5%" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white/10 backdrop-blur-sm p-3 text-center">
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] text-white/70">{s.label}</p>
              <p className="text-[10px] font-medium text-white/90">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Automation Adoption Trend */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Automation Adoption</h3>
              <p className="text-xs text-slate-500">Manual vs AI-assisted vs fully automated</p>
            </div>
          </div>
          <TrendArea
            data={aiAutomationTrend as unknown as Record<string, unknown>[]}
            areas={[
              { key: "manual", color: "#64748b", label: "Manual" },
              { key: "aiAssisted", color: "#0891b2", label: "AI Assisted" },
              { key: "fullyAuto", color: "#7c3aed", label: "Fully Automated" },
            ]}
            xKey="month"
            height={220}
            stacked
          />
        </div>

        {/* AI Performance Gauges */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">AI Performance</h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="relative flex flex-col items-center">
              <GaugeRing value={93} color="#059669" label="Avg Confidence" />
            </div>
            <div className="relative flex flex-col items-center">
              <GaugeRing value={97} color="#2563eb" label="Classification Accuracy" />
            </div>
            <div className="relative flex flex-col items-center">
              <GaugeRing value={88} color="#7c3aed" label="Sentiment Accuracy" />
            </div>
            <div className="relative flex flex-col items-center">
              <GaugeRing value={95} color="#0891b2" label="Response Quality" />
            </div>
          </div>
          <AiInsight variant="recommendation">
            AI confidence is highest for appointment-related messages (97%) and lowest for insurance queries (84%).
            Consider adding insurance FAQ training data to improve auto-response accuracy.
          </AiInsight>
        </div>
      </div>

      {/* Before/After Impact */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">AI Impact — Before vs After</h3>
        <p className="text-xs text-slate-500 mb-4">Key metrics comparison since One Engine Inbox AI activation</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { metric: "Avg Response Time", before: "12.4 min", after: "4.2 min", change: "-66%", improved: true },
            { metric: "Messages/Day Handled", before: "28", after: "52", change: "+86%", improved: true },
            { metric: "Missed Messages", before: "8/day", after: "1/day", change: "-88%", improved: true },
            { metric: "Patient Satisfaction", before: "82%", after: "94%", change: "+15%", improved: true },
          ].map((item) => (
            <div key={item.metric} className="rounded-lg border border-slate-200 p-4 space-y-3">
              <p className="text-xs font-medium text-slate-500">{item.metric}</p>
              <div className="flex items-center gap-3">
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-400 mb-1">Before</p>
                  <p className="text-sm font-semibold text-slate-500">{item.before}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-400 mb-1">After</p>
                  <p className="text-sm font-bold text-slate-900">{item.after}</p>
                </div>
              </div>
              <div className={cn(
                "text-center rounded-full py-0.5 text-[10px] font-bold",
                item.improved ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              )}>
                {item.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent AI Actions */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent AI Actions</h3>
            <p className="text-xs text-slate-500">Real-time One Engine inbox processing</p>
          </div>
          <SyncIndicator />
        </div>
        <div className="space-y-2">
          {recentAiActions.map((action, i) => {
            const ChannelIcon = channelIcons[action.channel] || MessageSquare;
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{action.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-500">{action.patient}</span>
                    <span className="text-[10px] text-slate-300">·</span>
                    <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
                      <ChannelIcon className="h-2.5 w-2.5" /> {action.channel}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                    action.confidence >= 95
                      ? "bg-emerald-50 text-emerald-700"
                      : action.confidence >= 90
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                  )}>
                    {action.confidence}%
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{action.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Capabilities Grid */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Inbox AI Capabilities</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Smart Triage", desc: "Auto-classify by urgency, intent, and channel", icon: Filter, active: true },
            { name: "Auto-Reply", desc: "Instant responses for common inquiries", icon: Reply, active: true },
            { name: "Sentiment Analysis", desc: "Real-time tone detection on all messages", icon: Activity, active: true },
            { name: "Draft Composer", desc: "AI-generated reply drafts for staff review", icon: Sparkles, active: true },
            { name: "Escalation Detection", desc: "Flag urgent/negative messages instantly", icon: AlertTriangle, active: true },
            { name: "Multi-Channel Sync", desc: "Unified view across email, SMS, phone, portal", icon: Globe, active: true },
            { name: "Patient Context", desc: "Auto-pull patient history for conversations", icon: Eye, active: false },
            { name: "Smart Routing", desc: "Route to right staff based on message content", icon: Zap, active: false },
            { name: "Follow-Up Reminders", desc: "Auto-detect unanswered conversations", icon: RefreshCw, active: true },
          ].map((cap) => (
            <div
              key={cap.name}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                cap.active
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-slate-200 bg-slate-50/50"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                cap.active ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
              )}>
                <cap.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-slate-900">{cap.name}</p>
                  {cap.active ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <span className="text-[9px] rounded-full bg-slate-200 px-1.5 py-0.5 text-slate-500">Planned</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inbox</h1>
          <p className="text-sm text-slate-500">
            Unified patient communications · {conversations.length} conversations
            {totalUnread > 0 && (
              <span className="ml-1 font-medium text-cyan-600">· {totalUnread} unread</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyncIndicator />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "conversations" && renderConversations()}
      {activeTab === "channels" && renderChannels()}
      {activeTab === "ai" && renderAi()}

      {/* AI Shimmer Styles */}
      <style jsx global>{`
        .ai-shimmer::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
}
