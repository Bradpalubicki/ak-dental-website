import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";

const PSI_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CACHE_HOURS = 24;

interface LighthouseAudit {
  numericValue?: number;
  displayValue?: string;
  title?: string;
  description?: string;
}

interface LighthouseResult {
  categories?: { performance?: { score?: number } };
  audits?: Record<string, LighthouseAudit>;
}

interface PSIResponse {
  lighthouseResult?: LighthouseResult;
  error?: { message?: string };
}

function extractMetrics(lr: LighthouseResult) {
  const a = lr.audits ?? {};
  return {
    performance_score: Math.round((lr.categories?.performance?.score ?? 0) * 100),
    lcp: a["largest-contentful-paint"]?.numericValue ?? null,
    cls: a["cumulative-layout-shift"]?.numericValue ?? null,
    inp: a["interaction-to-next-paint"]?.numericValue ?? null,
    fcp: a["first-contentful-paint"]?.numericValue ?? null,
    ttfb: a["server-response-time"]?.numericValue ?? null,
    speed_index: a["speed-index"]?.numericValue ?? null,
    opportunities: Object.entries(a)
      .filter(([, v]) => v.numericValue !== undefined && v.numericValue > 0 && v.displayValue)
      .filter(([id]) =>
        [
          "render-blocking-resources",
          "unused-css-rules",
          "unused-javascript",
          "uses-optimized-images",
          "uses-webp-images",
          "uses-responsive-images",
          "efficiently-encode-images",
          "uses-text-compression",
          "uses-rel-preconnect",
          "time-to-first-byte",
        ].includes(id)
      )
      .slice(0, 5)
      .map(([id, v]) => ({
        id,
        title: v.title ?? id,
        displayValue: v.displayValue ?? "",
        numericValue: v.numericValue ?? 0,
      })),
  };
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabase();
  const siteUrl = siteConfig.url;
  const apiKey = process.env.PAGESPEED_API_KEY ?? "";

  // Check cache — return last result if within 24h
  const since = new Date(Date.now() - CACHE_HOURS * 60 * 60 * 1000).toISOString();
  const { data: cached } = await supabase
    .from("seo_pagespeed_scores")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(2);

  const hasMobile = cached?.some((r) => r.strategy === "mobile");
  const hasDesktop = cached?.some((r) => r.strategy === "desktop");

  if (hasMobile && hasDesktop) {
    return NextResponse.json({
      mobile: cached!.find((r) => r.strategy === "mobile"),
      desktop: cached!.find((r) => r.strategy === "desktop"),
      cached: true,
      cachedAt: cached![0].created_at,
    });
  }

  return NextResponse.json({
    mobile: null,
    desktop: null,
    cached: false,
    needsRun: true,
  });
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabase();
  const siteUrl = siteConfig.url;
  const apiKey = process.env.PAGESPEED_API_KEY ?? "";

  try {
    const [mobileRes, desktopRes] = await Promise.all([
      fetch(
        `${PSI_API}?url=${encodeURIComponent(siteUrl)}&strategy=mobile${apiKey ? `&key=${apiKey}` : ""}`,
        { signal: AbortSignal.timeout(30_000) }
      ),
      fetch(
        `${PSI_API}?url=${encodeURIComponent(siteUrl)}&strategy=desktop${apiKey ? `&key=${apiKey}` : ""}`,
        { signal: AbortSignal.timeout(30_000) }
      ),
    ]);

    const [mobileData, desktopData]: [PSIResponse, PSIResponse] = await Promise.all([
      mobileRes.json(),
      desktopRes.json(),
    ]);

    if (mobileData.error) throw new Error(mobileData.error.message ?? "PSI mobile error");
    if (desktopData.error) throw new Error(desktopData.error.message ?? "PSI desktop error");

    const mobileMetrics = extractMetrics(mobileData.lighthouseResult!);
    const desktopMetrics = extractMetrics(desktopData.lighthouseResult!);

    const [{ data: mobileRow }, { data: desktopRow }] = await Promise.all([
      supabase
        .from("seo_pagespeed_scores")
        .insert({ url: siteUrl, strategy: "mobile", ...mobileMetrics })
        .select()
        .single(),
      supabase
        .from("seo_pagespeed_scores")
        .insert({ url: siteUrl, strategy: "desktop", ...desktopMetrics })
        .select()
        .single(),
    ]);

    return NextResponse.json({
      mobile: mobileRow,
      desktop: desktopRow,
      cached: false,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PageSpeed test failed" },
      { status: 500 }
    );
  }
}
