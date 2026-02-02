import { createServiceSupabase } from "@/lib/supabase/server";
import { generateLeadResponse } from "@/lib/services/ai";

/**
 * Lead Nurture Engine
 *
 * 1. Enrolls new unconverted leads into nurture sequences based on inquiry_type
 * 2. Processes active sequences whose next_send_at has passed
 * 3. Generates AI-personalized messages using SMS templates
 * 4. Queues everything for human approval (never auto-sends)
 */

// Map inquiry types from leads to nurture definition types
function mapInquiryType(inquiryType: string | null): string {
  if (!inquiryType) return "general";
  const normalized = inquiryType.toLowerCase();
  if (normalized.includes("cosmetic") || normalized.includes("whitening") || normalized.includes("veneer")) return "cosmetic";
  if (normalized.includes("implant")) return "implant";
  if (normalized.includes("emergency") || normalized.includes("pain") || normalized.includes("urgent")) return "emergency";
  if (normalized.includes("insurance") || normalized.includes("coverage") || normalized.includes("accept")) return "insurance";
  if (normalized.includes("new patient") || normalized.includes("new_patient") || normalized.includes("first visit")) return "new_patient";
  return "general";
}

/** Enroll new leads that don't already have a nurture sequence */
export async function enrollNewLeads(): Promise<{ enrolled: number; skipped: number }> {
  const supabase = createServiceSupabase();
  let enrolled = 0;
  let skipped = 0;

  // Find leads that are "new" or "contacted" and not yet in a nurture sequence
  const { data: leads } = await supabase
    .from("oe_leads")
    .select("id, first_name, inquiry_type, sms_opt_out, created_at")
    .in("status", ["new", "contacted"])
    .eq("sms_opt_out", false)
    .order("created_at", { ascending: true })
    .limit(50);

  if (!leads || leads.length === 0) return { enrolled: 0, skipped: 0 };

  for (const lead of leads) {
    // Check if already enrolled
    const { data: existing } = await supabase
      .from("oe_lead_nurture_sequences")
      .select("id")
      .eq("lead_id", lead.id)
      .in("status", ["active", "paused"])
      .limit(1);

    if (existing && existing.length > 0) {
      skipped++;
      continue;
    }

    const inquiryType = mapInquiryType(lead.inquiry_type);

    // Check if definitions exist for this inquiry type
    const { data: defs } = await supabase
      .from("oe_lead_nurture_definitions")
      .select("id, delay_hours")
      .eq("inquiry_type", inquiryType)
      .eq("step_number", 1)
      .eq("active", true)
      .limit(1);

    if (!defs || defs.length === 0) {
      skipped++;
      continue;
    }

    const firstStepDelay = defs[0].delay_hours;
    const nextSendAt = new Date(Date.now() + firstStepDelay * 60 * 60 * 1000);

    await supabase.from("oe_lead_nurture_sequences").insert({
      lead_id: lead.id,
      inquiry_type: inquiryType,
      current_step: 1,
      status: "active",
      next_send_at: nextSendAt.toISOString(),
    });

    enrolled++;
  }

  return { enrolled, skipped };
}

