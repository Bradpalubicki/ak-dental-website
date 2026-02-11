export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { BillingClient } from "./billing-client";
import type { BillingClaim } from "@/types/database";

export default async function BillingPage() {
  const supabase = createServiceSupabase();

  const { data } = await supabase
    .from("oe_billing_claims")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const claims = (data || []) as BillingClaim[];

  // Pre-compute totals server-side
  const totalBilled = claims.reduce((sum, c) => sum + Number(c.billed_amount || 0), 0);
  const totalCollected = claims.reduce((sum, c) => sum + Number(c.insurance_paid || 0), 0);
  const totalOutstanding = claims
    .filter((c) => c.status !== "paid" && c.status !== "written_off")
    .reduce((sum, c) => sum + Number(c.billed_amount || 0) - Number(c.insurance_paid || 0), 0);

  return (
    <BillingClient
      data={{
        claims,
        totalBilled,
        totalCollected,
        totalOutstanding,
      }}
    />
  );
}
