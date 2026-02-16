"use client";

import { useState } from "react";
import {
  Shield, ShieldCheck, ShieldX, Eye, Clock,
  FileText, AlertTriangle, Database, Lock
} from "lucide-react";

interface AuditLog {
  id: string;
  created_at: string;
  user_id: string | null;
  user_name: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  phi_accessed: boolean;
  ip_address: string | null;
  user_agent: string | null;
}

interface RetentionPolicy {
  id: string;
  resource_type: string;
  retention_days: number;
  action: string;
  is_active: boolean;
  description: string | null;
}

interface ComplianceStats {
  phiAccessLast24h: number;
  totalAuditEntries: number;
  consentSummary: {
    granted: number;
    denied: number;
    revoked: number;
    pending: number;
  };
  optOuts: number;
}

export function ComplianceClient({
  recentLogs,
  stats,
  retentionPolicies,
}: {
  recentLogs: AuditLog[];
  stats: ComplianceStats;
  retentionPolicies: RetentionPolicy[];
}) {
  const [activeTab, setActiveTab] = useState<"audit" | "consent" | "retention">("audit");
  const [phiFilter, setPhiFilter] = useState(false);

  const filteredLogs = phiFilter
    ? recentLogs.filter(l => l.phi_accessed)
    : recentLogs;

  const tabs = [
    { id: "audit" as const, label: "Audit Log", icon: Eye },
    { id: "consent" as const, label: "Consent Tracking", icon: ShieldCheck },
    { id: "retention" as const, label: "Data Retention", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-cyan-400" />
          HIPAA Compliance Center
        </h1>
        <p className="text-slate-400 mt-1">
          Audit logging, consent management, and data retention policies
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Eye className="h-5 w-5 text-blue-400" />}
          label="PHI Access (24h)"
          value={stats.phiAccessLast24h}
          color="blue"
        />
        <StatCard
          icon={<FileText className="h-5 w-5 text-emerald-400" />}
          label="Total Audit Entries"
          value={stats.totalAuditEntries}
          color="emerald"
        />
        <StatCard
          icon={<ShieldCheck className="h-5 w-5 text-green-400" />}
          label="Active Consents"
          value={stats.consentSummary.granted}
          color="green"
        />
        <StatCard
          icon={<ShieldX className="h-5 w-5 text-red-400" />}
          label="Opt-Outs"
          value={stats.optOuts}
          color="red"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10 pb-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? "bg-white/10 text-white border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPhiFilter(!phiFilter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                phiFilter
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              <Lock className="h-3 w-3" />
              PHI Access Only
            </button>
            <span className="text-xs text-slate-500">
              Showing {filteredLogs.length} of {recentLogs.length} entries
            </span>
          </div>

          {/* Audit Table */}
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left">
                  <th className="px-4 py-3 text-slate-400 font-medium">Timestamp</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">User</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Action</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Resource</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">PHI</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-slate-300 text-xs font-mono">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-slate-300">
                      {log.user_name || log.user_id?.substring(0, 12) || "System"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs">
                      {log.resource_type}{log.resource_id ? ` / ${log.resource_id.substring(0, 8)}...` : ""}
                    </td>
                    <td className="px-4 py-2.5">
                      {log.phi_accessed ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 text-xs">
                          <AlertTriangle className="h-3 w-3" />
                          PHI
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs font-mono">
                      {log.ip_address || "-"}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No audit entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "consent" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <p className="text-2xl font-bold text-emerald-400">{stats.consentSummary.granted}</p>
              <p className="text-xs text-slate-400 mt-1">Granted</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
              <p className="text-2xl font-bold text-amber-400">{stats.consentSummary.pending}</p>
              <p className="text-xs text-slate-400 mt-1">Pending</p>
            </div>
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-2xl font-bold text-red-400">{stats.consentSummary.denied}</p>
              <p className="text-xs text-slate-400 mt-1">Denied</p>
            </div>
            <div className="rounded-xl bg-red-400/10 border border-red-400/20 p-4">
              <p className="text-2xl font-bold text-red-300">{stats.consentSummary.revoked}</p>
              <p className="text-xs text-slate-400 mt-1">Revoked</p>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 p-6 text-center">
            <ShieldCheck className="h-10 w-10 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">Consent Management</h3>
            <p className="text-sm text-slate-400 mt-2">
              Patient consents are tracked per channel (SMS, Email, Voice) and per HIPAA purpose
              (Treatment, Payment, Operations). View individual patient consents from their profile page.
            </p>
          </div>
        </div>
      )}

      {activeTab === "retention" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left">
                  <th className="px-4 py-3 text-slate-400 font-medium">Resource</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Retention</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Action</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {retentionPolicies.map(policy => (
                  <tr key={policy.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-slate-300 font-mono text-xs">{policy.resource_type}</td>
                    <td className="px-4 py-2.5 text-white font-medium">
                      {Math.round(policy.retention_days / 365)} years ({policy.retention_days} days)
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        policy.action === "archive" ? "bg-blue-500/20 text-blue-300" :
                        policy.action === "anonymize" ? "bg-amber-500/20 text-amber-300" :
                        "bg-red-500/20 text-red-300"
                      }`}>
                        {policy.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 text-xs ${
                        policy.is_active ? "text-emerald-400" : "text-slate-500"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          policy.is_active ? "bg-emerald-400" : "bg-slate-600"
                        }`} />
                        {policy.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs max-w-xs truncate">
                      {policy.description}
                    </td>
                  </tr>
                ))}
                {retentionPolicies.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      <Database className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                      No retention policies configured. Add policies to manage data lifecycle.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            Data retention enforcement runs weekly (Sunday 3 AM UTC)
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-br from-${color}-500/5 to-transparent p-4`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-lg bg-${color}-500/10 p-2`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
          <p className="text-xs text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
