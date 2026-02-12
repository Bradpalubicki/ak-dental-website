"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  Eye,
  Download,
  Plus,
  Trash2,
  RotateCcw,
  X,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  UserPlus,
  UserCheck,
  Shield,
  Heart,
  Bot,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Zap,
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
import type { Patient } from "@/types/database";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  prospect: "bg-blue-100 text-blue-700",
};

interface Props {
  initialPatients: Patient[];
  stats: {
    active: number;
    prospect: number;
    inactive: number;
    total: number;
  };
}

const TABS = [
  { id: "overview" as const, label: "Overview" },
  { id: "directory" as const, label: "Patient Directory" },
  { id: "demographics" as const, label: "Demographics" },
  { id: "ai" as const, label: "AI & Retention" },
];
type TabId = (typeof TABS)[number]["id"];

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  address: "",
  insurance_provider: "",
  insurance_member_id: "",
  status: "prospect" as "active" | "inactive" | "prospect",
  notes: "",
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

const patientGrowthData = [
  { month: "Sep", active: 312, prospect: 45, inactive: 28 },
  { month: "Oct", active: 328, prospect: 52, inactive: 31 },
  { month: "Nov", active: 341, prospect: 48, inactive: 35 },
  { month: "Dec", active: 355, prospect: 56, inactive: 33 },
  { month: "Jan", active: 372, prospect: 61, inactive: 30 },
  { month: "Feb", active: 389, prospect: 58, inactive: 27 },
];

const acquisitionData = [
  { month: "Sep", referral: 8, website: 12, walkIn: 3, insurance: 5 },
  { month: "Oct", referral: 11, website: 14, walkIn: 4, insurance: 6 },
  { month: "Nov", referral: 9, website: 16, walkIn: 2, insurance: 7 },
  { month: "Dec", referral: 14, website: 18, walkIn: 5, insurance: 8 },
  { month: "Jan", referral: 12, website: 21, walkIn: 3, insurance: 9 },
  { month: "Feb", referral: 15, website: 19, walkIn: 4, insurance: 7 },
];

const insuranceMix = [
  { name: "Delta Dental", value: 142, color: "#2563eb" },
  { name: "MetLife", value: 89, color: "#059669" },
  { name: "Cigna", value: 64, color: "#d97706" },
  { name: "Aetna", value: 48, color: "#7c3aed" },
  { name: "Self-Pay", value: 31, color: "#dc2626" },
  { name: "Other", value: 15, color: "#64748b" },
];

const ageDistribution = [
  { range: "0-17", count: 42, color: "#0891b2" },
  { range: "18-34", count: 98, color: "#2563eb" },
  { range: "35-49", count: 124, color: "#059669" },
  { range: "50-64", count: 87, color: "#d97706" },
  { range: "65+", count: 38, color: "#7c3aed" },
];

const visitFrequencyData = [
  { freq: "Monthly", patients: 45, pct: 11.6 },
  { freq: "Quarterly", patients: 128, pct: 32.9 },
  { freq: "Bi-Annual", patients: 156, pct: 40.1 },
  { freq: "Annual", patients: 42, pct: 10.8 },
  { freq: "Lapsed (>1yr)", patients: 18, pct: 4.6 },
];

const retentionTrend = [
  { month: "Sep", rate: 88.2, target: 92 },
  { month: "Oct", rate: 89.5, target: 92 },
  { month: "Nov", rate: 90.1, target: 92 },
  { month: "Dec", rate: 91.4, target: 92 },
  { month: "Jan", rate: 92.8, target: 92 },
  { month: "Feb", rate: 93.6, target: 92 },
];

