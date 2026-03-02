import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

// GET — list pending drafts
export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "pending";

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_email_drafts")
    .select(`
      id, to_email, subject, body, status,
      approved_by, approved_at, sent_at, resend_id, created_at,
      source_message:oe_email_messages(id, from_email, from_name, subject, classification)
    `)
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ drafts: data ?? [] });
}
