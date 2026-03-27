"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    Plain?: {
      init: (config: Record<string, unknown>) => void;
      identify: (customer: Record<string, unknown>) => void;
    };
  }
}

export function PlainWidget() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PLAIN_APP_ID) return;

    const script = document.createElement("script");
    script.src = "https://chat.plain.com/getPlainChat.js";
    script.async = true;
    script.onload = async () => {
      if (!window.Plain) return;

      const config: Record<string, unknown> = {
        appId: process.env.NEXT_PUBLIC_PLAIN_APP_ID,
      };

      if (isSignedIn && user) {
        try {
          const res = await fetch("/api/plain-jwt");
          if (res.ok) {
            const { customerJwt } = await res.json();
            config.customerJwt = customerJwt;
          }
        } catch {
          // widget still loads unauthenticated
        }
      }

      window.Plain.init(config);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isSignedIn, user]);

  return null;
}
