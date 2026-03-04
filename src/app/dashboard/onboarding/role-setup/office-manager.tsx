"use client";

import { useState } from "react";
import { OnboardingShell } from "./onboarding-shell";
import { ExternalLink, CheckCircle2 } from "lucide-react";

const STEPS = [
  { title: "Scheduling Preferences", description: "Set booking window and buffer times." },
  { title: "Insurance Flow", description: "How eligibility verification works at intake." },
  { title: "Approval Queue", description: "Practice approving patient messages." },
  { title: "Daily Briefing", description: "Configure when you receive your daily summary." },
  { title: "Collections Dashboard", description: "Overview of your financial tracking tools." },
  { title: "All Set!", description: "You're ready to manage AK Ultimate Dental." },
];

export function OfficeManagerOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [briefingTime, setBriefingTime] = useState("07:00");

  async function handleComplete() {
    setCompleting(true);
    await onComplete();
  }

  const content = [
    <div key="0" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Booking Window (days ahead)</label>
          <input type="number" defaultValue={90} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Buffer Between Appointments</label>
          <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <option>5 minutes</option><option>10 minutes</option><option>15 minutes</option>
          </select>
        </div>
      </div>
    </div>,

    <div key="1" className="space-y-3">
      <p className="text-sm text-slate-600">When a new patient books or checks in, the system automatically verifies their insurance through Vyne Dental Trellis.</p>
      {["Coverage verified → green badge on patient record", "Issue found → insurance_pending SMS sent to patient", "Manual override available in patient record"].map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          {item}
        </div>
      ))}
      <a href="/dashboard/insurance" className="flex items-center gap-1 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> View insurance dashboard
      </a>
    </div>,

    <div key="2" className="space-y-3">
      <p className="text-sm text-slate-600">AI-generated messages for leads and recall patients land in the Approvals queue. You review and approve before anything sends.</p>
      <a href="/dashboard/approvals" className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 hover:bg-amber-100 transition-colors font-medium">
        <ExternalLink className="h-4 w-4" /> Open Approvals Queue
      </a>
    </div>,

    <div key="3" className="space-y-4">
      <p className="text-sm text-slate-600">You receive a daily briefing email with yesterday&apos;s production, collections, upcoming appointments, and any alerts.</p>
      <div>
        <label className="text-xs font-medium text-slate-700 mb-1 block">Send briefing at</label>
        <input type="time" value={briefingTime} onChange={(e) => setBriefingTime(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
    </div>,

    <div key="4" className="space-y-3">
      <p className="text-sm text-slate-600">Track daily collections vs. production target, outstanding balances, and Stripe payment history.</p>
      <a href="/dashboard/financials" className="flex items-center gap-2 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> View Financials Dashboard
      </a>
      <a href="/dashboard/billing" className="flex items-center gap-2 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> View Billing
      </a>
    </div>,

    <div key="5" className="text-center space-y-4 py-4">
      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <div>
        <p className="font-semibold text-slate-900">You&apos;re all set!</p>
        <p className="text-sm text-slate-500 mt-1">Start with the Approvals queue every morning to review AI-drafted messages before they send.</p>
      </div>
    </div>,
  ];

  return (
    <OnboardingShell role="Office Manager" steps={STEPS} currentStep={step} onNext={() => setStep((s) => s + 1)} onBack={step > 0 ? () => setStep((s) => s - 1) : undefined} onComplete={handleComplete} isLastStep={step === STEPS.length - 1} completing={completing}>
      {content[step]}
    </OnboardingShell>
  );
}
