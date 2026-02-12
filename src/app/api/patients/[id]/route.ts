import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_patients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
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

  const allowedFields = [
    "first_name", "last_name", "email", "phone", "date_of_birth",
    "address", "city", "state", "zip", "insurance_provider",
    "insurance_member_id", "insurance_group_number", "status", "notes", "tags",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  const { data, error } = await supabase
    .from("oe_patients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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

  const { data, error } = await supabase
    .from("oe_patients")
    .update({ deleted_at: new Date().toISOString(), deleted_by: authResult.userName || authResult.userId })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Patient moved to trash", data });
}
