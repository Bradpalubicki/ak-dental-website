import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    const uid = userId || "default";
    const supabase = createServiceSupabase();

    const { data } = await supabase
      .from("oe_dashboard_preferences")
      .select("layouts, visible_widgets")
      .eq("user_id", uid)
      .single();

    if (data) {
      return NextResponse.json(data);
    }

    // Return defaults if no saved preferences
    return NextResponse.json({
      layouts: {},
      visible_widgets: [
        "urgent", "kpi", "appointments", "leads", "ai_activity",
        "financials", "hr", "compliance", "insurance", "outreach",
      ],
    });
  } catch {
    return NextResponse.json({
      layouts: {},
      visible_widgets: [
        "urgent", "kpi", "appointments", "leads", "ai_activity",
        "financials", "hr", "compliance", "insurance", "outreach",
      ],
    });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const uid = userId || "default";
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
