"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Download,
  Mail,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

const weeklyData = [
  { day: "Mon", production: 4200, collections: 3800, appointments: 8, newPatients: 2 },
  { day: "Tue", production: 5100, collections: 4600, appointments: 9, newPatients: 1 },
  { day: "Wed", production: 3800, collections: 3500, appointments: 7, newPatients: 3 },
  { day: "Thu", production: 4800, collections: 4200, appointments: 8, newPatients: 1 },
  { day: "Fri", production: 0, collections: 0, appointments: 0, newPatients: 0 },
];

const monthlyMetrics = {
  production: { value: 47850, change: 8.3, trend: "up" as const },
  collections: { value: 43250, change: 5.7, trend: "up" as const },
  newPatients: { value: 22, change: 15.8, trend: "up" as const },
  noShowRate: { value: 6.2, change: -3.8, trend: "up" as const },
  treatmentAcceptance: { value: 72, change: 4.2, trend: "up" as const },
  avgLeadResponse: { value: 102, change: -45, trend: "up" as const },
  recallCompliance: { value: 75, change: 8, trend: "up" as const },
  reviewScore: { value: 4.8, change: 0.2, trend: "up" as const },
};

const leadSources = [
  { source: "Website", count: 8, percentage: 36 },
  { source: "Google Ads", count: 5, percentage: 23 },
  { source: "Referral", count: 4, percentage: 18 },
  { source: "Phone", count: 3, percentage: 14 },
  { source: "Social Media", count: 2, percentage: 9 },
];

const aiPerformance = {
  totalActions: 156,
  approved: 148,
  rejected: 5,
  pending: 3,
  approvalRate: 96.8,
  avgResponseTime: "1m 42s",
  leadsResponded: 22,
  reminderssSent: 89,
  insuranceVerified: 34,
};

export default function AnalyticsPage() {
  const maxProduction = Math.max(...weeklyData.map((d) => d.production));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reporting</h1>
          <p className="text-sm text-slate-500">Practice performance metrics and AI insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 90 Days</option>
            <option>Year to Date</option>
          </select>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
            <Mail className="h-4 w-4" />
            Send Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="MTD Production" value={`$${monthlyMetrics.production.value.toLocaleString()}`} change={`+${monthlyMetrics.production.change}%`} trend="up" icon={DollarSign} iconColor="bg-emerald-50 text-emerald-600" />
        <StatCard title="New Patients" value={monthlyMetrics.newPatients.value.toString()} change={`+${monthlyMetrics.newPatients.change}%`} trend="up" icon={Users} iconColor="bg-blue-50 text-blue-600" />
        <StatCard title="Treatment Acceptance" value={`${monthlyMetrics.treatmentAcceptance.value}%`} change={`+${monthlyMetrics.treatmentAcceptance.change}%`} trend="up" icon={Target} iconColor="bg-purple-50 text-purple-600" />
        <StatCard title="No-Show Rate" value={`${monthlyMetrics.noShowRate.value}%`} change={`${monthlyMetrics.noShowRate.change}%`} trend="up" icon={Calendar} iconColor="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Production Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">This Week&apos;s Production</h2>
          <div className="flex items-end gap-3 h-48">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-slate-900">
                  {day.production > 0 ? `$${(day.production / 1000).toFixed(1)}k` : "—"}
                </span>
                <div className="w-full flex gap-1">
                  <div
                    className="flex-1 rounded-t bg-cyan-500"
                    style={{ height: `${maxProduction > 0 ? (day.production / maxProduction) * 150 : 0}px` }}
                  />
                  <div
                    className="flex-1 rounded-t bg-cyan-200"
                    style={{ height: `${maxProduction > 0 ? (day.collections / maxProduction) * 150 : 0}px` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-cyan-500" />
              <span className="text-slate-500">Production</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-cyan-200" />
              <span className="text-slate-500">Collections</span>
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Lead Sources</h2>
          <div className="space-y-3">
            {leadSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{source.source}</span>
                  <span className="font-medium text-slate-900">{source.count} ({source.percentage}%)</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-cyan-500"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Performance */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">AI Performance This Month</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{aiPerformance.totalActions}</p>
            <p className="text-xs text-slate-500">Total Actions</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">{aiPerformance.approvalRate}%</p>
            <p className="text-xs text-emerald-600">Approval Rate</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{aiPerformance.avgResponseTime}</p>
            <p className="text-xs text-blue-600">Avg Response</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">{aiPerformance.leadsResponded}</p>
            <p className="text-xs text-purple-600">Leads Responded</p>
          </div>
          <div className="rounded-lg bg-cyan-50 p-4 text-center">
            <p className="text-2xl font-bold text-cyan-700">{aiPerformance.reminderssSent}</p>
            <p className="text-xs text-cyan-600">Reminders Sent</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{aiPerformance.insuranceVerified}</p>
            <p className="text-xs text-amber-600">Insurance Verified</p>
          </div>
        </div>
      </div>

      {/* Morning Briefing */}
      <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-cyan-900">Today&apos;s Morning Briefing</h2>
          </div>
          <span className="text-xs text-cyan-600">Generated at 7:00 AM</span>
        </div>
        <div className="rounded-lg bg-white p-4 text-sm text-slate-700 space-y-2">
          <p><strong>Priorities:</strong> 7 appointments today (1 unconfirmed - Jennifer Liu at 10:30 AM). 3 new leads need response. 5 insurance verifications pending.</p>
          <p><strong>Revenue:</strong> Yesterday&apos;s production was $4,250 (above average). Collection rate holding strong at 96.1%.</p>
          <p><strong>Attention Needed:</strong> David Park&apos;s Invisalign plan presented 6 days ago with no response - AI follow-up recommended. Karen Davis has a denied claim needing pre-auth resubmission.</p>
          <p><strong>Overnight AI Activity:</strong> 4 actions taken - 1 emergency call handled, 2 lead responses drafted, 1 appointment reminder sent.</p>
        </div>
      </div>
    </div>
  );
}
