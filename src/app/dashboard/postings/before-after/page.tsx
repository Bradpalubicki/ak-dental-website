export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { BeforeAfterManager } from "./before-after-manager";

export const metadata = {
  title: "Before & After Photos | AK Ultimate Dental",
};

const PRACTICE_ID = "ak-ultimate-dental";

export default async function BeforeAfterPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServiceSupabase();
  const { data: assets } = await supabase
    .from("media_assets")
    .select("id, blob_url, pending_blob_url, status, photo_type, service_category, before_or_after, pair_group_id, caption, case_notes, placement, ai_category, story_headline, story_body, story_treatment_summary, created_at, rejection_reason")
    .eq("practice_id", PRACTICE_ID)
    .eq("photo_type", "patient_result")
    .order("created_at", { ascending: false })
    .limit(200);

  return <BeforeAfterManager initialAssets={(assets ?? []) as Parameters<typeof BeforeAfterManager>[0]["initialAssets"]} />;
}
