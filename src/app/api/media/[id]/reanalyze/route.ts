import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/media/[id]/reanalyze — re-trigger AI analysis + story generation on an existing asset
export async function POST(req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const supabase = createServiceSupabase();

  const { data: asset } = await supabase
    .from("media_assets")
    .select("id, blob_url, uploaded_by")
    .eq("id", id)
    .single();

  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Kick off analysis fire-and-forget
  fetch(`${req.nextUrl.origin}/api/ai/analyze-media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assetId: asset.id, blobUrl: asset.blob_url }),
  }).catch(() => {});

  return NextResponse.json({ success: true });
}
