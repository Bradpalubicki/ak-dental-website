import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * GET /api/seo/vitals/summary
 * Returns p75 for LCP, CLS, INP over the last 30 days, plus per-page breakdown.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = await createServerSupabase();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("seo_web_vitals")
      .select("metric_name, metric_value, page, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = data || [];

    const p75 = (name: string): number | null => {
      const vals = rows
        .filter((r) => r.metric_name === name)
        .map((r) => Number(r.metric_value))
        .sort((a, b) => a - b);
      if (vals.length === 0) return null;
      return vals[Math.floor(vals.length * 0.75)];
    };

    const count = (name: string) => rows.filter((r) => r.metric_name === name).length;

    // Per-page p75 for top pages
    const pages = [...new Set(rows.map((r) => r.page))].slice(0, 10);
    const byPage = pages.map((page) => {
      const pageRows = rows.filter((r) => r.page === page);
      const pageP75 = (name: string): number | null => {
        const vals = pageRows
          .filter((r) => r.metric_name === name)
          .map((r) => Number(r.metric_value))
          .sort((a, b) => a - b);
        if (vals.length === 0) return null;
        return vals[Math.floor(vals.length * 0.75)];
      };
      return {
        page,
        lcp: pageP75("LCP"),
        cls: pageP75("CLS"),
        inp: pageP75("INP"),
        samples: pageRows.length,
      };
    });

    // Daily trend for last 7 days (LCP only for sparkline)
    const trend: { date: string; lcp: number | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayVals = rows
        .filter(
          (r) =>
            r.metric_name === "LCP" &&
            r.created_at.startsWith(dateStr)
        )
        .map((r) => Number(r.metric_value))
        .sort((a, b) => a - b);
      trend.push({
        date: dateStr,
        lcp: dayVals.length > 0 ? dayVals[Math.floor(dayVals.length * 0.75)] : null,
      });
    }

    return NextResponse.json({
      summary: {
        lcp: p75("LCP"),
        cls: p75("CLS"),
        inp: p75("INP"),
        samples: {
          lcp: count("LCP"),
          cls: count("CLS"),
          inp: count("INP"),
        },
      },
      byPage,
      trend,
      since,
    });
  } catch {
    // Table may not exist yet
    return NextResponse.json({
      summary: { lcp: null, cls: null, inp: null, samples: { lcp: 0, cls: 0, inp: 0 } },
      byPage: [],
      trend: [],
      since: null,
    });
  }
}
