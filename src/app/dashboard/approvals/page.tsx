export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { ApprovalsClient } from "./approvals-client";

export default async function ApprovalsPage() {
  const supabase = createServiceSupabase();

  // Fetch pending approvals with related patient/lead info
  const { data: pendingActions } = await supabase
    .from("oe_ai_actions")
    .select("*")
    .eq("status", "pending_approval")
    .order("created_at", { ascending: true });

  // Fetch recently processed (last 20)
  const { data: recentActions } = await supabase
    .from("oe_ai_actions")
    .select("*")
    .in("status", ["approved", "executed", "rejected"])
    .order("created_at", { ascending: false })
    .limit(20);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const pending = (pendingActions || []).map((a: any) => ({
    id: a.id as string,
    actionType: a.action_type as string,
    module: a.module as string,
    description: a.description as string,
    inputData: a.input_data as Record<string, any> | null,
    outputData: a.output_data as Record<string, any> | null,
    status: a.status as string,
    confidenceScore: a.confidence_score as number | null,
    patientId: a.patient_id as string | null,
    leadId: a.lead_id as string | null,
    createdAt: a.created_at as string,
  }));

  const recent = (recentActions || []).map((a: any) => ({
    id: a.id as string,
    actionType: a.action_type as string,
    module: a.module as string,
    description: a.description as string,
    status: a.status as string,
    approvedBy: a.approved_by as string | null,
    approvedAt: a.approved_at as string | null,
    createdAt: a.created_at as string,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return <ApprovalsClient pendingActions={pending} recentActions={recent} />;
}
