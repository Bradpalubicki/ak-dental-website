export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { ProvidersClient } from "./providers-client";
import type { Provider, Referral } from "@/types/database";

export default async function ProvidersPage() {
  const supabase = createServiceSupabase();

  const [providersRes, referralsRes] = await Promise.all([
    supabase
      .from("oe_providers")
      .select("*")
      .order("last_name", { ascending: true }),
    supabase
      .from("oe_referrals")
      .select("*, patient:oe_patients(id, first_name, last_name), referring_provider:oe_providers(id, first_name, last_name, title)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const providers = (providersRes.data || []) as Provider[];
  const referrals = (referralsRes.data || []) as Referral[];

  const stats = {
    total: providers.length,
    active: providers.filter((p) => p.is_active).length,
    accepting: providers.filter((p) => p.is_active && p.accepting_new_patients).length,
    totalReferrals: referrals.length,
    pendingReferrals: referrals.filter((r) => r.status === "pending").length,
  };

  return <ProvidersClient initialProviders={providers} initialReferrals={referrals} stats={stats} />;
}
