"use client";

import { useState, useEffect, useCallback } from "react";

const ENGINE_KEY = "ak-dental";

const STORAGE = {
  wizardSeen: `${ENGINE_KEY}-wizard-seen`,
  wizardCompleted: `${ENGINE_KEY}-wizard-completed`,
  setupSteps: `${ENGINE_KEY}-setup-steps`,
  tourDismissed: `${ENGINE_KEY}-tour-dismissed`,
  bannerDismissed: `${ENGINE_KEY}-banner-dismissed`,
  loginCount: `${ENGINE_KEY}-login-count`,
  wizardData: `${ENGINE_KEY}-wizard-data`,
};

export interface WizardData {
  practiceName?: string;
  phone?: string;
  address?: string;
  role?: string;
  teamSize?: string;
  priorities?: string[];
  hipaaAcknowledged?: boolean;
  tcpaAcknowledged?: boolean;
}

export function useOnboarding() {
  const [mounted, setMounted] = useState(false);

  // Setup wizard
  const [showWizard, setShowWizard] = useState(false);
  const [wizardCompleted, setWizardCompleted] = useState(false);

  // Progress banner
  const [setupSteps, setSetupSteps] = useState<string[]>([]);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Tour
  const [tourDismissed, setTourDismissed] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Wizard collected data
  const [wizardData, setWizardDataState] = useState<WizardData>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);

    const wizardSeen = localStorage.getItem(STORAGE.wizardSeen) === "true";
    const wizCompleted = localStorage.getItem(STORAGE.wizardCompleted) === "true";
    const loginCount = parseInt(localStorage.getItem(STORAGE.loginCount) || "0", 10) + 1;
    const steps: string[] = JSON.parse(localStorage.getItem(STORAGE.setupSteps) || "[]");
    const bannerOff = localStorage.getItem(STORAGE.bannerDismissed) === "true";
    const tourOff = localStorage.getItem(STORAGE.tourDismissed) === "true";
    const savedWizardData: WizardData = JSON.parse(localStorage.getItem(STORAGE.wizardData) || "{}");

    // Increment login count
    localStorage.setItem(STORAGE.loginCount, String(loginCount));

    setWizardCompleted(wizCompleted);
    setSetupSteps(steps);
    setBannerDismissed(bannerOff);
    setTourDismissed(tourOff);
    setWizardDataState(savedWizardData);

    // Show wizard: first 3 logins until completed
    if (!wizCompleted && loginCount <= 3) {
      // Small delay so dashboard renders first
      setTimeout(() => setShowWizard(true), 800);
      localStorage.setItem(STORAGE.wizardSeen, "true");
    }
  }, []);

  const completeWizard = useCallback((data: WizardData) => {
    localStorage.setItem(STORAGE.wizardCompleted, "true");
    localStorage.setItem(STORAGE.wizardData, JSON.stringify(data));
    setWizardCompleted(true);
    setWizardDataState(data);
    setShowWizard(false);
  }, []);

  const dismissWizard = useCallback(() => {
    setShowWizard(false);
  }, []);

  const completeStep = useCallback((stepId: string) => {
    setSetupSteps((prev) => {
      if (prev.includes(stepId)) return prev;
      const next = [...prev, stepId];
      localStorage.setItem(STORAGE.setupSteps, JSON.stringify(next));
      return next;
    });
  }, []);

  const dismissBanner = useCallback(() => {
    localStorage.setItem(STORAGE.bannerDismissed, "true");
    setBannerDismissed(true);
  }, []);

  const openTour = useCallback(() => {
    setShowTour(true);
  }, []);

  const closeTour = useCallback(() => {
    localStorage.setItem(STORAGE.tourDismissed, "true");
    setTourDismissed(true);
    setShowTour(false);
  }, []);

  const reopenWizard = useCallback(() => {
    setShowWizard(true);
  }, []);

  return {
    mounted,
    showWizard,
    wizardCompleted,
    setupSteps,
    bannerDismissed,
    tourDismissed,
    showTour,
    wizardData,
    completeWizard,
    dismissWizard,
    completeStep,
    dismissBanner,
    openTour,
    closeTour,
    reopenWizard,
  };
}
