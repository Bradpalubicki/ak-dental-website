"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  AlertCircle,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types (exported for config file) ────────────────────────────────────────

export interface TourStep {
  id: string;
  title: string;
  description: string;
  benefit: string;
  painPoint?: string;
}

export interface TourSection {
  id: string;
  sectionTitle: string;
  icon?: string;
  route?: string;
  steps: TourStep[];
}

interface GuidedTourProps {
  sections: TourSection[];
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GuidedTour({ sections, onClose }: GuidedTourProps) {
  const router = useRouter();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(false);

  // Flat list for global progress
  const allSteps = sections.flatMap((s) => s.steps.map((st) => ({ ...st, sectionTitle: s.sectionTitle })));
  const globalIdx = sections.slice(0, sectionIdx).reduce((acc, s) => acc + s.steps.length, 0) + stepIdx;
  const totalSteps = allSteps.length;

  const currentSection = sections[sectionIdx];
  const currentStep = currentSection?.steps[stepIdx];
  const isFirstStep = sectionIdx === 0 && stepIdx === 0;
  const isLastStep = sectionIdx === sections.length - 1 && stepIdx === currentSection.steps.length - 1;

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Navigate to section route when section changes
  useEffect(() => {
    const route = currentSection?.route;
    if (route) {
      const path = route.startsWith("/") ? route : `/dashboard/${route}`;
      router.push(path);
    }
  }, [sectionIdx, currentSection?.route, router]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  const currentSectionStepCount = currentSection?.steps.length ?? 0;

  const goNext = useCallback(() => {
    if (transitioning) return;

    if (stepIdx < currentSectionStepCount - 1) {
      setStepIdx((s) => s + 1);
    } else if (sectionIdx < sections.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setSectionIdx((s) => s + 1);
        setStepIdx(0);
        setTransitioning(false);
      }, 300);
    } else {
      handleClose();
    }
  }, [transitioning, stepIdx, currentSectionStepCount, sectionIdx, sections.length, handleClose]);

  const goBack = useCallback(() => {
    if (transitioning) return;
    if (stepIdx > 0) {
      setStepIdx((s) => s - 1);
    } else if (sectionIdx > 0) {
      const prevSection = sections[sectionIdx - 1];
      setSectionIdx((s) => s - 1);
      setStepIdx(prevSection.steps.length - 1);
    }
  }, [transitioning, stepIdx, sectionIdx, sections]);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay) return;
    const delay = Math.max(8000, 50 * (currentStep?.description.length ?? 0));
    const timer = setTimeout(goNext, delay);
    return () => clearTimeout(timer);
  }, [autoPlay, sectionIdx, stepIdx, goNext, currentStep?.description.length]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "Enter") goNext();
      if (e.key === "ArrowLeft") goBack();
      if (e.key === "Escape") handleClose();
      if (e.key === " ") { e.preventDefault(); setAutoPlay((a) => !a); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goBack]);

  if (!currentStep) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 transition-all duration-250 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Global progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${((globalIdx + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Section indicator */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {sections.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                  i === sectionIdx
                    ? "bg-cyan-100 text-cyan-700 font-semibold"
                    : i < sectionIdx
                    ? "text-slate-400"
                    : "text-slate-300"
                }`}
              >
                {s.icon && <span>{s.icon}</span>}
                <span className="hidden sm:inline">{s.sectionTitle}</span>
                {i < sectionIdx && <span className="text-cyan-400">✓</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">
              {globalIdx + 1} / {totalSteps}
            </span>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-5">
          <div className="flex items-start gap-3 mb-4">
            {currentSection.icon && (
              <span className="text-2xl shrink-0 mt-0.5">{currentSection.icon}</span>
            )}
            <div>
              <p className="text-xs font-medium text-cyan-600 uppercase tracking-wider mb-1">
                {currentSection.sectionTitle}
              </p>
              <h3 className="text-lg font-bold text-slate-900">{currentStep.title}</h3>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">{currentStep.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                <p className="text-xs font-semibold text-amber-800">Why This Matters</p>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">{currentStep.benefit}</p>
            </div>

            {currentStep.painPoint && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
                  <p className="text-xs font-semibold text-slate-600">Without This</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{currentStep.painPoint}</p>
              </div>
            )}
          </div>

          {/* Step dots within section */}
          {currentSection.steps.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {currentSection.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === stepIdx ? "w-4 bg-cyan-500" : i < stepIdx ? "w-1.5 bg-cyan-300" : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            disabled={isFirstStep}
            className="gap-1.5 text-slate-500"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoPlay((a) => !a)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                autoPlay
                  ? "bg-cyan-100 text-cyan-700"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
              title="Toggle auto-play (Space)"
            >
              {autoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              <span className="hidden sm:inline">{autoPlay ? "Pause" : "Auto"}</span>
            </button>

            <Button
              size="sm"
              onClick={goNext}
              className="gap-1.5 bg-cyan-500 hover:bg-cyan-600"
            >
              {isLastStep ? "Finish Tour" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="px-6 pb-3 text-center">
          <p className="text-[10px] text-slate-300">
            ← → Navigate · Space Auto-play · Esc Close
          </p>
        </div>
      </div>
    </div>
  );
}
