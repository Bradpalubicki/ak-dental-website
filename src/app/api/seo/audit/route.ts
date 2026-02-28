import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * GET /api/seo/audit — Returns latest audit record + issue breakdown
 * POST /api/seo/audit — Triggers a live audit scan (calls seo-auto-fix logic inline)
 */

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = await createServerSupabase();

    const { data: latest } = await supabase
      .from("seo_audits")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { data: history } = await supabase
      .from("seo_audits")
      .select("overall_score, issues_critical, issues_warning, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({ latest: latest || null, history: history || [] });
  } catch {
    return NextResponse.json({ latest: null, history: [] });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Forward to the cron endpoint with the internal secret
    const cronSecret = process.env.CRON_SECRET || "";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ak-ultimate-dental.vercel.app";

    const res = await fetch(`${baseUrl}/api/cron/seo-auto-fix`, {
      headers: { Authorization: `Bearer ${cronSecret}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Audit failed", status: res.status }, { status: 500 });
    }

    const data = await res.json();

    // Persist to seo_audits
    const supabase = await createServerSupabase();
    const report = data.report;
    if (report) {
      const issues = report.fixes || [];
      const critical = issues.filter((f: { issue: { type: string } }) =>
        f.issue.type === "schema" || f.issue.type === "meta"
      ).length;
      const warnings = issues.filter((f: { issue: { type: string } }) =>
        f.issue.type === "image" || f.issue.type === "performance"
      ).length;
      const score = Math.max(0, 100 - critical * 10 - warnings * 3);

      await supabase.from("seo_audits").insert({
        overall_score: score,
        issues_critical: critical,
        issues_warning: warnings,
        issues_detail: issues,
      });
    }

    return NextResponse.json({ success: true, report: data.report });
  } catch (err) {
    return NextResponse.json(
      { error: "Audit error", message: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}
