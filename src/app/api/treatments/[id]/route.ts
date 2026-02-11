import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    const supabase = createServiceSupabase();

    const { data: plan, error } = await supabase
      .from("oe_treatment_plans")
      .select("*, patient:oe_patients(*)")
      .eq("id", id)
      .single();

    if (error || !plan) {
      return NextResponse.json({ error: "Treatment plan not found" }, { status: 404 });
    }

    return NextResponse.json({ plan });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
