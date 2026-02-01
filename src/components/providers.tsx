"use client";

import { ClerkProvider } from "@clerk/nextjs";

const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = CLERK_KEY && !CLERK_KEY.includes("PLACEHOLDER");

export function Providers({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured) {
    return <ClerkProvider>{children}</ClerkProvider>;
  }
  return <>{children}</>;
}
