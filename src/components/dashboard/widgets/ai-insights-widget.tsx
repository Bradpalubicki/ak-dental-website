"use client";

import { Lightbulb, ArrowRight } from "lucide-react";
import type { DashboardData } from "../dashboard-types";

export function AiInsightsWidget({ data }: { data: DashboardData }) {
  const insights: Array<{
    text: string;
    action: string;
    href: string;
    type: "suggestion" | "warning" | "success";
  }> = [];

  if (data.stats.leadCount > 0) {
    insights.push({
      text: `${data.stats.leadCount} new lead${data.stats.leadCount !== 1 ? "s" : ""} today — follow up within 1 hour for 3x higher conversion`,
      action: "View Leads",
      href: "/dashboard/leads",
      type: "suggestion",
    });
  }

  if (data.stats.unconfirmedCount > 0) {
    insights.push({
      text: `${data.stats.unconfirmedCount} unconfirmed appointment${data.stats.unconfirmedCount !== 1 ? "s" : ""} today — send confirmation reminders to reduce no-shows`,
      action: "Send Reminders",
      href: "/dashboard/appointments",
      type: "warning",
    });
  }

  if (data.stats.pendingApprovals > 0) {
    insights.push({
      text: `${data.stats.pendingApprovals} AI-drafted message${data.stats.pendingApprovals !== 1 ? "s" : ""} waiting for your approval before sending`,
      action: "Review & Approve",
      href: "/dashboard/approvals",
      type: "suggestion",
    });
  }

  if (data.stats.approvedToday > 0) {
    const timeSaved = (data.stats.approvedToday * 4.5).toFixed(0);
    insights.push({
      text: `AI saved you ~${timeSaved} minutes today by handling ${data.stats.approvedToday} task${data.stats.approvedToday !== 1 ? "s" : ""} automatically`,
      action: "View Activity",
      href: "/dashboard/approvals",
      type: "success",
    });
  }

  if (data.stats.pendingInsurance > 0) {
    insights.push({
      text: `${data.stats.pendingInsurance} insurance verification${data.stats.pendingInsurance !== 1 ? "s" : ""} pending — verify before appointments to avoid billing issues`,
      action: "Verify Now",
      href: "/dashboard/insurance",
      type: "warning",
    });
  }

  if (insights.length === 0) {
    insights.push({
      text: "All caught up! Your practice is running smoothly. AI is monitoring for new opportunities.",
      action: "View Analytics",
      href: "/dashboard/analytics",
      type: "success",
    });
  }

  const typeStyles = {
    suggestion: {
      bg: "bg-indigo-50/60",
      border: "border-indigo-100",
      icon: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-700",
    },
    warning: {
      bg: "bg-amber-50/60",
      border: "border-amber-100",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
    success: {
      bg: "bg-emerald-50/60",
      border: "border-emerald-100",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
    },
  };

  return (
    <div className="space-y-2">
      {insights.slice(0, 4).map((insight, i) => {
        const styles = typeStyles[insight.type];
        return (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg border ${styles.border} ${styles.bg} px-3 py-2.5`}
          >
            <Lightbulb
              className={`h-4 w-4 shrink-0 mt-0.5 ${styles.icon}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {insight.text}
              </p>
              <a
                href={insight.href}
                className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${styles.badge} hover:opacity-80 transition-opacity`}
              >
                {insight.action}
                <ArrowRight className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
