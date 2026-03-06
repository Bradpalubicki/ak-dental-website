export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UploadClient } from "./upload-client";

export const metadata = {
  title: "Upload Photos | AK Ultimate Dental",
};

export default async function UploadPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Photos</h1>
        <p className="mt-1 text-gray-500">
          Upload patient results, office photos, or team photos. Our team reviews and publishes within 24 hours.
        </p>
      </div>
      <UploadClient />
    </div>
  );
}
