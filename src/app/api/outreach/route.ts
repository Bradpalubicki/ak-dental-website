import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function GET() {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_outreach_workflows")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { error: "Failed to load workflows" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("oe_outreach_workflows")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update workflow" },
      { status: 500 }
    );
  }
}
