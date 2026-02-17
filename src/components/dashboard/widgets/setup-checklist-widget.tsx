"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function SetupChecklistWidget() {
  const [steps, setSteps] = useState<
    Array<{
      key: string;
      label: string;
      category: string;
      completed: boolean;
      href: string;
    }>
  >([
    { key: "practice_info", label: "Add Practice Information", category: "essentials", completed: true, href: "/dashboard/settings" },
    { key: "add_provider", label: "Add Provider / Doctor", category: "essentials", completed: true, href: "/dashboard/settings" },
    { key: "add_staff", label: "Add Staff Members", category: "team", completed: false, href: "/dashboard/hr" },
    { key: "upload_licenses", label: "Upload Licenses & Credentials", category: "team", completed: false, href: "/dashboard/licensing" },
    { key: "connect_pms", label: "Connect Practice Management System", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "configure_twilio", label: "Configure SMS / Phone", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "configure_email", label: "Configure Email Sending", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "connect_billing", label: "Connect Billing / Clearinghouse", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "connect_accounting", label: "Connect Accounting System", category: "integrations", completed: false, href: "/dashboard/settings" },
    { key: "import_patients", label: "Import Patient Records", category: "operations", completed: false, href: "/dashboard/patients" },
    { key: "configure_ai", label: "Configure AI Settings", category: "operations", completed: false, href: "/dashboard/settings" },
    { key: "go_live", label: "Go Live", category: "advanced", completed: false, href: "/dashboard/settings" },
  ]);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const toggleStep = (key: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.key === key ? { ...s, completed: !s.completed } : s))
    );
  };

  if (pct === 100) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
          <p className="text-sm font-bold text-emerald-700">Setup Complete!</p>
          <p className="text-[11px] text-slate-400 mt-1">
            One Engine is fully configured
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-slate-600">
            {completedCount} of {totalCount} steps
          </span>
          <span className="text-[11px] font-bold text-cyan-600">{pct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="space-y-0.5">
        {steps
          .filter((s) => !s.completed)
          .slice(0, 5)
          .map((step) => (
            <div
              key={step.key}
              className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors group"
            >
              <button
                onClick={() => toggleStep(step.key)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-200 group-hover:border-cyan-300 transition-colors"
              >
                <span className="sr-only">Complete step</span>
              </button>
              <a
                href={step.href}
                className="flex-1 text-xs font-medium text-slate-700 hover:text-cyan-600 transition-colors truncate"
              >
                {step.label}
              </a>
              <ArrowRight className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        {completedCount > 0 && (
          <div className="pt-1 border-t border-slate-100 mt-1">
            <p className="text-[10px] font-medium text-emerald-500 px-2 py-1">
              <CheckCircle2 className="inline h-3 w-3 mr-1" />
              {completedCount} completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
