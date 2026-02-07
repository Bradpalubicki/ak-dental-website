export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { HrClient } from "./hr-client";

export default async function HrPage() {
  const supabase = createServiceSupabase();
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];

  const [
    employeesRes,
    pendingDocsRes,
    monthDocsRes,
    monthAckedRes,
    recentDocsRes,
  ] = await Promise.all([
    supabase
      .from("oe_employees")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("oe_hr_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_signature"),
    supabase
      .from("oe_hr_documents")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${monthStart}T00:00:00.000Z`),
    supabase
      .from("oe_hr_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "acknowledged")
      .gte("updated_at", `${monthStart}T00:00:00.000Z`),
    supabase
      .from("oe_hr_documents")
      .select(
        "id, type, title, status, severity, created_at, created_by, employee:oe_employees(first_name, last_name)"
      )
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const recentDocs = (recentDocsRes.data || []).map((d: any) => ({
    id: d.id,
    type: d.type,
    title: d.title,
    status: d.status,
    severity: d.severity,
    createdAt: d.created_at,
    createdBy: d.created_by,
    employeeName: d.employee
      ? `${d.employee.first_name} ${d.employee.last_name}`
      : "Unknown",
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <HrClient
      stats={{
        activeEmployees: employeesRes.count || 0,
        pendingSignatures: pendingDocsRes.count || 0,
        documentsThisMonth: monthDocsRes.count || 0,
        acknowledgedThisMonth: monthAckedRes.count || 0,
      }}
      recentDocuments={recentDocs}
    />
  );
}
