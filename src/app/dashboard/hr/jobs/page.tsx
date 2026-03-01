export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { HrJobsClient } from "./jobs-client";

export default async function HrJobsPage() {
  const supabase = createServiceSupabase();

  const { data: jobs } = await supabase
    .from("oe_job_postings")
    .select("*")
    .order("created_at", { ascending: false });

  // Gusto connection status
  const { data: gusto } = await supabase
    .from("oe_gusto_connection")
    .select("status, gusto_company_name, last_synced_at, error_message")
    .eq("practice_id", "ak-dental")
    .single();

  return (
    <HrJobsClient
      initialJobs={jobs || []}
      gustoConnection={gusto ?? { status: "disconnected" }}
    />
  );
}
