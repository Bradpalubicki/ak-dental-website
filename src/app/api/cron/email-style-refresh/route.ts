import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyCronSecret } from "@/lib/cron-auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const STYLE_ID = "00000000-0000-0000-0000-000000000001";

// GET /api/cron/email-style-refresh
// Reads last 10 sent drafts → generates AI style profile → upserts oe_email_style
export async function GET(req: NextRequest) {
  const auth = verifyCronSecret(req);
  if (!auth.valid) return auth.response!;

  if (!anthropic) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  const supabase = createServiceSupabase();

  // Fetch last 10 sent drafts
  const { data: drafts } = await supabase
    .from("oe_email_drafts")
    .select("to_email, subject, body, sent_at")
    .eq("status", "sent")
    .order("sent_at", { ascending: false })
    .limit(10);

  if (!drafts || drafts.length === 0) {
    return NextResponse.json({ skipped: true, reason: "No sent drafts yet" });
  }

  const emailSamples = drafts
    .map((d, i) => `--- Email ${i + 1} (to: ${d.to_email}) ---\nSubject: ${d.subject}\n\n${d.body.substring(0, 600)}`)
    .join("\n\n");

  const styleRes = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 600,
    system: `You analyze email writing samples and extract a concise style profile. Return JSON with:
{
  "style_summary": "2-3 sentence description of the writing style and voice",
  "tone_keywords": ["word1", "word2", "word3"],
  "example_openers": ["Hi [name],", "Hello,"],
  "example_closings": ["Dr. Alex & Team, AK Ultimate Dental", "See you soon!"]
}
Be specific and descriptive. Base everything strictly on the samples provided.`,
    messages: [
      {
        role: "user",
        content: `Analyze these sent email samples from AK Ultimate Dental and extract the style profile:\n\n${emailSamples}`,
      },
    ],
  });

  const text = styleRes.content.find((b) => b.type === "text")?.text || "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return NextResponse.json({ error: "Failed to parse style profile" }, { status: 500 });
  }

  let profile: {
    style_summary?: string;
    tone_keywords?: string[];
    example_openers?: string[];
    example_closings?: string[];
  };
  try {
    profile = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
  }

  const sampleSnippets = drafts.slice(0, 3).map((d) => d.body.substring(0, 200));

  await supabase
    .from("oe_email_style")
    .upsert({
      id: STYLE_ID,
      style_summary: profile.style_summary || "Professional dental practice voice.",
      tone_keywords: profile.tone_keywords || [],
      example_openers: profile.example_openers || [],
      example_closings: profile.example_closings || [],
      sample_snippets: sampleSnippets,
      generated_at: new Date().toISOString(),
      source_draft_count: drafts.length,
    });

  return NextResponse.json({
    success: true,
    draftsAnalyzed: drafts.length,
    summary: profile.style_summary,
  });
}
