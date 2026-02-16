export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { DropboxClient } from "./dropbox-client";
import type { Document } from "@/types/database";

export default async function DropboxPage() {
  const supabase = createServiceSupabase();

  // Fetch documents and patients in parallel
  const [documentsResult, patientsResult] = await Promise.all([
    supabase
      .from("oe_documents")
      .select("*")
      .not("status", "eq", "deleted")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("oe_patients")
      .select("id, first_name, last_name")
      .is("deleted_at", null)
      .eq("status", "active")
      .order("last_name", { ascending: true })
      .limit(500),
  ]);

  const documents = (documentsResult.data || []) as Document[];
  const patients = (patientsResult.data || []) as {
    id: string;
    first_name: string;
    last_name: string;
  }[];

  // Compute stats
  const totalDocs = documents.length;
  const pendingProcessing = documents.filter(
    (d) => d.status === "pending" || d.status === "active"
  ).length;
  const processedToday = documents.filter((d) => {
    if (!d.ai_processed_at) return false;
    const today = new Date().toISOString().split("T")[0];
    return d.ai_processed_at.startsWith(today);
  }).length;
  const totalStorageBytes = documents.reduce((sum, d) => sum + (d.file_size || 0), 0);
  const storageUsedMB = Math.round((totalStorageBytes / (1024 * 1024)) * 10) / 10;

  return (
    <DropboxClient
      initialDocuments={documents}
      patients={patients}
      stats={{
        totalDocs,
        pendingProcessing,
        processedToday,
        storageUsedMB,
      }}
    />
  );
}
