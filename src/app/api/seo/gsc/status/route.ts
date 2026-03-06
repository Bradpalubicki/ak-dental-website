import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isGSCConnected, fetchGSCSummary, getValidAccessToken } from "@/lib/seo/gsc";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const connected = await isGSCConnected();
  if (!connected) {
    return NextResponse.json({ connected: false, summary: null, topQueries: [] });
  }

  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return NextResponse.json({ connected: false, summary: null, topQueries: [] });
  }

  const [summary, supabase] = await Promise.all([
    fetchGSCSummary(accessToken, 28),
    createServerSupabase(),
  ]);

  const { data: topQueries } = await supabase
    .from("seo_gsc_data")
    .select("query, clicks, impressions, ctr, position")
    .order("clicks", { ascending: false })
    .limit(10);

  return NextResponse.json({
    connected: true,
    summary,
    topQueries: topQueries ?? [],
  });
}
