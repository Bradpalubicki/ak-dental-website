import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";

/**
 * GET /api/hr/gusto/status
 * Returns the current Gusto connection status for this practice.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("oe_gusto_connection")
    .select("status, gusto_company_name, last_synced_at, error_message, token_expires_at")
    .eq("practice_id", "ak-dental")
    .single();

  return NextResponse.json(data ?? { status: "disconnected" });
}
