"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import type { DashboardData } from "./dashboard-types";
import { timeAgo, MODULE_COLORS } from "./dashboard-utils";

type FilterTab = "all" | "urgent" | "activity";

export function ActivitySidebar({
  data,
  open,
  onToggle,
}: {
  data: DashboardData;
  open: boolean;
  onToggle: () => void;
}) {
  const [filter, setFilter] = useState<FilterTab>("all");

  if (!open) {
    const totalAttention = data.urgentItems.length;
    return (
      <div className="hidden lg:flex flex-col items-center w-10 shrink-0">
        <button
          onClick={onToggle}
          className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-1.5 py-3 hover:bg-slate-50 transition-colors shadow-sm"
          title="Open activity panel"
        >
          <PanelRightOpen className="h-4 w-4 text-slate-400" />
          {totalAttention > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[9px] font-bold text-amber-700">
              {totalAttention}
            </span>
          )}
        </button>
      </div>
    );
  }

  const critical = data.urgentItems.filter((i) => i.level === "critical");
  const warnings = data.urgentItems.filter((i) => i.level === "warning");
  const info = data.urgentItems.filter((i) => i.level === "info");
  const urgentCount = data.urgentItems.length;

  const showUrgent = filter === "all" || filter === "urgent";
  const showActivity = filter === "all" || filter === "activity";

  return (
    <div className="hidden lg:flex flex-col w-80 shrink-0 rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-xs font-bold text-slate-900">Activity</h3>
        <button
          onClick={onToggle}
          className="rounded-lg p-1 hover:bg-slate-100 transition-colors"
          title="Collapse panel"
        >
          <PanelRightClose className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-slate-100">
        {(
          [
            { key: "all", label: "All" },
            {
              key: "urgent",
              label: urgentCount > 0 ? `Urgent (${urgentCount})` : "Urgent",
            },
            { key: "activity", label: "AI Activity" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              filter === tab.key
                ? "border-b-2 border-cyan-500 text-cyan-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Needs Attention */}
        {showUrgent && data.urgentItems.length > 0 && (
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Needs Attention
            </p>
            <div className="space-y-1.5">
              {critical.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-2.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-red-700 flex-1">
                    Critical
                  </span>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-200 px-1 text-[10px] font-bold text-red-800">
                    {critical.length}
                  </span>
                </div>
              )}
              {warnings.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-2.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-amber-700 flex-1">
                    Warnings
                  </span>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-200 px-1 text-[10px] font-bold text-amber-800">
                    {warnings.length}
                  </span>
                </div>
              )}
              {info.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-blue-700 flex-1">
                    Info
                  </span>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-200 px-1 text-[10px] font-bold text-blue-800">
                    {info.length}
                  </span>
                </div>
              )}
              {/* Individual items */}
              <div className="mt-2 space-y-1">
                {data.urgentItems.slice(0, 5).map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <AlertTriangle
                      className={`h-3 w-3 shrink-0 ${
                        item.level === "critical"
                          ? "text-red-500"
                          : item.level === "warning"
                            ? "text-amber-500"
                            : "text-blue-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-slate-700 truncate">
                        {item.label}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        {item.detail}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {showUrgent && data.urgentItems.length === 0 && filter === "urgent" && (
          <div className="px-4 py-6 text-center">
            <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-300 mb-1.5" />
            <p className="text-[11px] font-medium text-emerald-600">
              All clear — no urgent items
            </p>
          </div>
        )}

        {/* Activity Feed */}
        {showActivity && (
          <div className="px-4 py-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recent Activity
            </p>
            {data.aiActions.length === 0 ? (
              <p className="text-[11px] text-slate-400 py-2">
                No recent activity
              </p>
            ) : (
              <div className="space-y-1">
                {data.aiActions.slice(0, 8).map((action) => {
                  const modColors =
                    MODULE_COLORS[action.module] || MODULE_COLORS.default;
                  return (
                    <div
                      key={action.id}
                      className="flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                          action.status === "pending_approval"
                            ? "bg-amber-50"
                            : action.status === "rejected"
                              ? "bg-red-50"
                              : "bg-cyan-50"
                        }`}
                      >
                        {action.status === "pending_approval" ? (
                          <Clock className="h-2.5 w-2.5 text-amber-600" />
                        ) : action.status === "rejected" ? (
                          <XCircle className="h-2.5 w-2.5 text-red-600" />
                        ) : (
                          <CheckCircle2 className="h-2.5 w-2.5 text-cyan-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-slate-700 leading-snug truncate">
                          {action.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${modColors.dot}`}
                          />
                          <span className="text-[9px] text-slate-400">
                            {action.module.replace(/_/g, " ")}
                          </span>
                          <span className="text-[9px] text-slate-300">
                            &middot;
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {timeAgo(action.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
