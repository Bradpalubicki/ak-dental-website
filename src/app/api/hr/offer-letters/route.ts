import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const CreateOfferSchema = z.object({
  candidate_first_name: z.string().min(1).max(100),
  candidate_last_name:  z.string().min(1).max(100),
  candidate_email:      z.string().email().max(254),
  candidate_phone:      z.string().max(20).optional().nullable(),
  job_title:            z.string().min(1).max(200),
  department:           z.enum(["Clinical", "Administrative", "Management"]).default("Clinical"),
  employment_type:      z.enum(["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY", "INTERN"]).default("FULL_TIME"),
  start_date:           z.string().optional().nullable(),
  salary_amount:        z.number().int().positive().optional().nullable(),
  salary_unit:          z.enum(["YEAR", "HOUR"]).default("YEAR"),
  hourly_rate:          z.number().positive().optional().nullable(),
  letter_body:          z.string().min(10),
  custom_message:       z.string().max(2000).optional().nullable(),
  send_now:             z.boolean().default(false),
});

export async function GET() {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_offer_letters")
    .select("id, created_at, candidate_first_name, candidate_last_name, candidate_email, job_title, department, employment_type, start_date, salary_amount, salary_unit, hourly_rate, status, sent_at, signed_at, expires_at, employee_id")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const body = await req.json().catch(() => null);
  const parsed = CreateOfferSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

  const { send_now, ...fields } = parsed.data;
  const supabase = createServiceSupabase();

  const insertData = {
    ...fields,
    created_by: authResult.userId,
    status: send_now ? "sent" : "draft",
    sent_at: send_now ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("oe_offer_letters")
    .insert(insertData)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
