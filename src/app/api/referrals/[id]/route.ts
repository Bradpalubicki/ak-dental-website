import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { logPhiAccess } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();
  const body = await req.json();

  const allowedFields: Record<string, unknown> = {};
  const updatable = [
    "status", "notes", "urgency", "sent_at", "completed_at",
    "referred_to_name", "referred_to_specialty", "referred_to_phone",
    "referred_to_fax", "referred_to_address", "reason",
  ];

  for (const field of updatable) {
    if (field in body) allowedFields[field] = body[field];
  }

  // Auto-set timestamps based on status changes
  if (body.status === "sent" && !body.sent_at) {
    allowedFields.sent_at = new Date().toISOString();
  }
  if (body.status === "completed" && !body.completed_at) {
    allowedFields.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("oe_referrals")
    .update(allowedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("referrals.update", "referral", id, { fields: Object.keys(allowedFields) });

  return NextResponse.json(data);
}
