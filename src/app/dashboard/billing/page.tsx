export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { BillingClient } from "./billing-client";
import type { BillingClaim } from "@/types/database";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STATUS_COLORS: Record<string, string> = {
  paid: "#059669",
  pending: "#d97706",
  submitted: "#2563eb",
  denied: "#dc2626",
  appealed: "#7c3aed",
  draft: "#64748b",
  written_off: "#94a3b8",
};
const CARRIER_COLORS = ["#0891b2", "#2563eb", "#059669", "#d97706", "#7c3aed", "#64748b", "#dc2626", "#0d9488"];

export default async function BillingPage() {
  const supabase = createServiceSupabase();

  // Fetch more claims for better analytics (last 6 months worth)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data } = await supabase
    .from("oe_billing_claims")
    .select("*")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: false });

  const claims = (data || []) as BillingClaim[];

  // Pre-compute totals server-side
  const totalBilled = claims.reduce((sum, c) => sum + Number(c.billed_amount || 0), 0);
  const totalCollected = claims.reduce((sum, c) => sum + Number(c.insurance_paid || 0), 0);
  const totalOutstanding = claims
    .filter((c) => c.status !== "paid" && c.status !== "written_off")
    .reduce((sum, c) => sum + Number(c.billed_amount || 0) - Number(c.insurance_paid || 0), 0);

  // --- Monthly Billing Trend (last 6 months) ---
  const monthMap = new Map<string, { billed: number; collected: number; denied: number }>();
  for (const c of claims) {
    const d = new Date(c.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const m = monthMap.get(key) || { billed: 0, collected: 0, denied: 0 };
    m.billed += Number(c.billed_amount || 0);
    m.collected += Number(c.insurance_paid || 0);
    if (c.status === "denied" || c.status === "appealed") m.denied += Number(c.billed_amount || 0);
    monthMap.set(key, m);
  }
  const monthlyBilling = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([key, val]) => ({
      month: MONTH_NAMES[parseInt(key.split("-")[1])],
      billed: Math.round(val.billed),
      collected: Math.round(val.collected),
      denied: Math.round(val.denied),
    }));

  // --- Collection Rate Trend ---
  const collectionRateTrend = monthlyBilling.map((m) => ({
    month: m.month,
    rate: m.billed > 0 ? Math.round((m.collected / m.billed) * 1000) / 10 : 0,
  }));

  // --- Claims by Status ---
  const statusCounts = new Map<string, number>();
  for (const c of claims) statusCounts.set(c.status, (statusCounts.get(c.status) || 0) + 1);
  const totalForPct = claims.length || 1;
  const claimsByStatus = Array.from(statusCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "),
      value: Math.round((count / totalForPct) * 100),
      color: STATUS_COLORS[name] || "#64748b",
    }));

  // --- Carrier Breakdown ---
  const carrierMap = new Map<string, { claims: number; paid: number; denied: number; totalDays: number; volume: number }>();
  for (const c of claims) {
    const carrier = c.insurance_provider || "Unknown";
    const entry = carrierMap.get(carrier) || { claims: 0, paid: 0, denied: 0, totalDays: 0, volume: 0 };
    entry.claims++;
    if (c.status === "paid") entry.paid++;
    if (c.status === "denied" || c.status === "appealed") entry.denied++;
    entry.totalDays += c.aging_days || 0;
    entry.volume += Number(c.billed_amount || 0);
    carrierMap.set(carrier, entry);
  }
  const carrierBreakdown = Array.from(carrierMap.entries())
    .sort((a, b) => b[1].claims - a[1].claims)
    .slice(0, 8)
    .map(([carrier, val]) => ({
      carrier,
      claims: val.claims,
      paid: val.paid,
      denialRate: val.claims > 0 ? Math.round((val.denied / val.claims) * 1000) / 10 : 0,
      avgDays: val.claims > 0 ? Math.round(val.totalDays / val.claims) : 0,
      volume: `$${Math.round(val.volume).toLocaleString()}`,
    }));

  // --- Carrier Donut ---
  const carrierDonut = carrierBreakdown.map((c, i) => ({
    name: c.carrier,
    value: c.claims,
    color: CARRIER_COLORS[i % CARRIER_COLORS.length],
  }));

  // --- Denial Reasons ---
  const reasonCounts = new Map<string, number>();
  for (const c of claims) {
    if ((c.status === "denied" || c.status === "appealed") && c.denial_reason) {
      reasonCounts.set(c.denial_reason, (reasonCounts.get(c.denial_reason) || 0) + 1);
    }
  }
  const totalDenied = Array.from(reasonCounts.values()).reduce((s, v) => s + v, 0) || 1;
  const denialReasons = Array.from(reasonCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([reason, count]) => ({
      reason,
      count,
      pct: Math.round((count / totalDenied) * 100),
    }));

  // --- Payment Timeline ---
  const unpaid = claims.filter((c) => c.status !== "paid" && c.status !== "written_off");
  const timelineBuckets = [
    { days: "0-15", min: 0, max: 15 },
    { days: "16-30", min: 16, max: 30 },
    { days: "31-45", min: 31, max: 45 },
    { days: "46-60", min: 46, max: 60 },
    { days: "60+", min: 61, max: Infinity },
  ];
  const totalUnpaid = unpaid.length || 1;
  const paymentTimeline = timelineBuckets.map((bucket) => {
    const count = unpaid.filter((c) => (c.aging_days || 0) >= bucket.min && (c.aging_days || 0) <= bucket.max).length;
    return { days: bucket.days, count, pct: Math.round((count / totalUnpaid) * 100) };
  });

  return (
    <BillingClient
      data={{
        claims,
        totalBilled,
        totalCollected,
        totalOutstanding,
      }}
      analytics={{
        monthlyBilling,
        collectionRateTrend,
        claimsByStatus,
        carrierBreakdown,
        carrierDonut,
        denialReasons,
        paymentTimeline,
      }}
    />
  );
}
