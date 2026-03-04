"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OwnerDentistOnboarding } from "./owner-dentist";
import { AssociateDentistOnboarding } from "./associate-dentist";
import { OfficeManagerOnboarding } from "./office-manager";
import { FrontDeskOnboarding } from "./front-desk";
import { DentalAssistantOnboarding } from "./dental-assistant";

export default function RoleSetupPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const role = (user?.publicMetadata as Record<string, string>)?.role;
  const onboardingComplete = (user?.publicMetadata as Record<string, boolean>)?.onboarding_complete;

  useEffect(() => {
    if (!isLoaded) return;
    if (onboardingComplete) {
      router.replace("/dashboard");
      return;
    }
    const t = setTimeout(() => setChecking(false), 0);
    return () => clearTimeout(t);
  }, [isLoaded, onboardingComplete, router]);

  if (checking || !isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-slate-400 text-sm">Loading your onboarding...</div>
      </div>
    );
  }

  async function handleComplete() {
    await fetch("/api/onboarding/complete", { method: "POST" });
    router.replace("/dashboard");
  }

  if (role === "owner-dentist") return <OwnerDentistOnboarding onComplete={handleComplete} />;
  if (role === "associate-dentist") return <AssociateDentistOnboarding onComplete={handleComplete} />;
  if (role === "office-manager") return <OfficeManagerOnboarding onComplete={handleComplete} />;
  if (role === "front-desk") return <FrontDeskOnboarding onComplete={handleComplete} />;
  if (role === "dental-assistant") return <DentalAssistantOnboarding onComplete={handleComplete} />;

  // No role set — send to dashboard
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <p className="text-slate-600">Your role hasn&apos;t been assigned yet. Please contact your administrator.</p>
      <button onClick={() => router.replace("/dashboard")} className="bg-cyan-600 text-white px-6 py-2 rounded-lg text-sm">
        Go to Dashboard
      </button>
    </div>
  );
}
