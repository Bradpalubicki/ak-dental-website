import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { siteConfig } from "@/lib/config";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { seed_keyword, existing_keywords = [], count = 10 } = await request.json();
  if (!seed_keyword) return NextResponse.json({ error: "seed_keyword required" }, { status: 400 });

  const existingList = (existing_keywords as string[]).slice(0, 50).join(", ");

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `You are an SEO expert for "${siteConfig.name}", a dental practice in Las Vegas, NV.

Seed keyword: "${seed_keyword}"
Already tracking: ${existingList || "none"}

Suggest ${count} NEW keyword variations that would be valuable for this dental practice to rank for.
Focus on: local Las Vegas/Summerlin intent, commercial/transactional searches, long-tail variations.

Return ONLY a JSON array of objects. No explanation. Format:
[
  { "keyword": "...", "category": "primary|secondary|long_tail|local|service", "intent": "informational|commercial|transactional|navigational", "est_volume": 0, "rationale": "one sentence" }
]`
    }]
  });

  const text = (msg.content[0] as { type: string; text: string }).text;
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return NextResponse.json({ error: "Failed to parse suggestions" }, { status: 500 });

  try {
    const suggestions = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
  }
}
