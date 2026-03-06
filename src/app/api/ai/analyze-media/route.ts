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
// Separate prompts per photo type, each trained on the psychological drivers:
// BEFORE: Fear + Recognition ("I felt like this too")
// AFTER: Aspiration + Possibility ("This could be me")
// SINGLE RESULT: Trust + Confidence story
// TEAM: Warmth + Safety ("You'll be in good hands")
// OFFICE: Calm + Anticipation ("This is where it happens")

const STORYTELLING_SYSTEM = `You are the lead copywriter for AK Ultimate Dental in Las Vegas, NV — a high-end cosmetic dental practice led by Dr. Alex Chireau, DDS.

Your job is to write photo copy that makes real people feel something and take action.

VOICE: Warm, direct, aspirational — like a trusted friend who is also an expert. Never clinical. Never salesy. Never generic.

RULES:
- Write for humans, not search engines
- Use plain English — "straighter teeth" not "Class II malocclusion"
- Be specific whenever possible — specificity creates trust
- Mention Las Vegas lifestyle naturally where it fits (photos, events, work, dating, family moments)
- HIPAA-safe: never use patient name, age, employer, or any identifying detail
- "I wish I had done this sooner" is the most common thing patients say — write toward that realization
- 99% of cosmetic patients delayed for years. Your copy should make them feel safe to finally act.

WHAT PATIENTS ACTUALLY CARE ABOUT (use this, not procedure names):
- Veneers: Looking natural, not "big horse teeth" or fake — just their best smile
- Implants: Eating freely again, no more gap they have to hide in photos
- Whitening: Looking younger and more energetic in every photo for years
- Crowns/bonding: The chip or crack that's been nagging them, finally gone
- Full makeover: How the world treats you differently when you lead with a confident smile`;

