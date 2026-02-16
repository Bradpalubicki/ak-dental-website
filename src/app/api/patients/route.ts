import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { logPhiAccess } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const status = req.nextUrl.searchParams.get("status");
  const showDeleted = req.nextUrl.searchParams.get("deleted") === "true";

  let query = supabase
    .from("oe_patients")
    .select("*")
    .order("last_name", { ascending: true })
    .limit(200);

  if (showDeleted) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    query = query.not("deleted_at", "is", null).gte("deleted_at", thirtyDaysAgo);
  } else {
    query = query.is("deleted_at", null);
  }

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("patients.list", "patient", undefined, { count: data?.length, status });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_patients")
    .insert({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email || null,
      phone: body.phone || null,
      date_of_birth: body.date_of_birth || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      zip: body.zip || null,
      insurance_provider: body.insurance_provider || null,
      insurance_member_id: body.insurance_member_id || null,
      insurance_group_number: body.insurance_group_number || null,
      status: body.status || "active",
      notes: body.notes || null,
      tags: body.tags || [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("patients.create", "patient", data?.id);

  return NextResponse.json(data, { status: 201 });
}
