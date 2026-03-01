import { redirect } from "next/navigation";

// Staff onboarding is managed under HR
export default function OnboardingRedirectPage() {
  redirect("/dashboard/hr/onboarding");
}
