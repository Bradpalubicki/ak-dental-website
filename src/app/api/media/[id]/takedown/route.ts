import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/media/[id]/takedown
// Soft-deletes: sets status=archived, hides from public site immediately.
// A scheduled job (or the next hard-delete run) permanently removes blobs + DB row after 30 days.
export async function POST(_req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const supabase = createServiceSupabase();

  const { data: asset, error: fetchError } = await supabase
    .from("media_assets")
    .select("id, uploaded_by, status")
    .eq("id", id)
    .single();

  if (fetchError || !asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (asset.uploaded_by !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const archiveExpiresAt = new Date();
  archiveExpiresAt.setDate(archiveExpiresAt.getDate() + 30);

  await supabase
    .from("media_assets")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
      archive_expires_at: archiveExpiresAt.toISOString(),
    })
    .eq("id", id);

  return NextResponse.json({ success: true, expires_at: archiveExpiresAt.toISOString() });
}
