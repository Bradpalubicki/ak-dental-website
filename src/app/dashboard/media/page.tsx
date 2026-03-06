export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createServiceSupabase } from "@/lib/supabase/server";
import { AssetCard } from "@/components/dashboard/media/asset-card";

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
    .select("id, blob_url, pending_blob_url, status, photo_type, service_category, placement, ai_category, created_at, rejection_reason")
    .eq("practice_id", PRACTICE_ID)
    .order("created_at", { ascending: false })
    .limit(100);

  const pending = assets?.filter((a) => a.status === "pending") ?? [];
  const published = assets?.filter((a) => a.status === "published") ?? [];
  const rejected = assets?.filter((a) => a.status === "rejected") ?? [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Media</h1>
          <p className="text-sm text-gray-500">{assets?.length ?? 0} photos total</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/media/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Link>
        </Button>
      </div>

      {(!assets || assets.length === 0) && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <ImageIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h2 className="font-semibold text-gray-700">No photos yet</h2>
          <p className="mt-1 text-sm text-gray-500">Upload before/after cases, team photos, and office photos.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/media/upload">Upload Your First Photo</Link>
          </Button>
        </div>
      )}

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-semibold text-gray-700">Pending Review ({pending.length})</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {pending.map((a) => (
              <AssetCard
                key={a.id}
                id={a.id}
                blobUrl={a.pending_blob_url || a.blob_url}
                status="pending"
                photoType={a.photo_type}
                serviceCategory={a.service_category}
                placement={a.placement}
                aiCategory={a.ai_category}
                createdAt={a.created_at}
              />
            ))}
          </div>
        </section>
      )}

      {published.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-semibold text-gray-700">Published ({published.length})</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {published.map((a) => (
              <AssetCard
                key={a.id}
                id={a.id}
                blobUrl={a.blob_url}
                status="published"
                photoType={a.photo_type}
                serviceCategory={a.service_category}
                placement={a.placement}
                aiCategory={a.ai_category}
                createdAt={a.created_at}
              />
            ))}
          </div>
        </section>
      )}

      {rejected.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold text-gray-700">Needs Attention ({rejected.length})</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {rejected.map((a) => (
              <AssetCard
                key={a.id}
                id={a.id}
                blobUrl={a.pending_blob_url || a.blob_url}
                status="rejected"
                photoType={a.photo_type}
                serviceCategory={a.service_category}
                placement={a.placement}
                aiCategory={a.ai_category}
                createdAt={a.created_at}
                rejectionReason={a.rejection_reason}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
