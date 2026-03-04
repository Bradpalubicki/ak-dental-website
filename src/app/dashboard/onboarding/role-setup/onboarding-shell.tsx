"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface Props {
  role: string;
  steps: Step[];
  currentStep: number;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  onComplete: () => void;
  nextLabel?: string;
  isLastStep: boolean;
  completing?: boolean;
}

export function OnboardingShell({
  role, steps, currentStep, children, onNext, onBack, onComplete,
  nextLabel, isLastStep, completing,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-xs font-medium text-cyan-600 uppercase tracking-widest">Welcome to AK Ultimate Dental</p>
        <h1 className="text-2xl font-bold text-slate-900">{role} Onboarding</h1>
        <p className="text-sm text-slate-500">Step {currentStep + 1} of {steps.length}</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              i < currentStep ? "bg-emerald-500" : i === currentStep ? "bg-cyan-500" : "bg-slate-200"
            )}
          />
        ))}
      </div>

      {/* Step label */}
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-base font-semibold text-slate-900">{steps[currentStep].title}</h2>
        <p className="text-sm text-slate-500">{steps[currentStep].description}</p>
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={onBack}
          disabled={!onBack || currentStep === 0}
          className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-0"
        >
          ← Back
        </button>
        <button
          onClick={isLastStep ? onComplete : onNext}
          disabled={completing}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50",
            isLastStep ? "bg-emerald-600 hover:bg-emerald-700" : "bg-cyan-600 hover:bg-cyan-700"
          )}
        >
          {completing ? "Finishing..." : isLastStep ? (
            <><CheckCircle2 className="h-4 w-4" /> Complete Onboarding</>
          ) : (
            <>{nextLabel || "Next"} <ChevronRight className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
