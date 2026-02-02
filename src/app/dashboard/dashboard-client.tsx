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

interface Props {
  appointments: DashboardAppointment[];
  leads: DashboardLead[];
  aiActions: DashboardAiAction[];
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

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  checked_in: "bg-purple-100 text-purple-700",
  in_progress: "bg-cyan-100 text-cyan-700",
  completed: "bg-green-100 text-green-700",
  no_show: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-500",
};

export function DashboardClient({ appointments, leads, aiActions, stats }: Props) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">
          Here&apos;s your practice overview for{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* KPI Cards - Row 1 */}
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

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Today&apos;s Schedule
            </h2>
            <a
              href="/dashboard/appointments"
              className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
            >
              View All
            </a>
          </div>
          {appointments.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 px-6 py-3">
                  <span className="w-20 text-sm font-medium text-slate-500">
                    {formatTime(apt.time)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {apt.patientName}
                    </p>
                    <p className="text-xs text-slate-500">{apt.type}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[apt.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {apt.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-sm text-slate-400">
              No appointments scheduled for today
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Leads</h2>
            <a
              href="/dashboard/leads"
              className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
            >
              View All
            </a>
          </div>
          {leads.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <div key={lead.id} className="px-6 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        lead.urgency === "high" || lead.urgency === "emergency"
                          ? "bg-red-500"
                          : lead.urgency === "medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {lead.source} &middot; {timeAgo(lead.createdAt)}
                    </span>
                    <span className="text-xs font-medium text-cyan-600 capitalize">
                      {lead.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-sm text-slate-400">
              No new leads today
            </div>
          )}
        </div>
      </div>

      {/* AI Activity Feed */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">AI Activity</h2>
          </div>
          {stats.pendingApprovals > 0 ? (
            <a
              href="/dashboard/approvals"
              className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
            >
              {stats.pendingApprovals} pending approval
              {stats.pendingApprovals !== 1 ? "s" : ""}
            </a>
          ) : (
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              All systems operational
            </span>
          )}
        </div>
        {aiActions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {aiActions.map((action) => (
              <div key={action.id} className="flex items-center gap-4 px-6 py-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    action.status === "pending_approval"
                      ? "bg-amber-50"
                      : action.status === "rejected"
                      ? "bg-red-50"
                      : "bg-cyan-50"
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
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{action.description}</p>
                  <p className="text-xs text-slate-500">
                    {action.module.replace(/_/g, " ")} &middot;{" "}
                    {timeAgo(action.createdAt)}
                  </p>
                </div>
                {action.status === "pending_approval" && (
                  <a
                    href="/dashboard/approvals"
                    className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-200"
                  >
                    Review
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-sm text-slate-400">
            No AI activity yet. Actions will appear here as the system processes
            leads, appointments, and messages.
          </div>
        )}
      </div>
    </div>
  );
}
