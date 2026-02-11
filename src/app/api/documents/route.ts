import { NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType");
  const entityId = searchParams.get("entityId");

  if (!entityType) {
    return NextResponse.json({ error: "entityType required" }, { status: 400 });
  }

  const supabase = createServiceSupabase();

  let query = supabase
    .from("oe_documents")
    .select("*")
    .eq("entity_type", entityType)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (entityId) {
    query = query.eq("entity_id", entityId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
