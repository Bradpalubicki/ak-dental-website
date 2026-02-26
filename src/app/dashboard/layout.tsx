export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AiCommandBar } from "@/components/dashboard/ai-command-bar";
import { createServiceSupabase } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard | AK Ultimate Dental",
  description: "AI Operations Platform for AK Ultimate Dental",
};

const isReviewMode = process.env.PUBLIC_REVIEW_MODE === "true";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In review mode (Clerk dev keys), skip auth entirely to avoid ClerkMiddlewareRequestError.
  // Production Clerk keys (pk_live_) restore full auth enforcement.
  if (!isReviewMode) {
    const { userId } = await auth();
    if (!userId) {
      const { redirect } = await import("next/navigation");
      redirect("/sign-in");
    }
  }

  const supabase = createServiceSupabase();
  const today = new Date().toISOString().split("T")[0];
  const todayStart = `${today}T00:00:00.000Z`;

  const [approvalsRes, leadsRes, inboxRes, insuranceRes, appointmentsRes, hrPendingRes] =
    await Promise.all([
      supabase
        .from("oe_ai_actions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_approval"),
      supabase
        .from("oe_leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("oe_outreach_messages")
        .select("id", { count: "exact", head: true })
        .eq("direction", "inbound")
        .gte("created_at", todayStart),
      supabase
        .from("oe_insurance_verifications")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("oe_appointments")
        .select("id", { count: "exact", head: true })
        .eq("appointment_date", today)
        .eq("status", "scheduled"),
      supabase
        .from("oe_hr_documents")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_signature"),
    ]);

  const badges = {
    approvals: approvalsRes.count || 0,
    leads: leadsRes.count || 0,
    inbox: inboxRes.count || 0,
    insurance: insuranceRes.count || 0,
    appointments: appointmentsRes.count || 0,
    hrPending: hrPendingRes.count || 0,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-cyan-50/30">
      <Sidebar badges={badges} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <AiCommandBar />
    </div>
  );
}
