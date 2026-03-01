import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/agency/prefill-state
 * Called by the setup wizard on mount to load pre-filled data pushed by the agency.
 * No auth required — data is non-sensitive practice info (name, address, hours).
 * The wizard is already behind Clerk auth.
 */
export async function GET() {
  try {
    const supabase = createServiceSupabase();

    const { data, error } = await supabase
      .from("onboarding_state")
      .select("prefilled_data, prefill_received_at")
      .eq("engine_key", "ak-dental")
      .not("prefilled_data", "is", null)
      .limit(1)
      .maybeSingle();

    if (error) {
      // Column may not exist yet (migration pending) — return empty
      return NextResponse.json({ prefillData: null, migrationPending: true });
    }

    if (!data?.prefilled_data) {
      return NextResponse.json({ prefillData: null });
    }

    return NextResponse.json({
      prefillData: data.prefilled_data,
      prefillReceivedAt: data.prefill_received_at,
    });
  } catch {
    return NextResponse.json({ prefillData: null });
  }
}
