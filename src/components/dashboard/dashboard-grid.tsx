"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ResponsiveGridLayout,
  useContainerWidth,
  verticalCompactor,
} from "react-grid-layout";
import type { LayoutItem, ResponsiveLayouts } from "react-grid-layout";
import Link from "next/link";
import {
  Settings2,
  GripVertical,
  X,
  RotateCcw,
  Calendar,
  CalendarPlus,
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
  ClipboardCheck,
  Lightbulb,
  MessageSquare,
  Phone,
  FileText,
  Pencil,
  Plus,
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
  { id: "setup", label: "Setup Checklist", icon: ClipboardCheck, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "urgent", label: "Needs Attention", icon: Siren, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "ai_insights", label: "AI Insights", icon: Lightbulb, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "kpi", label: "Key Metrics", icon: BarChart3, minW: 2, minH: 2, defaultW: 4, defaultH: 2 },
  { id: "appointments", label: "Today's Schedule", icon: Calendar, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "leads", label: "Recent Leads", icon: UserPlus, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "ai_activity", label: "AI Activity", icon: Sparkles, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "financials", label: "Financial Summary", icon: Wallet, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "hr", label: "HR & Payroll", icon: UsersRound, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "compliance", label: "Compliance Alerts", icon: Award, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "insurance", label: "Insurance", icon: Shield, minW: 2, minH: 2, defaultW: 2, defaultH: 3 },
  { id: "outreach", label: "Outreach", icon: Send, minW: 2, minH: 2, defaultW: 2, defaultH: 2 },
];

const DEFAULT_VISIBLE = [
  "kpi", "urgent", "ai_insights", "appointments", "leads", "ai_activity",
  "financials", "compliance", "hr", "insurance", "outreach",
];

// Explicit compact layout — fits ~one screen at 1080p
const COMPACT_POSITIONS: Record<string, { x: number; y: number; w: number; h: number }> = {
  kpi:          { x: 0, y: 0,  w: 4, h: 2 },
  urgent:       { x: 0, y: 2,  w: 2, h: 3 },
  ai_insights:  { x: 2, y: 2,  w: 2, h: 3 },
  appointments: { x: 0, y: 5,  w: 2, h: 3 },
  leads:        { x: 2, y: 5,  w: 2, h: 3 },
  financials:   { x: 0, y: 8,  w: 2, h: 3 },
  ai_activity:  { x: 2, y: 8,  w: 2, h: 3 },
  hr:           { x: 0, y: 11, w: 2, h: 3 },
  compliance:   { x: 2, y: 11, w: 2, h: 3 },
  insurance:    { x: 0, y: 14, w: 2, h: 3 },
  outreach:     { x: 2, y: 14, w: 2, h: 2 },
  setup:        { x: 0, y: 16, w: 2, h: 3 },
};

