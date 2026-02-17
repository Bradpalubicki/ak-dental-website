"use client";

import {
  Calendar,
  UserPlus,
  Eye,
  Users,
  Zap,
  Shield,
} from "lucide-react";
import { StatCard } from "../stat-card";
import type { DashboardData } from "../dashboard-types";

function generateSparkData(current: number, points: number = 7): number[] {
  if (current === 0) return [];
  const data: number[] = [];
  for (let i = 0; i < points; i++) {
    const factor = 0.6 + (i / (points - 1)) * 0.4;
    const jitter = 1 + (((i * 7 + current) % 11) - 5) * 0.03;
    data.push(Math.max(0, Math.round(current * factor * jitter)));
  }
  return data;
}

export function KpiWidget({ data }: { data: DashboardData }) {
  const confirmed =
    data.stats.appointmentCount - data.stats.unconfirmedCount;
  const urgentLeads = data.leads
    ? data.leads.filter(
        (l) => l.urgency === "high" || l.urgency === "emergency"
      ).length
    : 0;

  const kpis = [
    {
      title: "Appointments",
      value: String(data.stats.appointmentCount),
      icon: Calendar,
      iconColor: "text-blue-600 bg-blue-50",
      accentColor: "#3b82f6",
      description: `${confirmed} confirmed, ${data.stats.unconfirmedCount} pending`,
      href: "/dashboard/appointments",
      sparkData: generateSparkData(data.stats.appointmentCount),
      sparkColor: "#3b82f6",
    },
    {
      title: "New Leads",
      value: String(data.stats.leadCount),
      icon: UserPlus,
      iconColor: "text-emerald-600 bg-emerald-50",
      accentColor: "#10b981",
      description:
        urgentLeads > 0
          ? `${urgentLeads} high priority`
          : "all normal priority",
      href: "/dashboard/leads",
      sparkData: generateSparkData(data.stats.leadCount),
      sparkColor: "#10b981",
    },
    {
      title: "Pending Approvals",
      value: String(data.stats.pendingApprovals),
      icon: Eye,
      iconColor: "text-amber-600 bg-amber-50",
      accentColor: "#f59e0b",
      description: `${data.stats.approvedToday} approved today`,
      pulse: data.stats.pendingApprovals > 0,
      href: "/dashboard/approvals",
      sparkData: generateSparkData(data.stats.pendingApprovals),
      sparkColor: "#f59e0b",
    },
    {
      title: "Patients",
      value: String(data.stats.patientCount),
      icon: Users,
      iconColor: "text-cyan-600 bg-cyan-50",
      accentColor: "#06b6d4",
      description: "active roster",
      href: "/dashboard/patients",
      sparkData: generateSparkData(data.stats.patientCount),
      sparkColor: "#06b6d4",
    },
    {
      title: "AI Actions",
      value: String(data.stats.aiActionsToday),
      icon: Zap,
      iconColor: "text-indigo-600 bg-indigo-50",
      accentColor: "#6366f1",
      description: `${data.stats.approvedToday} executed today`,
      href: "/dashboard/approvals",
      sparkData: generateSparkData(data.stats.aiActionsToday),
      sparkColor: "#6366f1",
    },
    {
      title: "Insurance",
      value: String(data.stats.pendingInsurance),
      icon: Shield,
      iconColor: "text-purple-600 bg-purple-50",
      accentColor: "#a855f7",
      description: "pending verification",
      href: "/dashboard/insurance",
      sparkData: generateSparkData(data.stats.pendingInsurance),
      sparkColor: "#a855f7",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((kpi) => (
        <StatCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}
