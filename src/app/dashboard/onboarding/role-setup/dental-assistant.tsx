"use client";

import { useState } from "react";
import { OnboardingShell } from "./onboarding-shell";
import { ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";

const STEPS = [
  { title: "Pre-Appointment Chart Pull", description: "How to open a patient chart before they arrive." },
  { title: "Clinical Note Assist", description: "How AI pre-fills procedure notes." },
  { title: "Communication Rules", description: "What you can and cannot send to patients." },
  { title: "Required Training", description: "Complete HIPAA and OSHA before your first patient." },
  { title: "All Set!", description: "You're ready to assist Dr. Chireau." },
];

export function DentalAssistantOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    await onComplete();
  }

  const content = [
    <div key="0" className="space-y-3">
      <p className="text-sm text-slate-600">Before each patient arrives, pull up their chart to review upcoming procedure, allergies, and last visit notes.</p>
      {["Go to Patients → search by name or appointment", "Open chart → review Health History tab", "Check for allergies, medications, medical alerts", "Confirm the procedure scheduled for today"].map((step, i) => (
        <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700">
          <span className="font-mono text-xs text-slate-400 mt-0.5 w-4 shrink-0">{i + 1}.</span>
          {step}
        </div>
      ))}
      <a href="/dashboard/patients" className="flex items-center gap-1 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> Open Patients
      </a>
    </div>,

    <div key="1" className="space-y-3">
      <p className="text-sm text-slate-600">When a procedure is selected, AI pre-fills a clinical note template using the CDT code. You must verify all auto-filled content before the provider signs.</p>
      {["AI fills: chief complaint, procedure description, anesthesia used", "You verify: patient response, complications, materials used", "Provider reviews and signs — never alter a signed note", "Unsigned notes must be completed same day"].map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
          {item}
        </div>
      ))}
    </div>,

    <div key="2" className="space-y-3">
      <p className="text-sm text-slate-600">All patient communications go through the dashboard — not your personal phone.</p>
      <div className="space-y-2">
        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> Automated reminders and confirmations — handled by system</div>
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-800"><AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> Do NOT text or call patients from your personal phone about their care</div>
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-800"><AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> Do NOT share clinical information with patient family without written consent</div>
      </div>
    </div>,

    <div key="3" className="space-y-3">
      <p className="text-sm text-slate-600">Both quizzes are required before your first patient interaction. No exceptions.</p>
      <a href="/dashboard/training/hipaa" className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3 text-sm text-cyan-700 hover:bg-cyan-100 transition-colors font-medium">
        <ExternalLink className="h-4 w-4" /> HIPAA Quiz — 5 questions, pass = 4/5
      </a>
      <a href="/dashboard/training/osha" className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-700 hover:bg-orange-100 transition-colors font-medium">
        <ExternalLink className="h-4 w-4" /> OSHA Quiz — 5 questions, must pass all
      </a>
    </div>,

    <div key="4" className="text-center space-y-4 py-4">
      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <p className="font-semibold text-slate-900">Welcome to the team!</p>
      <p className="text-sm text-slate-500 mt-1">Complete HIPAA and OSHA training before your first patient. Dr. Chireau is counting on you.</p>
    </div>,
  ];

  return (
    <OnboardingShell role="Dental Assistant" steps={STEPS} currentStep={step} onNext={() => setStep((s) => s + 1)} onBack={step > 0 ? () => setStep((s) => s - 1) : undefined} onComplete={handleComplete} isLastStep={step === STEPS.length - 1} completing={completing}>
      {content[step]}
    </OnboardingShell>
  );
}
