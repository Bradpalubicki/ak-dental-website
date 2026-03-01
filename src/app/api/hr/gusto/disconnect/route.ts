import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";

/**
 * POST /api/hr/gusto/disconnect
 * Clears the stored Gusto OAuth tokens and marks connection as disconnected.
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceSupabase();
  await supabase
    .from("oe_gusto_connection")
    .update({
      access_token: null,
      refresh_token: null,
      token_expires_at: null,
      gusto_company_id: null,
      gusto_company_name: null,
      status: "disconnected",
      error_message: null,
    })
    .eq("practice_id", "ak-dental");

  return NextResponse.json({ success: true });
}
