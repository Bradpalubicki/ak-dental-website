"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/ak-logo-gold.jpg",
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorPrimary: "#0891b2",
          colorTextOnPrimaryBackground: "#ffffff",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
