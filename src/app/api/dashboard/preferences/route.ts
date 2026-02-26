import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

const VALID_WIDGETS = ["kpi", "ai_insights", "appointments", "leads", "financials", "hr", "compliance", "insurance", "outreach"] as const;
const DEFAULT_WIDGETS = [...VALID_WIDGETS];

const SavePreferencesSchema = z.object({
  layouts: z.record(z.string(), z.unknown()).default({}),
  visible_widgets: z.array(z.string()).default([]),
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ layouts: {}, visible_widgets: DEFAULT_WIDGETS });
    }

    const supabase = createServiceSupabase();
    const { data } = await supabase
      .from("oe_dashboard_preferences")
      .select("layouts, visible_widgets")
      .eq("user_id", userId)
      .single();

    if (data) {
      const validWidgets = (data.visible_widgets || []).filter(
        (w: string) => w !== "urgent" && w !== "ai_activity"
      );
      return NextResponse.json({
        ...data,
        visible_widgets: validWidgets.length > 0 ? validWidgets : DEFAULT_WIDGETS,
      });
    }

    return NextResponse.json({ layouts: {}, visible_widgets: DEFAULT_WIDGETS });
  } catch {
    return NextResponse.json({ layouts: {}, visible_widgets: DEFAULT_WIDGETS });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = SavePreferencesSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("oe_dashboard_preferences")
      .upsert(
        {
          user_id: userId,
          layouts: parsed.data.layouts,
          visible_widgets: parsed.data.visible_widgets,
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
