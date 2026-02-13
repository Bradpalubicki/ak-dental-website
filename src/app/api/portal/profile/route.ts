import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyPortalApiAuth } from "@/lib/portal-auth";

export async function PUT(request: NextRequest) {
  try {
    const { patient, error: authError } = await verifyPortalApiAuth();
    if (authError || !patient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Only allow updating specific fields
    const allowedUpdates: Record<string, unknown> = {};
    const allowed = ["first_name", "last_name", "phone", "date_of_birth", "address", "city", "state", "zip", "insurance_provider", "insurance_member_id", "insurance_group_number"];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        allowedUpdates[key] = body[key];
      }
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("oe_patients")
      .update(allowedUpdates)
      .eq("id", patient.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
