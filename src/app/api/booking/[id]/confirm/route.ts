import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

// PATCH /api/booking/[id]/confirm
// Clerk auth required — staff only
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const supabase = createServiceSupabase();

    const { data, error } = await supabase
      .from("oe_appointments")
      .update({ status: "confirmed", confirmation_sent: true })
      .eq("id", id)
      .select("id, status")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Appointment not found" },
        { status: error ? 500 : 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
