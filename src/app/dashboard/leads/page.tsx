import { createServiceSupabase } from "@/lib/supabase/server";
import { LeadsClient } from "./leads-client";
import type { Lead } from "@/types/database";

export default async function LeadsPage() {
  const supabase = createServiceSupabase();

  const { data } = await supabase
    .from("oe_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return <LeadsClient initialLeads={(data || []) as Lead[]} />;
}
