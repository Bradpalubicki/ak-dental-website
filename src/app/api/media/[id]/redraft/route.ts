import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

const BodySchema = z.object({
  // Client's current edits (used as context for the redraft)
  current_headline: z.string().max(200).optional(),
  current_body: z.string().max(2000).optional(),
  current_treatment_summary: z.string().max(500).optional(),
  // Optional plain-English direction from the client
  direction: z.string().max(500).optional(),
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function parseJson(text: string) {
  try {
    const clean = text.trim().replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
    return JSON.parse(clean);
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const body = BodySchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const supabase = createServiceSupabase();
  const { data: asset } = await supabase
    .from("media_assets")
    .select("id, blob_url, uploaded_by, before_or_after, service_category, photo_type, story_headline, story_body, story_caption, story_treatment_summary, case_notes")
    .eq("id", id)
    .single();

  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (asset.uploaded_by !== auth.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { current_headline, current_body, current_treatment_summary, direction } = body.data;

  const directionBlock = direction?.trim()
    ? `\n\nThe client has given you this specific direction for the redraft:\n"${direction}"\nFollow this closely.`
    : "";

  const currentCopy = [
    current_headline ? `Current headline: "${current_headline}"` : null,
    current_body ? `Current body: "${current_body}"` : null,
    current_treatment_summary ? `Current treatment summary: "${current_treatment_summary}"` : null,
  ].filter(Boolean).join("\n");

  const prompt = `You are the lead copywriter for AK Ultimate Dental in Las Vegas. A client has edited the AI-generated copy for one of their patient result photos and wants a professional redraft.

PHOTO CONTEXT:
- Type: ${asset.before_or_after === "before" ? "BEFORE photo" : asset.before_or_after === "after" ? "AFTER photo" : "Patient result photo"}
- Treatment: ${asset.service_category ?? "dental treatment"}
${asset.case_notes ? `- Case notes: ${asset.case_notes}` : ""}

CURRENT COPY (what the client has written/edited):
${currentCopy}
${directionBlock}

VOICE RULES:
- Warm, direct, aspirational — never clinical, never generic, never salesy
- Plain English only ("straighter teeth" not "Class II malocclusion")
- HIPAA-safe: no patient name, age, employer, or identifying details
- Las Vegas lifestyle references where natural
- ${asset.before_or_after === "before" ? "BEFORE photo: activate Recognition and Empathy — the reader should see this and think 'that's exactly how I feel about my smile'" : "AFTER photo: activate Aspiration and Possibility — the reader should see this and think 'that could be me'"}

Redraft the copy. Keep anything that's already working well. Improve what isn't.

Respond with ONLY valid JSON:
{
  "headline": "...",
  "body": "...",
  "caption": "...",
  "treatment_summary": "..."
}`;

  try {
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "url", url: asset.blob_url } },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const text = res.content[0].type === "text" ? res.content[0].text : "{}";
    const draft = parseJson(text);

    // Return draft for client review — do NOT save yet
    return NextResponse.json({
      success: true,
      draft: {
        headline: draft.headline ?? null,
        body: draft.body ?? null,
        caption: draft.caption ?? null,
        treatment_summary: draft.treatment_summary ?? null,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Redraft failed" }, { status: 500 });
  }
}