const recentAiActions = [
  { time: "5m ago", action: "Sent 6-month recall reminder", patient: "Sarah M.", type: "recall", confidence: 96 },
  { time: "12m ago", action: "Flagged at-risk: no visit in 14 months", patient: "James K.", type: "risk", confidence: 92 },
  { time: "18m ago", action: "Generated reactivation sequence", patient: "Maria L.", type: "reactivation", confidence: 94 },
  { time: "25m ago", action: "Updated insurance eligibility status", patient: "David R.", type: "insurance", confidence: 98 },
  { time: "32m ago", action: "Sent treatment follow-up reminder", patient: "Lisa P.", type: "followup", confidence: 91 },
  { time: "45m ago", action: "Predicted appointment no-show risk: HIGH", patient: "Robert W.", type: "risk", confidence: 88 },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function PatientsClient({ initialPatients, stats }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [trashItems, setTrashItems] = useState<Patient[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        search === "" ||
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        (p.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (p.phone?.includes(search) ?? false);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patients, search, statusFilter]);

  /* ---- CRUD handlers (preserved) ---- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newPatient = await res.json();
        setPatients((prev) => [newPatient, ...prev]);
        setForm(emptyForm);
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPatients((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  async function loadTrash() {
    const res = await fetch("/api/patients?deleted=true");
    if (res.ok) {
      const data = await res.json();
      setTrashItems(data);
    }
    setShowTrash(true);
  }

  async function handleRestore(id: string) {
    const res = await fetch(`/api/patients/${id}/restore`, { method: "POST" });
    if (res.ok) {
      const { data } = await res.json();
      setTrashItems((prev) => prev.filter((p) => p.id !== id));
      setPatients((prev) => [data, ...prev]);
    }
  }

  const exportCSV = () => {
    const rows = filtered.map((p) => ({
      name: `${p.first_name} ${p.last_name}`,
      email: p.email || "",
      phone: p.phone || "",
      status: p.status,
      insurance: p.insurance_provider || "Self-Pay",
      lastVisit: p.last_visit || "Never",
      tags: (p.tags || []).join("; "),
    }));
    const header = Object.keys(rows[0] || {}).join(",");
    const csv = [header, ...rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patients-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------------------------------------------------------- */
  /*  OVERVIEW TAB                                                     */
  /* ---------------------------------------------------------------- */
  const renderOverview = () => (
    <div className="space-y-6">
      <AiInsight variant="recommendation">
        <strong>One Engine Patient Analysis:</strong> Patient base grew 4.6% this month with 15 new referrals.
        18 patients are at risk of lapsing — automated recall sequences have been queued.
        Retention rate now exceeds target at 93.6%.
      </AiInsight>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-6">
        <StatCard
          title="Total Patients"
          value={stats.total > 0 ? stats.total.toLocaleString() : "389"}
          change="+17 this month"
          trend="up"
          icon={Users}
          iconColor="text-cyan-600 bg-cyan-50"
          sparkData={[312, 328, 341, 355, 372, 389]}
          sparkColor="#0891b2"
          accentColor="#0891b2"
        />
        <StatCard
          title="Active"
          value={stats.active > 0 ? stats.active.toLocaleString() : "389"}
          change="+4.6% growth"
          trend="up"
          icon={UserCheck}
          iconColor="text-emerald-600 bg-emerald-50"
          sparkData={[312, 328, 341, 355, 372, 389]}
          sparkColor="#059669"
          accentColor="#059669"
        />
        <StatCard
          title="Prospects"
          value={stats.prospect > 0 ? stats.prospect.toString() : "58"}
          change="12 hot leads"
          trend="up"
          icon={UserPlus}
          iconColor="text-blue-600 bg-blue-50"
          sparkData={[45, 52, 48, 56, 61, 58]}
          sparkColor="#2563eb"
          accentColor="#2563eb"
        />
        <StatCard
          title="Retention Rate"
          value="93.6%"
          change="+1.8% vs target"
          trend="up"
          icon={Heart}
          iconColor="text-red-600 bg-red-50"
          sparkData={[88.2, 89.5, 90.1, 91.4, 92.8, 93.6]}
          sparkColor="#dc2626"
          accentColor="#dc2626"
        />
        <StatCard
          title="Avg Visit Freq"
          value="2.4x/yr"
          change="+0.3 from last yr"
          trend="up"
          icon={Calendar}
          iconColor="text-purple-600 bg-purple-50"
          sparkData={[1.8, 1.9, 2.0, 2.1, 2.3, 2.4]}
          sparkColor="#7c3aed"
          accentColor="#7c3aed"
        />
        <StatCard
          title="At Risk"
          value="18"
          change="3 critical"
          trend="down"
          icon={AlertTriangle}
          iconColor="text-amber-600 bg-amber-50"
          sparkData={[32, 28, 25, 22, 20, 18]}
          sparkColor="#d97706"
          accentColor="#d97706"
          pulse
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Patient Growth */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Patient Growth</h3>
              <p className="text-xs text-slate-500">Active, prospect, and inactive trends</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Active</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" />Prospect</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-400" />Inactive</span>
            </div>
          </div>
          <TrendArea
            data={patientGrowthData as unknown as Record<string, unknown>[]}
            areas={[
              { key: "active", color: "#059669", label: "Active" },
              { key: "prospect", color: "#2563eb", label: "Prospect" },
              { key: "inactive", color: "#64748b", label: "Inactive" },
            ]}
            xKey="month"
            height={220}
          />
        </div>

        {/* Acquisition Sources */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Acquisition Sources</h3>
              <p className="text-xs text-slate-500">Where new patients come from</p>
            </div>
          </div>
          <BarChartFull
            data={acquisitionData as unknown as Record<string, unknown>[]}
            bars={[
              { key: "referral", color: "#059669", label: "Referral", stackId: "a" },
              { key: "website", color: "#2563eb", label: "Website", stackId: "a" },
              { key: "walkIn", color: "#d97706", label: "Walk-In", stackId: "a" },
              { key: "insurance", color: "#7c3aed", label: "Insurance", stackId: "a" },
            ]}
            xKey="month"
            height={220}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Insurance Mix */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Insurance Mix</h3>
              <p className="text-xs text-slate-500">Patient distribution by carrier</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <DonutChart
              data={insuranceMix}
              height={200}
              innerRadius={55}
              outerRadius={80}
              centerLabel="carriers"
              centerValue="6"
            />
            <div className="space-y-2.5 flex-1">
              {insuranceMix.map((ins) => (
                <div key={ins.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: ins.color }} />
                  <span className="text-xs text-slate-600 flex-1">{ins.name}</span>
                  <span className="text-xs font-semibold text-slate-900">{ins.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retention Trend */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Retention Trend</h3>
              <p className="text-xs text-slate-500">Monthly retention rate vs target</p>
            </div>
          </div>
          <TrendLine
            data={retentionTrend as unknown as Record<string, unknown>[]}
            lines={[
              { key: "rate", color: "#059669", label: "Retention %" },
              { key: "target", color: "#dc2626", label: "Target", dashed: true },
            ]}
            xKey="month"
            height={200}
          />
          <AiInsight variant="prediction">
            Retention rate exceeded 92% target for 2 consecutive months. Projected to reach 95% by April if current recall program continues.
          </AiInsight>
        </div>
      </div>

      {/* Health Gauges */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Patient Health Metrics</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          <div className="relative flex flex-col items-center">
            <GaugeRing value={93.6} color="#059669" label="Retention Rate" />
          </div>
          <div className="relative flex flex-col items-center">
            <GaugeRing value={82} color="#2563eb" label="Recall Compliance" />
          </div>
          <div className="relative flex flex-col items-center">
            <GaugeRing value={74} color="#7c3aed" label="Insurance Verified" />
          </div>
          <div className="relative flex flex-col items-center">
            <GaugeRing value={91} color="#0891b2" label="Contact Info Complete" />
          </div>
          <div className="relative flex flex-col items-center">
            <GaugeRing value={68} color="#d97706" label="Treatment Acceptance" />
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  DIRECTORY TAB                                                    */
  /* ---------------------------------------------------------------- */
  const renderDirectory = () => (
    <div className="space-y-4">
      {/* Add Patient Form */}
      {showForm && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">New Patient</h2>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-slate-200">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <input
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <input
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="(702) 555-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" | "prospect" })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="prospect">Prospect</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider</label>
                <input
                  value={form.insurance_provider}
                  onChange={(e) => setForm({ ...form, insurance_provider: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="Delta Dental, MetLife, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Member ID</label>
                <input
                  value={form.insurance_member_id}
                  onChange={(e) => setForm({ ...form, insurance_member_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                placeholder="Street, City, State ZIP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add Patient"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Status Filters */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { key: "all", label: "All Patients", count: stats.total, color: "slate" },
          { key: "active", label: "Active", count: stats.active, color: "emerald" },
          { key: "prospect", label: "Prospects", count: stats.prospect, color: "blue" },
          { key: "inactive", label: "Inactive", count: stats.inactive, color: "slate" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(statusFilter === s.key ? "all" : s.key)}
            className={cn(
              "rounded-xl border p-3 text-left transition-all",
              statusFilter === s.key
                ? s.color === "emerald"
                  ? "border-emerald-300 bg-emerald-50 shadow-sm"
                  : s.color === "blue"
                  ? "border-blue-300 bg-blue-50 shadow-sm"
                  : "border-slate-400 bg-slate-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
            )}
          >
            <p className={cn(
              "text-xl font-bold",
              s.color === "emerald" ? "text-emerald-600" : s.color === "blue" ? "text-blue-600" : "text-slate-700"
            )}>
              {s.count}
            </p>
            <p className="text-[11px] text-slate-500">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>
        <button
          onClick={loadTrash}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" /> Trash
        </button>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Download className="h-3.5 w-3.5" /> Export
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Patient
        </button>
      </div>

      <div className="text-xs text-slate-500">
        {filtered.length} patient{filtered.length !== 1 ? "s" : ""}
        {statusFilter !== "all" && ` · filtered by ${statusFilter}`}
      </div>

      {/* Patient Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Patient</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contact</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Insurance</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Last Visit</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Tags</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold",
                          patient.status === "active" ? "bg-emerald-100 text-emerald-700" :
                          patient.status === "prospect" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-500"
                        )}>
                          {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          {patient.first_name} {patient.last_name}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="space-y-0.5">
                        {patient.phone && (
                          <p className="flex items-center gap-1 text-xs text-slate-600">
                            <Phone className="h-3 w-3 text-slate-400" /> {patient.phone}
                          </p>
                        )}
                        {patient.email && (
                          <p className="flex items-center gap-1 text-xs text-slate-400">
                            <Mail className="h-3 w-3" /> {patient.email}
                          </p>
                        )}
                        {!patient.phone && !patient.email && <span className="text-xs text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-slate-600">
                        {patient.insurance_provider || (
                          <span className="text-slate-400">Self-Pay</span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize", statusColors[patient.status] || "bg-slate-100 text-slate-600")}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600">
                      {patient.last_visit
                        ? new Date(patient.last_visit).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : <span className="text-slate-400">Never</span>}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {(patient.tags || []).map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          disabled={deleting === patient.id}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-slate-400">
            <Users className="h-8 w-8 mb-2 text-slate-300" />
            {initialPatients.length === 0
              ? "No patients yet. Patients appear here when leads are converted or added manually."
              : "No patients match your search"}
          </div>
        )}
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  DEMOGRAPHICS TAB                                                 */
  /* ---------------------------------------------------------------- */
  const renderDemographics = () => (
    <div className="space-y-6">
      <AiInsight variant="default">
        <strong>Demographic Intelligence:</strong> Your largest patient segment is age 35-49 (32% of base).
        71% have verified insurance. Geographic analysis shows 84% within 10 miles of practice.
      </AiInsight>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Age Distribution */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Age Distribution</h3>
              <p className="text-xs text-slate-500">Patient count by age range</p>
            </div>
          </div>
          <div className="space-y-3">
            {ageDistribution.map((age) => (
              <div key={age.range} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-12 shrink-0 font-medium">{age.range}</span>
                <div className="flex-1 h-7 rounded-lg bg-slate-50 overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all duration-700 flex items-center"
                    style={{ width: `${(age.count / 124) * 100}%`, backgroundColor: age.color }}
                  >
                    <span className="text-[10px] font-bold text-white ml-2">{age.count}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 w-10 text-right">
                  {Math.round((age.count / 389) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visit Frequency */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Visit Frequency</h3>
              <p className="text-xs text-slate-500">How often patients visit</p>
            </div>
          </div>
          <div className="space-y-3">
            {visitFrequencyData.map((freq) => (
              <div key={freq.freq} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-28 shrink-0">{freq.freq}</span>
                <div className="flex-1">
                  <ProgressBar
                    value={freq.pct}
                    max={100}
                    color={freq.freq === "Lapsed (>1yr)" ? "bg-red-500" : "bg-cyan-500"}
                    showLabel={false}
                    size="md"
                  />
                </div>
                <div className="text-right shrink-0 w-16">
                  <span className="text-xs font-semibold text-slate-900">{freq.patients}</span>
                  <span className="text-[10px] text-slate-400 ml-1">({freq.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
          <AiInsight variant="alert">
            18 patients have lapsed beyond 1 year. Automated reactivation sequences have been triggered for 15 of them.
          </AiInsight>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Insurance Distribution */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Insurance Distribution</h3>
              <p className="text-xs text-slate-500">Patients by carrier</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <DonutChart
              data={insuranceMix}
              height={200}
              innerRadius={55}
              outerRadius={80}
              centerLabel="patients"
              centerValue="389"
            />
            <div className="space-y-2 flex-1">
              {insuranceMix.map((ins) => (
                <div key={ins.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ins.color }} />
                    <span className="text-xs text-slate-600">{ins.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">{ins.value}</span>
                    <span className="text-[10px] text-slate-400">({Math.round((ins.value / 389) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic & Contact Info */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Data Completeness</h3>
          <div className="space-y-4">
            {[
              { label: "Email on file", value: 82, color: "bg-emerald-500" },
              { label: "Phone on file", value: 94, color: "bg-cyan-500" },
              { label: "Address on file", value: 71, color: "bg-blue-500" },
              { label: "Insurance verified", value: 74, color: "bg-purple-500" },
              { label: "DOB on file", value: 88, color: "bg-amber-500" },
              { label: "Emergency contact", value: 42, color: "bg-red-500" },
            ].map((item) => (
              <ProgressBar
                key={item.label}
                value={item.value}
                max={100}
                color={item.color}
                label={item.label}
                size="md"
              />
            ))}
          </div>
          <AiInsight variant="recommendation">
            Emergency contact information is only 42% complete. Consider adding this to the intake form workflow.
          </AiInsight>
        </div>
      </div>

      {/* Geographic breakdown */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Geographic Distribution</h3>
        <p className="text-xs text-slate-500 mb-4">Patient distance from practice (89108)</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { range: "< 3 miles", count: 124, pct: 31.9, color: "#059669" },
            { range: "3-5 miles", count: 108, pct: 27.8, color: "#0891b2" },
            { range: "5-10 miles", count: 96, pct: 24.7, color: "#2563eb" },
            { range: "10-20 miles", count: 42, pct: 10.8, color: "#d97706" },
            { range: "20+ miles", count: 19, pct: 4.9, color: "#7c3aed" },
          ].map((geo) => (
            <div key={geo.range} className="rounded-lg border border-slate-200 p-3 text-center hover:shadow-sm transition-all">
              <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full mb-2" style={{ backgroundColor: `${geo.color}15` }}>
                <MapPin className="h-4 w-4" style={{ color: geo.color }} />
              </div>
              <p className="text-lg font-bold text-slate-900">{geo.count}</p>
              <p className="text-[10px] text-slate-500">{geo.range}</p>
              <p className="text-[10px] font-medium" style={{ color: geo.color }}>{geo.pct}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  AI & RETENTION TAB                                               */
  /* ---------------------------------------------------------------- */
  const renderAi = () => (
    <div className="space-y-6">
      {/* AI Summary Banner */}
      <div className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-5 w-5" />
          <h3 className="text-base font-semibold">One Engine Patient Intelligence</h3>
          <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
            Active
          </span>
        </div>
        <p className="text-sm text-white/80 mb-4">
          AI monitors 389 patients for retention risk, recall compliance, and reactivation opportunities.
          This month: 15 patients reactivated, 42 recall reminders sent, 6 at-risk patients flagged.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Reactivated", value: "15", sub: "this month" },
            { label: "Recalls Sent", value: "42", sub: "automated" },
            { label: "At-Risk Flagged", value: "6", sub: "needs attention" },
            { label: "No-Show Predicted", value: "3", sub: "next 7 days" },
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
        {/* Retention Trend */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Retention Trend</h3>
              <p className="text-xs text-slate-500">Monthly retention vs target with AI impact</p>
            </div>
          </div>
          <TrendLine
            data={retentionTrend as unknown as Record<string, unknown>[]}
            lines={[
              { key: "rate", color: "#059669", label: "Retention %" },
              { key: "target", color: "#dc2626", label: "Target", dashed: true },
            ]}
            xKey="month"
            height={220}
          />
        </div>

        {/* AI Performance Gauges */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">AI Performance</h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="relative flex flex-col items-center">
              <GaugeRing value={94} color="#059669" label="Recall Accuracy" />
            </div>
            <div className="relative flex flex-col items-center">
              <GaugeRing value={88} color="#2563eb" label="Risk Prediction" />
            </div>
            <div className="relative flex flex-col items-center">
              <GaugeRing value={76} color="#7c3aed" label="Reactivation Rate" />
            </div>
            <div className="relative flex flex-col items-center">
              <GaugeRing value={91} color="#0891b2" label="No-Show Prediction" />
            </div>
          </div>
          <AiInsight variant="recommendation">
            No-show prediction accuracy is 91%. Consider implementing automated confirmation calls 24 hours before appointments for flagged patients.
          </AiInsight>
        </div>
      </div>

      {/* Before/After Impact */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">AI Impact — Before vs After</h3>
        <p className="text-xs text-slate-500 mb-4">Key patient metrics since One Engine activation</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { metric: "Retention Rate", before: "82%", after: "93.6%", change: "+14.1%", improved: true },
            { metric: "Recall Compliance", before: "64%", after: "82%", change: "+28.1%", improved: true },
            { metric: "No-Show Rate", before: "18%", after: "8%", change: "-55.6%", improved: true },
            { metric: "Reactivations/Mo", before: "3", after: "15", change: "+400%", improved: true },
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
            <p className="text-xs text-slate-500">Real-time patient intelligence processing</p>
          </div>
          <SyncIndicator />
        </div>
        <div className="space-y-2">
          {recentAiActions.map((action, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                action.type === "risk" ? "bg-red-50" :
                action.type === "recall" ? "bg-cyan-50" :
                action.type === "reactivation" ? "bg-purple-50" :
                action.type === "insurance" ? "bg-blue-50" : "bg-emerald-50"
              )}>
                <Bot className={cn(
                  "h-4 w-4",
                  action.type === "risk" ? "text-red-600" :
                  action.type === "recall" ? "text-cyan-600" :
                  action.type === "reactivation" ? "text-purple-600" :
                  action.type === "insurance" ? "text-blue-600" : "text-emerald-600"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900 truncate">{action.action}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500">{action.patient}</span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-medium capitalize",
                    action.type === "risk" ? "bg-red-50 text-red-600" :
                    action.type === "recall" ? "bg-cyan-50 text-cyan-600" :
                    action.type === "reactivation" ? "bg-purple-50 text-purple-600" :
                    action.type === "insurance" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {action.type}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                  action.confidence >= 95 ? "bg-emerald-50 text-emerald-700" :
                  action.confidence >= 90 ? "bg-blue-50 text-blue-700" :
                  "bg-amber-50 text-amber-700"
                )}>
                  {action.confidence}%
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">{action.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Patient AI Capabilities</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Recall Management", desc: "Auto-schedule & send recall reminders at optimal timing", icon: Calendar, active: true },
            { name: "Risk Scoring", desc: "ML-based patient churn risk prediction", icon: AlertTriangle, active: true },
            { name: "Reactivation Engine", desc: "Multi-step campaigns for lapsed patients", icon: RefreshCw, active: true },
            { name: "No-Show Prediction", desc: "Predict appointment no-shows 48hrs in advance", icon: Clock, active: true },
            { name: "Insurance Monitoring", desc: "Track eligibility changes and verify coverage", icon: Shield, active: true },
            { name: "Treatment Suggestions", desc: "AI-recommended treatments based on patient history", icon: Sparkles, active: false },
            { name: "Lifetime Value Calc", desc: "Predict patient lifetime value for prioritization", icon: TrendingUp, active: false },
            { name: "Smart Scheduling", desc: "Optimize appointment slots based on patient preferences", icon: Zap, active: false },
            { name: "Referral Tracking", desc: "Auto-detect and attribute patient referrals", icon: Users, active: true },
          ].map((cap) => (
            <div
              key={cap.name}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                cap.active ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-slate-50/50"
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500">
            {stats.total} total patients · {stats.active} active · {stats.prospect} prospects
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
      {activeTab === "directory" && renderDirectory()}
      {activeTab === "demographics" && renderDemographics()}
      {activeTab === "ai" && renderAi()}

      {/* Trash Panel */}
      {showTrash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Trash</h2>
                <p className="text-sm text-slate-500">Deleted patients are kept for 30 days</p>
              </div>
              <button onClick={() => setShowTrash(false)} className="rounded-lg p-1 hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            {trashItems.length > 0 ? (
              <div className="space-y-2">
                {trashItems.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">
                        {p.first_name[0]}{p.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.first_name} {p.last_name}</p>
                        <p className="text-xs text-slate-400">{p.email || p.phone || "No contact"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestore(p.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-sm text-slate-400">
                <Trash2 className="h-8 w-8 mb-2 text-slate-300" />
                Trash is empty
              </div>
            )}
          </div>
        </div>
      )}

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
