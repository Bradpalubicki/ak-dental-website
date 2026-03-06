import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";
import Anthropic from "@anthropic-ai/sdk";

/**
 * POST /api/seo/reports/generate
 * Manually triggers an SEO report for the current or previous month.
 * Generates an AI narrative and stores it in seo_reports.
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = await createServerSupabase();

    const now = new Date();
    // Generate for previous month by default
    const reportMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthStr = reportMonth.toISOString().slice(0, 7);
    const startDate = `${monthStr}-01`;
    const endDate = new Date(reportMonth.getFullYear(), reportMonth.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    // Check if report already exists for this month
    const { data: existing } = await supabase
      .from("seo_reports")
      .select("id, narrative")
      .eq("report_month", startDate)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Gather data
    const [keywordsRes, vitalsRes, auditRes, gscRes] = await Promise.all([
      supabase
        .from("seo_keywords")
        .select("keyword, current_rank, previous_rank, best_rank, category")
        .eq("is_active", true),
      supabase
        .from("seo_web_vitals")
        .select("metric_name, metric_value")
        .gte("created_at", startDate)
        .lte("created_at", endDate),
      supabase
        .from("seo_audits")
        .select("overall_score, issues_critical, issues_warning")
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("seo_search_console_data")
        .select("clicks, impressions, ctr, position")
        .gte("date", startDate)
        .lte("date", endDate),
    ]);

    const keywords = keywordsRes.data || [];
    const vitalsData = vitalsRes.data || [];
    const audit = auditRes.data;
    const gscData = gscRes.data || [];

    const vitalAvg = (name: string) => {
      const vals = vitalsData.filter((v) => v.metric_name === name).map((v) => Number(v.metric_value));
      if (!vals.length) return null;
      vals.sort((a, b) => a - b);
      return vals[Math.floor(vals.length * 0.75)];
    };

    const totalClicks = gscData.reduce((s, r) => s + (r.clicks || 0), 0);
    const totalImpressions = gscData.reduce((s, r) => s + (r.impressions || 0), 0);
    const avgCtr = gscData.length ? gscData.reduce((s, r) => s + (r.ctr || 0), 0) / gscData.length : 0;
    const avgPosition = gscData.length ? gscData.reduce((s, r) => s + (r.position || 0), 0) / gscData.length : 0;

    const improvedKeywords = keywords.filter(
      (k) => k.current_rank && k.previous_rank && k.current_rank < k.previous_rank
    );
    const droppedKeywords = keywords.filter(
      (k) => k.current_rank && k.previous_rank && k.current_rank > k.previous_rank
    );
    const top10Keywords = keywords.filter((k) => k.current_rank && k.current_rank <= 10);

    // Generate AI narrative
    let narrative = "";
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      const client = new Anthropic({ apiKey });
      const prompt = `You are an SEO analyst writing a monthly performance summary for ${siteConfig.name} (${siteConfig.url}).

Write a concise 3-paragraph executive summary for ${new Date(startDate + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric" })}:

DATA:
- Audit score: ${audit?.overall_score ?? "N/A"}/100 (${audit?.issues_critical ?? 0} critical, ${audit?.issues_warning ?? 0} warnings)
- Google Search Console: ${totalClicks} clicks, ${totalImpressions} impressions, ${(avgCtr * 100).toFixed(1)}% CTR, position ${avgPosition.toFixed(1)} avg
- Keywords tracked: ${keywords.length} total, ${top10Keywords.length} in top 10, ${improvedKeywords.length} improved, ${droppedKeywords.length} dropped
- Core Web Vitals: LCP ${vitalAvg("LCP") ? (vitalAvg("LCP")! / 1000).toFixed(1) + "s" : "N/A"}, CLS ${vitalAvg("CLS")?.toFixed(3) ?? "N/A"}, INP ${vitalAvg("INP") ? vitalAvg("INP")! + "ms" : "N/A"}
- Top improved keywords: ${improvedKeywords.slice(0, 3).map((k) => `${k.keyword} (#${k.current_rank})`).join(", ") || "None"}

Paragraph 1: Overall performance summary — what the numbers mean in plain English.
Paragraph 2: What improved and what needs attention.
Paragraph 3: Recommended focus for next month (2-3 specific actions).

Write for a dental practice owner, not a developer. No markdown, no headers, just 3 paragraphs.`;

      const msg = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      });
      narrative = (msg.content[0] as { type: string; text: string }).text || "";
    }

    // Upsert report
    if (existing) {
      await supabase
        .from("seo_reports")
        .update({ narrative, overall_score: audit?.overall_score ?? null })
        .eq("id", existing.id);
      return NextResponse.json({ success: true, id: existing.id, narrative, month: monthStr });
    }

    const { data: newReport } = await supabase
      .from("seo_reports")
      .insert({
        report_month: startDate,
        overall_score: audit?.overall_score ?? null,
        narrative,
      })
      .select("id")
      .single();

    return NextResponse.json({ success: true, id: newReport?.id, narrative, month: monthStr });
  } catch (error) {
    return NextResponse.json(
      { error: "Report generation failed", message: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
