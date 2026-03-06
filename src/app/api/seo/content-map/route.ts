import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabase();
  const { searchParams } = new URL(request.url);
  const keyword_id = searchParams.get("keyword_id");

  let query = supabase
    .from("seo_content_map")
    .select(`
      id, keyword_id, content_type, page_url, page_title, is_primary, created_at,
      blog_post:seo_blog_posts(id, slug, title, status, published_at)
    `);

  if (keyword_id) query = query.eq("keyword_id", keyword_id);

  const { data, error } = await query.order("is_primary", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { keyword_id, content_type, page_url, page_title, blog_post_id, is_primary } = body;

  if (!keyword_id || !content_type) {
    return NextResponse.json({ error: "keyword_id and content_type required" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("seo_content_map")
    .upsert({
      keyword_id,
      content_type,
      page_url: page_url || null,
      page_title: page_title || null,
      blog_post_id: blog_post_id || null,
      is_primary: is_primary ?? false,
    }, { onConflict: content_type === "page" ? "keyword_id,content_type,page_url" : "keyword_id,blog_post_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("seo_content_map").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
