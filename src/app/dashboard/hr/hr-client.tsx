"use client";

import Link from "next/link";
import {
  Users,
  Clock,
  FileText,
  CheckCircle2,
  Plus,
  Monitor,
  AlertTriangle,
  ClipboardList,
  MessageSquare,
  Star,
  Shield,
  ArrowRight,
  DollarSign,
  Calendar,
  Timer,
  BadgeCheck,
  Brain,
  CreditCard,
  LogIn,
  LogOut,
  ShieldAlert,
  Award,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

interface RecentDocument {
  id: string;
  type: string;
  title: string;
  status: string;
  severity: string | null;
  createdAt: string;
  createdBy: string;
  employeeName: string;
}

interface Props {
  stats: {
    activeEmployees: number;
    pendingSignatures: number;
    documentsThisMonth: number;
    acknowledgedThisMonth: number;
  };
  recentDocuments: RecentDocument[];
  payroll?: {
    nextPayDate?: string;
    currentPeriod?: string;
    totalEstimate?: number;
  };
}

const typeConfig: Record<
  string,
  { label: string; color: string; icon: typeof FileText }
> = {
  disciplinary: {
    label: "Disciplinary",
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
  },
  incident_report: {
    label: "Incident",
    color: "bg-orange-100 text-orange-700",
    icon: Shield,
  },
  performance_review: {
    label: "Review",
    color: "bg-blue-100 text-blue-700",
    icon: Star,
  },
  coaching_note: {
    label: "Coaching",
    color: "bg-cyan-100 text-cyan-700",
    icon: MessageSquare,
  },
  general: {
    label: "General",
    color: "bg-slate-100 text-slate-600",
    icon: FileText,
  },
  advisor_conversation: {
    label: "Advisor",
    color: "bg-purple-100 text-purple-700",
    icon: MessageSquare,
  },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-600" },
  pending_signature: {
    label: "Pending Signature",
    color: "bg-amber-100 text-amber-700",
  },
  acknowledged: {
    label: "Acknowledged",
    color: "bg-emerald-100 text-emerald-700",
  },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-700" },
};

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
  if (days < 30) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

/* ------------------------------------------------------------------ */
/*  Demo data for ADP Payroll Integration                              */
/* ------------------------------------------------------------------ */

const employeeTimeData = [
  {
    name: "Maria Santos",
    role: "Hygienist",
    weekHrs: 38.5,
    overtime: 0,
    regRate: 42,
    otRate: 63,
    status: "near-ot" as const,
  },
  {
    name: "Jessica Chen",
    role: "Dental Assistant",
    weekHrs: 32.0,
    overtime: 0,
    regRate: 22,
    otRate: 33,
    status: "normal" as const,
  },
  {
    name: "Tom Williams",
    role: "Dental Assistant",
    weekHrs: 40.0,
    overtime: 2.0,
    regRate: 20,
    otRate: 30,
    status: "overtime" as const,
  },
  {
    name: "Rachel Green",
    role: "Front Desk",
    weekHrs: 36.0,
    overtime: 0,
    regRate: 18,
    otRate: 27,
    status: "normal" as const,
  },
  {
    name: "David Kim",
    role: "Office Manager",
    weekHrs: 40.0,
    overtime: 0,
    regRate: 28,
    otRate: 42,
    status: "normal" as const,
  },
];

const recentPunches = [
  {
    name: "David Kim",
    action: "Clock In",
    time: "7:45 AM",
    scheduled: "7:45 AM",
    flag: null,
  },
  {
    name: "Maria Santos",
    action: "Clock In",
    time: "7:58 AM",
    scheduled: "8:00 AM",
    flag: null,
  },
  {
    name: "Rachel Green",
    action: "Clock In",
    time: "7:55 AM",
    scheduled: "8:00 AM",
    flag: null,
  },
  {
    name: "Jessica Chen",
    action: "Clock In",
    time: "8:12 AM",
    scheduled: "8:00 AM",
    flag: "12 min late",
  },
  {
    name: "Tom Williams",
    action: "Clock In",
    time: "7:50 AM",
    scheduled: "8:00 AM",
    flag: null,
  },
];

const credentials = [
  {
    holder: "Dr. Alex Khachaturian",
    credential: "DDS License",
    number: "#DEN-12345",
    expires: "Jun 2027",
    status: "current" as const,
    daysUntil: 510,
  },
  {
    holder: "Dr. Alex Khachaturian",
    credential: "DEA License",
    number: "#BK1234567",
    expires: "Mar 2026",
    status: "warning" as const,
    daysUntil: 49,
  },
  {
    holder: "Maria Santos",
    credential: "RDH License",
    number: "#HYG-54321",
    expires: "Dec 2026",
    status: "current" as const,
    daysUntil: 327,
  },
  {
    holder: "Jessica Chen",
    credential: "DA Certification",
    number: "#DA-98765",
    expires: "Aug 2026",
    status: "current" as const,
    daysUntil: 205,
  },
  {
    holder: "All Staff",
    credential: "CPR/BLS",
    number: "",
    expires: "Sep 2026",
    status: "current" as const,
    daysUntil: 236,
  },
  {
    holder: "All Staff",
    credential: "OSHA Training",
    number: "",
    expires: "Jan 2027",
    status: "current" as const,
    daysUntil: 358,
  },
  {
    holder: "Dr. Alex Khachaturian",
    credential: "Radiation Safety",
    number: "",
    expires: "Feb 2026",
    status: "expired" as const,
    daysUntil: -1,
  },
];

const statusBadge = (status: "normal" | "near-ot" | "overtime") => {
  switch (status) {
    case "normal":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3 w-3" /> Normal
        </span>
      );
    case "near-ot":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          <AlertTriangle className="h-3 w-3" /> Near OT
        </span>
      );
    case "overtime":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
          <ShieldAlert className="h-3 w-3" /> Overtime
        </span>
      );
  }
};

