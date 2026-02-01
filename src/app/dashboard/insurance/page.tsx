"use client";

import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  RefreshCw,
  Eye,
  Filter,
} from "lucide-react";

interface Verification {
  id: string;
  patient: string;
  provider: string;
  memberId: string;
  appointmentDate: string;
  status: "pending" | "verified" | "issues" | "expired";
  coverage: {
    preventive: number;
    basic: number;
    major: number;
    deductible: number;
    deductibleMet: number;
    annualMax: number;
    annualUsed: number;
  } | null;
  flags: string[];
  verifiedAt: string | null;
}

const verifications: Verification[] = [
  {
    id: "1",
    patient: "Jennifer Liu",
    provider: "Delta Dental PPO",
    memberId: "DD-9876543",
    appointmentDate: "Today, 10:30 AM",
    status: "pending",
    coverage: null,
    flags: ["New patient", "Implant consultation"],
    verifiedAt: null,
  },
  {
    id: "2",
    patient: "Maria Santos",
    provider: "Cigna Dental",
    memberId: "CG-1234567",
    appointmentDate: "Today, 8:00 AM",
    status: "verified",
    coverage: { preventive: 100, basic: 80, major: 50, deductible: 50, deductibleMet: 50, annualMax: 2000, annualUsed: 450 },
    flags: [],
    verifiedAt: "Yesterday, 4:30 PM",
  },
  {
    id: "3",
    patient: "Robert Kim",
    provider: "MetLife Dental",
    memberId: "ML-5555678",
    appointmentDate: "Today, 9:00 AM",
    status: "verified",
    coverage: { preventive: 100, basic: 80, major: 50, deductible: 75, deductibleMet: 75, annualMax: 1500, annualUsed: 820 },
    flags: ["Crown pre-auth approved"],
    verifiedAt: "2 days ago",
  },
  {
    id: "4",
    patient: "Sarah Thompson",
    provider: "N/A",
    memberId: "N/A",
    appointmentDate: "Today, 1:00 PM",
    status: "verified",
    coverage: null,
    flags: ["Self-pay", "Cosmetic procedure"],
    verifiedAt: "N/A",
  },
  {
    id: "5",
    patient: "David Park",
    provider: "Aetna Dental",
    memberId: "AE-7890123",
    appointmentDate: "Tomorrow, 2:00 PM",
    status: "issues",
    coverage: { preventive: 100, basic: 70, major: 50, deductible: 100, deductibleMet: 0, annualMax: 1500, annualUsed: 0 },
    flags: ["Orthodontic waiting period", "Deductible not met"],
    verifiedAt: "Today, 6:15 AM",
  },
  {
    id: "6",
    patient: "Karen Davis",
    provider: "Guardian Dental",
    memberId: "GD-4567890",
    appointmentDate: "Tomorrow, 10:00 AM",
    status: "pending",
    coverage: null,
    flags: [],
    verifiedAt: null,
  },
  {
    id: "7",
    patient: "William Chang",
    provider: "United Concordia",
    memberId: "UC-2345678",
    appointmentDate: "Feb 3, 9:00 AM",
    status: "expired",
    coverage: null,
    flags: ["Coverage expired 01/15", "Patient notified"],
    verifiedAt: "Today, 6:30 AM",
  },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  verified: { label: "Verified", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  issues: { label: "Issues", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-600", icon: XCircle },
};

export default function InsurancePage() {
  const pending = verifications.filter((v) => v.status === "pending").length;
  const issues = verifications.filter((v) => v.status === "issues" || v.status === "expired").length;
  const verified = verifications.filter((v) => v.status === "verified").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insurance Verification</h1>
          <p className="text-sm text-slate-500">Automated eligibility checks and coverage verification</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Upload className="h-4 w-4" />
            Upload Card
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
            <RefreshCw className="h-4 w-4" />
            Verify All Pending
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
          <p className="text-sm text-slate-500">Pending Verification</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-emerald-600">{verified}</p>
          <p className="text-sm text-slate-500">Verified</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-red-600">{issues}</p>
          <p className="text-sm text-slate-500">Needs Attention</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">94%</p>
          <p className="text-sm text-slate-500">Auto-Verify Rate</p>
        </div>
      </div>

      {/* Verification List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Upcoming Appointments</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {verifications.map((v) => {
            const config = statusConfig[v.status];
            const StatusIcon = config.icon;
            return (
              <div key={v.id} className="px-6 py-4 hover:bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-slate-900">{v.patient}</p>
                      <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                      <span>{v.provider}</span>
                      <span>ID: {v.memberId}</span>
                      <span>Appt: {v.appointmentDate}</span>
                      {v.verifiedAt && <span>Verified: {v.verifiedAt}</span>}
                    </div>

                    {/* Flags */}
                    {v.flags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {v.flags.map((flag, i) => (
                          <span key={i} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Coverage details */}
                    {v.coverage && (
                      <div className="mt-3 grid grid-cols-4 gap-4 rounded-lg bg-slate-50 p-3">
                        <div>
                          <p className="text-xs text-slate-400">Preventive</p>
                          <p className="text-sm font-semibold text-slate-900">{v.coverage.preventive}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Basic</p>
                          <p className="text-sm font-semibold text-slate-900">{v.coverage.basic}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Major</p>
                          <p className="text-sm font-semibold text-slate-900">{v.coverage.major}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Remaining Benefits</p>
                          <p className="text-sm font-semibold text-slate-900">
                            ${(v.coverage.annualMax - v.coverage.annualUsed).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {v.status === "pending" && (
                      <button className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100">
                        Verify Now
                      </button>
                    )}
                    {v.status === "issues" && (
                      <button className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">
                        Review
                      </button>
                    )}
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
