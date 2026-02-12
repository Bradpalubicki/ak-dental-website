"use client";

import { useState } from "react";
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Sparkles,
  ExternalLink,
  Gift,
  Plus,
  Trash2,
  RotateCcw,
  X,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { FileUpload } from "@/components/dashboard/file-upload";
import { DocumentList } from "@/components/dashboard/document-list";

interface Verification {
  id: string;
  patientName: string;
  provider: string;
  memberId: string;
  groupNumber: string | null;
  status: string;
  appointmentDate: string | null;
  appointmentTime: string | null;
  preventiveCoverage: number | null;
  basicCoverage: number | null;
  majorCoverage: number | null;
  deductible: number | null;
  deductibleMet: number | null;
  annualMax: number | null;
  annualUsed: number | null;
  flags: string[];
  verifiedAt: string | null;
  notes: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  verified: { label: "Verified", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  issues: { label: "Issues", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-600", icon: XCircle },
  not_found: { label: "Not Found", color: "bg-red-100 text-red-700", icon: XCircle },
};

const carriers = [
  { name: "Delta Dental", type: "PPO", patientsActive: 42, feeSched: "Premier", contracted: true, policyUploaded: true },
  { name: "MetLife", type: "PPO", patientsActive: 28, feeSched: "Standard PPO", contracted: true, policyUploaded: true },
  { name: "Cigna", type: "DPPO", patientsActive: 18, feeSched: "Cigna DPPO", contracted: true, policyUploaded: false },
  { name: "Aetna", type: "DMO/PPO", patientsActive: 15, feeSched: "Aetna PPO", contracted: true, policyUploaded: false },
  { name: "Guardian", type: "PPO", patientsActive: 12, feeSched: "Guardian PPO", contracted: false, policyUploaded: false },
  { name: "United Concordia", type: "PPO", patientsActive: 8, feeSched: "Tricare/UC", contracted: true, policyUploaded: true },
  { name: "Humana", type: "DHMO", patientsActive: 6, feeSched: "Humana DHMO", contracted: false, policyUploaded: false },
];

const employeeBenefits = [
  { benefit: "Free Dental Care", description: "All employees + immediate family receive free dental treatment at the practice", eligible: "All Staff", status: "Active" },
  { benefit: "Paid Time Off", description: "Accrued PTO: 10 days/year (1-3 yrs), 15 days/year (3+ yrs)", eligible: "Full-Time", status: "Active" },
  { benefit: "CE Reimbursement", description: "Up to $1,500/year for continuing education courses and conferences", eligible: "Licensed Staff", status: "Active" },
  { benefit: "Uniform Allowance", description: "$300/year scrub and uniform allowance", eligible: "All Staff", status: "Active" },
  { benefit: "401(k) Match", description: "3% employer match after 1 year of employment", eligible: "Full-Time (1+ yr)", status: "Active" },
  { benefit: "Holiday Pay", description: "7 paid holidays per year", eligible: "All Staff", status: "Active" },
];

function formatTime(time: string | null): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${minutes} ${ampm}`;
}

const emptyForm = {
  patient_id: "",
  insurance_provider: "",
  member_id: "",
  group_number: "",
  notes: "",
};

interface Props {
  initialVerifications: Verification[];
}

export function InsuranceClient({ initialVerifications }: Props) {
  const [verifications, setVerifications] = useState(initialVerifications);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"verifications" | "carriers" | "benefits">("verifications");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [trashItems, setTrashItems] = useState<Verification[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [docRefreshKey, setDocRefreshKey] = useState(0);

  const filtered = verifications.filter(
    (v) =>
      search === "" ||
      v.patientName.toLowerCase().includes(search.toLowerCase()) ||
      v.provider.toLowerCase().includes(search.toLowerCase()) ||
      v.memberId.includes(search)
  );

  const pending = verifications.filter((v) => v.status === "pending").length;
  const verified = verifications.filter((v) => v.status === "verified").length;
  const issues = verifications.filter(
    (v) => v.status === "issues" || v.status === "expired" || v.status === "not_found"
  ).length;

  const carriersWithoutPolicy = carriers.filter((c) => !c.policyUploaded).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/insurance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        const newVer: Verification = {
          id: data.id,
          patientName: "New Patient",
          provider: data.insurance_provider,
          memberId: data.member_id,
          groupNumber: data.group_number,
          status: data.status,
          appointmentDate: null,
          appointmentTime: null,
          preventiveCoverage: null,
          basicCoverage: null,
          majorCoverage: null,
          deductible: null,
          deductibleMet: null,
          annualMax: null,
          annualUsed: null,
          flags: [],
          verifiedAt: null,
          notes: data.notes,
        };
        setVerifications((prev) => [newVer, ...prev]);
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
      const res = await fetch(`/api/insurance/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVerifications((prev) => prev.filter((v) => v.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  async function loadTrash() {
    const res = await fetch("/api/insurance?deleted=true");
    if (res.ok) {
      const data = await res.json();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const items = (data || []).map((v: any) => ({
        id: v.id,
        patientName: v.patient ? `${v.patient.first_name} ${v.patient.last_name}` : "Unknown",
        provider: v.insurance_provider,
        memberId: v.member_id,
        groupNumber: v.group_number,
        status: v.status,
        appointmentDate: v.appointment?.appointment_date || null,
        appointmentTime: v.appointment?.appointment_time || null,
        preventiveCoverage: v.preventive_coverage,
        basicCoverage: v.basic_coverage,
        majorCoverage: v.major_coverage,
        deductible: v.deductible,
        deductibleMet: v.deductible_met,
        annualMax: v.annual_maximum,
        annualUsed: v.annual_used,
        flags: v.flags || [],
        verifiedAt: v.verified_at,
        notes: v.notes,
      }));
      /* eslint-enable @typescript-eslint/no-explicit-any */
      setTrashItems(items);
    }
    setShowTrash(true);
  }

  async function handleRestore(id: string) {
    const res = await fetch(`/api/insurance/${id}/restore`, { method: "POST" });
    if (res.ok) {
      setTrashItems((prev) => prev.filter((v) => v.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insurance & Benefits</h1>
          <p className="text-sm text-slate-500">
            Patient verification, carrier policies, and employee benefits
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadTrash}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            <Trash2 className="h-4 w-4" /> Trash
          </button>
          <FileUpload
            entityType="insurance_policy"
            compact
            onUploadComplete={() => setDocRefreshKey((k) => k + 1)}
          />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Verification
          </button>
        </div>
      </div>

      {/* New Verification Form */}
      {showForm && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">New Insurance Verification</h2>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-slate-200">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID *</label>
                <input
                  required
                  value={form.patient_id}
                  onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="Patient UUID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider *</label>
                <select
                  required
                  value={form.insurance_provider}
                  onChange={(e) => setForm({ ...form, insurance_provider: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">Select carrier...</option>
                  {carriers.map((c) => (
                    <option key={c.name} value={c.name}>{c.name} ({c.type})</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Member ID *</label>
                <input
                  required
                  value={form.member_id}
                  onChange={(e) => setForm({ ...form, member_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Group Number</label>
                <input
                  value={form.group_number}
                  onChange={(e) => setForm({ ...form, group_number: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
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
                {saving ? "Saving..." : "Submit Verification"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Insight */}
      {(carriersWithoutPolicy > 0 || pending > 0) && (
        <div className="rounded-2xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50 via-blue-50/30 to-cyan-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-cyan-900">One Engine Insurance Intelligence</h3>
              <div className="mt-1.5 space-y-1 text-sm text-cyan-800/80">
                {pending > 0 && <p>{pending} patient verification{pending !== 1 ? "s" : ""} pending for upcoming appointments. One Engine can auto-verify through carrier portals.</p>}
                {carriersWithoutPolicy > 0 && <p>{carriersWithoutPolicy} carriers missing uploaded fee schedules. Upload policy documents so One Engine can auto-calculate patient responsibility.</p>}
                <p className="text-xs text-cyan-600/60 mt-2">Tip: Connect carriers via API for real-time eligibility checks and automated claim status updates.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pending Verifications" value={String(pending)} change={pending > 0 ? "Needs attention" : "All clear"} trend={pending > 0 ? "down" : "up"} icon={Clock} iconColor="bg-amber-50 text-amber-600" />
        <StatCard title="Verified" value={String(verified)} icon={CheckCircle2} iconColor="bg-emerald-50 text-emerald-600" />
        <StatCard title="Active Carriers" value={String(carriers.length)} change={`${carriers.filter(c => c.policyUploaded).length} policies uploaded`} trend="neutral" icon={Building2} iconColor="bg-blue-50 text-blue-600" />
        <StatCard title="Issues" value={String(issues)} change={issues > 0 ? "Review needed" : "None"} trend={issues > 0 ? "down" : "up"} icon={AlertTriangle} iconColor="bg-red-50 text-red-600" />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {[
          { key: "verifications" as const, label: "Patient Verifications", icon: Shield, count: verifications.length },
          { key: "carriers" as const, label: "Insurance Carriers", icon: Building2, count: carriers.length },
          { key: "benefits" as const, label: "Employee Benefits", icon: Gift, count: employeeBenefits.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              activeTab === tab.key ? "bg-cyan-100 text-cyan-700" : "bg-slate-200 text-slate-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB: Patient Verifications */}
      {activeTab === "verifications" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Patient Insurance Verifications</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patient, carrier, ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {filtered.map((v) => {
                const config = statusConfig[v.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const hasCoverage = v.preventiveCoverage !== null || v.basicCoverage !== null;

                return (
                  <div key={v.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold text-slate-900">{v.patientName}</p>
                          <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-[11px] text-slate-400">
                          <span>{v.provider}</span>
                          <span>ID: {v.memberId}</span>
                          {v.appointmentDate && (
                            <span>Appt: {new Date(v.appointmentDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}{v.appointmentTime && ` at ${formatTime(v.appointmentTime)}`}</span>
                          )}
                        </div>

                        {v.flags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {v.flags.map((flag, i) => (
                              <span key={i} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{flag}</span>
                            ))}
                          </div>
                        )}

                        {hasCoverage && (
                          <div className="mt-3 grid grid-cols-4 gap-4 rounded-lg bg-slate-50 p-3">
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Preventive</p>
                              <p className="text-sm font-bold text-slate-900">{v.preventiveCoverage ?? "—"}%</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Basic</p>
                              <p className="text-sm font-bold text-slate-900">{v.basicCoverage ?? "—"}%</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Major</p>
                              <p className="text-sm font-bold text-slate-900">{v.majorCoverage ?? "—"}%</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Remaining</p>
                              <p className="text-sm font-bold text-slate-900">
                                {v.annualMax !== null && v.annualUsed !== null
                                  ? `$${(v.annualMax - v.annualUsed).toLocaleString()}`
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {v.status === "pending" && (
                          <button className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100">Verify Now</button>
                        )}
                        {v.status === "issues" && (
                          <button className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">Review</button>
                        )}
                        <button
                          onClick={() => handleDelete(v.id)}
                          disabled={deleting === v.id}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Shield className="h-8 w-8 text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">
                {verifications.length === 0 ? "No insurance verifications yet." : "No verifications match your search"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB: Insurance Carriers */}
      {activeTab === "carriers" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Insurance Carrier Directory</h2>
                <p className="text-[11px] text-slate-400">Carriers the practice is contracted with and fee schedule status</p>
              </div>
              <FileUpload
                entityType="insurance_fee_schedule"
                compact
                onUploadComplete={() => setDocRefreshKey((k) => k + 1)}
              />
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {carriers.map((carrier) => (
              <div key={carrier.name} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{carrier.name}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">{carrier.type}</span>
                    {carrier.contracted && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200/50">Contracted</span>
                    )}
                    {!carrier.contracted && (
                      <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200/50">Out of Network</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Fee Schedule: {carrier.feeSched} &middot; {carrier.patientsActive} active patients
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {carrier.policyUploaded ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Policy Uploaded
                    </span>
                  ) : (
                    <FileUpload
                      entityType="insurance_policy"
                      compact
                      description={`${carrier.name} policy`}
                      onUploadComplete={() => setDocRefreshKey((k) => k + 1)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 px-6 py-4 space-y-4">
            <DocumentList
              entityType="insurance_policy"
              refreshKey={docRefreshKey}
            />
            <DocumentList
              entityType="insurance_fee_schedule"
              refreshKey={docRefreshKey}
              className="mt-3"
            />
            <div className="rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200/30 p-4">
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-cyan-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-cyan-900">Carrier API Integration</p>
                  <p className="text-xs text-cyan-700/70 mt-1">One Engine can connect directly to carrier portals for real-time eligibility verification, automated claim submissions, and payment posting. Currently planning integration with Vyne Dental Trellis for batch processing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Employee Benefits */}
      {activeTab === "benefits" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Employee Benefits Package</h2>
                <p className="text-[11px] text-slate-400">Benefits offered to AK Ultimate Dental team members</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-slate-50">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Note:</span> AK Ultimate Dental does not currently offer group health insurance to employees. Below are the benefits and perks currently provided to the team.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {employeeBenefits.map((benefit) => (
              <div key={benefit.benefit} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <Gift className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{benefit.benefit}</p>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200/50">{benefit.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{benefit.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Eligible: {benefit.eligible}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 px-6 py-4">
            <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/30 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">One Engine Recommendation</p>
                  <p className="text-xs text-amber-700/70 mt-1">Consider adding a group dental HMO/PPO plan through a carrier like Guardian or MetLife. As a contracted provider, your team gets treated at your practice at no cost, while the insurance benefit becomes a recruiting tool. Estimated employer cost: $85-150/employee/month.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trash Panel */}
      {showTrash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Trash</h2>
                <p className="text-sm text-slate-500">Deleted verifications are kept for 30 days</p>
              </div>
              <button onClick={() => setShowTrash(false)} className="rounded-lg p-1 hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            {trashItems.length > 0 ? (
              <div className="space-y-2">
                {trashItems.map((v) => (
                  <div key={v.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{v.patientName}</p>
                      <p className="text-xs text-slate-400">{v.provider} &middot; {v.memberId}</p>
                    </div>
                    <button
                      onClick={() => handleRestore(v.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-sm text-slate-400">
                Trash is empty
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
