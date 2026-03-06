import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabase();

  // Get all active keywords
  const { data: keywords } = await supabase
    .from("seo_keywords")
    .select("id, keyword, category, current_rank, search_volume")
    .eq("is_active", true);

  if (!keywords?.length) return NextResponse.json({ error: "No keywords to cluster" }, { status: 400 });

  const kwList = keywords.map(k => `${k.keyword} (rank: ${k.current_rank ?? "?"}, vol: ${k.search_volume ?? "?"})`).join("\n");

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{
      role: "user",
      content: `Group these dental practice keywords into topic clusters. Each cluster should represent a clear content theme.

Keywords:
${kwList}

Return ONLY a JSON array. No explanation. Format:
[
  {
    "cluster_name": "...",
    "color": "#hexcolor",
    "keywords": ["exact keyword text", ...]
  }
]

Use 3-6 clusters. Pick distinct hex colors (cyan, purple, red, green, orange, blue tones).`
    }]
  });

  const text = (msg.content[0] as { type: string; text: string }).text;
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return NextResponse.json({ error: "Failed to parse clusters" }, { status: 500 });

  try {
    const clusters: { cluster_name: string; color: string; keywords: string[] }[] = JSON.parse(jsonMatch[0]);

    // Upsert clusters and assign keywords
    const results = [];
    for (const c of clusters) {
      const { data: cluster } = await supabase
        .from("seo_keyword_clusters")
        .upsert({ name: c.cluster_name, color: c.color }, { onConflict: "name" })
        .select()
        .single();

      if (!cluster) continue;

      // Assign keywords to cluster
      for (const kwText of c.keywords) {
        const kw = keywords.find(k => k.keyword.toLowerCase() === kwText.toLowerCase());
        if (kw) {
          await supabase
            .from("seo_keywords")
            .update({ cluster_id: cluster.id, updated_at: new Date().toISOString() })
            .eq("id", kw.id);
        }
      }

      results.push({ cluster: cluster.name, assigned: c.keywords.length });
    }

    return NextResponse.json({ success: true, clusters: results });
  } catch {
    return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
  }
}
