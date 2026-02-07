export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { PatientsClient } from "./patients-client";
import type { Patient } from "@/types/database";

export default async function PatientsPage() {
  const supabase = createServiceSupabase();

  const [patientsRes, statsRes] = await Promise.all([
    supabase
      .from("oe_patients")
      .select("*")
      .order("last_name", { ascending: true })
      .limit(200),
    supabase
      .from("oe_patients")
      .select("status", { count: "exact" }),
  ]);

  const patients = (patientsRes.data || []) as Patient[];
  const allStatuses = (statsRes.data || []) as { status: string }[];

  const stats = {
    active: allStatuses.filter((p) => p.status === "active").length,
    prospect: allStatuses.filter((p) => p.status === "prospect").length,
    inactive: allStatuses.filter((p) => p.status === "inactive").length,
    total: allStatuses.length,
  };

  return <PatientsClient initialPatients={patients} stats={stats} />;
}
