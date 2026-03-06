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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJson(text: string): any {
  try {
    const clean = text.trim().replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
    return JSON.parse(clean);
  } catch {
    return {};
  }
}

// Pass 1: Technical analysis — includes before/after verification
async function runAnalysis(blobUrl: string, clientLabel?: string) {
  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "url", url: blobUrl } },
        { type: "text", text: `Analyze this dental practice photo and respond with ONLY valid JSON:
{
  "category": "before_after" | "team" | "office" | "equipment" | "other",
  "description": "1-2 sentence factual description",
  "suggested_placement": "smile_gallery" | "team_page" | "about_page" | "homepage_hero" | "services/cosmetic-dentistry" | "other",
  "detected_tags": ["tag1", "tag2"],
  "contains_identifiable_person": true | false,
  "quality_assessment": "good" | "acceptable" | "poor",
  "quality_notes": "Brief note on lighting, focus, angle",
  "visible_treatments": ["veneer", "whitening", "implant", "crown", "bonding", "gum_contouring", "orthodontics", "general"],
  "verified_before_or_after": "before" | "after" | "na" | "unknown"
}

CRITICAL — before/after verification:
- "before": teeth show visible problems — discoloration, chips, gaps, misalignment, missing teeth, staining, decay, worn enamel, crowding
- "after": teeth look treated — bright white, straight, restored, uniform, veneers visible, implants, clean gum line
- "na": single result photo not intended as a pair, or no teeth visible
- "unknown": cannot determine

${clientLabel ? `The client labeled this photo as "${clientLabel}". Verify if that label is correct based on what you actually see. If the label is wrong, return the correct value.` : ""}

Category: before_after=teeth transformation, team=staff/doctor, office=facility, equipment=dental tech, other=unclear.
Only return the JSON.` },
      ],
    }],
  });
  const text = res.content[0].type === "text" ? res.content[0].text : "{}";
  return parseJson(text);
}

// Pass 2: Storytelling agent — writes patient-facing copy that converts
async function runStorytelling(blobUrl: string, asset: Record<string, unknown>, analysis: Record<string, unknown>) {
  const photoType = asset.photo_type as string;
  const serviceCategory = asset.service_category as string;
  const beforeOrAfter = asset.before_or_after as string;
  const caseNotes = asset.case_notes as string;
  const treatments = (analysis.visible_treatments as string[])?.join(", ") || serviceCategory || "dental treatment";

  const isPatient = photoType === "patient_result";

  const systemPrompt = `You are an expert dental marketing copywriter for AK Ultimate Dental in Las Vegas, NV — a high-end cosmetic dental practice led by Dr. Alex Chireau.

You write compelling before & after stories and photo captions that:
- Lead with the PATIENT OUTCOME and emotional transformation, not the procedure name
- Use warm, confident, aspirational language — the tone of a trusted friend who happens to be an expert
- Avoid clinical jargon (say "straighter smile" not "Class I occlusion")
- Speak to the reader's deepest desire: to feel confident, attractive, and not self-conscious about their smile
- Mention Las Vegas lifestyle naturally (photos, events, confidence at work, dating, etc.) when relevant
- Never sound salesy or pushy — let the result speak
- Are HIPAA-safe: never mention patient name, age, or identifying details

You know these truths about dental patients:
- Most patients delayed treatment for years out of fear, cost concern, or thinking it wasn't possible for them
- The #1 thing patients say after cosmetic dentistry: "I wish I had done this sooner"
- Veneers patients care about: looking natural, not "fake" or "big horse teeth"
- Implant patients care about: eating normally again, not having a gap they hide
- Whitening patients care about: looking younger and more energetic in photos
- Smile makeover patients care about: the total transformation of how others perceive them
- Before photos should evoke empathy and recognition ("I felt like this too")
- After photos should evoke genuine excitement and possibility ("This could be me")`;

  const userPrompt = isPatient
    ? `Write compelling patient-facing copy for this ${beforeOrAfter === "before" ? "BEFORE" : beforeOrAfter === "after" ? "AFTER" : "result"} photo.

Treatment performed: ${treatments}
${caseNotes ? `Internal case notes (do NOT quote directly, use as inspiration only): ${caseNotes}` : ""}
Photo type: ${beforeOrAfter === "before" ? "before treatment" : beforeOrAfter === "after" ? "after treatment" : "completed result"}

Respond with ONLY valid JSON:
{
  "headline": "Short punchy headline, 6-10 words, emotion-first. Examples: 'She stopped hiding her smile at 34.' / 'Same-day. Permanent. Life-changing.' / 'The smile he was afraid to ask for.'",
  "body": "2-3 sentence story that makes the reader feel something. Paint the before situation briefly, then the transformation. End with a line that makes them imagine themselves getting the same result. DO NOT mention the patient by name or any identifying detail.",
  "caption": "Single sentence for the photo caption on the gallery page. Warm, specific to the treatment, ends with quiet confidence.",
  "treatment_summary": "1 sentence plain-English summary of what was done. Example: '6 porcelain veneers, completed in two appointments.'"
}`
    : `Write compelling copy for this ${photoType} photo of AK Ultimate Dental.

Photo shows: ${analysis.description || "dental practice"}

Respond with ONLY valid JSON:
{
  "headline": "Short, welcoming headline for this photo. 5-8 words.",
  "body": "1-2 sentences that make a prospective patient feel at ease and excited to visit.",
  "caption": "Single sentence photo caption.",
  "treatment_summary": ""
}`;

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "url", url: blobUrl } },
          { type: "text", text: userPrompt },
        ],
      },
    ],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "{}";
  return parseJson(text);
}

