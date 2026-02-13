export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { FinancialsClient } from "./financials-client";
import type { BillingClaim } from "@/types/database";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CATEGORY_COLORS: Record<string, string> = {
  Labor: "#0891b2",
  Clinical: "#059669",
  Overhead: "#2563eb",
  Growth: "#7c3aed",
  Other: "#64748b",
};

export default async function FinancialsPage() {
  const supabase = createServiceSupabase();
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split("T")[0];
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  const [metricsResult, claimsResult, expensesResult, apResult] = await Promise.all([
    // Last 6 months of daily metrics for revenue charts
    supabase
      .from("oe_daily_metrics")
      .select("date, production, collections")
      .gte("date", sixMonthsAgo)
      .order("date", { ascending: true }),

    // All unpaid claims for AR aging
    supabase
      .from("oe_billing_claims")
      .select("*, oe_patients(first_name, last_name)")
      .order("aging_days", { ascending: false })
      .limit(200),

    // Current month expenses
    supabase
      .from("oe_monthly_expenses")
      .select("label, category, amount, month")
      .gte("month", sixMonthsAgo)
      .order("month", { ascending: true }),

    // Active accounts payable
    supabase
      .from("oe_accounts_payable")
      .select("*")
      .neq("status", "paid")
      .order("due_date", { ascending: true }),
  ]);

  // Build monthly revenue from daily metrics
  const monthlyMap = new Map<string, { production: number; collections: number }>();
  for (const m of metricsResult.data || []) {
    const d = new Date(m.date + "T12:00:00");
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const existing = monthlyMap.get(key) || { production: 0, collections: 0 };
    existing.production += Number(m.production || 0);
    existing.collections += Number(m.collections || 0);
    monthlyMap.set(key, existing);
  }

  const monthlyRevenue = Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, val]) => ({
      month: MONTH_NAMES[parseInt(key.split("-")[1])],
      revenue: val.production,
    }));

  const prodVsCollections = Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, val]) => ({
      month: MONTH_NAMES[parseInt(key.split("-")[1])],
      production: val.production,
      collections: val.collections,
    }));

  // Current month totals
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const currentMonth = monthlyMap.get(currentMonthKey) || { production: 0, collections: 0 };

  // AR aging from claims
  const claims = (claimsResult.data || []) as (BillingClaim & { oe_patients?: { first_name: string; last_name: string } })[];
  const unpaid = claims.filter((c) => c.status !== "paid" && c.status !== "written_off");

  const bucketAmounts = { "0-30 days": 0, "31-60 days": 0, "61-90 days": 0, "90+ days": 0 };
  for (const c of unpaid) {
    const amount = Number(c.billed_amount || 0) - Number(c.insurance_paid || 0);
    const days = c.aging_days || 0;
    if (days <= 30) bucketAmounts["0-30 days"] += amount;
    else if (days <= 60) bucketAmounts["31-60 days"] += amount;
    else if (days <= 90) bucketAmounts["61-90 days"] += amount;
    else bucketAmounts["90+ days"] += amount;
  }

  const totalAR = Object.values(bucketAmounts).reduce((s, v) => s + v, 0);
  const arAging = [
    { bucket: "0-30 days", amount: bucketAmounts["0-30 days"], color: "bg-emerald-500", bgColor: "bg-emerald-50", textColor: "text-emerald-700", percent: totalAR > 0 ? Math.round((bucketAmounts["0-30 days"] / totalAR) * 100) : 0 },
    { bucket: "31-60 days", amount: bucketAmounts["31-60 days"], color: "bg-amber-500", bgColor: "bg-amber-50", textColor: "text-amber-700", percent: totalAR > 0 ? Math.round((bucketAmounts["31-60 days"] / totalAR) * 100) : 0 },
    { bucket: "61-90 days", amount: bucketAmounts["61-90 days"], color: "bg-orange-500", bgColor: "bg-orange-50", textColor: "text-orange-700", percent: totalAR > 0 ? Math.round((bucketAmounts["61-90 days"] / totalAR) * 100) : 0 },
    { bucket: "90+ days", amount: bucketAmounts["90+ days"], color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-700", percent: totalAR > 0 ? Math.round((bucketAmounts["90+ days"] / totalAR) * 100) : 0 },
  ];

  // Top outstanding accounts
  const topOutstandingAccounts = unpaid
    .slice(0, 5)
    .map((c) => ({
      name: c.oe_patients ? `${c.oe_patients.first_name} ${c.oe_patients.last_name}` : "Unknown",
      amount: Number(c.billed_amount || 0) - Number(c.insurance_paid || 0),
      days: c.aging_days || 0,
      insurance: c.insurance_provider || "—",
    }));

  // Build expense items from DB (current month)
  const allExpenses = expensesResult.data || [];
  const currentMonthExpenses = allExpenses.filter((e) => e.month === currentMonthStart);
  const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const expenseItems = currentMonthExpenses.map((e) => ({
    label: e.label,
    amount: Number(e.amount),
    category: e.category,
    pctOfRev: currentMonth.production > 0
      ? Math.round((Number(e.amount) / currentMonth.production) * 1000) / 10
      : 0,
  }));

  // Build expense by category (aggregate for donut chart)
  const categoryMap = new Map<string, number>();
  for (const e of currentMonthExpenses) {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + Number(e.amount));
  }
  const expenseByCategory = Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || "#64748b",
  }));

  // Build cash flow data (monthly: inflow = collections, outflow = expenses)
  const monthlyExpenseMap = new Map<string, number>();
  for (const e of allExpenses) {
    const d = new Date(e.month + "T12:00:00");
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthlyExpenseMap.set(key, (monthlyExpenseMap.get(key) || 0) + Number(e.amount));
  }

  const cashFlowData = Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, val]) => {
      const outflow = monthlyExpenseMap.get(key) || 0;
      return {
        name: MONTH_NAMES[parseInt(key.split("-")[1])],
        inflow: val.collections,
        outflow,
        net: val.collections - outflow,
      };
    });

  // Accounts payable from DB
  const accountsPayable = (apResult.data || []).map((ap) => {
    const dueDate = new Date(ap.due_date + "T12:00:00");
    const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      vendor: ap.vendor,
      description: ap.description || "",
      amount: Number(ap.amount),
      dueDate: dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: (daysUntil < 0 ? "overdue" : daysUntil <= 7 ? "due_soon" : ap.status) as "upcoming" | "due_soon" | "paid" | "overdue",
      daysUntil,
    };
  });

  // Net income
  const netIncome = currentMonth.collections - totalExpenses;

  return (
    <FinancialsClient
      data={{
        monthlyRevenue,
        prodVsCollections,
        arAging,
        topOutstandingAccounts,
        totalAR,
        mtdProduction: currentMonth.production,
        mtdCollections: currentMonth.collections,
        netIncome: Math.max(netIncome, 0),
        expenseItems,
        accountsPayable,
        cashFlowData,
        expenseByCategory,
      }}
    />
  );
}
