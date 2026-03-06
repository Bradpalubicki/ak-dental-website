import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

const UpdateSchema = z.object({
  message: z.string().min(1).max(280).optional(),
  link_label: z.string().max(60).nullable().optional(),
  link_href: z.string().max(200).nullable().optional(),
  style: z.enum(["info", "warning", "success", "urgent"]).optional(),
  starts_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().nullable().optional(),
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
    .from("practice_announcements")
    .update(body.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ announcement: data });
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const supabase = createServiceSupabase();
  await supabase.from("practice_announcements").update({ status: "archived" }).eq("id", id);
  return NextResponse.json({ success: true });
}
