import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { logPhiAccess } from "@/lib/audit";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_provider_availability")
    .select("*")
    .eq("provider_id", id)
    .order("day_of_week", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();
  const body = await req.json();

  if (!Array.isArray(body.availability)) {
    return NextResponse.json({ error: "availability must be an array" }, { status: 400 });
  }

  // Delete existing availability for this provider
  await supabase
    .from("oe_provider_availability")
    .delete()
    .eq("provider_id", id);

  // Insert new availability
  const rows = body.availability.map((slot: { day_of_week: number; start_time: string; end_time: string; is_available?: boolean; location?: string }) => ({
    provider_id: id,
    day_of_week: slot.day_of_week,
    start_time: slot.start_time,
    end_time: slot.end_time,
    is_available: slot.is_available ?? true,
    location: slot.location || "Main Office",
  }));

  const { data, error } = await supabase
    .from("oe_provider_availability")
    .insert(rows)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("providers.availability.update", "provider", id, { slots: rows.length });

  return NextResponse.json(data);
}