function buildStoryPrompt(
  photoType: string,
  beforeOrAfter: string,
  treatments: string,
  caseNotes?: string,
  description?: string,
): string {
  const treatmentContext = `Treatment performed: ${treatments}${caseNotes ? `\nCase notes (use as inspiration only, never quote directly): ${caseNotes}` : ""}`;
  const jsonShape = `Respond with ONLY valid JSON (no markdown, no explanation):
{
  "headline": "...",
  "body": "...",
  "caption": "...",
  "treatment_summary": "..."
}`;

  if (photoType === "patient_result" && beforeOrAfter === "before") {
    return `This is a BEFORE photo — the patient before their dental treatment.

${treatmentContext}

Write copy that activates RECOGNITION and EMPATHY. The reader should see this photo and think "that's exactly how I feel about my smile."

BEFORE copy rules:
- Headline: Name the specific struggle — the thing this patient lived with every day. 6-10 words. Lead with the emotional reality, not the tooth problem. Examples: "She stopped smiling in photos for three years." / "He turned down the job interview photo." / "Every mirror was a reminder of what she wanted to change."
- Body: 2-3 sentences. Name the emotional weight of the problem (hiding, avoiding, self-conscious), NOT the clinical details. Make the reader nod and feel understood. End with a quiet signal that change is possible — "It didn't have to stay this way." Leave them leaning forward.
- Caption: One sentence. Empathetic, non-judgmental. "This is where every transformation starts — with the courage to imagine something different."
- Treatment summary: Plain English, what was done. "6 porcelain veneers, completed over two appointments."

${jsonShape}`;
  }

  if (photoType === "patient_result" && beforeOrAfter === "after") {
    return `This is an AFTER photo — the patient after their dental treatment. This is the result they get to live with forever.

${treatmentContext}

Write copy that activates POSSIBILITY and ASPIRATION. The reader should see this photo and think "that could be me."

AFTER copy rules:
- Headline: Lead with the OUTCOME — what this person can now do, feel, or experience that they couldn't before. 6-10 words. Specific beats generic. Examples: "Now she smiles first in every photo." / "He got the promotion. Coincidence? We don't think so." / "Same-day veneers. The smile she always deserved." / "She stopped hiding. She'll never go back."
- Body: 2-3 sentences. Start with what changed for them (not the teeth — their life, their confidence, how they carry themselves). Use sensory or scene-specific language: "The first thing she did was call her sister and say she finally felt like herself." End with a line that invites the reader to picture this for themselves — "Your version of this is one conversation away."
- Caption: One confident sentence that anchors the transformation. Specific to what was done, ends with quiet pride.
- Treatment summary: Plain English. "Full smile makeover: 8 upper and lower porcelain veneers, in-office whitening."

${jsonShape}`;
  }

  if (photoType === "patient_result" && (beforeOrAfter === "na" || !beforeOrAfter)) {
    return `This is a single completed result photo — a patient's smile after treatment, not part of a before/after pair.

${treatmentContext}

Write copy that builds TRUST through specificity and quiet confidence. The reader is someone on the fence — not sure if this practice is right for them.

SINGLE RESULT copy rules:
- Headline: Specific outcome + quiet emotional truth. 6-10 words. Examples: "The gap is gone. Her confidence is not." / "Four veneers. One decision she'll never regret." / "This is what 'I finally did it' looks like."
- Body: 2-3 sentences. Tell the micro-story of WHY someone like this patient might have hesitated, then what it looks like on the other side. Be specific about what was done without sounding clinical. End with something that makes the reader feel this is possible for them — "If you've been thinking about it, this is your sign."
- Caption: One specific, proud sentence about the result.
- Treatment summary: Plain English, what was done.

${jsonShape}`;
  }

  if (photoType === "team") {
    return `This is a team photo of AK Ultimate Dental staff or Dr. Alex Chireau.

What the photo shows: ${description || "dental team member(s)"}

Write copy that creates WARMTH and SAFETY. A nervous new patient should see this and feel: "These are real people who will take care of me."

TEAM copy rules:
- Headline: 5-8 words. Welcoming, human, slightly personal. "The team you'll actually look forward to seeing." / "Friendly faces behind every transformation." / "Dr. Chireau and the crew who make it happen."
- Body: 2 sentences. Make the reader feel comfortable before they walk in. Reference the kind of care they'll receive, not the credentials. "You'll never feel like a number here — the whole team knows your name before you sit down."
- Caption: One warm, specific sentence.
- Treatment summary: "" (empty string)

${jsonShape}`;
  }

  if (photoType === "office") {
    return `This is an office or facility photo of AK Ultimate Dental in Las Vegas.

What the photo shows: ${description || "dental office"}

Write copy that creates CALM and POSITIVE ANTICIPATION. A nervous patient should see this and feel: "This place feels safe and beautiful — not like a regular dentist."

OFFICE copy rules:
- Headline: 5-8 words. Clean, confident, inviting. "Where Las Vegas smiles are made." / "Modern care in a space designed for comfort." / "The room where it all begins."
- Body: 1-2 sentences. Help the reader imagine being there — the feeling of walking in, settling in, being in good hands. Reference that dental anxiety is normal and this space was designed with them in mind.
- Caption: One specific, reassuring sentence.
- Treatment summary: "" (empty string)

${jsonShape}`;
  }

  if (photoType === "equipment") {
    return `This is a photo of dental technology or equipment at AK Ultimate Dental.

What the photo shows: ${description || "dental equipment"}

Write copy that builds CONFIDENCE through capability. The reader should feel: "This practice invests in the best so I get the best result."

EQUIPMENT copy rules:
- Headline: 5-8 words. Tech as benefit, not tech as tech. "Same-day results. No second guessing." / "Precision tools for permanent results."
- Body: 1-2 sentences. Translate what the tech MEANS for the patient — faster, more comfortable, more accurate, fewer visits. Never sound like a brochure.
- Caption: One specific, patient-benefit-focused sentence.
- Treatment summary: "" (empty string)

${jsonShape}`;
  }

  // Fallback for unknown photo types
  return `This is a photo from AK Ultimate Dental in Las Vegas.

What the photo shows: ${description || "dental practice"}

Write brief, welcoming copy for this photo.

- Headline: 5-8 words, warm and professional.
- Body: 1-2 sentences that make a prospective patient feel welcome and confident.
- Caption: One sentence.
- Treatment summary: "" (empty string)

${jsonShape}`;
}

async function runStorytelling(blobUrl: string, asset: Record<string, unknown>, analysis: Record<string, unknown>) {
  const photoType = (asset.photo_type as string) ?? "other";
  const serviceCategory = asset.service_category as string;
  const beforeOrAfter = asset.before_or_after as string;
  const caseNotes = asset.case_notes as string | undefined;
  const treatments = (analysis.visible_treatments as string[])?.join(", ") || serviceCategory || "dental treatment";
  const description = analysis.description as string | undefined;

  const userPrompt = buildStoryPrompt(photoType, beforeOrAfter, treatments, caseNotes, description);

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: STORYTELLING_SYSTEM,
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
