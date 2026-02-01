"use client";

import {
  UserPlus,
  Calendar,
  DollarSign,
  Shield,
  Phone,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Users,
  FileText,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

const todaySchedule = [
  { time: "8:00 AM", patient: "Maria S.", type: "Cleaning", status: "confirmed" },
  { time: "9:00 AM", patient: "Robert K.", type: "Crown Prep", status: "confirmed" },
  { time: "10:30 AM", patient: "Jennifer L.", type: "Implant Consult", status: "unconfirmed" },
  { time: "11:30 AM", patient: "David M.", type: "Root Canal", status: "confirmed" },
  { time: "1:00 PM", patient: "Sarah T.", type: "Whitening", status: "confirmed" },
  { time: "2:00 PM", patient: "James W.", type: "Extraction", status: "checked_in" },
  { time: "3:30 PM", patient: "Amanda P.", type: "Cleaning", status: "confirmed" },
];

const recentLeads = [
  { name: "Michael R.", source: "Website", time: "12 min ago", status: "AI Responded", urgency: "high" },
  { name: "Lisa H.", source: "Google", time: "45 min ago", status: "Awaiting Review", urgency: "medium" },
  { name: "Tom B.", source: "Phone", time: "2 hours ago", status: "Booked", urgency: "low" },
];

const aiActions = [
  { action: "Sent appointment reminder", target: "Robert K.", module: "Scheduling", time: "7:00 AM" },
  { action: "Drafted lead response", target: "Michael R.", module: "Lead Response", time: "6:48 AM" },
  { action: "Verified insurance", target: "Jennifer L.", module: "Insurance", time: "6:30 AM" },
  { action: "No-show follow-up sent", target: "Karen D.", module: "Outreach", time: "Yesterday" },
  { action: "Daily briefing generated", target: "All Staff", module: "Analytics", time: "7:00 AM" },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  unconfirmed: "bg-amber-100 text-amber-700",
  checked_in: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Good Morning, Dr. Chireu</h1>
        <p className="text-sm text-slate-500">
          Here&apos;s your practice overview for{" "}
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Appointments"
          value="7"
          change="1 unconfirmed"
          trend="neutral"
          icon={Calendar}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="New Leads"
          value="3"
          change="+50% vs last week"
          trend="up"
          icon={UserPlus}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Today's Production"
          value="$4,250"
          change="+12% vs avg"
          trend="up"
          icon={DollarSign}
          iconColor="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          title="Pending Insurance"
          value="5"
          change="2 urgent"
          trend="down"
          icon={Shield}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Second Row KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Avg Lead Response"
          value="1m 42s"
          change="Under 2 min target"
          trend="up"
          icon={Clock}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="No-Show Rate"
          value="6.2%"
          change="-3.8% this month"
          trend="up"
          icon={AlertTriangle}
          iconColor="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="Collection Rate"
          value="96.1%"
          change="+1.3% vs last month"
          trend="up"
          icon={TrendingUp}
          iconColor="bg-green-50 text-green-600"
        />
        <StatCard
          title="AI Actions Today"
          value="24"
          change="22 approved, 2 pending"
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
            <h2 className="text-base font-semibold text-slate-900">Today&apos;s Schedule</h2>
            <a href="/dashboard/appointments" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
              View All
            </a>
          </div>
          <div className="divide-y divide-slate-100">
            {todaySchedule.map((apt, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3">
                <span className="w-20 text-sm font-medium text-slate-500">{apt.time}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{apt.patient}</p>
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
        </div>

        {/* Recent Leads */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Leads</h2>
            <a href="/dashboard/leads" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
              View All
            </a>
          </div>
          <div className="divide-y divide-slate-100">
            {recentLeads.map((lead, i) => (
              <div key={i} className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      lead.urgency === "high"
                        ? "bg-red-500"
                        : lead.urgency === "medium"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {lead.source} &middot; {lead.time}
                  </span>
                  <span className="text-xs font-medium text-cyan-600">{lead.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Activity Feed */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">AI Activity</h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            All systems operational
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {aiActions.map((action, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50">
                <CheckCircle2 className="h-4 w-4 text-cyan-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{action.action}</span> for{" "}
                  <span className="font-medium">{action.target}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {action.module} &middot; {action.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
