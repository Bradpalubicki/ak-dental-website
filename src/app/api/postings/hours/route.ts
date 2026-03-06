import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const PRACTICE_ID = "ak-ultimate-dental";

const HoursOverrideSchema = z.object({
  label: z.string().min(1).max(100),
  note: z.string().max(300).optional(),
  show_banner: z.boolean().default(true),
  banner_message: z.string().max(200).optional(),
  starts_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ends_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mon_hours: z.string().max(30).nullable().optional(),
  tue_hours: z.string().max(30).nullable().optional(),
  wed_hours: z.string().max(30).nullable().optional(),
  thu_hours: z.string().max(30).nullable().optional(),
  fri_hours: z.string().max(30).nullable().optional(),
  sat_hours: z.string().max(30).nullable().optional(),
  sun_hours: z.string().max(30).nullable().optional(),
});

export async function GET() {
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("practice_hours_overrides")
    .select("*")
    .eq("practice_id", PRACTICE_ID)
    .eq("status", "active")
    .order("starts_at", { ascending: true });
  return NextResponse.json({ overrides: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const body = HoursOverrideSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("practice_hours_overrides")
    .insert({ ...body.data, practice_id: PRACTICE_ID, created_by: auth.userId! })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ override: data });
}
