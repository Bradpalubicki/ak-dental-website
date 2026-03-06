export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { MediaClient } from "./media-client";

export const metadata = {
  title: "My Media | AK Ultimate Dental",
};

const PRACTICE_ID = "ak-ultimate-dental";

export default async function MediaPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServiceSupabase();
  const { data: assets } = await supabase
    .from("media_assets")
    .select("id, blob_url, pending_blob_url, status, photo_type, service_category, before_or_after, caption, case_notes, placement, ai_category, created_at, rejection_reason")
    .eq("practice_id", PRACTICE_ID)
    .order("created_at", { ascending: false })
    .limit(100);

  return <MediaClient initialAssets={(assets ?? []) as Parameters<typeof MediaClient>[0]["initialAssets"]} />;
}
