import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

// GET /api/clinical-notes/templates - List available templates
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceSupabase();
    const { searchParams } = new URL(req.url);
    const noteType = searchParams.get("note_type");

    let query = supabase
      .from("oe_note_templates")
      .select("*")
      .order("is_default", { ascending: false })
      .order("name", { ascending: true });

    if (noteType) {
      query = query.eq("note_type", noteType);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
