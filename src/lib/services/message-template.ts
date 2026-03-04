// Fetch a message template from oe_message_templates and fill merge fields
// Falls back to hardcoded body if template not found or not approved

import { createServiceSupabase } from "@/lib/supabase/server";

export type MergeFields = {
  patient_name?: string;
  practice_name?: string;
  appointment_date?: string;
  appointment_time?: string;
  provider_name?: string;
  booking_link?: string;
  cancel_link?: string;
  treatment_name?: string;
  review_link?: string;
  intake_link?: string;
  payment_link?: string;
};

const PRACTICE_NAME = "AK Ultimate Dental";
const BOOKING_LINK = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/book`
  : "https://akultimatedental.com/book";
const REVIEW_LINK = "https://g.page/akultimatedental/review";

export async function getTemplateBody(
  type: string,
  fields: MergeFields
): Promise<{ subject: string | null; body: string } | null> {
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("oe_message_templates")
    .select("subject, body, approved")
    .eq("type", type)
    .single();

  if (!data) return null;

  const merged = fillMergeFields(data.body, fields);
  const subject = data.subject ? fillMergeFields(data.subject, fields) : null;

  return { subject, body: merged };
}

export function fillMergeFields(text: string, fields: MergeFields): string {
  return text
    .replace(/\{\{patient_name\}\}/g, fields.patient_name || "")
    .replace(/\{\{practice_name\}\}/g, fields.practice_name || PRACTICE_NAME)
    .replace(/\{\{appointment_date\}\}/g, fields.appointment_date || "")
    .replace(/\{\{appointment_time\}\}/g, fields.appointment_time || "")
    .replace(/\{\{provider_name\}\}/g, fields.provider_name || "Dr. Chireau")
    .replace(/\{\{booking_link\}\}/g, fields.booking_link || BOOKING_LINK)
    .replace(/\{\{cancel_link\}\}/g, fields.cancel_link || BOOKING_LINK)
    .replace(/\{\{treatment_name\}\}/g, fields.treatment_name || "")
    .replace(/\{\{review_link\}\}/g, fields.review_link || REVIEW_LINK)
    .replace(/\{\{intake_link\}\}/g, fields.intake_link || BOOKING_LINK)
    .replace(/\{\{payment_link\}\}/g, fields.payment_link || BOOKING_LINK);
}
