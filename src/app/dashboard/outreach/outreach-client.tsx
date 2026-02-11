"use client";

import {
  Plus,
  Play,
  Pause,
  Settings,
  Users,
  Mail,
  MessageSquare,
  Phone,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  type: string;
  status: "active" | "paused" | "draft";
  enrolled_count: number;
  completed_count: number;
  conversion_rate: number | null;
  steps: unknown[];
  trigger_conditions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const typeConfig: Record<string, { label: string; color: string }> = {
  welcome: { label: "Welcome", color: "bg-blue-100 text-blue-700" },
  recall: { label: "Recall", color: "bg-green-100 text-green-700" },
  treatment_followup: { label: "Treatment", color: "bg-purple-100 text-purple-700" },
  reactivation: { label: "Reactivation", color: "bg-orange-100 text-orange-700" },
  no_show: { label: "No-Show", color: "bg-red-100 text-red-700" },
  review_request: { label: "Reviews", color: "bg-cyan-100 text-cyan-700" },
  custom: { label: "Custom", color: "bg-slate-100 text-slate-700" },
};

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
};

function getChannels(steps: unknown[]): string[] {
  const channels = new Set<string>();
  for (const step of steps) {
    if (step && typeof step === "object" && "channel" in step) {
      channels.add(String((step as { channel: string }).channel));
    }
  }
  return channels.size > 0 ? Array.from(channels) : ["email", "sms"];
}

export function OutreachClient({ initialWorkflows }: { initialWorkflows: Workflow[] }) {
  const workflows = initialWorkflows;

  const totalEnrolled = workflows.reduce((sum, w) => sum + (w.enrolled_count || 0), 0);
  const totalCompleted = workflows.reduce((sum, w) => sum + (w.completed_count || 0), 0);
  const activeWorkflows = workflows.filter((w) => w.status === "active").length;

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    await fetch("/api/outreach", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Outreach</h1>
          <p className="text-sm text-slate-500">Automated workflow sequences for patient engagement</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
          <Plus className="h-4 w-4" />
          New Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">{activeWorkflows}</p>
          <p className="text-sm text-slate-500">Active Workflows</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-blue-600">{totalEnrolled}</p>
          <p className="text-sm text-slate-500">Currently Enrolled</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-emerald-600">{totalCompleted}</p>
          <p className="text-sm text-slate-500">Completed Sequences</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">
            {totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0}%
          </p>
          <p className="text-sm text-slate-500">Avg Completion Rate</p>
        </div>
      </div>

      {/* Empty state */}
      {workflows.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-semibold text-slate-900">No workflows yet</h3>
          <p className="mt-1 text-sm text-slate-500">Create your first patient outreach workflow to get started.</p>
        </div>
      )}

      {/* Workflows */}
      <div className="space-y-4">
        {workflows.map((workflow) => {
          const typeConf = typeConfig[workflow.type] || typeConfig.custom;
          const channels = getChannels(workflow.steps as unknown[]);
          const stepCount = Array.isArray(workflow.steps) ? workflow.steps.length : 0;
          return (
            <div key={workflow.id} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-slate-900">{workflow.name}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeConf.color}`}>
                      {typeConf.label}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      workflow.status === "active" ? "bg-emerald-100 text-emerald-700" :
                      workflow.status === "paused" ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {workflow.status === "active" ? "Active" : workflow.status === "paused" ? "Paused" : "Draft"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                    <span>{stepCount} steps</span>
                    <span className="flex items-center gap-1">
                      {channels.map((ch) => {
                        const Icon = channelIcons[ch];
                        return Icon ? <Icon key={ch} className="h-3.5 w-3.5" /> : null;
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {workflow.status === "active" ? (
                    <button
                      onClick={() => handleToggleStatus(workflow.id, workflow.status)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Pause className="h-3 w-3" /> Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(workflow.id, workflow.status)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                    >
                      <Play className="h-3 w-3" /> Activate
                    </button>
                  )}
                  <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{workflow.enrolled_count || 0}</p>
                    <p className="text-xs text-slate-500">Enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{workflow.completed_count || 0}</p>
                    <p className="text-xs text-slate-500">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {workflow.conversion_rate != null ? `${workflow.conversion_rate}%` : "—"}
                    </p>
                    <p className="text-xs text-slate-500">Conversion</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
