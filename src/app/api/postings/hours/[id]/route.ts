import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

const UpdateSchema = z.object({
  label: z.string().min(1).max(100).optional(),
  note: z.string().max(300).nullable().optional(),
  show_banner: z.boolean().optional(),
  banner_message: z.string().max(200).nullable().optional(),
  starts_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  ends_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  mon_hours: z.string().max(30).nullable().optional(),
  tue_hours: z.string().max(30).nullable().optional(),
  wed_hours: z.string().max(30).nullable().optional(),
  thu_hours: z.string().max(30).nullable().optional(),
  fri_hours: z.string().max(30).nullable().optional(),
  sat_hours: z.string().max(30).nullable().optional(),
  sun_hours: z.string().max(30).nullable().optional(),
  status: z.enum(["active", "archived"]).optional(),
});

export async function PATCH(req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const body = UpdateSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("practice_hours_overrides")
    .update(body.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ override: data });
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const supabase = createServiceSupabase();
  await supabase.from("practice_hours_overrides").update({ status: "archived" }).eq("id", id);
  return NextResponse.json({ success: true });
}
