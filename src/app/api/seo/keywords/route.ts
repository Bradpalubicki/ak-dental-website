import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * SEO Keywords API
 *
 * GET    /api/seo/keywords — List tracked keywords with current ranks
 * POST   /api/seo/keywords — Add keyword(s)
 * PUT    /api/seo/keywords — Update keyword metadata
 * DELETE /api/seo/keywords — Deactivate keyword
 */

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServerSupabase();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const activeOnly = searchParams.get("active") !== "false";

  let query = supabase
    .from("seo_keywords")
    .select("*")
    .order("current_rank", { ascending: true, nullsFirst: false });

  if (category) {
    query = query.eq("category", category);
  }

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServerSupabase();
  const body = await request.json();

  // Support single keyword or array
  const keywords = Array.isArray(body) ? body : [body];

  const rows = keywords.map(
    (kw: {
      keyword: string;
      category?: string;
      target_url?: string;
      search_volume?: number;
      difficulty?: number;
    }) => ({
      keyword: kw.keyword,
      category: kw.category || "primary",
      target_url: kw.target_url,
      search_volume: kw.search_volume,
      difficulty: kw.difficulty,
    })
  );

  const { data, error } = await supabase
    .from("seo_keywords")
    .insert(rows)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServerSupabase();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("seo_keywords")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServerSupabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("seo_keywords")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
