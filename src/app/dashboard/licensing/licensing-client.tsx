"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Calendar,
  User,
  Users,
  Plus,
  Search,
  Filter,
  FileText,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { FileUpload } from "@/components/dashboard/file-upload";
import { DocumentList } from "@/components/dashboard/document-list";

interface License {
  id: string;
  holderType: string;
  holderName: string;
  licenseType: string;
  licenseNumber: string | null;
  issuedBy: string;
  issueDate: string | null;
  expirationDate: string | null;
  status: string;
  daysUntilExpiry: number | null;
  category: string | null;
  isRequired: boolean;
  documentUrl: string | null;
  renewalSubmitted: boolean;
  alertExpiredSent: boolean;
}

interface LicensingClientProps {
  licenses: License[];
  stats: {
    total: number;
    current: number;
    expiringSoon: number;
    expired: number;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2; dot: string }> = {
  current: { label: "Current", color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", icon: CheckCircle2, dot: "bg-emerald-500" },
  expiring_soon: { label: "Expiring Soon", color: "bg-amber-50 text-amber-700 ring-amber-600/20", icon: Clock, dot: "bg-amber-500" },
  expired: { label: "EXPIRED", color: "bg-red-50 text-red-700 ring-red-600/20", icon: XCircle, dot: "bg-red-500" },
  pending_renewal: { label: "Pending Renewal", color: "bg-blue-50 text-blue-700 ring-blue-600/20", icon: Clock, dot: "bg-blue-500" },
  not_applicable: { label: "No Expiration", color: "bg-slate-50 text-slate-700 ring-slate-600/20", icon: CheckCircle2, dot: "bg-slate-400" },
};

export function LicensingClient({ licenses, stats }: LicensingClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [docRefreshKey, setDocRefreshKey] = useState(0);
  const [uploadForLicense, setUploadForLicense] = useState<string | null>(null);

  const expired = licenses.filter((l) => l.status === "expired");
  const expiringSoon = licenses.filter((l) => l.status === "expiring_soon");

  // Filter licenses
  const filtered = licenses.filter((l) => {
    const matchesSearch =
      !searchQuery ||
      l.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.licenseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.licenseNumber || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Group by holder
  const holderGroups = new Map<string, License[]>();
  for (const lic of filtered) {
    const key = lic.holderName;
    if (!holderGroups.has(key)) holderGroups.set(key, []);
    holderGroups.get(key)!.push(lic);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Licensing & Credentials</h1>
          <p className="text-sm text-slate-500">
            Track all professional licenses, certifications, and compliance documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileUpload
            entityType="license"
            compact
            onUploadComplete={() => setDocRefreshKey((k) => k + 1)}
          />
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 shadow-sm">
            <Plus className="h-4 w-4" />
            Add License
          </button>
        </div>
      </div>

      {/* AI Alert */}
      {(expired.length > 0 || expiringSoon.length > 0) && (
        <div className="rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50 via-orange-50/30 to-amber-50/30 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-900">One Engine Compliance Alert</h3>
              <div className="mt-2 space-y-1.5">
                {expired.map((l) => (
                  <p key={l.id} className="text-sm text-red-800">
                    <span className="font-semibold">EXPIRED:</span> {l.holderName}&apos;s {l.licenseType}
                    {l.licenseNumber ? ` (${l.licenseNumber})` : ""} expired{" "}
                    {l.daysUntilExpiry !== null ? `${Math.abs(l.daysUntilExpiry)} days ago` : ""}. Immediate renewal
                    required.
                  </p>
                ))}
                {expiringSoon.map((l) => (
                  <p key={l.id} className="text-sm text-amber-800">
                    <span className="font-semibold">Expiring Soon:</span> {l.holderName}&apos;s {l.licenseType}
                    {l.licenseNumber ? ` (${l.licenseNumber})` : ""} expires in {l.daysUntilExpiry} days. One Engine has
                    drafted a renewal reminder.
                  </p>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                One Engine continuously monitors all licenses and will alert you 90, 60, and 30 days before expiration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard title="Total Licenses" value={String(stats.total)} icon={Award} iconColor="bg-blue-50 text-blue-600" />
        <StatCard
          title="Current"
          value={String(stats.current)}
          change="In good standing"
          trend="up"
          icon={CheckCircle2}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Expiring Soon"
          value={String(stats.expiringSoon)}
          change={stats.expiringSoon > 0 ? "Needs attention" : "None"}
          trend={stats.expiringSoon > 0 ? "down" : "up"}
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Expired"
          value={String(stats.expired)}
          change={stats.expired > 0 ? "ACTION REQUIRED" : "None"}
          trend={stats.expired > 0 ? "down" : "up"}
          icon={XCircle}
          iconColor="bg-red-50 text-red-600"
        />
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search licenses, holders, or numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 py-2 pl-10 pr-8 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="current">Current</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="expired">Expired</option>
            <option value="pending_renewal">Pending Renewal</option>
          </select>
        </div>
      </div>

      {/* License Groups */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
          <Award className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No licenses found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? "Try a different search term" : "Add your first license to start tracking compliance"}
          </p>
        </div>
      ) : (
        Array.from(holderGroups.entries()).map(([holder, items]) => (
          <div key={holder} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                {items[0]?.holderType === "team" || items[0]?.holderType === "practice" ? (
                  <Users className="h-4 w-4 text-slate-600" />
                ) : (
                  <User className="h-4 w-4 text-slate-600" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{holder}</h2>
                <p className="text-[11px] text-slate-400">
                  {items.length} license{items.length !== 1 ? "s" : ""} / certification
                  {items.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {items.map((license) => {
                const sc = statusConfig[license.status] || statusConfig.current;
                return (
                  <div key={license.id}>
                    <div className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          license.status === "expired"
                            ? "bg-red-100"
                            : license.status === "expiring_soon"
                            ? "bg-amber-100"
                            : "bg-emerald-50"
                        }`}
                      >
                        <Award
                          className={`h-4 w-4 ${
                            license.status === "expired"
                              ? "text-red-600"
                              : license.status === "expiring_soon"
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{license.licenseType}</p>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${sc.color}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                          {license.renewalSubmitted && (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                              Renewal Submitted
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-400">
                          {license.licenseNumber && <span className="font-mono">{license.licenseNumber}</span>}
                          <span>{license.issuedBy}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium text-slate-900">
                          {!license.expirationDate
                            ? "No Expiration"
                            : `Exp: ${new Date(license.expirationDate + "T12:00:00").toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}`}
                        </p>
                        {license.expirationDate && license.daysUntilExpiry !== null && (
                          <p
                            className={`text-[11px] font-medium ${
                              license.status === "expired"
                                ? "text-red-600"
                                : license.status === "expiring_soon"
                                ? "text-amber-600"
                                : "text-slate-400"
                            }`}
                          >
                            {license.daysUntilExpiry < 0
                              ? `${Math.abs(license.daysUntilExpiry)} days overdue`
                              : `${license.daysUntilExpiry} days remaining`}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setUploadForLicense(uploadForLicense === license.id ? null : license.id)
                        }
                        className={`shrink-0 rounded-lg p-2 transition-colors ${
                          license.documentUrl
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-slate-400 hover:bg-slate-100"
                        }`}
                        title={license.documentUrl ? "View documents" : "Attach document"}
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                    {uploadForLicense === license.id && (
                      <div className="px-6 pb-4 space-y-3">
                        <FileUpload
                          entityType="license"
                          entityId={license.id}
                          compact
                          onUploadComplete={() => setDocRefreshKey((k) => k + 1)}
                        />
                        <DocumentList
                          entityType="license"
                          entityId={license.id}
                          refreshKey={docRefreshKey}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Renewal Timeline */}
      {filtered.some((l) => l.expirationDate && l.daysUntilExpiry !== null && l.daysUntilExpiry <= 365) && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50">
              <Calendar className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Upcoming Renewal Timeline</h2>
              <p className="text-[11px] text-slate-400">Next 12 months</p>
            </div>
          </div>
          <div className="space-y-2">
            {[...filtered]
              .filter((l) => l.expirationDate && l.daysUntilExpiry !== null && l.daysUntilExpiry <= 365)
              .sort((a, b) => (a.daysUntilExpiry ?? 0) - (b.daysUntilExpiry ?? 0))
              .slice(0, 8)
              .map((l) => (
                <div key={l.id} className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-2.5">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      l.status === "expired"
                        ? "bg-red-500"
                        : l.status === "expiring_soon"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span className="text-xs font-medium text-slate-900 w-32">
                    {new Date(l.expirationDate! + "T12:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-slate-600 flex-1">
                    {l.holderName} — {l.licenseType}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      (l.daysUntilExpiry ?? 0) < 0
                        ? "text-red-600"
                        : (l.daysUntilExpiry ?? 0) < 90
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {(l.daysUntilExpiry ?? 0) < 0
                      ? `${Math.abs(l.daysUntilExpiry ?? 0)}d overdue`
                      : `${l.daysUntilExpiry}d`}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
