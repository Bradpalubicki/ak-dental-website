"use client";

import { useState } from "react";
import {
  HeartPulse,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Upload,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Building2,
  Users,
  DollarSign,
  Phone,
  Mail,
  ExternalLink,
  Info,
  Briefcase,
  Landmark,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

// ─── Types ────────────────────────────────────────────────────────

interface EnrollmentRow {
  id: string;
  employee_id: string;
  benefit_type: string;
  plan_name: string | null;
  carrier_name: string | null;
  policy_number: string | null;
  monthly_premium: number | null;
  employer_contribution: number | null;
  employee_contribution: number | null;
  coverage_tier: string | null;
  enrollment_status: string;
  effective_date: string | null;
  ichra_allowance_monthly: number | null;
  employee?: { first_name: string; last_name: string } | null;
}

interface PolicyRow {
  id: string;
  policy_type: string;
  carrier_name: string;
  policy_number: string | null;
  coverage_amount: number | null;
  deductible: number | null;
  annual_premium: number | null;
  monthly_premium: number | null;
  effective_date: string;
  expiration_date: string;
  renewal_date: string | null;
  status: string;
  agent_name: string | null;
  agent_phone: string | null;
  agent_email: string | null;
  broker_company: string | null;
  auto_renew: boolean;
  notes: string | null;
}

interface FilingRow {
  id: string;
  filing_type: string;
  title: string;
  filing_entity: string;
  jurisdiction: string | null;
  filing_number: string | null;
  status: string;
  effective_date: string | null;
  expiration_date: string | null;
  renewal_frequency: string | null;
  cost: number | null;
  responsible_party: string | null;
  notes: string | null;
}

interface EmployeeRow {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
}

interface MissingPolicy {
  policy_type: string;
  label: string;
}

interface Props {
  enrollments: EnrollmentRow[];
  policies: PolicyRow[];
  filings: FilingRow[];
  employees: EmployeeRow[];
  missingPolicies: MissingPolicy[];
  docCountByPolicy: Record<string, number>;
  policyTypeLabels: Record<string, string>;
  stats: {
    enrolledCount: number;
    totalEmployees: number;
    activePolicies: number;
    expiringSoon: number;
    expiredPolicies: number;
    missingCount: number;
    totalAnnualPremium: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────

const benefitTypeLabels: Record<string, string> = {
  ichra_health: "ICHRA Health",
  dental: "Dental",
  vision: "Vision",
  life: "Life Insurance",
  short_term_disability: "Short-Term Disability",
  long_term_disability: "Long-Term Disability",
  other: "Other",
};

const enrollmentStatusConfig: Record<string, { label: string; color: string }> = {
  not_enrolled: { label: "Not Enrolled", color: "bg-slate-100 text-slate-600" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  enrolled: { label: "Enrolled", color: "bg-emerald-100 text-emerald-700" },
  waived: { label: "Waived", color: "bg-blue-100 text-blue-700" },
  terminated: { label: "Terminated", color: "bg-red-100 text-red-700" },
};

const policyStatusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700", icon: ShieldCheck },
  expiring_soon: { label: "Expiring Soon", color: "bg-amber-100 text-amber-700", icon: Clock },
  expired: { label: "Expired", color: "bg-red-100 text-red-700", icon: ShieldX },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-600", icon: XCircle },
  pending_renewal: { label: "Pending Renewal", color: "bg-blue-100 text-blue-700", icon: Clock },
};

const filingStatusConfig: Record<string, { label: string; color: string }> = {
  current: { label: "Current", color: "bg-emerald-100 text-emerald-700" },
  expiring_soon: { label: "Expiring Soon", color: "bg-amber-100 text-amber-700" },
  expired: { label: "Expired", color: "bg-red-100 text-red-700" },
  pending: { label: "Pending", color: "bg-blue-100 text-blue-700" },
  not_applicable: { label: "N/A", color: "bg-slate-100 text-slate-500" },
};

const filingTypeLabels: Record<string, string> = {
  state_business_registration: "State Business Registration",
  annual_report: "Annual Report",
  business_license: "Business License",
  tax_registration: "Tax Registration",
  professional_license: "Professional License",
  dba_registration: "DBA Registration",
  ein_registration: "EIN Registration",
  sales_tax_permit: "Sales Tax Permit",
  zoning_permit: "Zoning Permit",
  health_department_permit: "Health Department Permit",
  fire_inspection: "Fire Inspection",
  ada_compliance: "ADA Compliance",
  hipaa_compliance: "HIPAA Compliance",
  dental_board_registration: "Dental Board Registration",
  dea_registration: "DEA Registration",
  radiation_safety_permit: "Radiation Safety Permit",
  other: "Other",
};

const policyTypeIcons: Record<string, typeof Shield> = {
  general_liability: Shield,
  professional_liability: Briefcase,
  workers_comp: Users,
  cyber_liability: Activity,
  property: Building2,
  directors_officers: Landmark,
  management_liability: Landmark,
  umbrella: Shield,
  business_auto: Shield,
  employment_practices: Users,
  crime_fidelity: ShieldAlert,
  business_interruption: AlertTriangle,
  unemployment_insurance: DollarSign,
  other: FileText,
};

function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return "\u2014";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: string | null): string {
  if (!date) return "\u2014";
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date + "T12:00:00");
  return Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Main Component ───────────────────────────────────────────────

export function BenefitsClient({
  enrollments,
  policies,
  filings,
  employees,
  missingPolicies,
  docCountByPolicy,
  policyTypeLabels,
  stats,
}: Props) {
  const [activeTab, setActiveTab] = useState<"benefits" | "insurance" | "filings">("benefits");
  const [search, setSearch] = useState("");

  const urgentCount = stats.expiringSoon + stats.missingCount + stats.expiredPolicies;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Benefits & Insurance</h1>
          <p className="text-sm text-slate-500">
            Employee benefits enrollment, business insurance policies, and corporate filings
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
            <Plus className="h-4 w-4" />
            Add Policy
          </button>
        </div>
      </div>

      {/* AI Insight Banner */}
      {urgentCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Attention Needed</p>
            <p className="text-sm text-amber-700">
              {stats.expiringSoon > 0 && (
                <span>{stats.expiringSoon} {stats.expiringSoon === 1 ? "policy" : "policies"} expiring within 60 days. </span>
              )}
              {stats.expiredPolicies > 0 && (
                <span>{stats.expiredPolicies} {stats.expiredPolicies === 1 ? "policy has" : "policies have"} expired. </span>
              )}
              {stats.missingCount > 0 && (
                <span>{stats.missingCount} recommended {stats.missingCount === 1 ? "policy is" : "policies are"} missing.</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Enrolled Staff"
          value={`${stats.enrolledCount} / ${stats.totalEmployees}`}
          icon={Users}
          iconColor="bg-pink-50 text-pink-600"
          description="employees with active benefits"
        />
        <StatCard
          title="Active Policies"
          value={String(stats.activePolicies)}
          icon={ShieldCheck}
          iconColor="bg-emerald-50 text-emerald-600"
          description="business insurance policies"
        />
        <StatCard
          title="Expiring Soon"
          value={String(stats.expiringSoon)}
          icon={Clock}
          iconColor={stats.expiringSoon > 0 ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"}
          description="within 60 days"
        />
        <StatCard
          title="Annual Premium"
          value={formatCurrency(stats.totalAnnualPremium)}
          icon={DollarSign}
          iconColor="bg-cyan-50 text-cyan-600"
          description="total business insurance cost"
        />
      </div>

      {/* Tab Bar */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {[
            { key: "benefits" as const, label: "Employee Benefits", icon: HeartPulse },
            { key: "insurance" as const, label: "Business Insurance", icon: Shield },
            { key: "filings" as const, label: "Corporate Filings", icon: Landmark },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 border-b-2 pb-3 pt-1 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-cyan-600 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={
            activeTab === "benefits" ? "Search employees..." :
            activeTab === "insurance" ? "Search policies..." :
            "Search filings..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {/* Tab Content */}
      {activeTab === "benefits" && (
        <EmployeeBenefitsTab enrollments={enrollments} employees={employees} search={search} />
      )}
      {activeTab === "insurance" && (
        <BusinessInsuranceTab
          policies={policies}
          missingPolicies={missingPolicies}
          docCountByPolicy={docCountByPolicy}
          policyTypeLabels={policyTypeLabels}
          search={search}
        />
      )}
      {activeTab === "filings" && (
        <CorporateFilingsTab filings={filings} search={search} />
      )}

      {/* Transparency Footer */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            NuStack Digital Ventures tracks your business insurance, employee benefits, and corporate filing information
            to help manage claims, ensure compliance, and stay ahead of renewal deadlines. Adding this information is
            beneficial for your practice operations. <strong>This is not insurance advice</strong> — consult your
            licensed insurance professional for coverage recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 1: Employee Benefits ─────────────────────────────────────

function EmployeeBenefitsTab({
  enrollments,
  employees: _employees,
  search,
}: {
  enrollments: EnrollmentRow[];
  employees: EmployeeRow[];
  search: string;
}) {
  const filtered = enrollments.filter((e) => {
    if (!search) return true;
    const name = e.employee
      ? `${e.employee.first_name} ${e.employee.last_name}`.toLowerCase()
      : "";
    return (
      name.includes(search.toLowerCase()) ||
      (e.carrier_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.plan_name || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  // Group by employee
  const byEmployee: Record<string, EnrollmentRow[]> = {};
  filtered.forEach((e) => {
    const key = e.employee_id;
    if (!byEmployee[key]) byEmployee[key] = [];
    byEmployee[key].push(e);
  });

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
        <Info className="h-5 w-5 shrink-0 text-cyan-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-cyan-900">Benefits Enrollment Tracking</p>
          <p className="text-sm text-cyan-700">
            Track employee benefit enrollments including ICHRA health plans, dental, vision, life, and disability coverage.
            Provider portal integration is coming soon.
          </p>
        </div>
        <button className="ml-auto shrink-0 flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-white px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-50">
          <ExternalLink className="h-3 w-3" />
          Benefits Provider Portal
        </button>
      </div>

      {/* Enrollment Table */}
      {Object.keys(byEmployee).length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <HeartPulse className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No benefit enrollments yet</p>
          <p className="mt-1 text-xs text-slate-400">Add employee benefit enrollments to start tracking coverage</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
            <Plus className="h-4 w-4" />
            Add Enrollment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(byEmployee).map(([employeeId, items]) => {
            const emp = items[0].employee;
            const name = emp ? `${emp.first_name} ${emp.last_name}` : "Unknown Employee";

            return (
              <div key={employeeId} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700">
                      {name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{items.length} {items.length === 1 ? "benefit" : "benefits"}</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {items.map((enrollment) => {
                    const statusCfg = enrollmentStatusConfig[enrollment.enrollment_status] || enrollmentStatusConfig.not_enrolled;
                    return (
                      <div key={enrollment.id} className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center gap-4">
                          <div className="w-40">
                            <p className="text-sm font-medium text-slate-900">
                              {benefitTypeLabels[enrollment.benefit_type] || enrollment.benefit_type}
                            </p>
                            {enrollment.carrier_name && (
                              <p className="text-xs text-slate-500">{enrollment.carrier_name}</p>
                            )}
                          </div>
                          <div className="w-36">
                            <p className="text-xs text-slate-400">Plan</p>
                            <p className="text-sm text-slate-700">{enrollment.plan_name || "\u2014"}</p>
                          </div>
                          <div className="w-28">
                            <p className="text-xs text-slate-400">Coverage</p>
                            <p className="text-sm text-slate-700">
                              {enrollment.coverage_tier ? enrollment.coverage_tier.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "\u2014"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-slate-400">Monthly</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatCurrency(enrollment.monthly_premium)}
                            </p>
                            {enrollment.employer_contribution !== null && (
                              <p className="text-[10px] text-slate-400">
                                Employer: {formatCurrency(enrollment.employer_contribution)} | Employee: {formatCurrency(enrollment.employee_contribution)}
                              </p>
                            )}
                          </div>
                          {enrollment.ichra_allowance_monthly !== null && (
                            <div className="text-right">
                              <p className="text-xs text-slate-400">ICHRA Allowance</p>
                              <p className="text-sm font-semibold text-emerald-600">
                                {formatCurrency(enrollment.ichra_allowance_monthly)}/mo
                              </p>
                            </div>
                          )}
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: Business Insurance ────────────────────────────────────

function BusinessInsuranceTab({
  policies,
  missingPolicies,
  docCountByPolicy,
  policyTypeLabels,
  search,
}: {
  policies: PolicyRow[];
  missingPolicies: MissingPolicy[];
  docCountByPolicy: Record<string, number>;
  policyTypeLabels: Record<string, string>;
  search: string;
}) {
  const filtered = policies.filter((p) => {
    if (!search) return true;
    return (
      p.carrier_name.toLowerCase().includes(search.toLowerCase()) ||
      (policyTypeLabels[p.policy_type] || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.policy_number || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Missing Policy Alerts */}
      {missingPolicies.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Missing Recommended Policies
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {missingPolicies.map((mp) => (
              <div
                key={mp.policy_type}
                className="flex items-center justify-between rounded-xl border-2 border-dashed border-red-200 bg-red-50/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <ShieldX className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-red-900">{mp.label}</p>
                    <p className="text-xs text-red-600">Not found — recommended for all practices</p>
                  </div>
                </div>
                <button className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">
                  <Plus className="inline h-3 w-3 mr-1" />
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Policy Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <Shield className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No business insurance policies yet</p>
          <p className="mt-1 text-xs text-slate-400">Add your practice&apos;s insurance policies to track coverage and renewals</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
            <Plus className="h-4 w-4" />
            Add Policy
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((policy) => {
            const statusCfg = policyStatusConfig[policy.status] || policyStatusConfig.active;
            const StatusIcon = statusCfg.icon;
            const TypeIcon = policyTypeIcons[policy.policy_type] || Shield;
            const days = daysUntil(policy.expiration_date);
            const docCount = docCountByPolicy[policy.id] || 0;

            return (
              <div
                key={policy.id}
                className={`rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${
                  policy.status === "expired"
                    ? "border-red-200"
                    : policy.status === "expiring_soon"
                    ? "border-amber-200"
                    : "border-slate-200"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      policy.status === "expired" ? "bg-red-50" :
                      policy.status === "expiring_soon" ? "bg-amber-50" : "bg-cyan-50"
                    }`}>
                      <TypeIcon className={`h-5 w-5 ${
                        policy.status === "expired" ? "text-red-500" :
                        policy.status === "expiring_soon" ? "text-amber-500" : "text-cyan-500"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {policyTypeLabels[policy.policy_type] || policy.policy_type}
                      </p>
                      <p className="text-xs text-slate-500">{policy.carrier_name}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusCfg.label}
                  </span>
                </div>

                {/* Card Body */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Policy #</p>
                    <p className="font-medium text-slate-700">{policy.policy_number || "\u2014"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Coverage</p>
                    <p className="font-medium text-slate-700">{formatCurrency(policy.coverage_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Deductible</p>
                    <p className="font-medium text-slate-700">{formatCurrency(policy.deductible)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Annual Premium</p>
                    <p className="font-medium text-slate-700">{formatCurrency(policy.annual_premium)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Effective</p>
                    <p className="font-medium text-slate-700">{formatDate(policy.effective_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Expires</p>
                    <p className={`font-medium ${
                      days < 0 ? "text-red-600" : days <= 60 ? "text-amber-600" : "text-slate-700"
                    }`}>
                      {formatDate(policy.expiration_date)}
                      {days >= 0 && days <= 60 && (
                        <span className="ml-1 text-xs">({days}d)</span>
                      )}
                      {days < 0 && (
                        <span className="ml-1 text-xs">(expired)</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Agent Info */}
                {(policy.agent_name || policy.broker_company) && (
                  <div className="mt-3 flex items-center gap-4 rounded-lg bg-slate-50 px-3 py-2">
                    <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">
                        {policy.agent_name}{policy.broker_company ? ` \u00b7 ${policy.broker_company}` : ""}
                      </p>
                      <div className="flex gap-3 text-[10px] text-slate-500">
                        {policy.agent_phone && (
                          <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" />{policy.agent_phone}</span>
                        )}
                        {policy.agent_email && (
                          <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5" />{policy.agent_email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Footer */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {docCount} {docCount === 1 ? "document" : "documents"}
                    </span>
                    {policy.auto_renew && (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Auto-renew
                      </span>
                    )}
                  </div>
                  <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-cyan-600 hover:bg-cyan-50">
                    <Upload className="h-3 w-3" />
                    Upload
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Corporate Filings ─────────────────────────────────────

function CorporateFilingsTab({
  filings,
  search,
}: {
  filings: FilingRow[];
  search: string;
}) {
  const filtered = filings.filter((f) => {
    if (!search) return true;
    return (
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      (filingTypeLabels[f.filing_type] || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.jurisdiction || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Track state registrations, business licenses, permits, and compliance filings
        </p>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
          <Plus className="h-4 w-4" />
          Add Filing
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <Landmark className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No corporate filings tracked yet</p>
          <p className="mt-1 text-xs text-slate-400">Add your state registrations, licenses, and compliance filings</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Jurisdiction</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Filing #</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Expires</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Renewal</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Cost</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((filing) => {
                const statusCfg = filingStatusConfig[filing.status] || filingStatusConfig.current;
                const days = filing.expiration_date ? daysUntil(filing.expiration_date) : null;

                return (
                  <tr key={filing.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        {filingTypeLabels[filing.filing_type] || filing.filing_type}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-slate-900">{filing.title}</p>
                      <p className="text-xs text-slate-400">{filing.filing_entity}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-700">{filing.jurisdiction || "\u2014"}</td>
                    <td className="px-5 py-3 text-sm text-slate-700 font-mono text-xs">{filing.filing_number || "\u2014"}</td>
                    <td className="px-5 py-3">
                      <p className={`text-sm ${
                        days !== null && days < 0 ? "text-red-600 font-medium" :
                        days !== null && days <= 60 ? "text-amber-600 font-medium" : "text-slate-700"
                      }`}>
                        {formatDate(filing.expiration_date)}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500 capitalize">{filing.renewal_frequency || "\u2014"}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">{formatCurrency(filing.cost)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
