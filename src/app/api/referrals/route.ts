import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { logPhiAccess } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const status = req.nextUrl.searchParams.get("status");
  const patientId = req.nextUrl.searchParams.get("patient_id");
  const providerId = req.nextUrl.searchParams.get("provider_id");

  let query = supabase
    .from("oe_referrals")
    .select("*, patient:oe_patients(id, first_name, last_name), referring_provider:oe_providers(id, first_name, last_name, title)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) query = query.eq("status", status);
  if (patientId) query = query.eq("patient_id", patientId);
  if (providerId) query = query.eq("referring_provider_id", providerId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("referrals.list", "referral", undefined, { count: data?.length });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_referrals")
    .insert({
      patient_id: body.patient_id || null,
      referring_provider_id: body.referring_provider_id || null,
      referred_to_name: body.referred_to_name,
      referred_to_specialty: body.referred_to_specialty || null,
      referred_to_phone: body.referred_to_phone || null,
      referred_to_fax: body.referred_to_fax || null,
      referred_to_address: body.referred_to_address || null,
      reason: body.reason,
      urgency: body.urgency || "routine",
      status: body.status || "pending",
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("referrals.create", "referral", data?.id);

  return NextResponse.json(data, { status: 201 });
}
