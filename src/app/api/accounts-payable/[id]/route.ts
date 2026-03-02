import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { z } from "zod";

const UpdateSchema = z.object({
  status: z.enum(["upcoming", "due_soon", "paid", "overdue"]).optional(),
  paid_date: z.string().nullable().optional(),
  notes: z.string().optional(),
  vendor: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  due_date: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const update: Record<string, unknown> = { ...parsed.data, updated_at: new Date().toISOString() };
  if (parsed.data.status === "paid" && !parsed.data.paid_date) {
    update.paid_date = new Date().toISOString().split("T")[0];
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_accounts_payable")
    .update(update)
    .eq("id", id)
    .select("id, vendor, amount, due_date, status, paid_date")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  return NextResponse.json({ bill: data });
}
