import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { logPhiAccess } from "@/lib/audit";

const CreatePatientSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email().max(254).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(50).optional().nullable(),
  zip: z.string().max(10).optional().nullable(),
  insurance_provider: z.string().max(200).optional().nullable(),
  insurance_member_id: z.string().max(100).optional().nullable(),
  insurance_group_number: z.string().max(100).optional().nullable(),
  status: z.enum(["active", "inactive", "prospect"]).default("active"),
  notes: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string()).default([]),
});

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

  const parsed = CreatePatientSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_patients")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("patients.create", "patient", data?.id);

  return NextResponse.json(data, { status: 201 });
}
