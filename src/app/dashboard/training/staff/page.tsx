export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { clerkClient } from "@clerk/nextjs/server";
import { StaffTrainingClient } from "./staff-training-client";

const CLINICAL_ROLES = ["owner-dentist", "associate-dentist", "dental-assistant"];
const ALL_MODULES = ["hipaa", "osha", "scheduling_insurance", "clinical_documentation", "treatment_presentation", "collections_financials"];

export default async function StaffTrainingPage() {
  const supabase = createServiceSupabase();
  const client = await clerkClient();

  // Get all users in the org
  const { data: userList } = await client.users.getUserList({ limit: 100 });
  const { data: completions } = await supabase
    .from("oe_training_completions")
    .select("*");

  const completionMap: Record<string, Record<string, { passed: boolean; completed_at: string }>> = {};
  for (const c of completions || []) {
    if (!completionMap[c.user_id]) completionMap[c.user_id] = {};
    completionMap[c.user_id][c.module] = { passed: c.passed, completed_at: c.completed_at };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  const staff = userList.map((u) => {
    const role = (u.publicMetadata as Record<string, string>)?.role || "staff";
    const isClinical = CLINICAL_ROLES.includes(role);
    const userCompletions = completionMap[u.id] || {};
    const requiredModules = isClinical
      ? ["hipaa", "osha"]
      : ["hipaa"];
    const completedRequired = requiredModules.filter((m) => userCompletions[m]?.passed);
    const oshaRequired = isClinical;
    const oshaComplete = !!userCompletions.osha?.passed;
    const hipaaComplete = !!userCompletions.hipaa?.passed;
    const createdAt = new Date(u.createdAt);
    const isNewAndUntrained = isClinical && !oshaComplete && createdAt < sevenDaysAgo;

    return {
      id: u.id,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.emailAddresses[0]?.emailAddress || "Unknown",
      email: u.emailAddresses[0]?.emailAddress || "",
      role,
      isClinical,
      oshaRequired,
      hipaaComplete,
      oshaComplete,
      completedRequired: completedRequired.length,
      totalRequired: requiredModules.length,
      modules: ALL_MODULES.reduce((acc, m) => {
        acc[m] = userCompletions[m] || null;
        return acc;
      }, {} as Record<string, { passed: boolean; completed_at: string } | null>),
      alertOsha: isNewAndUntrained,
      createdAt: u.createdAt,
    };
  });

  return <StaffTrainingClient staff={staff} />;
}
