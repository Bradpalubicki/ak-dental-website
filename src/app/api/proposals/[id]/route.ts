import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";

const PatchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  notes: z.string().max(2000).optional().nullable(),
  status: z.enum(["draft", "sent", "viewed", "accepted", "declined", "expired"]).optional(),
  financing_provider: z.string().max(50).optional().nullable(),
  financing_monthly: z.number().min(0).optional().nullable(),
  financing_term_months: z.number().int().min(1).max(120).optional().nullable(),
  tier: z.enum(["good", "better", "best"]).optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data: proposal, error: pErr } = await supabase
    .from("oe_proposals")
    .select(`
      *,
      provider:oe_providers(id, first_name, last_name),
      patient:oe_patients(id, first_name, last_name, email, phone)
    `)
    .eq("id", id)
    .single();

  if (pErr || !proposal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: items } = await supabase
    .from("oe_proposal_items")
    .select("*")
    .eq("proposal_id", id)
    .order("sort_order", { ascending: true });

  return NextResponse.json({ proposal, items: items ?? [] });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_proposals")
    .update(parsed.data)
    .eq("id", id)
    .select("id, status, sign_token")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Not found" }, { status: 404 });
  }

  return NextResponse.json({ proposal: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  const { error } = await supabase.from("oe_proposals").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
