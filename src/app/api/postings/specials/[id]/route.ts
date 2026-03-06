import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

const UpdateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  fine_print: z.string().max(300).optional(),
  cta_label: z.string().max(60).optional(),
  cta_href: z.string().max(200).optional(),
  badge_text: z.string().max(40).nullable().optional(),
  discount_type: z.enum(["percent", "fixed", "free", "custom"]).nullable().optional(),
  discount_value: z.number().nullable().optional(),
  discount_display: z.string().max(60).nullable().optional(),
  starts_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  is_featured: z.boolean().optional(),
  status: z.enum(["active", "paused", "expired", "archived"]).optional(),
});

export async function PATCH(req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const body = UpdateSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("practice_specials")
    .update(body.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ special: data });
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const supabase = createServiceSupabase();
  await supabase.from("practice_specials").update({ status: "archived" }).eq("id", id);
  return NextResponse.json({ success: true });
}
