import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"];
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const PRACTICE_ID = "ak-ultimate-dental";

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed. Use JPG, PNG, WEBP, or HEIC." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large. Max 20 MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const assetId = crypto.randomUUID();
  const blobPath = `pending/${PRACTICE_ID}/${assetId}.${ext}`;

  // Upload to Vercel Blob
  let blob: Awaited<ReturnType<typeof put>>;
  try {
    blob = await put(blobPath, file, {
      access: "public",
      contentType: file.type,
    });
  } catch (err) {
    console.error("[media/upload] Blob upload error:", err);
    return NextResponse.json({ error: `Blob upload failed: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }

  // Create media_assets record
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      id: assetId,
      practice_id: PRACTICE_ID,
      uploaded_by: auth.userId!,
      blob_url: blob.url,
      pending_blob_url: blob.url,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[media/upload] Supabase insert error:", error.message, error.code, error.details);
    return NextResponse.json({ error: `Failed to save asset record: ${error.message}` }, { status: 500 });
  }

  // Fire-and-forget AI analysis
  fetch(`${req.nextUrl.origin}/api/ai/analyze-media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assetId: data.id, blobUrl: blob.url }),
  }).catch(() => {});

  return NextResponse.json({ success: true, assetId: data.id, blobUrl: blob.url }, { status: 201 });
}
