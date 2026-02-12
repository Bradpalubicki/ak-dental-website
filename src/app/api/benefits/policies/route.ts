import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const check = await requirePermission("benefits.view");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const status = req.nextUrl.searchParams.get("status");

  let query = supabase
    .from("oe_business_insurance_policies")
    .select("*")
    .order("expiration_date", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const check = await requirePermission("benefits.edit");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_business_insurance_policies")
    .insert({
      policy_type: body.policy_type,
      carrier_name: body.carrier_name,
      policy_number: body.policy_number,
      coverage_amount: body.coverage_amount || null,
      deductible: body.deductible || null,
      annual_premium: body.annual_premium || null,
      monthly_premium: body.monthly_premium || null,
      effective_date: body.effective_date || null,
      expiration_date: body.expiration_date || null,
      renewal_date: body.renewal_date || null,
      status: body.status || "active",
      agent_name: body.agent_name || null,
      agent_phone: body.agent_phone || null,
      agent_email: body.agent_email || null,
      broker_company: body.broker_company || null,
      auto_renew: body.auto_renew || false,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
