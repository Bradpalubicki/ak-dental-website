"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Settings2,
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
  Plus,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { StatCard } from "./stat-card";

// ─── Widget registry ──────────────────────────────────────────────
interface WidgetDef {
  id: string;
  label: string;
  icon: typeof Calendar;
}

const WIDGET_REGISTRY: WidgetDef[] = [
  { id: "setup", label: "Setup Checklist", icon: ClipboardCheck },
  { id: "urgent", label: "Needs Attention", icon: Siren },
  { id: "ai_insights", label: "AI Insights", icon: Lightbulb },
  { id: "kpi", label: "Key Metrics", icon: BarChart3 },
  { id: "appointments", label: "Today's Schedule", icon: Calendar },
  { id: "leads", label: "Recent Leads", icon: UserPlus },
  { id: "ai_activity", label: "AI Activity", icon: Sparkles },
  { id: "financials", label: "Financial Summary", icon: Wallet },
  { id: "hr", label: "HR & Payroll", icon: UsersRound },
  { id: "compliance", label: "Compliance Alerts", icon: Award },
  { id: "insurance", label: "Insurance", icon: Shield },
  { id: "outreach", label: "Outreach", icon: Send },
];

const DEFAULT_VISIBLE = [
  "kpi", "urgent", "ai_insights", "appointments", "leads", "ai_activity",
  "financials", "compliance", "hr", "insurance", "outreach",
];

// Widgets that should span full width in the grid
const FULL_WIDTH_WIDGETS = new Set(["kpi"]);

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

// ─── Today's Summary Stats Bar ──────────────────────────────────

