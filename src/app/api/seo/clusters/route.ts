import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabase();

  const { data: clusters } = await supabase
    .from("seo_keyword_clusters")
    .select("*")
    .order("name");

  const { data: keywords } = await supabase
    .from("seo_keywords")
    .select("id, keyword, cluster_id, current_rank, previous_rank, search_volume, intent, is_active")
    .eq("is_active", true)
    .order("current_rank", { ascending: true, nullsFirst: false });

  return NextResponse.json({ clusters: clusters || [], keywords: keywords || [] });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, description, color } = body;
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("seo_keyword_clusters")
    .insert({ name, description, color: color || "#0891b2" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { keyword_id, cluster_id } = body;
  if (!keyword_id) return NextResponse.json({ error: "keyword_id required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("seo_keywords")
    .update({ cluster_id: cluster_id || null, updated_at: new Date().toISOString() })
    .eq("id", keyword_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
