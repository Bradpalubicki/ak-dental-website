export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { CallsClient } from "./calls-client";
import type { Call } from "@/types/database";

export default async function CallsPage() {
  const supabase = createServiceSupabase();

  const { data } = await supabase
    .from("oe_calls")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return <CallsClient initialCalls={(data || []) as Call[]} />;
}
