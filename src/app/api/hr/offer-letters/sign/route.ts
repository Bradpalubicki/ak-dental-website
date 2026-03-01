// Public endpoint — no Clerk auth required. Candidate signs via token link.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";

const SignSchema = z.object({
  token:          z.string().min(10),
  signature_name: z.string().min(2).max(200),
  accepted:       z.boolean(),
});

const ONBOARDING_TASKS = [
  { task_key: "offer_signed",    task_label: "Offer letter signed",              category: "paperwork"   },
  { task_key: "i9_complete",     task_label: "I-9 Employment Eligibility (I-9)", category: "paperwork"   },
  { task_key: "w4_complete",     task_label: "Federal W-4 Withholding",          category: "paperwork"   },
  { task_key: "direct_deposit",  task_label: "Direct deposit form",              category: "paperwork"   },
  { task_key: "hipaa_training",  task_label: "HIPAA training completed",         category: "compliance"  },
  { task_key: "handbook_ack",    task_label: "Employee handbook acknowledged",   category: "compliance"  },
  { task_key: "system_access",   task_label: "Dashboard access granted",         category: "systems"     },
  { task_key: "email_setup",     task_label: "Work email set up",                category: "systems"     },
  { task_key: "photo_id",        task_label: "Photo ID on file",                 category: "paperwork"   },
  { task_key: "emergency_contact", task_label: "Emergency contact on file",      category: "paperwork"   },
];

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_offer_letters")
    .select("id, candidate_first_name, candidate_last_name, job_title, department, employment_type, start_date, salary_amount, salary_unit, hourly_rate, letter_body, custom_message, status, expires_at, signed_at")
    .eq("sign_token", token)
    .single();

  if (error || !data) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
  if (data.status === "expired" || (data.expires_at && new Date(data.expires_at) < new Date())) {
    return NextResponse.json({ error: "This offer link has expired" }, { status: 410 });
  }
  if (data.status === "withdrawn") return NextResponse.json({ error: "This offer has been withdrawn" }, { status: 410 });

  // Mark as viewed if still sent
  if (data.status === "sent") {
    await supabase.from("oe_offer_letters").update({ status: "viewed" }).eq("sign_token", token);
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = SignSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

  const { token, signature_name, accepted } = parsed.data;
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

  const supabase = createServiceSupabase();

  // Fetch offer
  const { data: offer, error: fetchErr } = await supabase
    .from("oe_offer_letters")
    .select("*")
    .eq("sign_token", token)
    .single();

  if (fetchErr || !offer) return NextResponse.json({ error: "Invalid link" }, { status: 404 });
  if (offer.status === "signed") return NextResponse.json({ error: "Already signed" }, { status: 409 });
  if (offer.status === "expired" || (offer.expires_at && new Date(offer.expires_at) < new Date())) {
    return NextResponse.json({ error: "Link expired" }, { status: 410 });
  }
  if (offer.status === "withdrawn") return NextResponse.json({ error: "Offer withdrawn" }, { status: 410 });

  if (!accepted) {
    await supabase.from("oe_offer_letters").update({ status: "declined" }).eq("id", offer.id);
    return NextResponse.json({ status: "declined" });
  }

  // Sign the offer
  const now = new Date().toISOString();
  await supabase.from("oe_offer_letters").update({
    status: "signed",
    signed_at: now,
    signature_name,
    signed_ip: ip,
  }).eq("id", offer.id);

  // Create employee record
  const { data: employee } = await supabase
    .from("oe_employees")
    .insert({
      first_name: offer.candidate_first_name,
      last_name:  offer.candidate_last_name,
      email:      offer.candidate_email,
      phone:      offer.candidate_phone ?? null,
      role:       offer.job_title,
      hire_date:  offer.start_date ?? null,
      status:     "active",
      notes:      `Hired via offer letter. Signed ${new Date(now).toLocaleDateString()}.`,
    })
    .select("id")
    .single();

  if (employee) {
    // Link employee to offer
    await supabase.from("oe_offer_letters").update({ employee_id: employee.id }).eq("id", offer.id);

    // Seed onboarding checklist
    const tasks = ONBOARDING_TASKS.map((t) => ({
      ...t,
      employee_id:  employee.id,
      status:       t.task_key === "offer_signed" ? "completed" : "pending",
      completed_at: t.task_key === "offer_signed" ? now : null,
      completed_by: t.task_key === "offer_signed" ? "candidate" : null,
    }));
    await supabase.from("oe_onboarding_tasks").insert(tasks);
  }

  return NextResponse.json({ status: "signed", employee_id: employee?.id ?? null });
}
