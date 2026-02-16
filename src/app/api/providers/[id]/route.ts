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

  // Get provider
  const { data: provider, error } = await supabase
    .from("oe_providers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  // Get availability
  const { data: availability } = await supabase
    .from("oe_provider_availability")
    .select("*")
    .eq("provider_id", id)
    .order("day_of_week", { ascending: true });

  // Get upcoming blocks (next 90 days)
  const today = new Date().toISOString().split("T")[0];
  const ninetyDays = new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0];
  const { data: blocks } = await supabase
    .from("oe_provider_blocks")
    .select("*")
    .eq("provider_id", id)
    .gte("end_date", today)
    .lte("start_date", ninetyDays)
    .order("start_date", { ascending: true });

  await logPhiAccess("providers.view", "provider", id);

  return NextResponse.json({
    ...provider,
    availability: availability || [],
    blocks: blocks || [],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();
  const body = await req.json();

  // Only allow updating specific fields
  const allowedFields: Record<string, unknown> = {};
  const updatable = [
    "first_name", "last_name", "title", "specialty", "npi_number",
    "license_number", "license_state", "email", "phone", "bio",
    "photo_url", "accepting_new_patients", "is_active", "color",
  ];

  for (const field of updatable) {
    if (field in body) allowedFields[field] = body[field];
  }

  const { data, error } = await supabase
    .from("oe_providers")
    .update(allowedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("providers.update", "provider", id, { fields: Object.keys(allowedFields) });

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  // Soft delete - set is_active to false
  const { data, error } = await supabase
    .from("oe_providers")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("providers.deactivate", "provider", id);

  return NextResponse.json(data);
}