function TodaySummaryBar({ data }: { data: DashboardData }) {
  const nextApt = data.appointments[0];
  const urgentCount = data.urgentItems.filter(
    (i) => i.level === "critical" || i.level === "warning"
  ).length;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-gradient-to-r from-cyan-50 via-white to-cyan-50 border border-cyan-100 px-5 py-2.5">
      <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
        Today
      </span>
      <div className="h-4 w-px bg-cyan-200" />
      <span className="text-xs text-slate-600">
        <strong className="text-slate-900">{data.stats.appointmentCount}</strong>{" "}
        appointments
        {data.stats.unconfirmedCount > 0 && (
          <span className="text-amber-600">
            {" "}
            ({data.stats.unconfirmedCount} unconfirmed)
          </span>
        )}
      </span>
      <span className="text-xs text-slate-600">
        <strong className="text-slate-900">{data.stats.leadCount}</strong> leads
      </span>
      <span className="text-xs text-slate-600">
        <strong className="text-slate-900">
          {data.stats.pendingApprovals}
        </strong>{" "}
        pending
      </span>
      {urgentCount > 0 && (
        <span className="text-xs font-semibold text-red-600">
          {urgentCount} urgent
        </span>
      )}
      {nextApt && (
        <>
          <div className="h-4 w-px bg-cyan-200 hidden sm:block" />
          <span className="text-xs text-slate-600">
            Next:{" "}
            <strong className="text-slate-900">{nextApt.patientName}</strong> at{" "}
            <strong className="text-slate-900">
              {formatTime(nextApt.time)}
            </strong>
          </span>
        </>
      )}
    </div>
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
  const confirmed = data.stats.appointmentCount - data.stats.unconfirmedCount;
  const urgentLeads = data.leads
    ? data.leads.filter(
        (l) => l.urgency === "high" || l.urgency === "emergency"
      ).length
    : 0;

  const kpis = [
    {
      title: "Appointments",
      value: String(data.stats.appointmentCount),
      icon: Calendar,
      iconColor: "text-blue-600 bg-blue-50",
      accentColor: "#3b82f6",
      description: `${confirmed} confirmed, ${data.stats.unconfirmedCount} pending`,
      href: "/dashboard/appointments",
    },
    {
      title: "New Leads",
      value: String(data.stats.leadCount),
      icon: UserPlus,
      iconColor: "text-emerald-600 bg-emerald-50",
      accentColor: "#10b981",
      description:
        urgentLeads > 0
          ? `${urgentLeads} high priority`
          : "all normal priority",
      href: "/dashboard/leads",
    },
    {
      title: "Pending Approvals",
      value: String(data.stats.pendingApprovals),
      icon: Eye,
      iconColor: "text-amber-600 bg-amber-50",
      accentColor: "#f59e0b",
      description: `${data.stats.approvedToday} approved today`,
      pulse: data.stats.pendingApprovals > 0,
      href: "/dashboard/approvals",
    },
    {
      title: "Patients",
      value: String(data.stats.patientCount),
      icon: Users,
      iconColor: "text-cyan-600 bg-cyan-50",
      accentColor: "#06b6d4",
      description: "active roster",
      href: "/dashboard/patients",
    },
    {
      title: "AI Actions",
      value: String(data.stats.aiActionsToday),
      icon: Zap,
      iconColor: "text-indigo-600 bg-indigo-50",
      accentColor: "#6366f1",
      description: `${data.stats.approvedToday} executed today`,
      href: "/dashboard/approvals",
    },
    {
      title: "Insurance",
      value: String(data.stats.pendingInsurance),
      icon: Shield,
      iconColor: "text-purple-600 bg-purple-50",
      accentColor: "#a855f7",
      description: "pending verification",
      href: "/dashboard/insurance",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((kpi) => (
        <StatCard key={kpi.title} {...kpi} />
      ))}
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

// ─── Activity Sidebar ──────────────────────────────────────────────

function ActivitySidebar({
  data,
  open,
  onToggle,
}: {
  data: DashboardData;
  open: boolean;
  onToggle: () => void;
}) {
  if (!open) {
    const totalAttention = data.urgentItems.length;
    return (
      <div className="hidden lg:flex flex-col items-center w-10 shrink-0">
        <button
          onClick={onToggle}
          className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-1.5 py-3 hover:bg-slate-50 transition-colors shadow-sm"
          title="Open activity panel"
        >
          <PanelRightOpen className="h-4 w-4 text-slate-400" />
          {totalAttention > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[9px] font-bold text-amber-700">
              {totalAttention}
            </span>
          )}
        </button>
      </div>
    );
  }

  const critical = data.urgentItems.filter((i) => i.level === "critical");
  const warnings = data.urgentItems.filter((i) => i.level === "warning");
  const info = data.urgentItems.filter((i) => i.level === "info");

  return (
    <div className="hidden lg:flex flex-col w-80 shrink-0 rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-xs font-bold text-slate-900">Activity</h3>
        <button
          onClick={onToggle}
          className="rounded-lg p-1 hover:bg-slate-100 transition-colors"
          title="Collapse panel"
        >
          <PanelRightClose className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Needs Attention */}
        {data.urgentItems.length > 0 && (
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Needs Attention
            </p>
            <div className="space-y-1.5">
              {critical.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-2.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-red-700 flex-1">
                    Critical
                  </span>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-200 px-1 text-[10px] font-bold text-red-800">
                    {critical.length}
                  </span>
                </div>
              )}
              {warnings.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-2.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-amber-700 flex-1">
                    Warnings
                  </span>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-200 px-1 text-[10px] font-bold text-amber-800">
                    {warnings.length}
                  </span>
                </div>
              )}
              {info.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-blue-700 flex-1">
                    Info
                  </span>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-200 px-1 text-[10px] font-bold text-blue-800">
                    {info.length}
                  </span>
                </div>
              )}
              {/* Individual items */}
              <div className="mt-2 space-y-1">
                {data.urgentItems.slice(0, 5).map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <AlertTriangle
                      className={`h-3 w-3 shrink-0 ${
                        item.level === "critical"
                          ? "text-red-500"
                          : item.level === "warning"
                            ? "text-amber-500"
                            : "text-blue-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-slate-700 truncate">
                        {item.label}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        {item.detail}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Recent Activity
          </p>
          {data.aiActions.length === 0 ? (
            <p className="text-[11px] text-slate-400 py-2">
              No recent activity
            </p>
          ) : (
            <div className="space-y-1">
              {data.aiActions.slice(0, 8).map((action) => (
                <div
                  key={action.id}
                  className="flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                      action.status === "pending_approval"
                        ? "bg-amber-50"
                        : action.status === "rejected"
                          ? "bg-red-50"
                          : "bg-cyan-50"
                    }`}
                  >
                    {action.status === "pending_approval" ? (
                      <Clock className="h-2.5 w-2.5 text-amber-600" />
                    ) : action.status === "rejected" ? (
                      <XCircle className="h-2.5 w-2.5 text-red-600" />
                    ) : (
                      <CheckCircle2 className="h-2.5 w-2.5 text-cyan-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-700 leading-snug truncate">
                      {action.description}
                    </p>
                    <p className="text-[9px] text-slate-400">
                      {timeAgo(action.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Widget Wrapper ────────────────────────────────────────────────

function WidgetCard({ id, data }: { id: string; data: DashboardData }) {
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
    <div className="flex flex-col rounded-xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Widget header */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
          id === "urgent" ? "bg-amber-50" : id === "ai_insights" ? "bg-indigo-50" : "bg-slate-50"
        }`}>
          <Icon className={`h-3.5 w-3.5 ${id === "urgent" ? "text-amber-600" : id === "ai_insights" ? "text-indigo-600" : "text-slate-500"}`} />
        </div>
        <h3 className="text-xs font-bold text-slate-900 flex-1">{def.label}</h3>
      </div>
      {/* Widget body */}
      <div className="px-4 py-3">
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
  const [visible, setVisible] = useState<string[]>(DEFAULT_VISIBLE);
  const [showSettings, setShowSettings] = useState(false);
  const [columnCount, setColumnCount] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ak-sidebar-open");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });

  // Load saved preferences
  useEffect(() => {
    fetch("/api/dashboard/preferences")
      .then((r) => r.json())
      .then((prefs) => {
        if (prefs.visible_widgets?.length) setVisible(prefs.visible_widgets);
        if (prefs.column_count) setColumnCount(prefs.column_count);
      })
      .catch(() => {});
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("ak-sidebar-open", String(next));
      return next;
    });
  }, []);

  const savePreferences = useCallback((newVisible: string[], newColumnCount: number) => {
    fetch("/api/dashboard/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible_widgets: newVisible, column_count: newColumnCount }),
    }).catch(() => {});
  }, []);

  const handleToggle = useCallback(
    (id: string) => {
      setVisible((prev) => {
        const next = prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id];
        savePreferences(next, columnCount);
        return next;
      });
    },
    [columnCount, savePreferences]
  );

  const handleReset = useCallback(() => {
    setVisible(DEFAULT_VISIBLE);
    setColumnCount(3);
    savePreferences(DEFAULT_VISIBLE, 3);
  }, [savePreferences]);

  const gridClass =
    columnCount === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : columnCount === 4
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className="space-y-4">
      {/* Ask Me Anything Banner */}
      <AskMeAnythingBanner />

      {/* Today's Summary Stats Bar */}
      <TodaySummaryBar data={data} />

      {/* Quick Actions Bar */}
      <QuickActionsBar />

      {/* Dashboard toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Command Center</h2>
          <p className="text-xs text-slate-400">Your practice at a glance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5">
            {[2, 3, 4].map((cols) => (
              <button
                key={cols}
                onClick={() => {
                  setColumnCount(cols);
                  savePreferences(visible, cols);
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  columnCount === cols
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {cols}-col
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Edit Layout
          </button>
        </div>
      </div>

      {/* Card Grid + Activity Sidebar */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className={gridClass}>
            {visible.map((id) => (
              <div
                key={id}
                className={FULL_WIDTH_WIDGETS.has(id) ? "col-span-full" : ""}
              >
                {id === "kpi" ? (
                  <KpiWidget data={data} />
                ) : (
                  <WidgetCard id={id} data={data} />
                )}
              </div>
            ))}
          </div>
        </div>
        <ActivitySidebar
          data={data}
          open={sidebarOpen}
          onToggle={toggleSidebar}
        />
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

