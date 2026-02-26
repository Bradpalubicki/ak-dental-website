import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const UpdateSettingSchema = z.object({
  key: z.string().min(1).max(200),
  value: z.unknown(),
});

export async function GET() {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_practice_settings")
      .select("key, value");

    if (error) throw error;

    const settings: Record<string, unknown> = {};
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const parsed = UpdateSettingSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { key, value } = parsed.data;

    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("oe_practice_settings")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
