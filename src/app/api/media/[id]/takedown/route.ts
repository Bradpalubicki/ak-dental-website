import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/media/[id]/takedown — client removes their own photo from the site
export async function POST(_req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const supabase = createServiceSupabase();

  const { data: asset, error: fetchError } = await supabase
    .from("media_assets")
    .select("id, blob_url, pending_blob_url, uploaded_by, status")
    .eq("id", id)
    .single();

  if (fetchError || !asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only the uploader can take down their own photo
  if (asset.uploaded_by !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete blobs from Vercel storage
  const urlsToDelete = [asset.blob_url, asset.pending_blob_url].filter(Boolean) as string[];
  await Promise.all(urlsToDelete.map((url) => del(url).catch(() => {})));

  // Hard delete the record
  await supabase.from("media_assets").delete().eq("id", id);

  return NextResponse.json({ success: true });
}
