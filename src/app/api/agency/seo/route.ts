import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * GET /api/agency/seo
 * Called by Agency Engine to get cross-client SEO summary.
 * No Clerk auth — uses AGENCY_SECRET header for M2M auth.
 */
export async function GET(request: Request) {
  const secret = request.headers.get("x-agency-secret");
  if (!secret || secret !== process.env.AGENCY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServerSupabase();

  const [kwRes, clusterRes, blogRes, auditRes, gscRes] = await Promise.all([
    supabase
      .from("seo_keywords")
      .select("id, keyword, current_rank, previous_rank, search_volume, cluster_id, is_active")
      .eq("is_active", true),
    supabase
      .from("seo_keyword_clusters")
      .select("id, name, color"),
    supabase
      .from("seo_blog_posts")
      .select("id, status, primary_keyword_id, ai_generated")
      .neq("status", "archived"),
    supabase
      .from("seo_audits")
      .select("overall_score, issues_critical, issues_warning, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("seo_gsc_data")
      .select("clicks, impressions, position")
      .order("fetched_at", { ascending: false })
      .limit(100),
  ]);

  const keywords = kwRes.data || [];
  const blogs = blogRes.data || [];
  const gsc = gscRes.data || [];

  const ranked = keywords.filter(k => k.current_rank !== null);
  const avgRank = ranked.length
    ? Math.round(ranked.reduce((s, k) => s + (k.current_rank ?? 0), 0) / ranked.length)
    : null;

  const improving = keywords.filter(k =>
    k.current_rank && k.previous_rank && k.current_rank < k.previous_rank
  ).length;

  const totalClicks = gsc.reduce((s, r) => s + (r.clicks || 0), 0);
  const totalImpressions = gsc.reduce((s, r) => s + (r.impressions || 0), 0);

  // Content gap: keywords with no blog post mapped
  const mappedKwIds = new Set(blogs.map(b => b.primary_keyword_id).filter(Boolean));
  const contentGapCount = keywords.filter(k => !mappedKwIds.has(k.id)).length;

  // Top performers (rank 1-5)
  const topPerformers = keywords
    .filter(k => k.current_rank && k.current_rank <= 5)
    .sort((a, b) => (a.current_rank ?? 99) - (b.current_rank ?? 99))
    .slice(0, 3)
    .map(k => ({ keyword: k.keyword, rank: k.current_rank }));

  return NextResponse.json({
    keyword_count: keywords.length,
    avg_rank: avgRank,
    improving_count: improving,
    top_performers: topPerformers,
    content_gap_count: contentGapCount,
    blog_post_count: blogs.filter(b => b.status === "published").length,
    blog_draft_count: blogs.filter(b => b.status === "draft").length,
    cluster_count: clusterRes.data?.length || 0,
    audit_score: auditRes.data?.overall_score || null,
    audit_critical: auditRes.data?.issues_critical || 0,
    total_clicks: totalClicks,
    total_impressions: totalImpressions,
    last_updated: new Date().toISOString(),
  });
}
