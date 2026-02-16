import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { logPhiAccess } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const startDate = req.nextUrl.searchParams.get("start_date");
  const endDate = req.nextUrl.searchParams.get("end_date");

  let query = supabase
    .from("oe_provider_blocks")
    .select("*")
    .eq("provider_id", id)
    .order("start_date", { ascending: true });

  if (startDate) query = query.gte("end_date", startDate);
  if (endDate) query = query.lte("start_date", endDate);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_provider_blocks")
    .insert({
      provider_id: id,
      block_type: body.block_type,
      title: body.title || null,
      start_date: body.start_date,
      end_date: body.end_date,
      start_time: body.start_time || null,
      end_time: body.end_time || null,
      all_day: body.all_day ?? true,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("providers.blocks.create", "provider_block", data?.id, { provider_id: id });

  return NextResponse.json(data, { status: 201 });
}
