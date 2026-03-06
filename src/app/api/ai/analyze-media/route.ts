import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { put, del } from "@vercel/blob";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";

// Auto-publish when AI + consent checks all pass — no human review needed
async function autoPublish(assetId: string, asset: Record<string, unknown>, placement: string) {
  const supabase = createServiceSupabase();
  let publishedUrl = asset.blob_url as string;

  if (asset.pending_blob_url && (asset.pending_blob_url as string).includes("/pending/")) {
    try {
      const res = await fetch(asset.pending_blob_url as string);
      const buffer = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") || "image/jpeg";
      const ext = (asset.pending_blob_url as string).split(".").pop() || "jpg";
      const newBlob = await put(`published/${asset.practice_id}/${assetId}.${ext}`, Buffer.from(buffer), { access: "public", contentType });
      publishedUrl = newBlob.url;
      await del(asset.pending_blob_url as string).catch(() => {});
    } catch { /* keep existing URL on failure */ }
  }

  await supabase.from("media_assets").update({
    status: "published",
    blob_url: publishedUrl,
    pending_blob_url: null,
    reviewed_by: "ai-auto",
    reviewed_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    placement,
  }).eq("id", assetId);
}

const BodySchema = z.object({
  assetId: z.string().uuid(),
  blobUrl: z.string().url(),
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  // Internal route — no Clerk auth required (called server-side after upload)
  const body = BodySchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { assetId, blobUrl } = body.data;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "url", url: blobUrl },
            },
            {
              type: "text",
              text: `You are analyzing a photo uploaded by a dental practice for their website.

Analyze this image and respond with ONLY valid JSON matching this schema exactly:
{
  "category": "before_after" | "team" | "office" | "equipment" | "other",
  "description": "1-2 sentence description of what the image shows",
  "suggested_placement": "smile_gallery" | "team_page" | "about_page" | "homepage_hero" | "services/cosmetic-dentistry" | "other",
  "detected_tags": ["tag1", "tag2"],
  "contains_identifiable_person": true | false,
  "quality_assessment": "good" | "acceptable" | "poor",
  "quality_notes": "Brief note on lighting, focus, angle quality"
}

Category guide:
- before_after: dental transformation photos showing teeth results
- team: photos of staff members or the dentist
- office: reception, exam room, exterior, or facility photos
- equipment: dental technology or equipment photos
- other: anything else

Only return the JSON object, no other text.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : "{}";

    let analysis: {
      category?: string;
      description?: string;
      suggested_placement?: string;
      detected_tags?: string[];
      contains_identifiable_person?: boolean;
      quality_assessment?: string;
      quality_notes?: string;
    } = {};

    try {
      // Strip markdown code fences if present
      const clean = text.replace(/^```json?\s*/i, "").replace(/\s*```$/, "");
      analysis = JSON.parse(clean);
    } catch {
      analysis = { category: "other", description: "Could not analyze image.", quality_assessment: "acceptable" };
    }

    const supabase = createServiceSupabase();

    // Fetch full asset record to check consent + photo_type
    const { data: asset } = await supabase
      .from("media_assets")
      .select("*")
      .eq("id", assetId)
      .single();

    await supabase
      .from("media_assets")
      .update({
        ai_category: analysis.category ?? "other",
        ai_description: analysis.description ?? null,
        ai_placement_suggestion: analysis.suggested_placement ?? null,
        ai_tags: analysis.detected_tags ?? [],
        ai_contains_person: analysis.contains_identifiable_person ?? false,
        ai_quality: analysis.quality_assessment ?? "acceptable",
        ai_quality_notes: analysis.quality_notes ?? null,
      })
      .eq("id", assetId);

    // Auto-publish compliance check:
    // - Photo quality is not "poor"
    // - For patient_result: consent must be confirmed
    // - Non-patient photos (office, team, equipment) auto-publish freely
    const qualityPasses = analysis.quality_assessment !== "poor";
    const isPatient = asset?.photo_type === "patient_result";
    const consentPasses = !isPatient || asset?.consent_confirmed === true;
    const categoryOk = analysis.category !== "other"; // must be identifiable dental content

    if (asset && qualityPasses && consentPasses && categoryOk) {
      const placement = analysis.suggested_placement ?? (isPatient ? "smile_gallery" : "about_page");
      await autoPublish(assetId, asset, placement);
      return NextResponse.json({ success: true, analysis, auto_published: true, placement });
    }

    return NextResponse.json({ success: true, analysis, auto_published: false });
  } catch (err) {
    console.error("[analyze-media] error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
