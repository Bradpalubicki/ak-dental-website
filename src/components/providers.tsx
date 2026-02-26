"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

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
      <Toaster richColors position="top-right" />
    </ClerkProvider>
  );
}