/** Process active sequences that are due to send */
export async function processNurtureSequences(): Promise<{ processed: number; completed: number; errors: number }> {
  const supabase = createServiceSupabase();
  let processed = 0;
  let completed = 0;
  let errors = 0;

  // Find sequences that are due
  const { data: dueSequences } = await supabase
    .from("oe_lead_nurture_sequences")
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
      // Get the lead
      const { data: lead } = await supabase
        .from("oe_leads")
        .select("id, first_name, last_name, email, phone, status, sms_opt_out, message, inquiry_type")
        .eq("id", seq.lead_id)
        .single();

      if (!lead) {
        errors++;
        continue;
      }

      // Check if lead has converted or opted out
      if (lead.status === "converted" || lead.status === "appointment_booked") {
        await supabase
          .from("oe_lead_nurture_sequences")
          .update({ status: "converted", completed_at: new Date().toISOString() })
          .eq("id", seq.id);
        completed++;
        continue;
      }

      if (lead.sms_opt_out) {
        await supabase
          .from("oe_lead_nurture_sequences")
          .update({ status: "opted_out", completed_at: new Date().toISOString() })
          .eq("id", seq.id);
        completed++;
        continue;
      }

      // Get current step definition
      const { data: stepDef } = await supabase
        .from("oe_lead_nurture_definitions")
        .select("*")
        .eq("inquiry_type", seq.inquiry_type)
        .eq("step_number", seq.current_step)
        .eq("active", true)
        .single();

      if (!stepDef) {
        // No more steps - sequence complete
        await supabase
          .from("oe_lead_nurture_sequences")
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

      // Generate content: use template if available, otherwise AI-generate
      let smsContent: string;
      let emailContent: string | null = null;

      if (template) {
        smsContent = template.body.replace(/\{\{first_name\}\}/g, lead.first_name);
      } else {
        // AI fallback
        const aiResponse = await generateLeadResponse({
          patientName: `${lead.first_name} ${lead.last_name}`,
          inquiry: lead.inquiry_type || "General Inquiry",
          message: lead.message || "Follow-up nurture message",
          source: "nurture_sequence",
          urgency: "medium",
        });
        smsContent = aiResponse?.content || `Hi ${lead.first_name}, following up from AK Ultimate Dental. Call us at (702) 935-4395.`;
      }

      // For email steps, generate richer content via AI
      if (stepDef.channel === "email" || stepDef.channel === "both") {
        const aiEmail = await generateLeadResponse({
          patientName: `${lead.first_name} ${lead.last_name}`,
          inquiry: lead.inquiry_type || "General Inquiry",
          message: `Nurture sequence step ${seq.current_step}: ${lead.message || "Follow-up"}.`,
          source: "nurture_email",
          urgency: "medium",
        });
        emailContent = aiEmail?.content || smsContent;
      }

      // Queue for approval via oe_ai_actions
      await supabase.from("oe_ai_actions").insert({
        action_type: "lead_nurture",
        module: "remarketing",
        description: `Nurture step ${seq.current_step}/${seq.inquiry_type} for ${lead.first_name} ${lead.last_name}`,
        input_data: {
          sequence_id: seq.id,
          lead_id: lead.id,
          lead_name: `${lead.first_name} ${lead.last_name}`,
          email: lead.email,
          phone: lead.phone,
          step_number: seq.current_step,
          inquiry_type: seq.inquiry_type,
          channel: stepDef.channel,
          subject_line: stepDef.subject_line,
        },
        output_data: {
          sms_content: smsContent,
          email_content: emailContent,
          template_key: stepDef.template_key,
        },
        status: "pending_approval",
        lead_id: lead.id,
        confidence_score: 0.8,
      });

      // Calculate next step
      const nextStep = seq.current_step + 1;
      const { data: nextDef } = await supabase
        .from("oe_lead_nurture_definitions")
        .select("delay_hours")
        .eq("inquiry_type", seq.inquiry_type)
        .eq("step_number", nextStep)
        .eq("active", true)
        .limit(1);

      if (nextDef && nextDef.length > 0) {
        // More steps - advance
        const nextSendAt = new Date(Date.now() + nextDef[0].delay_hours * 60 * 60 * 1000);
        await supabase
          .from("oe_lead_nurture_sequences")
          .update({
            current_step: nextStep,
            last_sent_at: new Date().toISOString(),
            next_send_at: nextSendAt.toISOString(),
          })
          .eq("id", seq.id);
      } else {
        // Last step - mark as completed after this sends
        await supabase
          .from("oe_lead_nurture_sequences")
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
      console.error("[LeadNurture] Error processing sequence:", seq.id, err);
      errors++;
    }
  }

  return { processed, completed, errors };
}
