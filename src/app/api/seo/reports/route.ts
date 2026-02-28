import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * GET /api/seo/reports — Returns list of monthly SEO reports
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("seo_reports")
      .select("id, report_month, overall_score, sent_to_client, sent_at, created_at")
      .order("report_month", { ascending: false })
      .limit(24);

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}
