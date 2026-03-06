import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { createServiceSupabase } from "@/lib/supabase/server";

// Vercel Cron: runs daily at 2 AM UTC
// 1. Auto-expires specials and announcements past their expires_at
// 2. Hard-deletes archived media_assets where archive_expires_at < now()

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabase();
  const results: Record<string, number> = {};

  // 1. Expire specials
  const { count: specialsExpired } = await supabase
    .from("practice_specials")
    .update({ status: "expired" })
    .eq("status", "active")
    .lt("expires_at", new Date().toISOString())
    .not("expires_at", "is", null);
  results.specials_expired = specialsExpired ?? 0;

  // 2. Expire announcements
  const { count: announcementsExpired } = await supabase
    .from("practice_announcements")
    .update({ status: "expired" })
    .eq("status", "active")
    .lt("expires_at", new Date().toISOString())
    .not("expires_at", "is", null);
  results.announcements_expired = announcementsExpired ?? 0;

  // 3. Hard-delete archived media past 30-day window
  const { data: toDelete } = await supabase
    .from("media_assets")
    .select("id, blob_url, pending_blob_url")
    .eq("status", "archived")
    .lt("archive_expires_at", new Date().toISOString())
    .not("archive_expires_at", "is", null)
    .limit(50);

  let hardDeleted = 0;
  for (const asset of toDelete ?? []) {
    try {
      if (asset.blob_url) await del(asset.blob_url).catch(() => {});
      if (asset.pending_blob_url) await del(asset.pending_blob_url).catch(() => {});
      await supabase.from("media_assets").delete().eq("id", asset.id);
      hardDeleted++;
    } catch {
      // log and continue
    }
  }
  results.media_hard_deleted = hardDeleted;

  return NextResponse.json({ ok: true, ...results });
}
