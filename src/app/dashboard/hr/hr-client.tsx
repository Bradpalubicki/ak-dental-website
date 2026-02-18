"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
  GraduationCap,
  ChevronDown,
  Trash2,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  Activity,
  Download,
  RefreshCw,
  Target,
  Zap,
  BarChart3,
  UserCheck,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import type { AlertItem } from "@/components/dashboard/alert-banner";
import {
  TrendLine,
  BarChartFull,
  DonutChart,
  ProgressBar,
} from "@/components/dashboard/chart-components";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

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

interface EmployeeTimeEntry {
  name: string;
  role: string;
  department: string;
  weekHrs: number;
  overtime: number;
  regRate: number;
  otRate: number;
  status: "normal" | "near-ot" | "overtime";
  punctuality: number;
  adherence: number;
  daysPresent: number;
  daysScheduled: number;
}

interface PunchEntry {
  name: string;
  action: string;
  time: string;
  scheduled: string;
  flag: string | null;
}

interface CredentialEntry {
  holder: string;
  credential: string;
  number: string;
  expires: string;
  status: "current" | "warning" | "expired";
  daysUntil: number;
}

interface WorkforceData {
  employeeTimeData: EmployeeTimeEntry[];
  recentPunches: PunchEntry[];
  credentials: CredentialEntry[];
  roleDistribution: { name: string; value: number; color: string }[];
  payrollTrendData: { name: string; gross: number; taxes: number; net: number }[];
  weeklyHoursData: { name: string; regular: number; overtime: number }[];
  attendanceData: { name: string; present: number; absent: number; late: number }[];
  laborCostTrend: { name: string; laborPct: number; revenue: number }[];
}

interface Props {
  stats: {
    activeEmployees: number;
    pendingSignatures: number;
    documentsThisMonth: number;
    acknowledgedThisMonth: number;
  };
  recentDocuments: RecentDocument[];
  workforce: WorkforceData;
}

/* ================================================================== */
/*  Config Maps                                                        */
/* ================================================================== */

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
  training_record: {
    label: "Training",
    color: "bg-indigo-100 text-indigo-700",
    icon: GraduationCap,
  },
  certificate: {
    label: "Certificate",
    color: "bg-teal-100 text-teal-700",
    icon: Award,
  },
  credential: {
    label: "Credential",
    color: "bg-violet-100 text-violet-700",
    icon: BadgeCheck,
  },
};

const addNewItems = [
  {
    label: "Write-Up",
    description: "Disciplinary or coaching write-up",
    icon: AlertTriangle,
    color: "text-red-600 bg-red-50",
    href: "/dashboard/hr/documents/new?category=disciplinary",
  },
  {
    label: "Training Record",
    description: "Track completed or required training",
    icon: GraduationCap,
    color: "text-indigo-600 bg-indigo-50",
    href: "/dashboard/hr/documents/new?category=training_record",
  },
  {
    label: "Certificate / Credential",
    description: "License, certification, or credential",
    icon: Award,
    color: "text-teal-600 bg-teal-50",
    href: "/dashboard/hr/documents/new?category=certificate",
  },
  {
    label: "Incident Report",
    description: "Document a workplace incident",
    icon: Shield,
    color: "text-orange-600 bg-orange-50",
    href: "/dashboard/hr/documents/new?category=incident_report",
  },
  {
    label: "Performance Review",
    description: "Annual or periodic review",
    icon: Star,
    color: "text-blue-600 bg-blue-50",
    href: "/dashboard/hr/documents/new?category=performance_review",
  },
  {
    label: "Coaching Note",
    description: "Informal coaching or feedback",
    icon: MessageSquare,
    color: "text-cyan-600 bg-cyan-50",
    href: "/dashboard/hr/documents/new?category=coaching_note",
  },
  {
    label: "General Document",
    description: "Other HR documentation",
    icon: FileText,
    color: "text-slate-600 bg-slate-50",
    href: "/dashboard/hr/documents/new?category=general",
  },
];

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

/* Demo data removed — all workforce data now computed server-side from oe_employees + oe_licenses */

/* ================================================================== */
/*  Helper Components                                                  */
/* ================================================================== */

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

