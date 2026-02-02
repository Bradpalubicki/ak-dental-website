import { createServiceSupabase } from "@/lib/supabase/server";
import { generateLeadResponse } from "@/lib/services/ai";

/**
 * Patient Reactivation Engine
 *
 * 1. Identifies patients needing reactivation (recall, incomplete treatment, missed appt, lapsed)
 * 2. Enrolls them into reactivation sequences
 * 3. Processes active sequences whose next_send_at has passed
 * 4. Generates AI-personalized messages using SMS templates
 * 5. Queues everything for human approval (never auto-sends)
 */

/** Scan for patients who need reactivation and enroll them */
export async function enrollReactivationPatients(): Promise<{
  recall: number;
  incomplete_treatment: number;
  missed_appointment: number;
  lapsed: number;
  skipped: number;
}> {
  const supabase = createServiceSupabase();
  const results = { recall: 0, incomplete_treatment: 0, missed_appointment: 0, lapsed: 0, skipped: 0 };

  // --- RECALL: active patients with last_visit > 6 months ---
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: recallPatients } = await supabase
    .from("oe_patients")
    .select("id, first_name, last_name, last_visit, sms_opt_out")
    .eq("status", "active")
    .eq("sms_opt_out", false)
    .lt("last_visit", sixMonthsAgo.toISOString().split("T")[0])
    .order("last_visit", { ascending: true })
    .limit(20);

  if (recallPatients) {
    for (const patient of recallPatients) {
      const enrolled = await enrollIfNotActive(supabase, patient.id, "recall");
      if (enrolled) results.recall++;
      else results.skipped++;
    }
  }

  // --- INCOMPLETE TREATMENT: patients with presented/partially_accepted treatment plans ---
  const { data: incompleteTreatments } = await supabase
    .from("oe_treatment_plans")
    .select("patient_id")
    .in("status", ["presented", "partially_accepted"])
    .order("created_at", { ascending: false })
    .limit(20);

  if (incompleteTreatments) {
    const patientIds = [...new Set(incompleteTreatments.map((t) => t.patient_id))];
    for (const patientId of patientIds) {
      // Verify patient isn't opted out
      const { data: patient } = await supabase
        .from("oe_patients")
        .select("id, sms_opt_out")
        .eq("id", patientId)
        .eq("sms_opt_out", false)
        .single();

      if (patient) {
        const enrolled = await enrollIfNotActive(supabase, patientId, "incomplete_treatment");
        if (enrolled) results.incomplete_treatment++;
        else results.skipped++;
      }
    }
  }

  // --- MISSED APPOINTMENT: no-shows from the past 7 days ---
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: noShows } = await supabase
    .from("oe_appointments")
    .select("patient_id")
    .eq("status", "no_show")
    .eq("no_show_followup_sent", false)
    .gte("appointment_date", sevenDaysAgo.toISOString().split("T")[0])
    .limit(20);

  if (noShows) {
    const patientIds = [...new Set(noShows.map((a) => a.patient_id))];
    for (const patientId of patientIds) {
      const { data: patient } = await supabase
        .from("oe_patients")
        .select("id, sms_opt_out")
        .eq("id", patientId)
        .eq("sms_opt_out", false)
        .single();

      if (patient) {
        const enrolled = await enrollIfNotActive(supabase, patientId, "missed_appointment");
        if (enrolled) results.missed_appointment++;
        else results.skipped++;
      }
    }
  }

  // --- LAPSED: inactive patients or active with last_visit > 12 months ---
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const { data: lapsedPatients } = await supabase
    .from("oe_patients")
    .select("id, first_name, last_name, last_visit, sms_opt_out")
    .eq("sms_opt_out", false)
    .lt("last_visit", twelveMonthsAgo.toISOString().split("T")[0])
    .order("last_visit", { ascending: true })
    .limit(20);

  if (lapsedPatients) {
    for (const patient of lapsedPatients) {
      // Don't double-enroll if already in recall
      const enrolled = await enrollIfNotActive(supabase, patient.id, "lapsed");
      if (enrolled) results.lapsed++;
      else results.skipped++;
    }
  }

  return results;
}

/** Helper: only enroll if patient doesn't already have an active sequence of this type */
async function enrollIfNotActive(
  supabase: ReturnType<typeof createServiceSupabase>,
  patientId: string,
  reactivationType: string
): Promise<boolean> {
  const { data: existing } = await supabase
    .from("oe_patient_reactivation_sequences")
    .select("id")
    .eq("patient_id", patientId)
    .eq("reactivation_type", reactivationType)
    .in("status", ["active", "paused"])
    .limit(1);

  if (existing && existing.length > 0) return false;

  // Get first step definition
  const { data: defs } = await supabase
    .from("oe_reactivation_definitions")
    .select("delay_days")
    .eq("reactivation_type", reactivationType)
    .eq("step_number", 1)
    .eq("active", true)
    .limit(1);

  if (!defs || defs.length === 0) return false;

  const nextSendAt = new Date(Date.now() + defs[0].delay_days * 24 * 60 * 60 * 1000);

  await supabase.from("oe_patient_reactivation_sequences").insert({
    patient_id: patientId,
    reactivation_type: reactivationType,
    current_step: 1,
    status: "active",
    next_send_at: nextSendAt.toISOString(),
  });

  return true;
}

