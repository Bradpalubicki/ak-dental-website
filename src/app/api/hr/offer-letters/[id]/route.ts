import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const UpdateSchema = z.object({
  status:         z.enum(["draft", "sent", "withdrawn"]).optional(),
  start_date:     z.string().optional().nullable(),
  salary_amount:  z.number().int().positive().optional().nullable(),
  custom_message: z.string().max(2000).optional().nullable(),
  letter_body:    z.string().min(10).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "sent") updates.sent_at = new Date().toISOString();

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_offer_letters")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { error } = await supabase
    .from("oe_offer_letters")
    .update({ status: "withdrawn" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
