import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const check = await requirePermission("benefits.view");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const status = req.nextUrl.searchParams.get("status");

  let query = supabase
    .from("oe_corporate_filings")
    .select("*")
    .order("expiration_date", { ascending: true, nullsFirst: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch filings" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const check = await requirePermission("benefits.edit");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_corporate_filings")
    .insert({
      filing_type: body.filing_type,
      title: body.title,
      filing_entity: body.filing_entity || null,
      jurisdiction: body.jurisdiction || null,
      filing_number: body.filing_number || null,
      status: body.status || "active",
      effective_date: body.effective_date || null,
      expiration_date: body.expiration_date || null,
      renewal_frequency: body.renewal_frequency || null,
      cost: body.cost || null,
      responsible_party: body.responsible_party || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create filing" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
