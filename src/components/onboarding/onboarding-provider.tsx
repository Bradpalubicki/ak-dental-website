"use client";

import { useOnboarding } from "@/hooks/useOnboarding";
import { SetupWizard } from "@/components/onboarding/setup-wizard";
import { OnboardingBanner } from "@/components/onboarding/onboarding-banner";
import { GuidedTour } from "@/components/onboarding/guided-tour";
import { TourTrigger } from "@/components/onboarding/tour-trigger";
import { dashboardTourConfig } from "@/config/onboarding-config";

/**
 * OnboardingProvider
 * Drop this anywhere inside the dashboard layout (client side).
 * It orchestrates the Setup Wizard, Progress Banner, Tour, and Tour Trigger.
 */
export function OnboardingProvider() {
  const {
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
  } = useOnboarding();

  // Don't render anything server-side or before hydration
  if (!mounted) return null;

  const showBanner = !bannerDismissed && !wizardCompleted && setupSteps.length < 7;

  return (
    <>
      {/* Progress banner — shown until setup complete or dismissed */}
      {showBanner && (
        <OnboardingBanner
          completedSteps={setupSteps}
          onDismiss={dismissBanner}
          onReopenWizard={reopenWizard}
        />
      )}

      {/* Setup Wizard — full-screen modal, first 3 logins */}
      {showWizard && (
        <SetupWizard
          onComplete={(data) => {
            completeWizard(data);
            // Mark compliance steps as done automatically
            if (data.hipaaAcknowledged) completeStep("review-compliance");
          }}
          onDismiss={dismissWizard}
          initialData={wizardData}
        />
      )}

      {/* Guided Tour — on-demand */}
      {showTour && (
        <GuidedTour
          sections={dashboardTourConfig}
          onClose={() => {
            closeTour();
            completeStep("take-tour");
          }}
        />
      )}

      {/* Tour trigger button — always visible */}
      <TourTrigger onClick={openTour} tourDismissed={tourDismissed} />
    </>
  );
}
