"use client";

import {
  Send,
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
  Clock,
  Eye,
} from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  type: "welcome" | "recall" | "treatment_followup" | "reactivation" | "no_show" | "review_request";
  status: "active" | "paused" | "draft";
  enrolled: number;
  completed: number;
  conversionRate: number;
  steps: number;
  channels: string[];
  lastTriggered: string;
}

const workflows: Workflow[] = [
  {
    id: "1", name: "New Patient Welcome", type: "welcome", status: "active",
    enrolled: 45, completed: 38, conversionRate: 84, steps: 5,
    channels: ["email", "sms"], lastTriggered: "2 hours ago",
  },
  {
    id: "2", name: "6-Month Recall / Hygiene", type: "recall", status: "active",
    enrolled: 120, completed: 92, conversionRate: 72, steps: 6,
    channels: ["email", "sms", "call"], lastTriggered: "1 hour ago",
  },
  {
    id: "3", name: "Treatment Plan Follow-Up", type: "treatment_followup", status: "active",
    enrolled: 18, completed: 8, conversionRate: 44, steps: 5,
    channels: ["email", "sms"], lastTriggered: "Today, 6 AM",
  },
  {
    id: "4", name: "Lapsed Patient Reactivation", type: "reactivation", status: "active",
    enrolled: 65, completed: 22, conversionRate: 34, steps: 7,
    channels: ["email", "sms", "call"], lastTriggered: "Yesterday",
  },
  {
    id: "5", name: "No-Show Recovery", type: "no_show", status: "active",
    enrolled: 12, completed: 8, conversionRate: 67, steps: 4,
    channels: ["sms", "email"], lastTriggered: "Today, 8 AM",
  },
  {
    id: "6", name: "Post-Visit Review Request", type: "review_request", status: "paused",
    enrolled: 0, completed: 0, conversionRate: 0, steps: 3,
    channels: ["email", "sms"], lastTriggered: "Never",
  },
];

const typeConfig: Record<string, { label: string; color: string }> = {
  welcome: { label: "Welcome", color: "bg-blue-100 text-blue-700" },
  recall: { label: "Recall", color: "bg-green-100 text-green-700" },
  treatment_followup: { label: "Treatment", color: "bg-purple-100 text-purple-700" },
  reactivation: { label: "Reactivation", color: "bg-orange-100 text-orange-700" },
  no_show: { label: "No-Show", color: "bg-red-100 text-red-700" },
  review_request: { label: "Reviews", color: "bg-cyan-100 text-cyan-700" },
};

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
};

export default function OutreachPage() {
  const totalEnrolled = workflows.reduce((sum, w) => sum + w.enrolled, 0);
  const totalCompleted = workflows.reduce((sum, w) => sum + w.completed, 0);
  const activeWorkflows = workflows.filter((w) => w.status === "active").length;

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

      {/* Workflows */}
      <div className="space-y-4">
        {workflows.map((workflow) => {
          const typeConf = typeConfig[workflow.type];
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
                    <span>{workflow.steps} steps</span>
                    <span className="flex items-center gap-1">
                      {workflow.channels.map((ch) => {
                        const Icon = channelIcons[ch];
                        return Icon ? <Icon key={ch} className="h-3.5 w-3.5" /> : null;
                      })}
                    </span>
                    <span>Last triggered: {workflow.lastTriggered}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {workflow.status === "active" ? (
                    <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                      <Pause className="h-3 w-3" /> Pause
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
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
                    <p className="text-sm font-medium text-slate-900">{workflow.enrolled}</p>
                    <p className="text-xs text-slate-500">Enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{workflow.completed}</p>
                    <p className="text-xs text-slate-500">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{workflow.conversionRate}%</p>
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
