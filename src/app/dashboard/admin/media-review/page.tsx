export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { ReviewClient } from "./review-client";

export const metadata = {
  title: "Media Review | NuStack Admin",
};

export default async function MediaReviewPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServiceSupabase();
  const { data: assets } = await supabase
    .from("media_assets")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Review Queue</h1>
        <p className="text-sm text-gray-500">
          {assets?.length ?? 0} photo{(assets?.length ?? 0) !== 1 ? "s" : ""} pending approval
        </p>
      </div>
      <ReviewClient initialAssets={(assets as Parameters<typeof ReviewClient>[0]["initialAssets"]) ?? []} />
    </div>
  );
}
