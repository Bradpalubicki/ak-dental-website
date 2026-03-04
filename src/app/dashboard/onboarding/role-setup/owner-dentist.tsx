"use client";

import { useState } from "react";
import { OnboardingShell } from "./onboarding-shell";
import { CheckCircle2, ExternalLink } from "lucide-react";

const STEPS = [
  { title: "Practice Confirmation", description: "Confirm your practice details are correct." },
  { title: "Voice AI Setup", description: "Review your AI receptionist greeting and settings." },
  { title: "Template Review", description: "Preview your most important patient messages." },
  { title: "Team Setup", description: "Invite your staff to the platform." },
  { title: "Financial Targets", description: "Set your monthly production and collections goals." },
  { title: "Launch Checklist", description: "Review everything before going live with patients." },
  { title: "All Set!", description: "You're ready to run AK Ultimate Dental." },
];

export function OwnerDentistOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    await onComplete();
  }

  const content = [
    // Step 0: Practice confirmation
    <div key="0" className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500">Practice</span><p className="font-medium text-slate-900 mt-0.5">AK Ultimate Dental</p></div>
          <div><span className="text-slate-500">Phone</span><p className="font-medium text-slate-900 mt-0.5">(702) 935-4395</p></div>
          <div><span className="text-slate-500">Address</span><p className="font-medium text-slate-900 mt-0.5">7480 W Sahara Ave, Las Vegas, NV 89117</p></div>
          <div><span className="text-slate-500">Hours</span><p className="font-medium text-slate-900 mt-0.5">Mon–Thu 8AM–5PM</p></div>
        </div>
      </div>
      <p className="text-xs text-slate-500">These details appear on all patient communications. Contact NuStack to update.</p>
    </div>,

    // Step 1: Voice AI
    <div key="1" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Receptionist Greeting</p>
        <p className="text-sm text-slate-700 italic">&ldquo;Thank you for calling AK Ultimate Dental. How can I help you today?&rdquo;</p>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-3">End of Call</p>
        <p className="text-sm text-slate-700 italic">&ldquo;Thank you for calling AK Dental. We&apos;ll follow up with you shortly. Have a great day.&rdquo;</p>
      </div>
      <a href="/dashboard/calls" className="flex items-center gap-1 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> View call logs
      </a>
    </div>,

    // Step 2: Template review
    <div key="2" className="space-y-3">
      {[
        { label: "Appointment Reminder (24h)", preview: "Hi [Patient], your appointment at AK Dental is tomorrow at [Time]. Reply CONFIRM to confirm..." },
        { label: "Post-Visit Review Request", preview: "Hi [Patient] — thank you for visiting AK Dental! If your experience was great, a quick Google review..." },
        { label: "6-Month Recall", preview: "Hi [Patient]! It's been 6 months since your last cleaning at AK Dental. Dr. Chireau recommends..." },
      ].map((t) => (
        <div key={t.label} className="border border-slate-200 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-700">{t.label}</p>
          <p className="text-xs text-slate-500 mt-1 italic">{t.preview}</p>
        </div>
      ))}
      <a href="/dashboard/message-templates" className="flex items-center gap-1 text-sm text-cyan-600 hover:underline">
        <ExternalLink className="h-3.5 w-3.5" /> Review & approve all 18 templates
      </a>
    </div>,

    // Step 3: Team setup
    <div key="3" className="space-y-4">
      <p className="text-sm text-slate-600">Invite your team members by going to Settings → Users. Each person will receive a Clerk invite and complete their own role-based onboarding.</p>
      <div className="space-y-2 text-sm text-slate-600">
        {["Office Manager", "Front Desk", "Dental Assistant", "Associate Dentist"].map((r) => (
          <div key={r} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-slate-300" />
            {r}
          </div>
        ))}
      </div>
    </div>,

    // Step 4: Financial targets
    <div key="4" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Monthly Production Target</label>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <span className="px-3 py-2 bg-slate-50 text-slate-500 text-sm border-r border-slate-200">$</span>
            <input type="number" defaultValue={120000} className="flex-1 px-3 py-2 text-sm focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Monthly Collections Target</label>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <span className="px-3 py-2 bg-slate-50 text-slate-500 text-sm border-r border-slate-200">$</span>
            <input type="number" defaultValue={100000} className="flex-1 px-3 py-2 text-sm focus:outline-none" />
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400">These appear in your analytics dashboard and daily briefing email.</p>
    </div>,

    // Step 5: Launch checklist
    <div key="5" className="space-y-3">
      <p className="text-sm text-slate-600">Before going live with patients, review the launch checklist to make sure everything is configured.</p>
      <a href="/dashboard/launch-checklist" className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3 text-sm text-cyan-700 hover:bg-cyan-100 transition-colors">
        <ExternalLink className="h-4 w-4" /> Open Launch Checklist
      </a>
    </div>,

    // Step 6: Done
    <div key="6" className="text-center space-y-4 py-4">
      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <div>
        <p className="font-semibold text-slate-900">You&apos;re all set, Dr. Chireau!</p>
        <p className="text-sm text-slate-500 mt-1">Your dashboard is ready. Complete the launch checklist when you&apos;re ready to go live.</p>
      </div>
    </div>,
  ];

  return (
    <OnboardingShell
      role="Owner Dentist"
      steps={STEPS}
      currentStep={step}
      onNext={() => setStep((s) => s + 1)}
      onBack={step > 0 ? () => setStep((s) => s - 1) : undefined}
      onComplete={handleComplete}
      isLastStep={step === STEPS.length - 1}
      completing={completing}
    >
      {content[step]}
    </OnboardingShell>
  );
}
