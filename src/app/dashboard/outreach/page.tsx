export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { OutreachClient } from "./outreach-client";

export default async function OutreachPage() {
  const supabase = createServiceSupabase();

  const { data } = await supabase
    .from("oe_outreach_workflows")
    .select("*")
    .order("created_at", { ascending: true });

  return <OutreachClient initialWorkflows={data || []} />;
}