const credentialBadge = (status: "current" | "warning" | "expired") => {
  switch (status) {
    case "current":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3 w-3" /> Current
        </span>
      );
    case "warning":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          <AlertTriangle className="h-3 w-3" /> Expiring Soon
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
          <ShieldAlert className="h-3 w-3" /> EXPIRED
        </span>
      );
  }
};

/* ------------------------------------------------------------------ */
/*  AI Insight Box Component                                           */
/* ------------------------------------------------------------------ */

function AiInsight({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
          <Brain className="h-4 w-4 text-purple-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            One Engine Insight
          </p>
          <p className="text-sm text-purple-900 leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function HrClient({ stats, recentDocuments }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR & Team</h1>
          <p className="text-sm text-slate-500">
            Employee records, write-ups, and document management
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/hr/employees"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Users className="h-4 w-4" />
            Team Directory
          </Link>
          <Link
            href="/dashboard/hr/documents/new"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Write-up
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Employees"
          value={String(stats.activeEmployees)}
          icon={Users}
          iconColor="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          title="Pending Signatures"
          value={String(stats.pendingSignatures)}
          change={
            stats.pendingSignatures > 0 ? "Needs attention" : "All clear"
          }
          trend={stats.pendingSignatures > 0 ? "down" : "up"}
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Documents This Month"
          value={String(stats.documentsThisMonth)}
          icon={FileText}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Acknowledged"
          value={String(stats.acknowledgedThisMonth)}
          icon={CheckCircle2}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* ============================================================ */}
      {/*  ADP PAYROLL OVERVIEW                                        */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">
              ADP Payroll Overview
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Synced with ADP
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Next Payroll Date
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-900">Feb 14, 2026</p>
              <p className="text-xs text-slate-500 mt-1">
                Current period: Feb 1 - Feb 14
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-emerald-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Payroll Estimate
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-900">$18,500</p>
              <p className="text-xs text-slate-500 mt-1">
                5 employees this period
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="h-4 w-4 text-amber-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Days Until Payroll
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-900">7 days</p>
              <p className="text-xs text-slate-500 mt-1">
                Processing begins Feb 12
              </p>
            </div>
          </div>
          <AiInsight>
            One Engine detected Maria Santos approaching overtime (38.5 hrs).
            Consider adjusting schedule for remaining 2 days of this pay period.
          </AiInsight>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  EMPLOYEE TIME & ATTENDANCE                                   */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">
              Employee Time & Attendance
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Week of Feb 2 - Feb 7, 2026
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  This Week
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Overtime
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Reg Rate
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  OT Rate
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employeeTimeData.map((emp) => (
                <tr
                  key={emp.name}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <p className="text-sm font-medium text-slate-900">
                      {emp.name}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">
                    {emp.role}
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm font-medium text-slate-900">
                    {emp.weekHrs.toFixed(1)} hrs
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm text-slate-600">
                    {emp.overtime > 0 ? (
                      <span className="font-medium text-red-600">
                        {emp.overtime.toFixed(1)} hrs
                      </span>
                    ) : (
                      "0 hrs"
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm text-slate-600">
                    ${emp.regRate}/hr
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm text-slate-600">
                    ${emp.otRate}/hr
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {statusBadge(emp.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  PAYROLL SUMMARY                                              */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
            <CreditCard className="h-4 w-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">
              Payroll Summary
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Gross Payroll</span>
                <span className="text-sm font-semibold text-slate-900">
                  $18,500.00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Employer Taxes (FICA, FUTA, SUTA)
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  $1,915.00
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Total Payroll Cost
                </span>
                <span className="text-lg font-bold text-slate-900">
                  $20,415.00
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  YTD Payroll
                </span>
                <span className="text-sm font-bold text-slate-900">
                  $57,250.00
                </span>
              </div>
            </div>
            <AiInsight>
              Overtime cost this period: $120. Tom Williams has had overtime 3 of
              last 4 pay periods -- consider staffing adjustment.
            </AiInsight>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  RECENT PUNCH ACTIVITY                                       */}
        {/* ============================================================ */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
            <Timer className="h-4 w-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">
              Recent Punch Activity
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentPunches.map((punch, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    punch.action === "Clock In"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {punch.action === "Clock In" ? (
                    <LogIn className="h-4 w-4" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {punch.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {punch.action} at {punch.time}{" "}
                    <span className="text-slate-400">
                      (scheduled: {punch.scheduled})
                    </span>
                  </p>
                </div>
                {punch.flag ? (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    <AlertTriangle className="h-3 w-3" />
                    {punch.flag}
                  </span>
                ) : (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    On time
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 px-6 py-3">
            <AiInsight>
              Jessica Chen clocked in 12 min late today (8:12 AM vs 8:00 AM
              scheduled). This is her 2nd late arrival this month.
            </AiInsight>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  LICENSING & CREDENTIALS                                      */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">
              Licensing & Credentials
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            2 items need attention
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Holder
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Credential
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  License #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Expires
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {credentials.map((cred, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50 transition-colors ${
                    cred.status === "expired"
                      ? "bg-red-50/30"
                      : cred.status === "warning"
                        ? "bg-amber-50/30"
                        : ""
                  }`}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          cred.status === "expired"
                            ? "bg-red-100 text-red-600"
                            : cred.status === "warning"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <BadgeCheck className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        {cred.holder}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">
                    {cred.credential}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500 font-mono">
                    {cred.number || "--"}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-slate-900">{cred.expires}</p>
                    {cred.status === "warning" && (
                      <p className="text-xs text-amber-600 font-medium">
                        {cred.daysUntil} days remaining
                      </p>
                    )}
                    {cred.status === "expired" && (
                      <p className="text-xs text-red-600 font-semibold">
                        ACTION NEEDED
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {credentialBadge(cred.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 px-6 py-3">
          <AiInsight>
            One Engine Alert: Dr. Alex&apos;s DEA license expires in 49 days.
            Radiation Safety certification has EXPIRED. Renewal applications have
            been drafted for your review.
          </AiInsight>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  RECENT DOCUMENTS (original section)                          */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">
              Recent Documents
            </h2>
          </div>
        </div>

        {recentDocuments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentDocuments.map((doc) => {
              const tConfig = typeConfig[doc.type] || typeConfig.general;
              const sConfig =
                statusConfig[doc.status] || statusConfig.draft;
              const TypeIcon = tConfig.icon;

              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tConfig.color}`}
                  >
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {doc.employeeName} &middot; {timeAgo(doc.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${sConfig.color}`}
                  >
                    {sConfig.label}
                  </span>
                  {doc.status === "pending_signature" && (
                    <Link
                      href={`/dashboard/hr/documents/${doc.id}/present`}
                      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      Present
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/hr/employees/${doc.id}`}
                    className="shrink-0 text-slate-400 hover:text-slate-600"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <ClipboardList className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">
              No Documents Yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Create your first write-up or save an advisor conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
