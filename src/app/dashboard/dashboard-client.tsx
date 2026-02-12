"use client";

import {
  UserPlus,
  Calendar,
  Shield,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  Users,
  AlertTriangle,
  ArrowRight,
  Siren,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

interface DashboardAppointment {
  id: string;
  time: string;
  patientName: string;
  type: string;
  status: string;
}

interface DashboardLead {
  id: string;
  name: string;
  source: string;
  urgency: string;
  status: string;
  createdAt: string;
}

interface DashboardAiAction {
  id: string;
  description: string;
  module: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  appointmentCount: number;
  unconfirmedCount: number;
  leadCount: number;
  pendingApprovals: number;
  pendingInsurance: number;
  patientCount: number;
  aiActionsToday: number;
  approvedToday: number;
}

interface UrgentItem {
  type: string;
  label: string;
  detail: string;
  href: string;
  level: "critical" | "warning" | "info";
}

interface Props {
  appointments: DashboardAppointment[];
  leads: DashboardLead[];
  aiActions: DashboardAiAction[];
  urgentItems: UrgentItem[];
  stats: DashboardStats;
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
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
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
  cancelled: { label: "Cancelled", color: "bg-slate-50 text-slate-500 ring-slate-600/20", dot: "bg-slate-400" },
};

const urgencyDot: Record<string, string> = {
  emergency: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

const sourceIcons: Record<string, string> = {
  website: "bg-cyan-100 text-cyan-700",
  phone: "bg-blue-100 text-blue-700",
  referral: "bg-purple-100 text-purple-700",
  walk_in: "bg-amber-100 text-amber-700",
  google: "bg-emerald-100 text-emerald-700",
};

export function DashboardClient({ appointments, leads, aiActions, urgentItems, stats }: Props) {
  return (
    <div className="space-y-6">
      {/* Urgent Matters - Full-width alert banner */}
      {urgentItems.length > 0 && (
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
              <Siren className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-900">
                Needs Your Attention
              </h2>
              <p className="text-[11px] text-amber-600/70">{urgentItems.length} item{urgentItems.length !== 1 ? "s" : ""} requiring action</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {urgentItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 hover:shadow-md ${
                  item.level === "critical"
                    ? "border-red-200 bg-white hover:bg-red-50/50 hover:border-red-300"
                    : item.level === "warning"
                    ? "border-amber-200 bg-white hover:bg-amber-50/50 hover:border-amber-300"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    item.level === "critical"
                      ? "bg-red-100"
                      : item.level === "warning"
                      ? "bg-amber-100"
                      : "bg-blue-100"
                  }`}
                >
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      item.level === "critical"
                        ? "text-red-600"
                        : item.level === "warning"
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold ${
                      item.level === "critical" ? "text-red-900" : "text-slate-900"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{item.detail}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Appointments"
          value={String(stats.appointmentCount)}
          change={
            stats.unconfirmedCount > 0
              ? `${stats.unconfirmedCount} unconfirmed`
              : stats.appointmentCount > 0
              ? "All confirmed"
              : "None scheduled"
          }
          trend={stats.unconfirmedCount > 0 ? "neutral" : "up"}
          icon={Calendar}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="New Leads Today"
          value={String(stats.leadCount)}
          trend={stats.leadCount > 0 ? "up" : "neutral"}
          icon={UserPlus}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Pending Approvals"
          value={String(stats.pendingApprovals)}
          change={stats.pendingApprovals > 0 ? "Needs review" : "All clear"}
          trend={stats.pendingApprovals > 0 ? "down" : "up"}
          icon={Eye}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Pending Insurance"
          value={String(stats.pendingInsurance)}
          change={
            stats.pendingInsurance > 0
              ? `${stats.pendingInsurance} need verification`
              : "All verified"
          }
          trend={stats.pendingInsurance > 0 ? "down" : "up"}
          icon={Shield}
          iconColor="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Patients"
          value={String(stats.patientCount)}
          icon={Users}
          iconColor="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          title="AI Actions Today"
          value={String(stats.aiActionsToday)}
          change={`${stats.approvedToday} approved, ${stats.pendingApprovals} pending`}
          trend="neutral"
          icon={Zap}
          iconColor="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Conversion Rate"
          value={stats.leadCount > 0 ? `${Math.round((stats.approvedToday / Math.max(stats.leadCount, 1)) * 100)}%` : "--"}
          change="Lead to appointment"
          trend="neutral"
          icon={TrendingUp}
          iconColor="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Today's Schedule - takes 3/5 */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Today&apos;s Schedule</h2>
                <p className="text-[11px] text-slate-400">{appointments.length} appointment{appointments.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <a
              href="/dashboard/appointments"
              className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          {appointments.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {appointments.map((apt) => {
                const sc = statusConfig[apt.status] || statusConfig.scheduled;
                return (
                  <div key={apt.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-900">
                        {formatTime(apt.time)}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {apt.patientName}
                      </p>
                      <p className="text-[11px] text-slate-400 capitalize">{apt.type.replace(/_/g, " ")}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${sc.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Calendar className="h-8 w-8 text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">No appointments scheduled for today</p>
            </div>
          )}
        </div>

        {/* Recent Leads - takes 2/5 */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                <UserPlus className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Recent Leads</h2>
                <p className="text-[11px] text-slate-400">{leads.length} new today</p>
              </div>
            </div>
            <a
              href="/dashboard/leads"
              className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          {leads.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {leads.map((lead) => (
                <div key={lead.id} className="px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold ${sourceIcons[lead.source] || "bg-slate-100 text-slate-600"}`}>
                        {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {lead.source.replace(/_/g, " ")} &middot; {timeAgo(lead.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${urgencyDot[lead.urgency] || "bg-slate-300"}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <UserPlus className="h-8 w-8 text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">No new leads today</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Activity Feed */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50">
              <Sparkles className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">AI Activity Feed</h2>
              <p className="text-[11px] text-slate-400">One Engine automated actions</p>
            </div>
          </div>
          {stats.pendingApprovals > 0 ? (
            <a
              href="/dashboard/approvals"
              className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/50 px-3 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <Clock className="h-3 w-3" />
              {stats.pendingApprovals} pending approval{stats.pendingApprovals !== 1 ? "s" : ""}
            </a>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              All systems operational
            </span>
          )}
        </div>
        {aiActions.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {aiActions.map((action) => (
              <div key={action.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    action.status === "pending_approval"
                      ? "bg-amber-50 ring-1 ring-amber-200/50"
                      : action.status === "rejected"
                      ? "bg-red-50 ring-1 ring-red-200/50"
                      : "bg-cyan-50 ring-1 ring-cyan-200/50"
                  }`}
                >
                  {action.status === "pending_approval" ? (
                    <Clock className="h-4 w-4 text-amber-600" />
                  ) : action.status === "rejected" ? (
                    <XCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-cyan-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{action.description}</p>
                  <p className="text-[11px] text-slate-400">
                    {action.module.replace(/_/g, " ")} &middot;{" "}
                    {timeAgo(action.createdAt)}
                  </p>
                </div>
                {action.status === "pending_approval" && (
                  <a
                    href="/dashboard/approvals"
                    className="flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200/50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    Review
                    <ArrowRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-8 w-8 text-slate-200 mb-2" />
            <p className="text-sm text-slate-400">
              No AI activity yet. Actions will appear here as the system processes
              leads, appointments, and messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
