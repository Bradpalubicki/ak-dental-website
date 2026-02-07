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

      {/* Recent Documents */}
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
