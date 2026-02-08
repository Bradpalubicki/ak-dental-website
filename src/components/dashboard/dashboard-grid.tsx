"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ResponsiveGridLayout,
  useContainerWidth,
  verticalCompactor,
} from "react-grid-layout";
import type { LayoutItem, ResponsiveLayouts } from "react-grid-layout";
import {
  Settings2,
  GripVertical,
  X,
  RotateCcw,
  Calendar,
  UserPlus,
  Sparkles,
  Wallet,
  UsersRound,
  Shield,
  Award,
  Send,
  Siren,
  BarChart3,
  Eye,
  TrendingUp,
  Users,
  Zap,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  FileText,
} from "lucide-react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// ─── Widget registry ──────────────────────────────────────────────
interface WidgetDef {
  id: string;
  label: string;
  icon: typeof Calendar;
  minW: number;
  minH: number;
  defaultW: number;
  defaultH: number;
}

const WIDGET_REGISTRY: WidgetDef[] = [
  { id: "urgent", label: "Needs Attention", icon: Siren, minW: 2, minH: 2, defaultW: 4, defaultH: 3 },
  { id: "kpi", label: "Key Metrics", icon: BarChart3, minW: 2, minH: 2, defaultW: 4, defaultH: 3 },
  { id: "appointments", label: "Today's Schedule", icon: Calendar, minW: 2, minH: 3, defaultW: 2, defaultH: 5 },
  { id: "leads", label: "Recent Leads", icon: UserPlus, minW: 2, minH: 3, defaultW: 2, defaultH: 5 },
  { id: "ai_activity", label: "AI Activity", icon: Sparkles, minW: 2, minH: 2, defaultW: 4, defaultH: 4 },
  { id: "financials", label: "Financial Summary", icon: Wallet, minW: 2, minH: 2, defaultW: 2, defaultH: 4 },
  { id: "hr", label: "HR & Payroll", icon: UsersRound, minW: 2, minH: 2, defaultW: 2, defaultH: 4 },
  { id: "compliance", label: "Compliance Alerts", icon: Award, minW: 2, minH: 2, defaultW: 2, defaultH: 4 },
  { id: "insurance", label: "Insurance", icon: Shield, minW: 2, minH: 2, defaultW: 2, defaultH: 4 },
  { id: "outreach", label: "Outreach", icon: Send, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
];

const DEFAULT_VISIBLE = [
  "urgent", "kpi", "appointments", "leads", "ai_activity",
  "financials", "hr", "compliance", "insurance", "outreach",
];

function buildDefaultLayout(visible: string[]): LayoutItem[] {
  const items: LayoutItem[] = [];
  let x = 0;
  let y = 0;
  visible.forEach((id) => {
    const def = WIDGET_REGISTRY.find((w) => w.id === id);
    if (!def) return;
    if (x + def.defaultW > 4) { x = 0; y += 4; }
    items.push({
      i: id,
      x,
      y,
      w: def.defaultW,
      h: def.defaultH,
      minW: def.minW,
      minH: def.minH,
    });
    x += def.defaultW;
    if (x >= 4) { x = 0; y += def.defaultH; }
  });
  return items;
}

// ─── Widget Content Components ────────────────────────────────────

interface DashboardData {
  appointments: Array<{ id: string; time: string; patientName: string; type: string; status: string }>;
  leads: Array<{ id: string; name: string; source: string; urgency: string; createdAt: string }>;
  aiActions: Array<{ id: string; description: string; module: string; status: string; createdAt: string }>;
  urgentItems: Array<{ type: string; label: string; detail: string; href: string; level: string }>;
  stats: {
    appointmentCount: number;
    unconfirmedCount: number;
    leadCount: number;
    pendingApprovals: number;
    pendingInsurance: number;
    patientCount: number;
    aiActionsToday: number;
    approvedToday: number;
  };
}

function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${minutes} ${ampm}`;
}

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-50 text-blue-700 ring-blue-600/20", dot: "bg-blue-500" },
  confirmed: { label: "Confirmed", color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  checked_in: { label: "Checked In", color: "bg-purple-50 text-purple-700 ring-purple-600/20", dot: "bg-purple-500" },
  in_progress: { label: "In Progress", color: "bg-cyan-50 text-cyan-700 ring-cyan-600/20", dot: "bg-cyan-500" },
  completed: { label: "Completed", color: "bg-green-50 text-green-700 ring-green-600/20", dot: "bg-green-500" },
  no_show: { label: "No Show", color: "bg-red-50 text-red-700 ring-red-600/20", dot: "bg-red-500" },
};

function UrgentWidget({ data }: { data: DashboardData }) {
  if (data.urgentItems.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300 mb-2" />
          <p className="text-sm font-medium text-emerald-600">All clear — no urgent items</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {data.urgentItems.slice(0, 4).map((item, i) => (
        <a key={i} href={item.href} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all hover:shadow-sm ${
          item.level === "critical" ? "border-red-200 bg-red-50/50 hover:bg-red-50" :
          item.level === "warning" ? "border-amber-200 bg-amber-50/50 hover:bg-amber-50" :
          "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
        }`}>
          <AlertTriangle className={`h-4 w-4 shrink-0 ${
            item.level === "critical" ? "text-red-500" : item.level === "warning" ? "text-amber-500" : "text-blue-500"
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{item.label}</p>
            <p className="text-[10px] text-slate-500 truncate">{item.detail}</p>
          </div>
          <ArrowRight className="h-3 w-3 shrink-0 text-slate-300" />
        </a>
      ))}
    </div>
  );
}

function KpiWidget({ data }: { data: DashboardData }) {
  const kpis = [
    { label: "Appointments", value: data.stats.appointmentCount, icon: Calendar, color: "text-blue-600 bg-blue-50" },
    { label: "New Leads", value: data.stats.leadCount, icon: UserPlus, color: "text-emerald-600 bg-emerald-50" },
    { label: "Approvals", value: data.stats.pendingApprovals, icon: Eye, color: "text-amber-600 bg-amber-50" },
    { label: "Patients", value: data.stats.patientCount, icon: Users, color: "text-cyan-600 bg-cyan-50" },
    { label: "AI Actions", value: data.stats.aiActionsToday, icon: Zap, color: "text-indigo-600 bg-indigo-50" },
    { label: "Insurance", value: data.stats.pendingInsurance, icon: Shield, color: "text-purple-600 bg-purple-50" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center">
            <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${kpi.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{kpi.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function AppointmentsWidget({ data }: { data: DashboardData }) {
  if (data.appointments.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Calendar className="mx-auto h-8 w-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400">No appointments today</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {data.appointments.slice(0, 8).map((apt) => {
        const sc = statusConfig[apt.status] || statusConfig.scheduled;
        return (
          <div key={apt.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors">
            <span className="text-[11px] font-bold text-slate-500 w-16 shrink-0">{formatTime(apt.time)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{apt.patientName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{apt.type.replace(/_/g, " ")}</p>
            </div>
            <span className={`h-2 w-2 rounded-full shrink-0 ${sc.dot}`} />
          </div>
        );
      })}
      <a href="/dashboard/appointments" className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors">
        View all <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

function LeadsWidget({ data }: { data: DashboardData }) {
  const urgencyDot: Record<string, string> = {
    emergency: "bg-red-500", high: "bg-orange-500", medium: "bg-amber-400", low: "bg-emerald-400",
  };
  if (data.leads.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <UserPlus className="mx-auto h-8 w-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400">No new leads today</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {data.leads.slice(0, 6).map((lead) => (
        <div key={lead.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700">
            {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{lead.name}</p>
            <p className="text-[10px] text-slate-400">{lead.source.replace(/_/g, " ")} · {timeAgo(lead.createdAt)}</p>
          </div>
          <span className={`h-2 w-2 rounded-full shrink-0 ${urgencyDot[lead.urgency] || "bg-slate-300"}`} />
        </div>
      ))}
      <a href="/dashboard/leads" className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors">
        View all <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

function AiActivityWidget({ data }: { data: DashboardData }) {
  if (data.aiActions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-8 w-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400">No AI activity yet</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {data.aiActions.slice(0, 6).map((action) => (
        <div key={action.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors">
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
            action.status === "pending_approval" ? "bg-amber-50" : action.status === "rejected" ? "bg-red-50" : "bg-cyan-50"
          }`}>
            {action.status === "pending_approval" ? <Clock className="h-3.5 w-3.5 text-amber-600" /> :
             action.status === "rejected" ? <XCircle className="h-3.5 w-3.5 text-red-600" /> :
             <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-900 truncate">{action.description}</p>
            <p className="text-[10px] text-slate-400">{action.module.replace(/_/g, " ")} · {timeAgo(action.createdAt)}</p>
          </div>
        </div>
      ))}
      <a href="/dashboard/approvals" className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors">
        View all <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

function FinancialsWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Revenue MTD</p>
          <p className="text-xl font-bold text-slate-900">$47,850</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Collections</span>
          <span className="font-semibold text-slate-900">$43,250</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Outstanding AR</span>
          <span className="font-semibold text-amber-600">$18,430</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Collection Rate</span>
          <span className="font-semibold text-emerald-600">96.1%</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Net Income</span>
          <span className="font-semibold text-slate-900">$12,940</span>
        </div>
      </div>
      <a href="/dashboard/financials" className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors">
        Full financials <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

function HrWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Active Staff</p>
          <p className="text-xl font-bold text-slate-900">5</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <UsersRound className="h-5 w-5 text-blue-600" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Pending Signatures</span>
          <span className="font-semibold text-amber-600">1</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Next Payroll</span>
          <span className="font-semibold text-slate-900">Feb 14</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">OT This Period</span>
          <span className="font-semibold text-red-600">4.5 hrs</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Avg Hours/Week</span>
          <span className="font-semibold text-slate-900">38.2</span>
        </div>
      </div>
      <a href="/dashboard/hr" className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors">
        HR dashboard <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

function ComplianceWidget() {
  const items = [
    { label: "DEA Registration", holder: "Dr. Alexandru", days: 49, status: "warning" },
    { label: "Radiation Safety Cert", holder: "Dr. Alexandru", days: -3, status: "expired" },
    { label: "Business License", holder: "Practice", days: 143, status: "ok" },
    { label: "CPR/BLS (All Staff)", holder: "Team", days: 220, status: "ok" },
  ];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5 rounded-lg bg-slate-50/80 px-3 py-2">
          <span className={`h-2 w-2 rounded-full shrink-0 ${
            item.status === "expired" ? "bg-red-500" : item.status === "warning" ? "bg-amber-500" : "bg-emerald-500"
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-900 truncate">{item.label}</p>
            <p className="text-[10px] text-slate-400">{item.holder}</p>
          </div>
          <span className={`text-[10px] font-bold shrink-0 ${
            item.days < 0 ? "text-red-600" : item.days < 90 ? "text-amber-600" : "text-slate-400"
          }`}>
            {item.days < 0 ? `${Math.abs(item.days)}d overdue` : `${item.days}d`}
          </span>
        </div>
      ))}
      <a href="/dashboard/licensing" className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors">
        All licenses <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

function InsuranceWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Pending Verifications</p>
          <p className="text-xl font-bold text-slate-900">3</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
          <Shield className="h-5 w-5 text-purple-600" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Active Carriers</span>
          <span className="font-semibold text-slate-900">7</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Policies Uploaded</span>
          <span className="font-semibold text-emerald-600">4 / 7</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Claims Pending</span>
          <span className="font-semibold text-amber-600">12</span>
        </div>
      </div>
      <a href="/dashboard/insurance" className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors">
        Insurance hub <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

function OutreachWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Sent This Week</p>
          <p className="text-xl font-bold text-slate-900">24</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <Send className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Recall Campaigns</span>
          <span className="font-semibold text-slate-900">3 active</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Open Rate</span>
          <span className="font-semibold text-emerald-600">68%</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Reactivated</span>
          <span className="font-semibold text-cyan-600">4 patients</span>
        </div>
      </div>
      <a href="/dashboard/outreach" className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors">
        Outreach hub <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

// ─── Widget Wrapper ────────────────────────────────────────────────

function WidgetCard({ id, data, isEditing }: { id: string; data: DashboardData; isEditing: boolean }) {
  const def = WIDGET_REGISTRY.find((w) => w.id === id);
  if (!def) return null;
  const Icon = def.icon;

  const content: Record<string, React.ReactNode> = {
    urgent: <UrgentWidget data={data} />,
    kpi: <KpiWidget data={data} />,
    appointments: <AppointmentsWidget data={data} />,
    leads: <LeadsWidget data={data} />,
    ai_activity: <AiActivityWidget data={data} />,
    financials: <FinancialsWidget />,
    hr: <HrWidget />,
    compliance: <ComplianceWidget />,
    insurance: <InsuranceWidget />,
    outreach: <OutreachWidget />,
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Widget header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3 shrink-0">
        {isEditing && (
          <GripVertical className="h-4 w-4 text-slate-300 cursor-grab active:cursor-grabbing drag-handle" />
        )}
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
          id === "urgent" ? "bg-amber-50" : "bg-slate-50"
        }`}>
          <Icon className={`h-3.5 w-3.5 ${id === "urgent" ? "text-amber-600" : "text-slate-500"}`} />
        </div>
        <h3 className="text-xs font-bold text-slate-900 flex-1">{def.label}</h3>
      </div>
      {/* Widget body */}
      <div className="flex-1 overflow-y-auto p-4">
        {content[id] || <p className="text-xs text-slate-400">Widget: {id}</p>}
      </div>
    </div>
  );
}

