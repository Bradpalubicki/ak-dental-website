"use client";

import { useState } from "react";
import { OnboardingShell } from "./onboarding-shell";
import { ExternalLink, CheckCircle2 } from "lucide-react";

const STEPS = [
  { title: "Schedule Review", description: "Confirm your chair assignments and availability." },
  { title: "Clinical Note Templates", description: "Pick your default procedure templates." },
  { title: "Treatment Plan Presentation", description: "Learn how to present plans on iPad." },
  { title: "HIPAA Reminder", description: "Key privacy rules for your role." },
  { title: "Documentation Requirements", description: "What must be signed before end of day." },
  { title: "HIPAA Quiz", description: "Mandatory — complete before your first patient." },
  { title: "All Set!", description: "You're ready to start seeing patients." },
];

const CDT_TEMPLATES = ["D0120 — Periodic Oral Evaluation", "D2140 — Amalgam Filling", "D2740 — Crown (Porcelain)", "D3330 — Root Canal (Molar)", "D4341 — Scaling & Root Planing"];

export function AssociateDentistOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("D0120 — Periodic Oral Evaluation");
  const [completing, setCompleting] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    await onComplete();
  }

  const content = [
    <div key="0" className="space-y-3">
      <p className="text-sm text-slate-600">Your schedule is managed in the dashboard. Contact your office manager to confirm your chair assignments and weekly availability hours.</p>
      <a href="/dashboard/schedule" className="flex items-center gap-2 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> View your schedule
      </a>
    </div>,

    <div key="1" className="space-y-3">
      <p className="text-sm text-slate-600">Select your most-used procedure template. This pre-fills when you create clinical notes.</p>
      <div className="space-y-2">
        {CDT_TEMPLATES.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTemplate(t)}
            className={`w-full text-left text-sm px-4 py-2.5 rounded-lg border transition-colors ${selectedTemplate === t ? "border-cyan-500 bg-cyan-50 text-cyan-800" : "border-slate-200 hover:border-slate-300"}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>,

    <div key="2" className="space-y-3">
      <p className="text-sm text-slate-600">Use the treatment presentation view to walk patients through their plan on an iPad. It shows procedures, costs, and before/after expectations in a clean visual format.</p>
      <a href="/dashboard/treatments" className="flex items-center gap-2 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> View treatment plans
      </a>
    </div>,

    <div key="3" className="space-y-4">
      {[
        "Never discuss a patient's care with family members without written authorization",
        "Only access charts for patients you are actively treating",
        "Verbal conversations about patients should not happen in waiting areas",
        "Dispose of paper records by cross-cut shredding only",
      ].map((rule, i) => (
        <div key={i} className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">{rule}</p>
        </div>
      ))}
    </div>,

    <div key="4" className="space-y-3">
      <p className="text-sm text-slate-600">Before leaving for the day, all of the following must be completed:</p>
      {["All clinical notes signed and locked", "Treatment plans reviewed and presented", "Consent forms signed for any procedure performed", "Any outstanding prescriptions documented"].map((req, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-slate-300" />
          {req}
        </div>
      ))}
    </div>,

    <div key="5" className="space-y-3">
      <p className="text-sm text-slate-600">Complete the HIPAA quiz to receive your certification. Required before your first patient visit.</p>
      <a href="/dashboard/training/hipaa" className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3 text-sm text-cyan-700 hover:bg-cyan-100 transition-colors font-medium">
        <ExternalLink className="h-4 w-4" /> Take HIPAA Quiz (5 questions, pass = 4/5)
      </a>
      <a href="/dashboard/training/osha" className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-700 hover:bg-orange-100 transition-colors font-medium">
        <ExternalLink className="h-4 w-4" /> Take OSHA Quiz (5 questions, must pass all)
      </a>
    </div>,

    <div key="6" className="text-center space-y-4 py-4">
      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <div>
        <p className="font-semibold text-slate-900">Welcome to AK Ultimate Dental!</p>
        <p className="text-sm text-slate-500 mt-1">Complete your HIPAA and OSHA quizzes before your first patient visit.</p>
      </div>
    </div>,
  ];

  return (
    <OnboardingShell role="Associate Dentist" steps={STEPS} currentStep={step} onNext={() => setStep((s) => s + 1)} onBack={step > 0 ? () => setStep((s) => s - 1) : undefined} onComplete={handleComplete} isLastStep={step === STEPS.length - 1} completing={completing}>
      {content[step]}
    </OnboardingShell>
  );
}