function StatusBadge({
  status,
}: {
  status: "normal" | "near-ot" | "overtime";
}) {
  const config = {
    normal: {
      icon: CheckCircle2,
      label: "Normal",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    "near-ot": {
      icon: AlertTriangle,
      label: "Near OT",
      className: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    overtime: {
      icon: ShieldAlert,
      label: "Overtime",
      className: "bg-red-50 text-red-700 border border-red-200",
    },
  }[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3 w-3" /> {config.label}
    </span>
  );
}

function CredentialBadge({
  status,
}: {
  status: "current" | "warning" | "expired";
}) {
  const config = {
    current: {
      icon: CheckCircle2,
      label: "Current",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    warning: {
      icon: AlertTriangle,
      label: "Expiring Soon",
      className: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    expired: {
      icon: ShieldAlert,
      label: "EXPIRED",
      className: "bg-red-50 text-red-700 border border-red-200 animate-pulse",
    },
  }[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3 w-3" /> {config.label}
    </span>
  );
}

function AiInsight({
  children,
  actions,
  type = "default",
}: {
  children: React.ReactNode;
  actions?: { label: string; href?: string }[];
  type?: "default" | "prediction" | "recommendation";
}) {
  const borderColor =
    type === "prediction"
      ? "border-amber-300/80"
      : type === "recommendation"
        ? "border-emerald-300/80"
        : "border-purple-200/80";
  const gradientFrom =
    type === "prediction"
      ? "from-amber-50/80 via-orange-50/60 to-amber-50/80"
      : type === "recommendation"
        ? "from-emerald-50/80 via-teal-50/60 to-emerald-50/80"
        : "from-purple-50/80 via-indigo-50/60 to-purple-50/80";
  const iconGradient =
    type === "prediction"
      ? "from-amber-500 to-orange-600"
      : type === "recommendation"
        ? "from-emerald-500 to-teal-600"
        : "from-purple-500 to-indigo-600";
  const labelColor =
    type === "prediction"
      ? "text-amber-600"
      : type === "recommendation"
        ? "text-emerald-600"
        : "text-purple-500";
  const label =
    type === "prediction"
      ? "One Engine Prediction"
      : type === "recommendation"
        ? "One Engine Recommendation"
        : "One Engine Insight";
  const actionBg =
    type === "prediction"
      ? "bg-amber-600 hover:bg-amber-700"
      : type === "recommendation"
        ? "bg-emerald-600 hover:bg-emerald-700"
        : "bg-purple-600 hover:bg-purple-700";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${borderColor} bg-gradient-to-r ${gradientFrom} p-4 shadow-sm transition-all duration-300 hover:shadow-md`}
    >
      {/* Animated shimmer */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconGradient} shadow-md`}
        >
          {type === "prediction" ? (
            <Zap className="h-4 w-4 text-white" />
          ) : (
            <Brain className="h-4 w-4 text-white" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.15em] ${labelColor} mb-1`}
          >
            {label}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{children}</p>
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-2.5">
              {actions.map((action) =>
                action.href ? (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`inline-flex items-center gap-1 rounded-lg ${actionBg} px-3 py-1.5 text-xs font-medium text-white transition-colors shadow-sm`}
                  >
                    {action.label}
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <button
                    key={action.label}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/80 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white transition-colors backdrop-blur-sm"
                  >
                    {action.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SyncIndicator() {
  const [lastSync, setLastSync] = useState(new Date());
  const [syncing, setSyncing] = useState(false);
  const [displayTime, setDisplayTime] = useState("Just now");

  useEffect(() => {
    function tick() {
      const diff = Math.floor((Date.now() - lastSync.getTime()) / 60000);
      setDisplayTime(diff < 1 ? "Just now" : `${diff}m ago`);
    }
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [lastSync]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium text-emerald-700">Synced</span>
        <span className="text-emerald-600">{displayTime}</span>
      </div>
      <button
        onClick={() => {
          setSyncing(true);
          setTimeout(() => {
            setLastSync(new Date());
            setSyncing(false);
          }, 1500);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
        title="Refresh data"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`}
        />
      </button>
    </div>
  );
}

/** Gauge-style percentage ring */
function GaugeRing({
  value,
  label,
  color,
  size = 80,
}: {
  value: number;
  label: string;
  color: string;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90 origin-center"
          fill="#1e293b"
          fontSize="14"
          fontWeight="700"
        >
          {value}%
        </text>
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}

function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================================================================== */
/*  Tab config                                                         */
/* ================================================================== */

const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "time", label: "Time & Attendance", icon: Clock },
  { id: "performance", label: "Performance", icon: Target },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "documents", label: "Documents", icon: FileText },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function HrClient({ stats, recentDocuments, workforce }: Props) {
  const { employeeTimeData, recentPunches, credentials, roleDistribution, payrollTrendData, weeklyHoursData, attendanceData, laborCostTrend } = workforce;
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTrash, setShowTrash] = useState(false);
  const [deletedDocs, setDeletedDocs] = useState<RecentDocument[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState("this-week");
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(e.target as Node)
      ) {
        setAddMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employeeTimeData.filter((emp) => {
      const nameMatch = emp.name
        .toLowerCase()
        .includes(employeeFilter.toLowerCase());
      const roleMatch =
        roleFilter === "all" || emp.department === roleFilter;
      return nameMatch && roleMatch;
    });
  }, [employeeFilter, roleFilter, employeeTimeData]);

  // Compute summary stats
  const totalHours = employeeTimeData.reduce((s, e) => s + e.weekHrs, 0);
  const totalOT = employeeTimeData.reduce((s, e) => s + e.overtime, 0);
  const otPct =
    totalHours > 0 ? ((totalOT / totalHours) * 100).toFixed(1) : "0";
  const laborCostEst = employeeTimeData.reduce(
    (s, e) =>
      s + (e.weekHrs - e.overtime) * e.regRate + e.overtime * e.otRate,
    0
  );
  const avgPunctuality = Math.round(
    employeeTimeData.reduce((s, e) => s + e.punctuality, 0) /
      employeeTimeData.length
  );
  const avgAdherence = Math.round(
    employeeTimeData.reduce((s, e) => s + e.adherence, 0) /
      employeeTimeData.length
  );
  const attendanceRate = Math.round(
    (employeeTimeData.reduce((s, e) => s + e.daysPresent, 0) /
      employeeTimeData.reduce((s, e) => s + e.daysScheduled, 0)) *
      100
  );
  const costPerFTE = Math.round(
    laborCostEst / employeeTimeData.length
  );
  const otPctOfPayroll =
    laborCostEst > 0
      ? (
          ((totalOT *
            (employeeTimeData.find((e) => e.overtime > 0)?.otRate || 30)) /
            laborCostEst) *
          100
        ).toFixed(1)
      : "0";

  // Build alert items
  const alertItems: AlertItem[] = [];
  const expiredCreds = credentials.filter((c) => c.status === "expired");
  const warningCreds = credentials.filter((c) => c.status === "warning");
  const overtimeEmps = employeeTimeData.filter(
    (e) => e.status === "overtime"
  );
  const nearOtEmps = employeeTimeData.filter((e) => e.status === "near-ot");

  expiredCreds.forEach((c) => {
    alertItems.push({
      id: `exp-${c.credential}`,
      severity: "critical",
      title: `${c.credential} EXPIRED`,
      description: `${c.holder} — expired ${c.expires}. Renewal required immediately.`,
      action: {
        label: "Renew Now",
        href: "/dashboard/hr/certifications/new",
      },
      dismissible: false,
    });
  });
  warningCreds.forEach((c) => {
    alertItems.push({
      id: `warn-${c.credential}`,
      severity: "warning",
      title: `${c.credential} expiring soon`,
      description: `${c.holder} — expires ${c.expires}`,
      countdown: `${c.daysUntil} days`,
      action: {
        label: "Schedule Renewal",
        href: "/dashboard/hr/certifications/new",
      },
    });
  });
  overtimeEmps.forEach((e) => {
    alertItems.push({
      id: `ot-${e.name}`,
      severity: "warning",
      title: `${e.name} in overtime`,
      description: `${e.overtime} OT hours this week. Consider adjusting schedule.`,
      action: { label: "Adjust Schedule" },
    });
  });
  nearOtEmps.forEach((e) => {
    alertItems.push({
      id: `nearot-${e.name}`,
      severity: "info",
      title: `${e.name} approaching overtime`,
      description: `${e.weekHrs} hours worked — ${(40 - e.weekHrs).toFixed(1)} hours remaining before OT threshold.`,
    });
  });
  if (stats.pendingSignatures > 0) {
    alertItems.push({
      id: "pending-sigs",
      severity: "info",
      title: `${stats.pendingSignatures} document${stats.pendingSignatures > 1 ? "s" : ""} awaiting signature`,
      action: { label: "View Documents" },
    });
  }

  const handleExportEmployees = useCallback(() => {
    exportToCSV(
      "employee-time-report",
      [
        "Name",
        "Role",
        "Department",
        "Hours",
        "Overtime",
        "Reg Rate",
        "OT Rate",
        "Status",
      ],
      employeeTimeData.map((e) => [
        e.name,
        e.role,
        e.department,
        String(e.weekHrs),
        String(e.overtime),
        String(e.regRate),
        String(e.otRate),
        e.status,
      ])
    );
  }, [employeeTimeData]);

  const handleExportCredentials = useCallback(() => {
    exportToCSV(
      "credentials-report",
      ["Holder", "Credential", "License #", "Expires", "Status", "Days Until"],
      credentials.map((c) => [
        c.holder,
        c.credential,
        c.number,
        c.expires,
        c.status,
        String(c.daysUntil),
      ])
    );
  }, [credentials]);

  function handleDeleteClick(docId: string) {
    setPendingDeleteId(docId);
  }

  async function handleDeleteConfirm() {
    if (!pendingDeleteId) return;
    const docId = pendingDeleteId;
    setPendingDeleteId(null);
    setDeletingId(docId);
    try {
      const res = await fetch(`/api/hr/documents/${docId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      window.location.reload();
    } catch {
      // Error displayed via UI state, not alert
      setDeletingId(null);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRestore(docId: string) {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/hr/documents/${docId}/restore`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to restore");
      window.location.reload();
    } catch {
      setErrorMsg("Failed to restore document. Please try again.");
    }
  }

  async function loadTrash() {
    setErrorMsg(null);
    try {
      const res = await fetch("/api/hr/documents?deleted=true");
      const data = await res.json();
      setDeletedDocs(
        data.map((d: Record<string, unknown>) => ({
          id: d.id as string,
          type: d.type as string,
          title: d.title as string,
          status: d.status as string,
          severity: d.severity as string | null,
          createdAt: d.created_at as string,
          createdBy: d.created_by as string,
          employeeName: (d.employee as Record<string, string>)
            ? `${(d.employee as Record<string, string>).first_name} ${(d.employee as Record<string, string>).last_name}`
            : "Unknown",
        }))
      );
      setShowTrash(true);
    } catch {
      setErrorMsg("Failed to load trash.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600">&times;</button>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Header + Sync + Date Range                                   */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR & Team</h1>
          <p className="text-sm text-slate-500">
            Employee records, training, credentials, and document management
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SyncIndicator />

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
          </select>

          <button
            onClick={loadTrash}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
            title="View recently deleted"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <Link
            href="/dashboard/hr/employees"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team Directory</span>
          </Link>
          <div className="relative" ref={addMenuRef}>
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="h-4 w-4" />
              Add New
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${addMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {addMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2">
                  {addNewItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setAddMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  PRIORITY ALERTS                                              */}
      {/* ============================================================ */}
      {alertItems.length > 0 && (
        <AlertBanner alerts={alertItems} maxVisible={3} />
      )}

      {/* ============================================================ */}
      {/*  KPI STRIP                                                    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Active Employees"
          value={String(stats.activeEmployees)}
          icon={Users}
          iconColor="bg-cyan-50 text-cyan-600"
          sparkData={[4, 4, 5, 5, 5, 5]}
          sparkColor="#0891b2"
          accentColor="#0891b2"
          href="/dashboard/hr/employees"
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
          accentColor="#d97706"
          pulse={stats.pendingSignatures > 0}
        />
        <StatCard
          title="Total Hours (Week)"
          value={`${totalHours.toFixed(0)}`}
          change={`${otPct}% overtime`}
          trend={totalOT > 0 ? "down" : "up"}
          icon={Timer}
          iconColor="bg-blue-50 text-blue-600"
          sparkData={weeklyHoursData.map((d) => d.regular + d.overtime)}
          sparkColor="#2563eb"
          accentColor="#2563eb"
        />
        <StatCard
          title="Est. Labor Cost"
          value={`$${laborCostEst.toLocaleString()}`}
          change="+2.1% vs last period"
          trend="up"
          icon={DollarSign}
          iconColor="bg-emerald-50 text-emerald-600"
          sparkData={payrollTrendData.map((d) => d.gross)}
          sparkColor="#059669"
          accentColor="#059669"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          change={`${avgPunctuality}% punctual`}
          trend={avgPunctuality >= 95 ? "up" : "down"}
          icon={UserCheck}
          iconColor="bg-indigo-50 text-indigo-600"
          accentColor="#4f46e5"
        />
        <StatCard
          title="Compliance Score"
          value={`${Math.round(((credentials.length - expiredCreds.length) / credentials.length) * 100)}%`}
          change={
            expiredCreds.length > 0
              ? `${expiredCreds.length} expired`
              : "All current"
          }
          trend={expiredCreds.length > 0 ? "down" : "up"}
          icon={Shield}
          iconColor={
            expiredCreds.length > 0
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-600"
          }
          accentColor={expiredCreds.length > 0 ? "#dc2626" : "#059669"}
          pulse={expiredCreds.length > 0}
        />
      </div>

      {/* ============================================================ */}
      {/*  TAB NAVIGATION                                               */}
      {/* ============================================================ */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 ${
                  isActive
                    ? "border-cyan-600 text-cyan-700 bg-cyan-50/30"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Trash Modal */}
      {showTrash && (
        <div className="rounded-xl border border-red-200 bg-red-50/50">
          <div className="flex items-center justify-between border-b border-red-200 px-6 py-3">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-500" />
              <h2 className="text-sm font-semibold text-red-800">
                Recently Deleted (30-day retention)
              </h2>
            </div>
            <button
              onClick={() => setShowTrash(false)}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Close
            </button>
          </div>
          {deletedDocs.length > 0 ? (
            <div className="divide-y divide-red-100">
              {deletedDocs.map((doc) => {
                const tConfig = typeConfig[doc.type] || typeConfig.general;
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 px-6 py-3"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tConfig.color}`}
                    >
                      <tConfig.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {doc.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {doc.employeeName} &middot; {timeAgo(doc.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRestore(doc.id)}
                      className="shrink-0 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Restore
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-red-600">
                No deleted documents in the last 30 days.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/*  OVERVIEW TAB                                                 */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <DemoBanner module="Payroll, time tracking, and attendance data" />
          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Payroll Trend */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Payroll Trend
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Last 5 periods</span>
              </div>
              <div className="p-4">
                <TrendLine
                  data={payrollTrendData}
                  lines={[
                    {
                      key: "gross",
                      color: "#0891b2",
                      label: "Gross Payroll",
                    },
                    { key: "net", color: "#059669", label: "Net Pay" },
                    {
                      key: "taxes",
                      color: "#d97706",
                      label: "Taxes",
                      dashed: true,
                    },
                  ]}
                  height={220}
                />
              </div>
            </div>

            {/* Team Composition */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <Users className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Team Composition
                </h3>
              </div>
              <div className="p-4">
                <DonutChart
                  data={roleDistribution}
                  height={160}
                  innerRadius={45}
                  outerRadius={65}
                  centerLabel="Total"
                  centerValue={String(stats.activeEmployees)}
                />
                <div className="mt-3 space-y-2">
                  {roleDistribution.map((r) => (
                    <div
                      key={r.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: r.color }}
                        />
                        <span className="text-xs text-slate-600">
                          {r.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900">
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hours & OT Chart + Payroll Summary */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Weekly Hours
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Last 5 weeks</span>
              </div>
              <div className="p-4">
                <BarChartFull
                  data={weeklyHoursData}
                  bars={[
                    {
                      key: "regular",
                      color: "#0891b2",
                      label: "Regular",
                      stackId: "hrs",
                    },
                    {
                      key: "overtime",
                      color: "#dc2626",
                      label: "Overtime",
                      stackId: "hrs",
                    },
                  ]}
                  height={180}
                />
              </div>
            </div>

            {/* ADP Payroll Summary */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Payroll Summary
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Demo Data
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/50 to-white p-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Next Pay
                    </p>
                    <p className="text-lg font-bold text-slate-900">Feb 14</p>
                    <p className="text-[10px] text-slate-500">7 days</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/50 to-white p-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Gross
                    </p>
                    <p className="text-lg font-bold text-slate-900">$18.5K</p>
                    <p className="text-[10px] text-slate-500">5 employees</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/50 to-white p-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      YTD
                    </p>
                    <p className="text-lg font-bold text-slate-900">$57.3K</p>
                    <p className="text-[10px] text-slate-500">3 periods</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Gross Payroll</span>
                    <span className="font-semibold text-slate-900">
                      $18,500.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Employer Taxes</span>
                    <span className="font-semibold text-slate-900">
                      $1,915.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">OT Cost</span>
                    <span className="font-semibold text-red-600">$120.00</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      $20,535.00
                    </span>
                  </div>
                </div>
                <AiInsight
                  type="recommendation"
                  actions={[
                    {
                      label: "Adjust Schedule",
                      href: "/dashboard/appointments",
                    },
                    { label: "Dismiss" },
                  ]}
                >
                  Tom Williams has had overtime 3 of last 4 pay periods ($480 in
                  OT costs). Consider hiring a part-time assistant to cover
                  Thursday/Friday peaks.
                </AiInsight>
              </div>
            </div>
          </div>

          {/* Quick Compliance Strip */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Compliance Quick View
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("compliance")}
                className="text-xs font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
              >
                View All <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-3">
                {[...credentials]
                  .sort((a, b) => a.daysUntil - b.daysUntil)
                  .slice(0, 4)
                  .map((cred, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:shadow-sm ${
                        cred.status === "expired"
                          ? "border-red-200 bg-red-50/50"
                          : cred.status === "warning"
                            ? "border-amber-200 bg-amber-50/50"
                            : "border-slate-200 bg-white"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          cred.status === "expired"
                            ? "bg-red-100 text-red-600"
                            : cred.status === "warning"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {cred.credential}
                        </p>
                        <p className="text-xs text-slate-500">{cred.holder}</p>
                      </div>
                      <CredentialBadge status={cred.status} />
                      {cred.daysUntil > 0 && (
                        <span className="text-xs font-mono text-slate-500">
                          {cred.daysUntil}d
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  TIME & ATTENDANCE TAB                                        */}
      {/* ============================================================ */}
      {activeTab === "time" && (
        <div className="space-y-6">
          {/* Employee Table with Filters */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Employee Time & Attendance
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Week of Feb 2 - Feb 7, 2026
                </span>
                <button
                  onClick={handleExportEmployees}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-3 bg-slate-50/50">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white py-2 pl-2 pr-7 text-sm text-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="all">All Departments</option>
                  <option value="Clinical">Clinical</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <span className="text-xs text-slate-400">
                {filteredEmployees.length} of {employeeTimeData.length}{" "}
                employees
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
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
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Utilization
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr
                      key={emp.name}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-6 py-3.5">
                        <Link
                          href="/dashboard/hr/employees"
                          className="block"
                        >
                          <p className="text-sm font-medium text-slate-900 group-hover:text-cyan-700 transition-colors">
                            {emp.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {emp.department}
                          </p>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {emp.role}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-medium text-slate-900">
                        {emp.weekHrs.toFixed(1)} hrs
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm">
                        {emp.overtime > 0 ? (
                          <span className="font-medium text-red-600">
                            {emp.overtime.toFixed(1)} hrs
                          </span>
                        ) : (
                          <span className="text-slate-400">0 hrs</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm text-slate-600">
                        ${emp.regRate}/hr
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm text-slate-600">
                        ${emp.otRate}/hr
                      </td>
                      <td className="px-4 py-3.5 w-32">
                        <ProgressBar
                          value={emp.weekHrs}
                          max={40}
                          color={
                            emp.status === "overtime"
                              ? "bg-red-500"
                              : emp.status === "near-ot"
                                ? "bg-amber-500"
                                : "bg-cyan-500"
                          }
                          showLabel={false}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <StatusBadge status={emp.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-6 py-3">
              <AiInsight
                type="prediction"
                actions={[{ label: "View Prediction" }]}
              >
                Based on current pace, Maria Santos will exceed 40hrs by
                Friday at 2:30 PM. Consider swapping her Thursday PM shift with
                Jessica Chen (32 hrs, has capacity).
              </AiInsight>
            </div>
          </div>

          {/* Punch Activity */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-indigo-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Recent Punch Activity
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Today</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {recentPunches.filter((p) => p.flag).length} issues
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {recentPunches.map((punch, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/70 transition-colors"
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
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      <AlertTriangle className="h-3 w-3" />
                      {punch.flag}
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />
                      On time
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  PERFORMANCE TAB                                              */}
      {/* ============================================================ */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          {/* Gauge Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center">
              <GaugeRing
                value={avgPunctuality}
                label="Punctuality"
                color="#0891b2"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center">
              <GaugeRing
                value={avgAdherence}
                label="Schedule Adherence"
                color="#2563eb"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center">
              <GaugeRing
                value={attendanceRate}
                label="Attendance Rate"
                color="#059669"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center">
              <GaugeRing
                value={100 - Number(otPct)}
                label="Efficiency"
                color="#7c3aed"
              />
            </div>
          </div>

          {/* Cost Analytics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Labor Cost % of Revenue */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Labor Cost % of Revenue
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  Target: &lt; 28%
                </span>
              </div>
              <div className="p-4">
                <TrendLine
                  data={laborCostTrend}
                  lines={[
                    {
                      key: "laborPct",
                      color: "#059669",
                      label: "Labor Cost %",
                    },
                  ]}
                  height={200}
                />
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-0.5">
                      Current
                    </p>
                    <p className="text-lg font-bold text-emerald-700">26.8%</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                      Cost/FTE
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      ${costPerFTE.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                      OT % of Payroll
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {otPctOfPayroll}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Attendance */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Daily Attendance
                  </h3>
                </div>
                <span className="text-xs text-slate-400">This Week</span>
              </div>
              <div className="p-4">
                <BarChartFull
                  data={attendanceData}
                  bars={[
                    {
                      key: "present",
                      color: "#059669",
                      label: "Present",
                      stackId: "att",
                    },
                    {
                      key: "late",
                      color: "#d97706",
                      label: "Late",
                      stackId: "att",
                    },
                    {
                      key: "absent",
                      color: "#dc2626",
                      label: "Absent",
                      stackId: "att",
                    },
                  ]}
                  height={200}
                />
              </div>
            </div>
          </div>

          {/* Employee Performance Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Team Performance Metrics
                </h2>
              </div>
              <button
                onClick={() =>
                  exportToCSV(
                    "team-performance",
                    [
                      "Name",
                      "Role",
                      "Punctuality",
                      "Adherence",
                      "Attendance",
                      "Hours",
                    ],
                    employeeTimeData.map((e) => [
                      e.name,
                      e.role,
                      `${e.punctuality}%`,
                      `${e.adherence}%`,
                      `${e.daysPresent}/${e.daysScheduled}`,
                      String(e.weekHrs),
                    ])
                  )
                }
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Role
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Punctuality
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Adherence
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Attendance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employeeTimeData
                    .sort(
                      (a, b) =>
                        (b.punctuality + b.adherence) / 2 -
                        (a.punctuality + a.adherence) / 2
                    )
                    .map((emp) => {
                      const score = Math.round(
                        (emp.punctuality + emp.adherence) / 2
                      );
                      return (
                        <tr
                          key={emp.name}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-6 py-3.5">
                            <p className="text-sm font-medium text-slate-900">
                              {emp.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {emp.department}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-slate-600">
                            {emp.role}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                emp.punctuality >= 95
                                  ? "bg-emerald-50 text-emerald-700"
                                  : emp.punctuality >= 90
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-700"
                              }`}
                            >
                              {emp.punctuality}%
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                emp.adherence >= 95
                                  ? "bg-emerald-50 text-emerald-700"
                                  : emp.adherence >= 90
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-700"
                              }`}
                            >
                              {emp.adherence}%
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center text-sm text-slate-700">
                            {emp.daysPresent}/{emp.daysScheduled} days
                          </td>
                          <td className="px-4 py-3.5 w-32">
                            <ProgressBar
                              value={score}
                              max={100}
                              color={
                                score >= 95
                                  ? "bg-emerald-500"
                                  : score >= 90
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }
                              label={`${score}%`}
                              size="sm"
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-6 py-3">
              <AiInsight type="recommendation">
                Rachel Green and David Kim have perfect punctuality and schedule
                adherence this period. Consider recognizing their consistency in
                the next team meeting.
              </AiInsight>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  COMPLIANCE TAB                                               */}
      {/* ============================================================ */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          {/* Compliance Score + Timeline */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 overflow-hidden">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Compliance Overview
              </h3>
              <DonutChart
                data={[
                  {
                    name: "Current",
                    value: credentials.filter((c) => c.status === "current")
                      .length,
                    color: "#059669",
                  },
                  {
                    name: "Expiring",
                    value: warningCreds.length,
                    color: "#d97706",
                  },
                  {
                    name: "Expired",
                    value: expiredCreds.length,
                    color: "#dc2626",
                  },
                ]}
                height={180}
                innerRadius={50}
                outerRadius={70}
                centerLabel="Score"
                centerValue={`${Math.round(((credentials.length - expiredCreds.length) / credentials.length) * 100)}%`}
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-600">Current</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900">
                    {credentials.filter((c) => c.status === "current").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-600">
                      Expiring Soon
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-amber-700">
                    {warningCreds.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-xs text-slate-600">Expired</span>
                  </div>
                  <span className="text-xs font-semibold text-red-700">
                    {expiredCreds.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Expiration Timeline */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Expiration Timeline
                  </h3>
                </div>
                <Link
                  href="/dashboard/hr/certifications/new"
                  className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
                >
                  + Add Credential
                </Link>
              </div>
              <div className="p-4 space-y-3">
                {[...credentials]
                  .sort((a, b) => a.daysUntil - b.daysUntil)
                  .map((cred, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          cred.status === "expired"
                            ? "bg-red-100 text-red-600"
                            : cred.status === "warning"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {cred.credential}
                          </p>
                          <CredentialBadge status={cred.status} />
                        </div>
                        <p className="text-xs text-slate-500">
                          {cred.holder} &middot; Expires {cred.expires}
                        </p>
                      </div>
                      <div className="shrink-0 w-32">
                        <ProgressBar
                          value={Math.max(cred.daysUntil, 0)}
                          max={365}
                          color={
                            cred.status === "expired"
                              ? "bg-red-500"
                              : cred.status === "warning"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }
                          label={
                            cred.daysUntil > 0
                              ? `${cred.daysUntil}d left`
                              : "Expired"
                          }
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Full Credentials Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-teal-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Licensing & Credentials
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {expiredCreds.length + warningCreds.length} items need
                  attention
                </span>
                <button
                  onClick={handleExportCredentials}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
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
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {credentials.map((cred, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50/70 transition-colors ${
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
                        {cred.number || "\u2014"}
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
                        <CredentialBadge status={cred.status} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {(cred.status === "expired" ||
                          cred.status === "warning") && (
                          <Link
                            href="/dashboard/hr/certifications/new"
                            className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 border border-cyan-200 px-2.5 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors"
                          >
                            Renew <ChevronRight className="h-3 w-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-200 px-6 py-3">
              <AiInsight
                actions={[
                  { label: "Review Drafts", href: "/dashboard/approvals" },
                  { label: "Dismiss" },
                ]}
              >
                Dr. Alex&apos;s DEA license expires in 49 days and Radiation
                Safety certification has EXPIRED. One Engine has drafted renewal
                applications for your review.
              </AiInsight>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  DOCUMENTS TAB                                                */}
      {/* ============================================================ */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-indigo-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Recent Documents
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                {recentDocuments.length} documents
              </span>
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
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tConfig.color}`}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate group-hover:text-cyan-700 transition-colors">
                          {doc.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doc.employeeName} &middot; {timeAgo(doc.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${sConfig.color}`}
                      >
                        {sConfig.label}
                      </span>
                      {doc.status === "pending_signature" && (
                        <Link
                          href={`/dashboard/hr/documents/${doc.id}/present`}
                          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                        >
                          <Monitor className="h-3.5 w-3.5" />
                          Present
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteClick(doc.id)}
                        disabled={deletingId === doc.id}
                        className="shrink-0 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/dashboard/hr/employees/${doc.id}`}
                        className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
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
      )}

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete Document"
        message="Move this document to trash? It will be permanently deleted after 30 days."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