function buildDefaultLayout(visible: string[]): LayoutItem[] {
  const items: LayoutItem[] = [];
  let autoY = 20; // high y for auto-placed items (compactor will fix)
  visible.forEach((id) => {
    const def = WIDGET_REGISTRY.find((w) => w.id === id);
    if (!def) return;
    const pos = COMPACT_POSITIONS[id];
    if (pos) {
      items.push({ i: id, ...pos, minW: def.minW, minH: def.minH });
    } else {
      items.push({
        i: id, x: 0, y: autoY, w: def.defaultW, h: def.defaultH,
        minW: def.minW, minH: def.minH,
      });
      autoY += def.defaultH;
    }
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

// ─── Quick Actions Bar ────────────────────────────────────────────

function QuickActionsBar() {
  const actions = [
    { label: "New Patient", icon: Plus, href: "/dashboard/patients", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" },
    { label: "Schedule Appt", icon: CalendarPlus, href: "/dashboard/appointments", color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200" },
    { label: "New Lead", icon: UserPlus, href: "/dashboard/leads", color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200" },
    { label: "Send Message", icon: MessageSquare, href: "/dashboard/inbox", color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200" },
    { label: "AI Advisor", icon: Sparkles, href: "/dashboard/advisor", color: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">Quick Actions</span>
      <div className="h-4 w-px bg-slate-200 shrink-0" />
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.label}
            href={action.href}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all hover:shadow-sm shrink-0 ${action.color}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {action.label}
          </a>
        );
      })}
    </div>
  );
}

// ─── Ask Me Anything Banner ──────────────────────────────────────

function AskMeAnythingBanner() {
  return (
    <Link
      href="/dashboard/advisor"
      className="group relative flex items-center gap-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 px-6 py-4 text-white shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.005]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-base font-bold">Ask Me Anything</p>
        <p className="text-xs text-white/80">
          Pull reports, analyze data, navigate the system, or get instant answers from your AI business advisor
        </p>
      </div>
      <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

// ─── AI Insights Widget ──────────────────────────────────────────

function AiInsightsWidget({ data }: { data: DashboardData }) {
  const insights: Array<{ text: string; action: string; href: string; type: "suggestion" | "warning" | "success" }> = [];

  if (data.stats.leadCount > 0) {
    insights.push({
      text: `${data.stats.leadCount} new lead${data.stats.leadCount !== 1 ? "s" : ""} today — follow up within 1 hour for 3x higher conversion`,
      action: "View Leads",
      href: "/dashboard/leads",
      type: "suggestion",
    });
  }

  if (data.stats.unconfirmedCount > 0) {
    insights.push({
      text: `${data.stats.unconfirmedCount} unconfirmed appointment${data.stats.unconfirmedCount !== 1 ? "s" : ""} today — send confirmation reminders to reduce no-shows`,
      action: "Send Reminders",
      href: "/dashboard/appointments",
      type: "warning",
    });
  }

  if (data.stats.pendingApprovals > 0) {
    insights.push({
      text: `${data.stats.pendingApprovals} AI-drafted message${data.stats.pendingApprovals !== 1 ? "s" : ""} waiting for your approval before sending`,
      action: "Review & Approve",
      href: "/dashboard/approvals",
      type: "suggestion",
    });
  }

  if (data.stats.approvedToday > 0) {
    const timeSaved = (data.stats.approvedToday * 4.5).toFixed(0);
    insights.push({
      text: `AI saved you ~${timeSaved} minutes today by handling ${data.stats.approvedToday} task${data.stats.approvedToday !== 1 ? "s" : ""} automatically`,
      action: "View Activity",
      href: "/dashboard/approvals",
      type: "success",
    });
  }

  if (data.stats.pendingInsurance > 0) {
    insights.push({
      text: `${data.stats.pendingInsurance} insurance verification${data.stats.pendingInsurance !== 1 ? "s" : ""} pending — verify before appointments to avoid billing issues`,
      action: "Verify Now",
      href: "/dashboard/insurance",
      type: "warning",
    });
  }

  if (insights.length === 0) {
    insights.push({
      text: "All caught up! Your practice is running smoothly. AI is monitoring for new opportunities.",
      action: "View Analytics",
      href: "/dashboard/analytics",
      type: "success",
    });
  }

  const typeStyles = {
    suggestion: { bg: "bg-indigo-50/60", border: "border-indigo-100", icon: "text-indigo-500", badge: "bg-indigo-100 text-indigo-700" },
    warning: { bg: "bg-amber-50/60", border: "border-amber-100", icon: "text-amber-500", badge: "bg-amber-100 text-amber-700" },
    success: { bg: "bg-emerald-50/60", border: "border-emerald-100", icon: "text-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  };

  return (
    <div className="space-y-2">
      {insights.slice(0, 4).map((insight, i) => {
        const styles = typeStyles[insight.type];
        return (
          <div key={i} className={`flex items-start gap-3 rounded-lg border ${styles.border} ${styles.bg} px-3 py-2.5`}>
            <Lightbulb className={`h-4 w-4 shrink-0 mt-0.5 ${styles.icon}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-700 leading-relaxed">{insight.text}</p>
              <a href={insight.href} className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${styles.badge} hover:opacity-80 transition-opacity`}>
                {insight.action}
                <ArrowRight className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
    <div className="grid grid-cols-6 gap-2">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-2.5 py-2">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${kpi.color}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-slate-900 leading-tight">{kpi.value}</p>
              <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wide truncate">{kpi.label}</p>
            </div>
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
        const isUnconfirmed = apt.status === "scheduled";
        return (
          <div key={apt.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors">
            <span className="text-[11px] font-bold text-slate-500 w-16 shrink-0">{formatTime(apt.time)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{apt.patientName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{apt.type.replace(/_/g, " ")}</p>
            </div>
            {isUnconfirmed ? (
              <div className="flex items-center gap-1 shrink-0">
                <a href="/dashboard/appointments" className="rounded-md bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 hover:bg-emerald-200 transition-colors">
                  Confirm
                </a>
                <a href="/dashboard/appointments" className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 hover:bg-slate-200 transition-colors">
                  Reschedule
                </a>
              </div>
            ) : (
              <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-semibold ring-1 ring-inset ${sc.color}`}>
                {sc.label}
              </span>
            )}
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
          <div className="flex items-center gap-1 shrink-0">
            <a href="/dashboard/leads" className="rounded-md bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700 hover:bg-indigo-200 transition-colors flex items-center gap-0.5" title="Send Intake Form">
              <FileText className="h-2.5 w-2.5" />
              Intake
            </a>
            <a href="/dashboard/leads" className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 hover:bg-slate-200 transition-colors" title="Schedule Call">
              <Phone className="h-2.5 w-2.5" />
            </a>
          </div>
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

function SetupChecklistWidget() {
  const [steps, setSteps] = useState<Array<{
    key: string;
    label: string;
    category: string;
    completed: boolean;
    href: string;
  }>>([
    { key: "practice_info", label: "Add Practice Information", category: "essentials", completed: true, href: "/dashboard/settings" },
    { key: "add_provider", label: "Add Provider / Doctor", category: "essentials", completed: true, href: "/dashboard/settings" },
    { key: "add_staff", label: "Add Staff Members", category: "team", completed: false, href: "/dashboard/hr" },
    { key: "upload_licenses", label: "Upload Licenses & Credentials", category: "team", completed: false, href: "/dashboard/licensing" },
    { key: "connect_pms", label: "Connect Practice Management System", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "configure_twilio", label: "Configure SMS / Phone", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "configure_email", label: "Configure Email Sending", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "connect_billing", label: "Connect Billing / Clearinghouse", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "connect_accounting", label: "Connect Accounting System", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "import_patients", label: "Import Patient Records", category: "operations", completed: false, href: "/dashboard/patients" },
    { key: "configure_ai", label: "Configure AI Settings", category: "operations", completed: false, href: "/dashboard/settings" },
    { key: "go_live", label: "Go Live", category: "advanced", completed: false, href: "/dashboard/settings" },
  ]);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const toggleStep = (key: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.key === key ? { ...s, completed: !s.completed } : s))
    );
  };

  if (pct === 100) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
          <p className="text-sm font-bold text-emerald-700">Setup Complete!</p>
          <p className="text-[11px] text-slate-400 mt-1">One Engine is fully configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-slate-600">{completedCount} of {totalCount} steps</span>
          <span className="text-[11px] font-bold text-cyan-600">{pct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="space-y-0.5">
        {steps.filter((s) => !s.completed).slice(0, 5).map((step) => (
          <div key={step.key} className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors group">
            <button
              onClick={() => toggleStep(step.key)}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-200 group-hover:border-cyan-300 transition-colors"
            >
              <span className="sr-only">Complete step</span>
            </button>
            <a href={step.href} className="flex-1 text-xs font-medium text-slate-700 hover:text-cyan-600 transition-colors truncate">
              {step.label}
            </a>
            <ArrowRight className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
        {steps.filter((s) => s.completed).length > 0 && (
          <div className="pt-1 border-t border-slate-100 mt-1">
            <p className="text-[10px] font-medium text-emerald-500 px-2 py-1">
              <CheckCircle2 className="inline h-3 w-3 mr-1" />
              {completedCount} completed
            </p>
          </div>
        )}
      </div>
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
    setup: <SetupChecklistWidget />,
    urgent: <UrgentWidget data={data} />,
    ai_insights: <AiInsightsWidget data={data} />,
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
    <div className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Widget header */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 shrink-0">
        {isEditing && (
          <GripVertical className="h-4 w-4 text-slate-300 cursor-grab active:cursor-grabbing drag-handle" />
        )}
        <div className={`flex h-6 w-6 items-center justify-center rounded-md ${
          id === "urgent" ? "bg-amber-50" : id === "ai_insights" ? "bg-indigo-50" : "bg-slate-50"
        }`}>
          <Icon className={`h-3 w-3 ${id === "urgent" ? "text-amber-600" : id === "ai_insights" ? "text-indigo-600" : "text-slate-500"}`} />
        </div>
        <h3 className="text-[11px] font-bold text-slate-900 flex-1">{def.label}</h3>
      </div>
      {/* Widget body */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
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
  const [columnCount, setColumnCount] = useState(4);
  const [hydrated, setHydrated] = useState(false);
  const [pageTitle, setPageTitle] = useState("Command Center");
  const [editingTitle, setEditingTitle] = useState(false);

  // Load saved preferences
  useEffect(() => {
    fetch("/api/dashboard/preferences")
      .then((r) => r.json())
      .then((prefs) => {
        if (prefs.visible_widgets?.length) setVisible(prefs.visible_widgets);
        if (prefs.layouts && Object.keys(prefs.layouts).length) setGridLayouts(prefs.layouts);
        if (prefs.column_count) setColumnCount(prefs.column_count);
        if (prefs.page_title) setPageTitle(prefs.page_title);
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  // Debounced save
  const savePreferences = useMemo(
    () => debounce((newGridLayouts: ResponsiveLayouts, newVisible: string[], newColumnCount?: number) => {
      fetch("/api/dashboard/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layouts: newGridLayouts, visible_widgets: newVisible, column_count: newColumnCount }),
      }).catch(() => {});
    }, 1000),
    []
  );

  const handleLayoutChange = useCallback(
    (_layout: readonly LayoutItem[], allGridLayouts: ResponsiveLayouts) => {
      if (!hydrated) return;
      setGridLayouts(allGridLayouts);
      savePreferences(allGridLayouts, visible, columnCount);
    },
    [hydrated, visible, columnCount, savePreferences]
  );

  const handleToggle = useCallback(
    (id: string) => {
      setVisible((prev) => {
        const next = prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id];
        savePreferences(layouts, next, columnCount);
        return next;
      });
    },
    [layouts, columnCount, savePreferences]
  );

  const handleReset = useCallback(() => {
    setVisible(DEFAULT_VISIBLE);
    setGridLayouts({});
    setColumnCount(4);
    setPageTitle("Command Center");
    savePreferences({}, DEFAULT_VISIBLE, 4);
    fetch("/api/dashboard/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layouts: {}, visible_widgets: DEFAULT_VISIBLE, column_count: 4, page_title: "Command Center" }),
    }).catch(() => {});
  }, [savePreferences]);

  const saveTitle = useCallback((title: string) => {
    fetch("/api/dashboard/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layouts, visible_widgets: visible, column_count: columnCount, page_title: title }),
    }).catch(() => {});
  }, [layouts, visible, columnCount]);

  const currentLayout = useMemo(() => {
    if (layouts.lg?.length) return undefined;
    return buildDefaultLayout(visible);
  }, [layouts, visible]);

  const resolvedLayouts = useMemo(() => {
    if (layouts.lg) return layouts;
    return { lg: currentLayout || [] };
  }, [layouts, currentLayout]);

  return (
    <div className="space-y-3">
      {/* Ask Me Anything Banner */}
      <AskMeAnythingBanner />

      {/* Quick Actions Bar */}
      <QuickActionsBar />

      {/* Dashboard toolbar */}
      <div className="flex items-center justify-between">
        <div>
          {editingTitle ? (
            <input
              autoFocus
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              onBlur={() => { setEditingTitle(false); saveTitle(pageTitle); }}
              onKeyDown={(e) => { if (e.key === "Enter") { setEditingTitle(false); saveTitle(pageTitle); } if (e.key === "Escape") { setEditingTitle(false); } }}
              className="text-lg font-bold text-slate-900 bg-transparent border-b-2 border-cyan-400 outline-none w-64"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="group flex items-center gap-2 text-lg font-bold text-slate-900 hover:text-cyan-600 transition-colors"
              title="Click to rename"
            >
              {pageTitle}
              <Pencil className="h-3.5 w-3.5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
            </button>
          )}
          <p className="text-xs text-slate-400">Your Dental Engine — drag widgets to rearrange</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5">
            {[2, 3, 4].map((cols) => (
              <button
                key={cols}
                onClick={() => {
                  setColumnCount(cols);
                  savePreferences(layouts, visible, cols);
                }}
                className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  columnCount === cols
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {cols}
              </button>
            ))}
          </div>
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
            cols={{ lg: columnCount, md: columnCount, sm: 2, xs: 1 }}
            rowHeight={50}
            dragConfig={{ enabled: isEditing, handle: ".drag-handle" }}
            resizeConfig={{ enabled: isEditing }}
            onLayoutChange={handleLayoutChange}
            compactor={verticalCompactor}
            margin={[10, 10]}
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
