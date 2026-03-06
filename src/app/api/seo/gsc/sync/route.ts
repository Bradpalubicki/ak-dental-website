import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  getValidAccessToken,
  fetchGSCSearchAnalytics,
} from "@/lib/seo/gsc";

/**
 * POST /api/seo/gsc/sync
 * Pulls latest GSC search analytics and upserts into:
 *   - seo_gsc_data (full query list)
 *   - seo_keywords (auto-seeds top 20 if not already tracked)
 *
 * Called after OAuth connect and by cron (daily).
 * Accepts either Clerk auth OR internal cron secret header.
 */
export async function POST(request: NextRequest) {
  const internalSecret = request.headers.get("x-internal");
  const isInternal = internalSecret === process.env.CRON_SECRET;

  if (!isInternal) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "GSC not connected" }, { status: 400 });
  }

  const rows = await fetchGSCSearchAnalytics(accessToken, 28);
  if (!rows.length) {
    return NextResponse.json({ synced: 0, seeded: 0 });
  }

  const supabase = await createServerSupabase();
  const fetchedAt = new Date().toISOString();

  // Replace gsc_data with fresh pull (delete + insert)
  await supabase.from("seo_gsc_data").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const gscRows = rows.map((r) => ({
    query: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
    fetched_at: fetchedAt,
  }));

  await supabase.from("seo_gsc_data").insert(gscRows);

  // Auto-seed top 20 queries into seo_keywords if not already tracked
  const { data: existing } = await supabase
    .from("seo_keywords")
    .select("keyword");
  const existingSet = new Set((existing ?? []).map((k) => k.keyword.toLowerCase()));

  const toSeed = rows
    .slice(0, 20)
    .filter((r) => !existingSet.has(r.keys[0].toLowerCase()))
    .map((r) => ({
      keyword: r.keys[0],
      category: "GSC",
      is_active: true,
    }));

  if (toSeed.length > 0) {
    await supabase.from("seo_keywords").insert(toSeed);
  }

  return NextResponse.json({ synced: gscRows.length, seeded: toSeed.length });
}

/**
 * GET /api/seo/gsc/sync — return latest GSC data + connection status
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabase();
  const accessToken = await getValidAccessToken();

  const { data: gscData } = await supabase
    .from("seo_gsc_data")
    .select("*")
    .order("clicks", { ascending: false })
    .limit(25);

  return NextResponse.json({
    connected: !!accessToken,
    rows: gscData ?? [],
    fetchedAt: gscData?.[0]?.fetched_at ?? null,
  });
}
