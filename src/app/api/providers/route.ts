import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { logPhiAccess } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const activeOnly = req.nextUrl.searchParams.get("active") !== "false";
  const specialty = req.nextUrl.searchParams.get("specialty");

  let query = supabase
    .from("oe_providers")
    .select("*")
    .order("last_name", { ascending: true });

  if (activeOnly) query = query.eq("is_active", true);
  if (specialty) query = query.eq("specialty", specialty);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("providers.list", "provider", undefined, { count: data?.length });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_providers")
    .insert({
      first_name: body.first_name,
      last_name: body.last_name,
      title: body.title || null,
      specialty: body.specialty || null,
      npi_number: body.npi_number || null,
      license_number: body.license_number || null,
      license_state: body.license_state || "NV",
      email: body.email || null,
      phone: body.phone || null,
      bio: body.bio || null,
      photo_url: body.photo_url || null,
      accepting_new_patients: body.accepting_new_patients ?? true,
      is_active: body.is_active ?? true,
      color: body.color || "#3B82F6",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("providers.create", "provider", data?.id);

  return NextResponse.json(data, { status: 201 });
}
