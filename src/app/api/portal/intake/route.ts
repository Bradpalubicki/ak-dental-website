import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyPortalApiAuth } from "@/lib/portal-auth";

const IntakeSchema = z.object({
  personalInfo: z.object({
    phone: z.string().min(10),
    date_of_birth: z.string().min(1),
    address: z.string().optional().default(""),
    city: z.string().optional().default(""),
    state: z.string().optional().default(""),
    zip: z.string().optional().default(""),
    emergency_contact_name: z.string().optional().default(""),
    emergency_contact_phone: z.string().optional().default(""),
    emergency_contact_relation: z.string().optional().default(""),
  }),
  medicalHistory: z.object({
    conditions: z.array(z.string()),
    medications: z.string().optional().default(""),
    allergies: z.string().optional().default(""),
    previous_dental_work: z.string().optional().default(""),
    last_dental_visit: z.string().optional().default(""),
    dental_anxiety: z.enum(["none", "mild", "moderate", "severe"]),
    reason_for_visit: z.string().min(1),
    referred_by: z.string().optional().default(""),
  }),
  insuranceInfo: z.object({
    insurance_provider: z.string().optional().default(""),
    insurance_member_id: z.string().optional().default(""),
    insurance_group_number: z.string().optional().default(""),
    insurance_subscriber_name: z.string().optional().default(""),
    insurance_subscriber_dob: z.string().optional().default(""),
    secondary_insurance: z.boolean().optional().default(false),
    secondary_provider: z.string().optional().default(""),
    secondary_member_id: z.string().optional().default(""),
  }),
  consent: z.object({
    treatment_consent: z.literal(true),
    hipaa_acknowledgment: z.literal(true),
    financial_responsibility: z.literal(true),
    sms_consent: z.boolean(),
  }),
});

export async function GET() {
  const { patient, error } = await verifyPortalApiAuth();
  if (error || !patient) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("oe_intake_submissions")
    .select("id, submitted_at")
    .eq("patient_id", patient.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ completed: !!data, submission: data });
}

export async function POST(req: NextRequest) {
  const { patient, error } = await verifyPortalApiAuth();
  if (error || !patient) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = IntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { personalInfo, medicalHistory, insuranceInfo, consent } = parsed.data;
  const supabase = createServiceSupabase();

  // Update patient record with latest personal/insurance info
  await supabase.from("oe_patients").update({
    phone: personalInfo.phone,
    date_of_birth: personalInfo.date_of_birth,
    address: personalInfo.address,
    city: personalInfo.city,
    state: personalInfo.state,
    zip: personalInfo.zip,
    insurance_provider: insuranceInfo.insurance_provider,
    insurance_member_id: insuranceInfo.insurance_member_id,
    insurance_group_number: insuranceInfo.insurance_group_number,
    sms_opt_out: !consent.sms_consent,
    updated_at: new Date().toISOString(),
  }).eq("id", patient.id);

  // Save full intake submission
  await supabase.from("oe_intake_submissions").insert({
    patient_id: patient.id,
    submitted_at: new Date().toISOString(),
    personal_info: personalInfo,
    medical_history: medicalHistory,
    insurance_info: insuranceInfo,
    consents: {
      treatment_consent: consent.treatment_consent,
      hipaa_acknowledgment: consent.hipaa_acknowledgment,
      financial_responsibility: consent.financial_responsibility,
      sms_consent: consent.sms_consent,
    },
    conditions: medicalHistory.conditions,
    medications: medicalHistory.medications,
    allergies: medicalHistory.allergies,
    dental_anxiety: medicalHistory.dental_anxiety,
    reason_for_visit: medicalHistory.reason_for_visit,
    referred_by: medicalHistory.referred_by,
  });

  // Notify front desk via ai_actions queue
  await supabase.from("oe_ai_actions").insert({
    action_type: "intake_submitted",
    module: "patients",
    description: `New patient intake submitted: ${patient.first_name} ${patient.last_name}`,
    input_data: { patient_id: patient.id },
    status: "executed",
  });

  return NextResponse.json({ success: true });
}
