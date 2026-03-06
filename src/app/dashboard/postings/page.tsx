export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { PostingsHub } from "./postings-hub";

export const metadata = {
  title: "Website Postings | AK Ultimate Dental",
};

const PRACTICE_ID = "ak-ultimate-dental";

export default async function PostingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServiceSupabase();

  // Fetch active postings for the "What's live now" summary
  const { data: assets } = await supabase
    .from("media_assets")
    .select("id, blob_url, status, photo_type, service_category, before_or_after, story_headline, created_at, published_at")
    .eq("practice_id", PRACTICE_ID)
    .in("status", ["published", "pending"])
    .order("created_at", { ascending: false })
    .limit(50);

  const published = (assets ?? []).filter((a) => a.status === "published");
  const pending = (assets ?? []).filter((a) => a.status === "pending");

  return <PostingsHub published={published} pending={pending} />;
}
