/**
 * GSC Sync Cron (Engine Template)
 *
 * Daily: Pull last 7 days of Search Console data,
 * update keyword ranks from GSC position data,
 * insert history rows for trend tracking.
 *
 * Schedule: Daily 8 AM UTC
 */

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { fetchSearchAnalytics } from "@/lib/seo/google-search-console";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createServerSupabase();

    // Fetch last 7 days of GSC data
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .split("T")[0];

    console.log(`GSC Sync: Fetching data from ${startDate} to ${endDate}`);

    const gscData = await fetchSearchAnalytics(startDate, endDate);

    if (gscData.length === 0) {
      console.log(
        "GSC Sync: No data returned (GSC may not be configured)"
      );
      return NextResponse.json({
        success: true,
        message: "No GSC data available",
        rowsInserted: 0,
      });
    }

    // Insert GSC data
    const rows = gscData.map((row) => ({
      date: row.date,
      query: row.query,
      page: row.page,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }));

    const { error: insertError } = await supabase
      .from("seo_search_console_data")
      .upsert(rows, {
        onConflict: "date,query,page",
        ignoreDuplicates: true,
      });

    if (insertError) {
      console.error("GSC insert error:", insertError);
    }

    // Update keyword ranks from GSC data
    const { data: keywords } = await supabase
      .from("seo_keywords")
      .select("id, keyword, current_rank")
      .eq("is_active", true);

    if (keywords && keywords.length > 0) {
      for (const kw of keywords) {
        // Find the best position for this keyword in the last 7 days
        const matchingRows = gscData.filter(
          (r) =>
            r.query.toLowerCase().includes(kw.keyword.toLowerCase()) ||
            kw.keyword.toLowerCase().includes(r.query.toLowerCase())
        );

        if (matchingRows.length > 0) {
          const bestPosition = Math.min(
            ...matchingRows.map((r) => Math.round(r.position))
          );

          // Update keyword rank
          await supabase
            .from("seo_keywords")
            .update({
              previous_rank: kw.current_rank,
              current_rank: bestPosition,
              best_rank: kw.current_rank
                ? Math.min(bestPosition, kw.current_rank)
                : bestPosition,
              updated_at: new Date().toISOString(),
            })
            .eq("id", kw.id);

          // Insert history row
          await supabase.from("seo_keyword_history").insert({
            keyword_id: kw.id,
            rank: bestPosition,
            date: endDate,
            source: "gsc",
          });
        }
      }
    }

    console.log(
      `GSC Sync complete: ${gscData.length} rows, ${keywords?.length || 0} keywords updated`
    );

    return NextResponse.json({
      success: true,
      rowsInserted: gscData.length,
      keywordsUpdated: keywords?.length || 0,
    });
  } catch (error) {
    console.error("GSC Sync failed:", error);
    return NextResponse.json(
      {
        error: "GSC sync failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
