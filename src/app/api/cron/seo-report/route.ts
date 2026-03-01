/**
 * Monthly SEO Report Cron (Engine Template)
 *
 * Generates and sends monthly SEO performance report.
 * Aggregates: GSC data, Web Vitals, audit scores, keyword changes.
 * Sends to client email(s) + NuStack internal copy.
 *
 * Schedule: Monthly on 1st at 9 AM UTC
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";
import {
  generateMonthlyReportHtml,
  generateReportSubject,
  type MonthlyReportData,
} from "@/lib/seo/report-generator";
import { verifyCronSecret } from "@/lib/cron-auth";

export async function GET(request: NextRequest) {
  const auth = verifyCronSecret(request);
  if (!auth.valid) return auth.response!;

  try {
    const supabase = await createServerSupabase();

    // Determine report month (previous month)
    const now = new Date();
    const reportMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthStr = reportMonth.toISOString().slice(0, 7); // "2026-01"
    const startDate = `${monthStr}-01`;
    const endDate = new Date(
      reportMonth.getFullYear(),
      reportMonth.getMonth() + 1,
      0
    )
      .toISOString()
      .split("T")[0];

    // Fetch keywords
    const { data: keywords } = await supabase
      .from("seo_keywords")
      .select("keyword, current_rank, previous_rank, best_rank, category")
      .eq("is_active", true);

    // Fetch Web Vitals averages for the month
    const { data: vitalsData } = await supabase
      .from("seo_web_vitals")
      .select("metric_name, metric_value")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    const vitalAvg = (name: string): number | null => {
      const vals = (vitalsData || [])
        .filter((v) => v.metric_name === name)
        .map((v) => Number(v.metric_value));
      if (vals.length === 0) return null;
      // Use p75 (75th percentile) as recommended by Google
      vals.sort((a, b) => a - b);
      return vals[Math.floor(vals.length * 0.75)];
    };

    // Fetch latest audit
    const { data: latestAudit } = await supabase
      .from("seo_audits")
      .select("overall_score, issues_critical, issues_warning")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Fetch GSC data for the month
    const { data: gscData } = await supabase
      .from("seo_search_console_data")
      .select("clicks, impressions, ctr, position")
      .gte("date", startDate)
      .lte("date", endDate);

    const totalClicks = (gscData || []).reduce(
      (sum, r) => sum + (r.clicks || 0),
      0
    );
    const totalImpressions = (gscData || []).reduce(
      (sum, r) => sum + (r.impressions || 0),
      0
    );
    const avgCtr =
      gscData && gscData.length > 0
        ? gscData.reduce((sum, r) => sum + (r.ctr || 0), 0) / gscData.length
        : 0;
    const avgPosition =
      gscData && gscData.length > 0
        ? gscData.reduce((sum, r) => sum + (r.position || 0), 0) /
          gscData.length
        : 0;

    // Build report data
    const reportData: MonthlyReportData = {
      month: monthStr,
      practiceName: siteConfig.name,
      siteUrl: siteConfig.url,
      keywords: (keywords || []).map((k) => ({
        keyword: k.keyword,
        currentRank: k.current_rank,
        previousRank: k.previous_rank,
        bestRank: k.best_rank,
        category: k.category,
      })),
      vitals: {
        lcp: vitalAvg("LCP"),
        cls: vitalAvg("CLS"),
        inp: vitalAvg("INP"),
      },
      auditScore: latestAudit?.overall_score || null,
      issuesCritical: latestAudit?.issues_critical || 0,
      issuesWarning: latestAudit?.issues_warning || 0,
      gscData: {
        totalClicks,
        totalImpressions,
        avgCtr,
        avgPosition,
      },
    };

    // Generate HTML report
    const htmlReport = generateMonthlyReportHtml(reportData);
    const subject = generateReportSubject(reportData);

    // Store report record
    await supabase.from("seo_reports").insert({
      report_month: startDate,
      overall_score: reportData.auditScore,
    });

    // Send email
    const apiKey = process.env.RESEND_API_KEY;
    const alertEmail =
      process.env.SEO_ALERT_EMAIL || "brad@nustack.com";
    const clientEmail = siteConfig.email;

    if (apiKey) {
      const recipients = [alertEmail];
      if (clientEmail && clientEmail !== alertEmail) {
        recipients.push(clientEmail);
      }

      const domain = new URL(siteConfig.url).hostname;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `SEO Report <report@${domain}>`,
          to: recipients,
          subject,
          html: htmlReport,
        }),
      });

      // Mark as sent
      const { data: reportRow } = await supabase
        .from("seo_reports")
        .select("id")
        .eq("report_month", startDate)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (reportRow) {
        await supabase
          .from("seo_reports")
          .update({
            sent_to_client: true,
            sent_at: new Date().toISOString(),
          })
          .eq("id", reportRow.id);
      }

      void monthStr; // report sent
    }

    return NextResponse.json({
      success: true,
      month: monthStr,
      keywordsTracked: reportData.keywords.length,
      gscClicks: totalClicks,
      gscImpressions: totalImpressions,
    });
  } catch (error) {
    console.error("SEO report generation failed:", error);
    return NextResponse.json(
      {
        error: "Report generation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