export async function POST(req: NextRequest) {
  const body = BodySchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { assetId, blobUrl } = body.data;

  try {
    const supabase = createServiceSupabase();

    // Fetch asset record
    const { data: asset } = await supabase
      .from("media_assets")
      .select("*")
      .eq("id", assetId)
      .single();

    // Pass 1: analysis — pass client's label so AI can verify it
    const clientLabel = asset?.before_or_after as string | undefined;
    const analysis = await runAnalysis(blobUrl, clientLabel);

    // Determine the correct before_or_after value:
    // If AI verified a different label than what the client said, trust the AI
    const aiVerified = analysis.verified_before_or_after as string;
    const correctedLabel = (aiVerified && aiVerified !== "unknown")
      ? aiVerified
      : (clientLabel ?? "na");
    const labelWasCorrected = aiVerified && aiVerified !== "unknown" && aiVerified !== clientLabel;

    // Pass 2: storytelling — now with analysis data
    const storyFinal = asset
      ? await runStorytelling(blobUrl, { ...asset, before_or_after: correctedLabel }, analysis)
      : {};

    // Save all AI outputs — including corrected before_or_after
    await supabase
      .from("media_assets")
      .update({
        ai_category: (analysis.category as string) ?? "other",
        ai_description: (analysis.description as string) ?? null,
        ai_placement_suggestion: (analysis.suggested_placement as string) ?? null,
        ai_tags: (analysis.detected_tags as string[]) ?? [],
        ai_contains_person: (analysis.contains_identifiable_person as boolean) ?? false,
        ai_quality: (analysis.quality_assessment as string) ?? "acceptable",
        ai_quality_notes: [
          analysis.quality_notes,
          labelWasCorrected ? `⚠️ Label corrected: client said "${clientLabel}", AI detected "${correctedLabel}"` : null,
        ].filter(Boolean).join(" | ") || null,
        story_headline: (storyFinal.headline as string) ?? null,
        story_body: (storyFinal.body as string) ?? null,
        story_caption: (storyFinal.caption as string) ?? null,
        story_treatment_summary: (storyFinal.treatment_summary as string) ?? null,
        // Correct the before_or_after if AI disagrees with client's label
        ...(labelWasCorrected ? { before_or_after: correctedLabel } : {}),
        // Use AI caption as the public caption if none was provided by client
        ...(asset && !asset.caption && storyFinal.caption
          ? { caption: storyFinal.caption }
          : {}),
      })
      .eq("id", assetId);

    // Auto-publish compliance check
    const qualityPasses = analysis.quality_assessment !== "poor";
    const isPatient = asset?.photo_type === "patient_result";
    const consentPasses = !isPatient || asset?.consent_confirmed === true;
    const categoryOk = analysis.category !== "other";

    if (asset && qualityPasses && consentPasses && categoryOk) {
      const placement = (analysis.suggested_placement as string) ?? (isPatient ? "smile_gallery" : "about_page");
      await autoPublish(assetId, asset as Record<string, unknown>, placement);
      return NextResponse.json({ success: true, analysis, story: storyFinal, auto_published: true, placement, label_corrected: labelWasCorrected, corrected_to: correctedLabel });
    }

    return NextResponse.json({ success: true, analysis, story: storyFinal, auto_published: false, label_corrected: labelWasCorrected, corrected_to: correctedLabel });
  } catch (err) {
    console.error("[analyze-media] error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
