import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { siteConfig } from "@/lib/config";
import { z } from "zod";

const client = new Anthropic();

const generateSchema = z.object({
  keyword_id: z.string().uuid(),
  mode: z.enum(["outline", "full"]).default("outline"),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("seo_blog_posts")
    .select(`
      id, slug, title, meta_description, excerpt, category, status,
      primary_keyword_id, supporting_keyword_ids, word_count,
      published_at, ai_generated, created_at, updated_at,
      primary_keyword:seo_keywords!seo_blog_posts_primary_keyword_id_fkey(keyword, current_rank)
    `)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Manual create (no AI)
  if (body.action === "create") {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("seo_blog_posts")
      .insert({
        slug: body.slug,
        title: body.title,
        meta_description: body.meta_description,
        excerpt: body.excerpt,
        category: body.category,
        primary_keyword_id: body.primary_keyword_id,
        supporting_keyword_ids: body.supporting_keyword_ids || [],
        status: "draft",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  }

  // AI generate
  if (body.action === "generate") {
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const supabase = await createServerSupabase();

    // Get keyword + its content map
    const { data: kw } = await supabase
      .from("seo_keywords")
      .select("keyword, category, search_volume, current_rank, intent")
      .eq("id", parsed.data.keyword_id)
      .single();

    if (!kw) return NextResponse.json({ error: "Keyword not found" }, { status: 404 });

    // Get related keywords in same cluster for internal linking suggestions
    const { data: related } = await supabase
      .from("seo_keywords")
      .select("keyword, target_url")
      .eq("is_active", true)
      .neq("id", parsed.data.keyword_id)
      .limit(8);

    const relatedList = (related || []).map(r => `- "${r.keyword}" → ${r.target_url || "/"}`).join("\n");

    const isFullMode = parsed.data.mode === "full";

    const prompt = `You are an SEO content writer for "${siteConfig.name}", a dental practice at ${siteConfig.url} serving Las Vegas and Summerlin, NV.

Primary keyword: "${kw.keyword}"
Search intent: ${kw.intent || "commercial"}
Search volume: ~${kw.search_volume || "unknown"}/month
Current rank: #${kw.current_rank || "not ranking"}

Related keywords to weave in naturally (include these where relevant):
${relatedList}

${isFullMode ? `Write a complete, publish-ready SEO blog post.

Requirements:
- Title: compelling H1 that includes the primary keyword
- Meta description: 150-160 chars, includes keyword, has a CTA
- Word count: 1,200-1,800 words
- Structure: intro, 3-5 H2 sections, FAQ section (3-5 questions), conclusion with CTA
- Naturally include primary keyword ~4-6x, related keywords 1-2x each
- Local focus: mention Las Vegas / Summerlin naturally
- CTA: schedule appointment at ${siteConfig.url}
- Include a "near me" angle where relevant
- Tone: professional but approachable, patient-focused

Return ONLY a JSON object:
{
  "title": "...",
  "meta_title": "... | ${siteConfig.name}",
  "meta_description": "...",
  "excerpt": "...",
  "slug": "url-friendly-slug",
  "category": "...",
  "content_body": "Full markdown content",
  "word_count": 0
}` : `Write a detailed content outline for a blog post.

Requirements:
- Suggest a compelling title (includes primary keyword)
- Meta description (150-160 chars)
- 4-6 H2 section headings with 2-3 bullet points each
- FAQ section with 4 questions
- Internal linking opportunities (use the related keywords list)
- Note where to naturally insert "near me" and local signals

Return ONLY a JSON object:
{
  "title": "...",
  "meta_title": "... | ${siteConfig.name}",
  "meta_description": "...",
  "excerpt": "...",
  "slug": "url-friendly-slug",
  "category": "...",
  "content_outline": "Markdown outline",
  "word_count": 0
}`}`;

    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: isFullMode ? 4096 : 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (msg.content[0] as { type: string; text: string }).text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });

    try {
      const generated = JSON.parse(jsonMatch[0]);

      // Save to DB as draft
      const { data: post, error: insertError } = await supabase
        .from("seo_blog_posts")
        .insert({
          slug: generated.slug,
          title: generated.title,
          meta_title: generated.meta_title,
          meta_description: generated.meta_description,
          excerpt: generated.excerpt,
          category: generated.category,
          primary_keyword_id: parsed.data.keyword_id,
          status: "draft",
          content_outline: generated.content_outline || null,
          content_body: generated.content_body || null,
          word_count: generated.word_count || null,
          ai_generated: true,
          ai_model: "claude-haiku-4-5-20251001",
        })
        .select()
        .single();

      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

      // Auto-create content map entry
      await supabase.from("seo_content_map").upsert({
        keyword_id: parsed.data.keyword_id,
        content_type: "blog_post",
        blog_post_id: post.id,
        is_primary: true,
      }, { onConflict: "keyword_id,blog_post_id" });

      return NextResponse.json({ post, generated });
    } catch {
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("seo_blog_posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("seo_blog_posts")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
