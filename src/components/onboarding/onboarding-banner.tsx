"use client";

import Link from "next/link";
import { Rocket, X, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { SETUP_STEPS } from "@/config/onboarding-config";

interface OnboardingBannerProps {
  completedSteps: string[];
  onDismiss: () => void;
  onReopenWizard: () => void;
}

export function OnboardingBanner({ completedSteps, onDismiss, onReopenWizard }: OnboardingBannerProps) {
  const completedSet = new Set(completedSteps);
  const essentialSteps = SETUP_STEPS.filter((s) => s.category === "essential");
  const progress = Math.round((completedSet.size / SETUP_STEPS.length) * 100);
  const essentialDone = essentialSteps.every((s) => completedSet.has(s.id));

  const nextStep = SETUP_STEPS.find((s) => !completedSet.has(s.id));

  return (
    <div className="mb-5 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <p className="text-sm font-semibold text-cyan-900">
                Setup Assistant — {progress}% complete
              </p>
              <div className="hidden sm:flex h-1.5 w-32 rounded-full bg-cyan-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {essentialDone && (
                <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                  Essentials done ✓
                </span>
              )}
            </div>
            {nextStep && (
              <p className="text-xs text-cyan-700 truncate">
                Next:{" "}
                {nextStep.href === "#tour" ? (
                  <button onClick={() => {}} className="underline hover:text-cyan-900">
                    {nextStep.label}
                  </button>
                ) : (
                  <Link href={nextStep.href} className="underline hover:text-cyan-900">
                    {nextStep.label}
                  </Link>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {nextStep && nextStep.href !== "#tour" && (
            <Link
              href={nextStep.href}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-600 transition-colors"
            >
              Continue
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
          <button
            onClick={onReopenWizard}
            className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-800 transition-colors whitespace-nowrap"
          >
            <ChevronRight className="h-3 w-3" />
            Setup Wizard
          </button>
          <Link
            href="#"
            onClick={(e) => { e.preventDefault(); }}
            className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-800 transition-colors"
          >
            <CheckCircle2 className="h-3 w-3" />
            View all
          </Link>
          <button
            onClick={onDismiss}
            className="p-1 rounded hover:bg-cyan-100 text-cyan-400 hover:text-cyan-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Step dots */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {SETUP_STEPS.map((step) => {
          const done = completedSet.has(step.id);
          return (
            <div
              key={step.id}
              title={step.label}
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs whitespace-nowrap transition-all ${
                done
                  ? "bg-cyan-200 text-cyan-800"
                  : "bg-white border border-slate-200 text-slate-400"
              }`}
            >
              {done ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-slate-300" />}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
