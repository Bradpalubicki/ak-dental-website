"use client";

import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function StickyEmergencyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-red-600 text-white py-3 px-4 shadow-2xl">
      <a
        href={siteConfig.phoneHref}
        className="flex items-center justify-center gap-3 font-bold text-base"
      >
        <Phone className="h-5 w-5" />
        <span>Dental Emergency? Call {siteConfig.phone}</span>
      </a>
    </div>
  );
}
