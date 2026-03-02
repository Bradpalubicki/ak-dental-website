import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { z } from "zod";

const CreateSchema = z.object({
  vendor: z.string().min(1),
  description: z.string().optional(),
  amount: z.number().positive(),
  due_date: z.string().min(1),
  status: z.enum(["upcoming", "due_soon", "paid", "overdue"]).default("upcoming"),
  notes: z.string().optional(),
  invoice_number: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const source = searchParams.get("source"); // "email" to filter email-sourced only

  const supabase = createServiceSupabase();
  let query = supabase
    .from("oe_accounts_payable")
    .select(`
      id, vendor, description, amount, due_date, status,
      paid_date, notes, invoice_number, extraction_confidence,
      source_email_id, created_at, updated_at,
      source_email:oe_email_messages(id, from_email, from_name, subject)
    `)
    .order("due_date", { ascending: true });

  if (status) query = query.eq("status", status);
  if (source === "email") query = query.not("source_email_id", "is", null);

  const { data, error } = await query.limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bills: data ?? [] });
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_accounts_payable")
    .insert(parsed.data)
    .select("id, vendor, amount, due_date, status")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bill: data }, { status: 201 });
}
