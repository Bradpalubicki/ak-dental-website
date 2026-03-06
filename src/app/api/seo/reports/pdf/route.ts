import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return new NextResponse("Missing id", { status: 400 });

  try {
    const supabase = await createServerSupabase();

    const { data: report } = await supabase
      .from("seo_reports")
      .select("id, report_month, overall_score, narrative, created_at")
      .eq("id", id)
      .single();

    if (!report) return new NextResponse("Not found", { status: 404 });

    const [keywordsRes, auditRes, gscRes] = await Promise.all([
      supabase
        .from("seo_keywords")
        .select("keyword, current_rank, previous_rank, category")
        .eq("is_active", true)
        .order("current_rank", { ascending: true })
        .limit(20),
      supabase
        .from("seo_audits")
        .select("overall_score, issues_critical, issues_warning")
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("seo_search_console_data")
        .select("clicks, impressions, position")
        .gte("date", report.report_month)
        .lte("date", new Date(
          new Date(report.report_month).getFullYear(),
          new Date(report.report_month).getMonth() + 1,
          0
        ).toISOString().split("T")[0]),
    ]);

    const keywords = keywordsRes.data || [];
    const audit = auditRes.data;
    const gscData = gscRes.data || [];

    type GscRow = { clicks: number; impressions: number; position: number };
    const totalClicks = gscData.reduce((s: number, r: GscRow) => s + (r.clicks || 0), 0);
    const totalImpressions = gscData.reduce((s: number, r: GscRow) => s + (r.impressions || 0), 0);
    const avgPosition = gscData.length
      ? (gscData.reduce((s: number, r: GscRow) => s + (r.position || 0), 0) / gscData.length).toFixed(1)
      : "N/A";

    const monthLabel = new Date(report.report_month + "T12:00:00Z").toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const scoreColor = (() => {
      if (!report.overall_score) return "#64748b";
      if (report.overall_score >= 80) return "#16a34a";
      if (report.overall_score >= 60) return "#d97706";
      return "#dc2626";
    })();

    type KwRow = { keyword: string; category: string | null; current_rank: number | null; previous_rank: number | null };
    const rankBadge = (cur: number | null, prev: number | null): string => {
      if (!cur || !prev) return "";
      const diff = prev - cur;
      if (diff > 0) return "<span style=\"color:#16a34a\">+" + diff + "</span>";
      if (diff < 0) return "<span style=\"color:#dc2626\">" + diff + "</span>";
      return "";
    };

    const kwRows = keywords
      .map((k: KwRow) =>
        "<tr><td>" + k.keyword + "</td><td style=\"color:#64748b\">" + (k.category ?? "") + "</td>" +
        "<td style=\"text-align:center;font-weight:600\">" + (k.current_rank ?? "?") + "</td>" +
        "<td style=\"text-align:center\">" + rankBadge(k.current_rank, k.previous_rank) + "</td></tr>"
      )
      .join("");

    const narrativeHtml = report.narrative
      ? report.narrative.split("\n\n").map((p: string) => "<p>" + p + "</p>").join("")
      : "";

    const genDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const parts = [
      "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"/>",
      "<title>SEO Report - " + monthLabel + " - " + siteConfig.name + "</title>",
      "<style>",
      "*{box-sizing:border-box;margin:0;padding:0}",
      "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;background:#fff;padding:40px;max-width:900px;margin:0 auto}",
      "h1{font-size:22px;font-weight:700}h2{font-size:13px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px}",
      ".hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e2e8f0;padding-bottom:20px;margin-bottom:28px}",
      ".hdr p{color:#64748b;font-size:13px;margin-top:4px}",
      ".grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}",
      ".card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px}",
      ".cv{font-size:20px;font-weight:700;color:#0f172a}.cl{font-size:11px;color:#64748b;margin-top:2px}",
      ".sec{margin-bottom:28px}",
      ".narr{font-size:13px;line-height:1.7;color:#334155;background:#f8fafc;border-left:3px solid #0891b2;padding:16px 20px;border-radius:0 8px 8px 0}",
      ".narr p+p{margin-top:12px}",
      "table{width:100%;border-collapse:collapse;font-size:12px}",
      "th{background:#f1f5f9;text-align:left;padding:8px 12px;font-size:11px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:.04em}",
      "td{padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#334155}",
      "tr:last-child td{border-bottom:none}",
      ".ftr{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;display:flex;justify-content:space-between}",
      "@media print{.np{display:none}}",
      "</style></head><body>",
      "<div class=\"hdr\">",
      "<div><h1>SEO Performance Report</h1><p>" + monthLabel + " &middot; " + siteConfig.name + "</p><p>" + siteConfig.url + "</p></div>",
      "<div style=\"width:72px;height:72px;border-radius:50%;border:3px solid " + scoreColor + ";display:flex;align-items:center;justify-content:center;flex-direction:column\">",
      "<span style=\"font-size:22px;font-weight:700;color:" + scoreColor + "\">" + (report.overall_score ?? "?") + "</span>",
      "<span style=\"font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.05em\">Score</span>",
      "</div></div>",
      "<div class=\"grid\">",
      "<div class=\"card\"><div class=\"cv\">" + totalClicks.toLocaleString() + "</div><div class=\"cl\">Search Clicks</div></div>",
      "<div class=\"card\"><div class=\"cv\">" + totalImpressions.toLocaleString() + "</div><div class=\"cl\">Impressions</div></div>",
      "<div class=\"card\"><div class=\"cv\">" + avgPosition + "</div><div class=\"cl\">Avg Position</div></div>",
      "<div class=\"card\"><div class=\"cv\">" + (audit?.issues_critical ?? "?") + "</div><div class=\"cl\">Critical Issues</div></div>",
      "</div>",
      narrativeHtml ? "<div class=\"sec\"><h2>Executive Summary</h2><div class=\"narr\">" + narrativeHtml + "</div></div>" : "",
      kwRows ? "<div class=\"sec\"><h2>Keyword Rankings</h2><table><thead><tr><th>Keyword</th><th>Category</th><th style=\"text-align:center\">Rank</th><th style=\"text-align:center\">Change</th></tr></thead><tbody>" + kwRows + "</tbody></table></div>" : "",
      "<div class=\"ftr\"><span>Generated " + genDate + "</span><span>NuStack Digital Ventures</span></div>",
      "<div class=\"np\" style=\"margin-top:32px;text-align:center\">",
      "<button onclick=\"window.print()\" style=\"background:#0891b2;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer\">Print / Save as PDF</button>",
      "</div></body></html>",
    ];

    const html = parts.join("");

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch {
    return new NextResponse("Failed to generate report", { status: 500 });
  }
}
