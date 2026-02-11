"use client";

import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Download,
  Mail,
  Zap,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

interface WeeklyDay {
  day: string;
  production: number;
  collections: number;
}

interface LeadSource {
  source: string;
  count: number;
  percentage: number;
}

interface AiPerformance {
  totalActions: number;
  approved: number;
  rejected: number;
  pending: number;
  approvalRate: number;
}

interface AnalyticsData {
  weeklyData: WeeklyDay[];
  monthlyMetrics: {
    production: number;
    collections: number;
    newPatients: number;
    noShowRate: number;
    treatmentAcceptance: number;
  };
  leadSources: LeadSource[];
  aiPerformance: AiPerformance;
}

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const { weeklyData, monthlyMetrics, leadSources, aiPerformance } = data;
  const maxProduction = Math.max(...weeklyData.map((d) => d.production), 1);

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
        <StatCard
          title="MTD Production"
          value={`$${monthlyMetrics.production.toLocaleString()}`}
          change=""
          trend="up"
          icon={DollarSign}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="New Patients"
          value={monthlyMetrics.newPatients.toString()}
          change=""
          trend="up"
          icon={Users}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Treatment Acceptance"
          value={`${monthlyMetrics.treatmentAcceptance}%`}
          change=""
          trend="up"
          icon={Target}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="No-Show Rate"
          value={`${monthlyMetrics.noShowRate}%`}
          change=""
          trend={monthlyMetrics.noShowRate <= 10 ? "up" : "down"}
          icon={Calendar}
          iconColor="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Production Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">This Week&apos;s Production</h2>
          {weeklyData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              No data for this week yet
            </div>
          ) : (
            <>
              <div className="flex items-end gap-3 h-48">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-slate-900">
                      {day.production > 0 ? `$${(day.production / 1000).toFixed(1)}k` : "—"}
                    </span>
                    <div className="w-full flex gap-1">
                      <div
                        className="flex-1 rounded-t bg-cyan-500"
                        style={{ height: `${(day.production / maxProduction) * 150}px` }}
                      />
                      <div
                        className="flex-1 rounded-t bg-cyan-200"
                        style={{ height: `${(day.collections / maxProduction) * 150}px` }}
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
            </>
          )}
        </div>

        {/* Lead Sources */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Lead Sources</h2>
          {leadSources.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              No leads this month
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* AI Performance */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">AI Performance This Month</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{aiPerformance.totalActions}</p>
            <p className="text-xs text-slate-500">Total Actions</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">{aiPerformance.approvalRate}%</p>
            <p className="text-xs text-emerald-600">Approval Rate</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{aiPerformance.approved}</p>
            <p className="text-xs text-blue-600">Approved</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{aiPerformance.pending}</p>
            <p className="text-xs text-amber-600">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