/** Process active reactivation sequences that are due to send */
export async function processReactivationSequences(): Promise<{
  processed: number;
  completed: number;
  errors: number;
}> {
  const supabase = createServiceSupabase();
  let processed = 0;
  let completed = 0;
  let errors = 0;

  // Find sequences that are due
  const { data: dueSequences } = await supabase
    .from("oe_patient_reactivation_sequences")
    .select("*")
    .eq("status", "active")
    .lte("next_send_at", new Date().toISOString())
    .order("next_send_at", { ascending: true })
    .limit(30);

  if (!dueSequences || dueSequences.length === 0) {
    return { processed: 0, completed: 0, errors: 0 };
  }

  for (const seq of dueSequences) {
    try {
      // Get the patient
      const { data: patient } = await supabase
        .from("oe_patients")
        .select("id, first_name, last_name, email, phone, status, sms_opt_out, last_visit")
        .eq("id", seq.patient_id)
        .single();

      if (!patient) {
        errors++;
        continue;
      }

      // Check if patient has reactivated (booked a new appointment) or opted out
      if (patient.sms_opt_out) {
        await supabase
          .from("oe_patient_reactivation_sequences")
          .update({ status: "opted_out", completed_at: new Date().toISOString() })
          .eq("id", seq.id);
        completed++;
        continue;
      }

      // Check for recent appointment (reactivated)
      const { data: recentAppt } = await supabase
        .from("oe_appointments")
        .select("id")
        .eq("patient_id", patient.id)
        .in("status", ["scheduled", "confirmed", "completed"])
        .gte("appointment_date", new Date().toISOString().split("T")[0])
        .limit(1);

      if (recentAppt && recentAppt.length > 0) {
        await supabase
          .from("oe_patient_reactivation_sequences")
          .update({ status: "reactivated", completed_at: new Date().toISOString() })
          .eq("id", seq.id);
        completed++;
        continue;
      }

      // Get current step definition
      const { data: stepDef } = await supabase
        .from("oe_reactivation_definitions")
        .select("*")
        .eq("reactivation_type", seq.reactivation_type)
        .eq("step_number", seq.current_step)
        .eq("active", true)
        .single();

      if (!stepDef) {
        await supabase
          .from("oe_patient_reactivation_sequences")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", seq.id);
        completed++;
        continue;
      }

      // Get SMS template
      const { data: template } = await supabase
        .from("oe_sms_templates")
        .select("body")
        .eq("name", stepDef.template_key)
        .eq("active", true)
        .single();

      let smsContent: string;
      let emailContent: string | null = null;

      if (template) {
        smsContent = template.body.replace(/\{\{first_name\}\}/g, patient.first_name);
      } else {
        const lastVisitDate = patient.last_visit
          ? new Date(patient.last_visit).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "a while";

        const aiResponse = await generateLeadResponse({
          patientName: `${patient.first_name} ${patient.last_name}`,
          inquiry: `Reactivation - ${seq.reactivation_type}`,
          message: `Patient last visited ${lastVisitDate}. Generate a warm ${seq.reactivation_type} message.`,
          source: "reactivation_sequence",
          urgency: "medium",
        });
        smsContent = aiResponse?.content || `Hi ${patient.first_name}, it's time to schedule your next visit! Call AK Ultimate Dental at (702) 935-4395.`;
      }

      if (stepDef.channel === "email" || stepDef.channel === "both") {
        const lastVisitDate = patient.last_visit
          ? new Date(patient.last_visit).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "a while";

        const aiEmail = await generateLeadResponse({
          patientName: `${patient.first_name} ${patient.last_name}`,
          inquiry: `Reactivation - ${seq.reactivation_type}`,
          message: `Reactivation step ${seq.current_step}: Patient last visited ${lastVisitDate}.`,
          source: "reactivation_email",
          urgency: "medium",
        });
        emailContent = aiEmail?.content || smsContent;
      }

      // Queue for approval
      await supabase.from("oe_ai_actions").insert({
        action_type: "patient_reactivation",
        module: "remarketing",
        description: `Reactivation step ${seq.current_step}/${seq.reactivation_type} for ${patient.first_name} ${patient.last_name}`,
        input_data: {
          sequence_id: seq.id,
          patient_id: patient.id,
          patient_name: `${patient.first_name} ${patient.last_name}`,
          email: patient.email,
          phone: patient.phone,
          step_number: seq.current_step,
          reactivation_type: seq.reactivation_type,
          channel: stepDef.channel,
          subject_line: stepDef.subject_line,
        },
        output_data: {
          sms_content: smsContent,
          email_content: emailContent,
          template_key: stepDef.template_key,
        },
        status: "pending_approval",
        patient_id: patient.id,
        confidence_score: 0.8,
      });

      // Calculate next step
      const nextStep = seq.current_step + 1;
      const { data: nextDef } = await supabase
        .from("oe_reactivation_definitions")
        .select("delay_days")
        .eq("reactivation_type", seq.reactivation_type)
        .eq("step_number", nextStep)
        .eq("active", true)
        .limit(1);

      if (nextDef && nextDef.length > 0) {
        const nextSendAt = new Date(Date.now() + nextDef[0].delay_days * 24 * 60 * 60 * 1000);
        await supabase
          .from("oe_patient_reactivation_sequences")
          .update({
            current_step: nextStep,
            last_sent_at: new Date().toISOString(),
            next_send_at: nextSendAt.toISOString(),
          })
          .eq("id", seq.id);
      } else {
        await supabase
          .from("oe_patient_reactivation_sequences")
          .update({
            last_sent_at: new Date().toISOString(),
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", seq.id);
        completed++;
      }

      processed++;
    } catch (err) {
      console.error("[Reactivation] Error processing sequence:", seq.id, err);
      errors++;
    }
  }

  return { processed, completed, errors };
}
