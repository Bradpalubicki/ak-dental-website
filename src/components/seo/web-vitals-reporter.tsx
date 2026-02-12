"use client";

import { useEffect } from "react";

/**
 * Web Vitals Reporter
 *
 * Client component that measures Core Web Vitals (LCP, CLS, INP, FCP, TTFB)
 * and beacons them to /api/seo/vitals for tracking.
 */
export function WebVitalsReporter() {
  useEffect(() => {
    async function reportVitals() {
      try {
        const { onLCP, onCLS, onINP, onFCP, onTTFB } = await import(
          "web-vitals"
        );

        const sendVital = (metric: { name: string; value: number; id: string }) => {
          const body = JSON.stringify({
            name: metric.name,
            value: metric.value,
            id: metric.id,
            page: window.location.pathname,
            timestamp: Date.now(),
          });

          // Use sendBeacon for reliability (fires even on page unload)
          if (navigator.sendBeacon) {
            navigator.sendBeacon("/api/seo/vitals", body);
          } else {
            fetch("/api/seo/vitals", {
              method: "POST",
              body,
              keepalive: true,
            });
          }
        };

        onLCP(sendVital);
        onCLS(sendVital);
        onINP(sendVital);
        onFCP(sendVital);
        onTTFB(sendVital);
      } catch {
        // web-vitals not available, silently ignore
      }
    }

    reportVitals();
  }, []);

  return null;
}
