export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { HrOnboardingClient } from "./onboarding-client";

export default async function HrOnboardingPage() {
  const supabase = createServiceSupabase();

  const [{ data: offers }, { data: employees }] = await Promise.all([
    supabase
      .from("oe_offer_letters")
      .select("id, created_at, candidate_first_name, candidate_last_name, candidate_email, job_title, department, employment_type, start_date, salary_amount, salary_unit, hourly_rate, status, sent_at, signed_at, expires_at, employee_id")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("oe_employees")
      .select("id, first_name, last_name, role, hire_date, status")
      .eq("status", "active")
      .order("hire_date", { ascending: false })
      .limit(20),
  ]);

  // Fetch onboarding tasks for recent employees
  const recentEmployeeIds = (employees || []).slice(0, 10).map((e) => e.id);
  const { data: tasks } = recentEmployeeIds.length > 0
    ? await supabase
        .from("oe_onboarding_tasks")
        .select("*")
        .in("employee_id", recentEmployeeIds)
    : { data: [] };

  return (
    <HrOnboardingClient
      initialOffers={offers || []}
      recentEmployees={employees || []}
      onboardingTasks={tasks || []}
    />
  );
}
