import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        layouts: {},
        visible_widgets: [
          "kpi", "ai_insights", "appointments", "leads",
          "financials", "hr", "compliance", "insurance", "outreach",
        ],
      });
    }
    const uid = userId;
    const supabase = createServiceSupabase();

    const { data } = await supabase
      .from("oe_dashboard_preferences")
      .select("layouts, visible_widgets")
      .eq("user_id", uid)
      .single();

    if (data) {
      // Filter out removed widget IDs from old preferences
      const validWidgets = (data.visible_widgets || []).filter(
        (w: string) => w !== "urgent" && w !== "ai_activity"
      );
      return NextResponse.json({
        ...data,
        visible_widgets: validWidgets.length > 0 ? validWidgets : [
          "kpi", "ai_insights", "appointments", "leads",
          "financials", "hr", "compliance", "insurance", "outreach",
        ],
      });
    }

    // Return defaults if no saved preferences
    return NextResponse.json({
      layouts: {},
      visible_widgets: [
        "kpi", "ai_insights", "appointments", "leads",
        "financials", "hr", "compliance", "insurance", "outreach",
      ],
    });
  } catch {
    return NextResponse.json({
      layouts: {},
      visible_widgets: [
        "kpi", "ai_insights", "appointments", "leads",
        "financials", "hr", "compliance", "insurance", "outreach",
      ],
    });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const uid = userId;
    const body = await req.json();
    const supabase = createServiceSupabase();

    const { error } = await supabase
      .from("oe_dashboard_preferences")
      .upsert(
        {
          user_id: uid,
          layouts: body.layouts || {},
          visible_widgets: body.visible_widgets || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
