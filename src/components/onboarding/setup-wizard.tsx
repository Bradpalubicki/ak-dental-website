"use client";

import { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Rocket,
  MapPin,
  Phone,
  Users,
  Star,
  Shield,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WIZARD_STEPS,
  ROLE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  PRIORITY_OPTIONS,
  SETUP_STEPS,
} from "@/config/onboarding-config";
import type { WizardData } from "@/hooks/useOnboarding";

interface SetupWizardProps {
  onComplete: (data: WizardData) => void;
  onDismiss: () => void;
  initialData?: WizardData;
}

export function SetupWizard({ onComplete, onDismiss, initialData = {} }: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    practiceName: "AK Ultimate Dental",
    phone: "(702) 935-4395",
    address: "Las Vegas, NV 89117",
    ...initialData,
  });

  const total = WIZARD_STEPS.length;
  const current = WIZARD_STEPS[step];
  const isLast = step === total - 1;
  const isFirst = step === 0;

  function update(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function next() {
    if (isLast) {
      onComplete(data);
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    if (!isFirst) setStep((s) => s - 1);
  }

  function canAdvance(): boolean {
    if (step === 0) return !!(data.practiceName && data.phone);
    if (step === 1) return !!data.role;
    if (step === 2) return !!data.teamSize;
    if (step === 3) return (data.priorities?.length ?? 0) > 0;
    if (step === 4) return !!(data.hipaaAcknowledged && data.tcpaAcknowledged);
    return true;
  }

  function togglePriority(value: string) {
    const current = data.priorities || [];
    const next = current.includes(value)
      ? current.filter((p) => p !== value)
      : [...current, value];
    update({ priorities: next });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500 flex items-center justify-center shrink-0">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Step {step + 1} of {total}
              </p>
              <h2 className="text-base font-bold text-slate-900 leading-tight">{current.title}</h2>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 min-h-[320px]">
          <p className="text-sm text-slate-500 mb-5">{current.subtitle}</p>

          {/* Step 0 — Practice Profile */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Practice Name
                </label>
                <input
                  type="text"
                  value={data.practiceName || ""}
                  onChange={(e) => update({ practiceName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="AK Ultimate Dental"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={data.phone || ""}
                  onChange={(e) => update({ phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="(702) 935-4395"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Address
                </label>
                <input
                  type="text"
                  value={data.address || ""}
                  onChange={(e) => update({ address: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Las Vegas, NV 89117"
                />
              </div>
              <p className="text-xs text-slate-400">
                You can update these any time in Settings.
              </p>
            </div>
          )}

          {/* Step 1 — Role */}
          {step === 1 && (
            <div className="space-y-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ role: opt.value })}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                    data.role === opt.value
                      ? "border-cyan-400 bg-cyan-50 ring-1 ring-cyan-400"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.description}</p>
                  </div>
                  {data.role === opt.value && (
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2 — Team Size */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-slate-400" />
                <p className="text-sm text-slate-600">
                  This helps us set up the right access levels and notifications.
                </p>
              </div>
              {TEAM_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ teamSize: opt.value })}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all ${
                    data.teamSize === opt.value
                      ? "border-cyan-400 bg-cyan-50 ring-1 ring-cyan-400"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.description}</p>
                  </div>
                  {data.teamSize === opt.value && (
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 3 — Priorities */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-slate-400" />
                <p className="text-sm text-slate-600">
                  Select all that apply — we&apos;ll highlight these features first.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITY_OPTIONS.map((opt) => {
                  const selected = (data.priorities || []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => togglePriority(opt.value)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${
                        selected
                          ? "border-cyan-400 bg-cyan-50 ring-1 ring-cyan-400"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base">{opt.icon}</span>
                      <span className="text-xs font-medium text-slate-800">{opt.label}</span>
                      {selected && <Check className="h-3 w-3 text-cyan-500 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 — Compliance */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800">
                  These acknowledgments are required for HIPAA compliance and patient
                  communication. They&apos;re stored with your account for audit purposes.
                </p>
              </div>

              <label className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                data.hipaaAcknowledged ? "border-cyan-400 bg-cyan-50" : "border-slate-200 hover:border-slate-300"
              }`}>
                <input
                  type="checkbox"
                  checked={!!data.hipaaAcknowledged}
                  onChange={(e) => update({ hipaaAcknowledged: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">HIPAA Privacy Acknowledgment</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    I confirm this platform will be used in compliance with HIPAA Privacy and
                    Security Rules. Patient data will not be shared without authorization.
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                data.tcpaAcknowledged ? "border-cyan-400 bg-cyan-50" : "border-slate-200 hover:border-slate-300"
              }`}>
                <input
                  type="checkbox"
                  checked={!!data.tcpaAcknowledged}
                  onChange={(e) => update({ tcpaAcknowledged: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">TCPA Consent Acknowledgment</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    I confirm that patients who receive SMS messages via this platform have provided
                    written consent in accordance with TCPA requirements.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Step 5 — Launch */}
          {step === 5 && (
            <div className="text-center py-2">
              <div className="h-16 w-16 rounded-2xl bg-cyan-500 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                You&apos;re all set, {data.role === "owner-dentist" ? "Dr. Alex" : "welcome"}!
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                Your dashboard is configured. Here&apos;s what to do next:
              </p>
              <div className="space-y-2 text-left">
                {SETUP_STEPS.filter((s) => s.category === "essential").map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
                    <div className="h-5 w-5 rounded-full border-2 border-slate-200 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-800">{s.label}</p>
                      <p className="text-xs text-slate-400">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={back}
            disabled={isFirst}
            className="gap-1.5 text-slate-500"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-1.5">
            {WIZARD_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-4 bg-cyan-500" : i < step ? "w-1.5 bg-cyan-300" : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={next}
            disabled={!canAdvance()}
            className="gap-1.5 bg-cyan-500 hover:bg-cyan-600"
          >
            {isLast ? "Go to Dashboard" : "Continue"}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
