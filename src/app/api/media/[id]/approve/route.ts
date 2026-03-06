import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/media/[id]/approve — NuStack admin approves a pending asset
export async function POST(req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));
  const placement = body.placement as string | undefined;

  const supabase = createServiceSupabase();

  // Fetch the asset
  const { data: asset, error: fetchError } = await supabase
    .from("media_assets")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
  if (asset.status === "published") {
    return NextResponse.json({ error: "Already published" }, { status: 409 });
  }

  // Move blob from pending/ to published/ if it's in pending path
  let publishedUrl = asset.blob_url;
  if (asset.pending_blob_url && asset.pending_blob_url.includes("/pending/")) {
    try {
      // Fetch the blob and re-upload to published path
      const res = await fetch(asset.pending_blob_url);
      const buffer = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") || "image/jpeg";
      const ext = asset.pending_blob_url.split(".").pop() || "jpg";
      const newPath = `published/${asset.practice_id}/${id}.${ext}`;

      const newBlob = await put(newPath, Buffer.from(buffer), {
        access: "public",
        contentType,
      });
      publishedUrl = newBlob.url;

      // Delete pending blob
      await del(asset.pending_blob_url).catch(() => {});
    } catch {
      // If move fails, keep existing URL
    }
  }

  const { error: updateError } = await supabase
    .from("media_assets")
    .update({
      status: "published",
      blob_url: publishedUrl,
      pending_blob_url: null,
      reviewed_by: auth.userId,
      reviewed_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      ...(placement ? { placement } : {}),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, publishedUrl });
}