// ─── Settings Panel ───────────────────────────────────────────────

function SettingsPanel({
  visible,
  onToggle,
  onReset,
  onClose,
}: {
  visible: string[];
  onToggle: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-80 bg-white shadow-xl border-l border-slate-200 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">Customize Dashboard</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100 transition-colors">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-1">
          {WIDGET_REGISTRY.map((widget) => {
            const isOn = visible.includes(widget.id);
            const Icon = widget.icon;
            return (
              <button
                key={widget.id}
                onClick={() => onToggle(widget.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isOn ? "bg-cyan-50/50 hover:bg-cyan-50" : "hover:bg-slate-50"
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  isOn ? "bg-cyan-100" : "bg-slate-100"
                }`}>
                  <Icon className={`h-4 w-4 ${isOn ? "text-cyan-600" : "text-slate-400"}`} />
                </div>
                <span className={`text-sm font-medium flex-1 text-left ${isOn ? "text-slate-900" : "text-slate-400"}`}>
                  {widget.label}
                </span>
                <div className={`h-5 w-9 rounded-full transition-colors ${isOn ? "bg-cyan-500" : "bg-slate-200"}`}>
                  <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${isOn ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </button>
            );
          })}
        </div>
        <div className="border-t border-slate-200 p-4">
          <button
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Grid ──────────────────────────────────────────

interface DashboardGridProps {
  data: DashboardData;
}

export function DashboardGrid({ data }: DashboardGridProps) {
  const { width, containerRef } = useContainerWidth();
  const [visible, setVisible] = useState<string[]>(DEFAULT_VISIBLE);
  const [layouts, setGridLayouts] = useState<ResponsiveLayouts>({});
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load saved preferences
  useEffect(() => {
    fetch("/api/dashboard/preferences")
      .then((r) => r.json())
      .then((prefs) => {
        if (prefs.visible_widgets?.length) setVisible(prefs.visible_widgets);
        if (prefs.layouts && Object.keys(prefs.layouts).length) setGridLayouts(prefs.layouts);
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  // Debounced save
  const savePreferences = useCallback(
    debounce((newGridLayouts: ResponsiveLayouts, newVisible: string[]) => {
      fetch("/api/dashboard/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layouts: newGridLayouts, visible_widgets: newVisible }),
      }).catch(() => {});
    }, 1000),
    []
  );

  const handleLayoutChange = useCallback(
    (_layout: readonly LayoutItem[], allGridLayouts: ResponsiveLayouts) => {
      if (!hydrated) return;
      setGridLayouts(allGridLayouts);
      savePreferences(allGridLayouts, visible);
    },
    [hydrated, visible, savePreferences]
  );

  const handleToggle = useCallback(
    (id: string) => {
      setVisible((prev) => {
        const next = prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id];
        savePreferences(layouts, next);
        return next;
      });
    },
    [layouts, savePreferences]
  );

  const handleReset = useCallback(() => {
    setVisible(DEFAULT_VISIBLE);
    setGridLayouts({});
    savePreferences({}, DEFAULT_VISIBLE);
  }, [savePreferences]);

  const currentLayout = useMemo(() => {
    if (layouts.lg?.length) return undefined;
    return buildDefaultLayout(visible);
  }, [layouts, visible]);

  const resolvedLayouts = useMemo(() => {
    if (layouts.lg) return layouts;
    return { lg: currentLayout || [] };
  }, [layouts, currentLayout]);

  return (
    <div className="space-y-4">
      {/* Dashboard toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-400">Your One Engine overview — drag widgets to rearrange</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isEditing
                ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <GripVertical className="h-3.5 w-3.5" />
            {isEditing ? "Done Editing" : "Edit Layout"}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Customize
          </button>
        </div>
      </div>

      {/* Grid */}
      <div ref={containerRef}>
        {width > 0 && (
          <ResponsiveGridLayout
            className="layout"
            width={width}
            layouts={resolvedLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 1 }}
            rowHeight={60}
            dragConfig={{ enabled: isEditing, handle: ".drag-handle" }}
            resizeConfig={{ enabled: isEditing }}
            onLayoutChange={handleLayoutChange}
            compactor={verticalCompactor}
            margin={[16, 16]}
          >
            {visible.map((id) => (
              <div key={id}>
                <WidgetCard id={id} data={data} isEditing={isEditing} />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </div>

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          visible={visible}
          onToggle={handleToggle}
          onReset={handleReset}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

// ─── Debounce helper ──────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}
