"use client";

import { useState } from "react";
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Eye,
} from "lucide-react";

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

function formatTime(time: string | null): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${minutes} ${ampm}`;
}

interface Props {
  initialVerifications: Verification[];
}

export function InsuranceClient({ initialVerifications }: Props) {
  const [search, setSearch] = useState("");

  const filtered = initialVerifications.filter(
    (v) =>
      search === "" ||
      v.patientName.toLowerCase().includes(search.toLowerCase()) ||
      v.provider.toLowerCase().includes(search.toLowerCase()) ||
      v.memberId.includes(search)
  );

  const pending = initialVerifications.filter((v) => v.status === "pending").length;
  const verified = initialVerifications.filter((v) => v.status === "verified").length;
  const issues = initialVerifications.filter(
    (v) => v.status === "issues" || v.status === "expired" || v.status === "not_found"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insurance Verification</h1>
          <p className="text-sm text-slate-500">
            Eligibility checks and coverage verification
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
          <RefreshCw className="h-4 w-4" />
          Verify All Pending
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
          <p className="text-sm text-slate-500">Pending</p>
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
          <p className="text-2xl font-bold text-slate-900">{initialVerifications.length}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
      </div>

      {/* Verification List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Verifications</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((v) => {
              const config = statusConfig[v.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              const hasCoverage =
                v.preventiveCoverage !== null || v.basicCoverage !== null;

              return (
                <div key={v.id} className="px-6 py-4 hover:bg-slate-50">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-slate-900">
                          {v.patientName}
                        </p>
                        <span
                          className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                        <span>{v.provider}</span>
                        <span>ID: {v.memberId}</span>
                        {v.appointmentDate && (
                          <span>
                            Appt:{" "}
                            {new Date(v.appointmentDate + "T12:00:00").toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                            {v.appointmentTime && ` at ${formatTime(v.appointmentTime)}`}
                          </span>
                        )}
                        {v.verifiedAt && <span>Verified: {v.verifiedAt}</span>}
                      </div>

                      {v.flags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {v.flags.map((flag, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      )}

                      {hasCoverage && (
                        <div className="mt-3 grid grid-cols-4 gap-4 rounded-lg bg-slate-50 p-3">
                          <div>
                            <p className="text-xs text-slate-400">Preventive</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {v.preventiveCoverage ?? "—"}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Basic</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {v.basicCoverage ?? "—"}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Major</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {v.majorCoverage ?? "—"}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Remaining</p>
                            <p className="text-sm font-semibold text-slate-900">
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
                        <button className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100">
                          Verify Now
                        </button>
                      )}
                      {v.status === "issues" && (
                        <button className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-sm text-slate-400">
            {initialVerifications.length === 0
              ? "No insurance verifications yet. They will appear when appointments are created."
              : "No verifications match your search"}
          </div>
        )}
      </div>
    </div>
  );
}
