"use client";

import { useState } from "react";
import { OnboardingShell } from "./onboarding-shell";
import { ExternalLink, CheckCircle2, Shield } from "lucide-react";

const STEPS = [
  { title: "Patient Check-In Flow", description: "How to check patients in when they arrive." },
  { title: "New Bookings", description: "What happens when patients book online." },
  { title: "Insurance Verification", description: "Where to see patient coverage status." },
  { title: "Intake Form Monitoring", description: "Where new patient forms appear." },
  { title: "Your Access Level", description: "What you can and cannot see." },
  { title: "All Set!", description: "You're ready to help patients at the front desk." },
];

export function FrontDeskOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    await onComplete();
  }

  const content = [
    <div key="0" className="space-y-3">
      <p className="text-sm text-slate-600">When a patient arrives:</p>
      {["Go to Patients → search by name or phone", "Open their record → click \"Mark Arrived\"", "Provider gets an alert in their dashboard", "Check insurance status badge — green = verified, red = needs attention"].map((step, i) => (
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
      <p className="text-sm text-slate-600">When a patient books online, the system automatically:</p>
      {["Creates an appointment in the schedule", "Sends a confirmation SMS + email to the patient", "Sends intake forms (new patients only)", "Queues reminder messages (48h and 24h before)"].map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          {item}
        </div>
      ))}
    </div>,

    <div key="2" className="space-y-3">
      <p className="text-sm text-slate-600">Insurance verification runs automatically at intake. You can see the status on each patient record.</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Green = coverage verified</div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700"><Shield className="h-4 w-4" /> Red = issue — patient needs to call insurance</div>
      </div>
      <a href="/dashboard/insurance" className="flex items-center gap-1 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> View Insurance Dashboard
      </a>
    </div>,

    <div key="3" className="space-y-3">
      <p className="text-sm text-slate-600">New patient intake forms are submitted online before their first visit. Monitor completion status in the Patients section.</p>
      <p className="text-sm text-slate-500">If forms haven&apos;t been submitted: remind the patient at check-in and have them complete on a tablet.</p>
      <a href="/dashboard/patients" className="flex items-center gap-1 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> View Patients → filter &quot;Intake Pending&quot;
      </a>
    </div>,

    <div key="4" className="space-y-3">
      <p className="text-sm text-slate-600">Your role gives you access to:</p>
      {["✅ Patient records (name, contact, appointment history)", "✅ Schedule and appointments", "✅ Insurance verification status", "✅ Intake form status", "🚫 Clinical notes and treatment details", "🚫 Financial data and billing", "🚫 HR records and payroll"].map((item, i) => (
        <div key={i} className={`text-sm px-3 py-2 rounded-lg ${item.startsWith("✅") ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-500"}`}>{item}</div>
      ))}
    </div>,

    <div key="5" className="text-center space-y-4 py-4">
      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <p className="font-semibold text-slate-900">You&apos;re all set!</p>
      <p className="text-sm text-slate-500">Start your day on the Appointments page to see who&apos;s coming in today.</p>
    </div>,
  ];

  return (
    <OnboardingShell role="Front Desk" steps={STEPS} currentStep={step} onNext={() => setStep((s) => s + 1)} onBack={step > 0 ? () => setStep((s) => s - 1) : undefined} onComplete={handleComplete} isLastStep={step === STEPS.length - 1} completing={completing}>
      {content[step]}
    </OnboardingShell>
  );
}
