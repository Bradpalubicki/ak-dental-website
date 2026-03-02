// Dev-only route to seed demo notifications
// Only callable in non-production environments

import { createServiceSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.NODE_ENV === "production" && !process.env.DEMO_MODE) {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const supabase = createServiceSupabase();

  const seeds = [
    { type: "lead", title: "New Lead", body: "Sarah Johnson submitted a cosmetic consultation inquiry (high urgency)", link: "/dashboard/leads" },
    { type: "appointment", title: "Appointment Scheduled", body: "New appointment scheduled for Mar 4", link: "/dashboard/appointments" },
    { type: "insurance", title: "Insurance Verification Complete", body: "Delta Dental verified for Michael Chen", link: "/dashboard/insurance" },
    { type: "ai", title: "AI Action Pending", body: "AI drafted a response for lead James Kim — review before sending", link: "/dashboard/leads" },
    { type: "hr", title: "New Hire Onboarding", body: "Emily Rodriguez has pending onboarding tasks", link: "/dashboard/hr/onboarding" },
    { type: "billing", title: "Claim Submitted", body: "Claim #CLM-2024-0342 submitted to Cigna for $1,250", link: "/dashboard/billing" },
    { type: "warning", title: "No-Show Alert", body: "David Park missed their 2:00 PM appointment", link: "/dashboard/appointments" },
  ];

  const { error } = await supabase.from("oe_notifications").insert(seeds);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ seeded: seeds.length });
}
