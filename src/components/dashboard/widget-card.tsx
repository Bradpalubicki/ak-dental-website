"use client";

import React from "react";
import { WIDGET_REGISTRY, type DashboardData } from "./dashboard-types";
import { AppointmentsWidget } from "./widgets/appointments-widget";
import { LeadsWidget } from "./widgets/leads-widget";
import { AiInsightsWidget } from "./widgets/ai-insights-widget";
import { FinancialsWidget } from "./widgets/financials-widget";
import { HrWidget } from "./widgets/hr-widget";
import { ComplianceWidget } from "./widgets/compliance-widget";
import { InsuranceWidget } from "./widgets/insurance-widget";
import { OutreachWidget } from "./widgets/outreach-widget";
import { SetupChecklistWidget } from "./widgets/setup-checklist-widget";

const content: Record<string, (data: DashboardData) => React.ReactNode> = {
  setup: () => <SetupChecklistWidget />,
  ai_insights: (data) => <AiInsightsWidget data={data} />,
  appointments: (data) => <AppointmentsWidget data={data} />,
  leads: (data) => <LeadsWidget data={data} />,
  financials: () => <FinancialsWidget />,
  hr: () => <HrWidget />,
  compliance: () => <ComplianceWidget />,
  insurance: () => <InsuranceWidget />,
  outreach: () => <OutreachWidget />,
};

export function WidgetCard({ id, data }: { id: string; data: DashboardData }) {
  const def = WIDGET_REGISTRY.find((w) => w.id === id);
  if (!def) return null;
  const Icon = def.icon;
  const renderContent = content[id];

  return (
    <div className="flex flex-col rounded-xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Widget header */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            id === "ai_insights" ? "bg-indigo-50" : "bg-slate-50"
          }`}
        >
          <Icon
            className={`h-3.5 w-3.5 ${
              id === "ai_insights" ? "text-indigo-600" : "text-slate-500"
            }`}
          />
        </div>
        <h3 className="text-xs font-bold text-slate-900 flex-1">
          {def.label}
        </h3>
        {def.demo && (
          <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-600">
            Demo
          </span>
        )}
      </div>
      {/* Widget body */}
      <div className="px-4 py-3">
        {renderContent ? (
          renderContent(data)
        ) : (
          <p className="text-xs text-slate-400">Widget: {id}</p>
        )}
      </div>
    </div>
  );
}
