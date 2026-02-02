export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Simplified types for One Engine tables
// Run `supabase gen types typescript` after creating tables to get full generated types

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Explicit row types for use in components and API routes

export interface Patient {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  insurance_provider: string | null;
  insurance_member_id: string | null;
  insurance_group_number: string | null;
  pms_patient_id: string | null;
  status: "active" | "inactive" | "prospect";
  last_visit: string | null;
  next_appointment: string | null;
  notes: string | null;
  tags: string[] | null;
}

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  source: string;
  status: string;
  inquiry_type: string | null;
  message: string | null;
  urgency: string;
  ai_response_draft: string | null;
  ai_response_sent: boolean;
  ai_response_approved: boolean;
  assigned_to: string | null;
  converted_patient_id: string | null;
  response_time_seconds: number | null;
  notes: string | null;
}

export interface Appointment {
  id: string;
  created_at: string;
  updated_at: string;
  patient_id: string;
  provider_name: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  type: string;
  status: string;
  confirmation_sent: boolean;
  reminder_24h_sent: boolean;
  reminder_2h_sent: boolean;
  no_show_followup_sent: boolean;
  insurance_verified: boolean;
  notes: string | null;
  pms_appointment_id: string | null;
}

export interface InsuranceVerification {
  id: string;
  created_at: string;
  updated_at: string;
  patient_id: string;
  appointment_id: string | null;
  insurance_provider: string;
  member_id: string;
  group_number: string | null;
  status: string;
  coverage_type: string | null;
  deductible: number | null;
  deductible_met: number | null;
  annual_maximum: number | null;
  annual_used: number | null;
  preventive_coverage: number | null;
  basic_coverage: number | null;
  major_coverage: number | null;
  orthodontic_coverage: number | null;
  waiting_periods: Json | null;
  flags: string[] | null;
  verified_by: string | null;
  verified_at: string | null;
  raw_response: Json | null;
  notes: string | null;
}

export interface TreatmentPlan {
  id: string;
  created_at: string;
  updated_at: string;
  patient_id: string;
  provider_name: string;
  title: string;
  status: string;
  procedures: Json;
  total_cost: number;
  insurance_estimate: number;
  patient_estimate: number;
  ai_summary: string | null;
  patient_viewed: boolean;
  patient_viewed_at: string | null;
  followup_count: number;
  last_followup_at: string | null;
  accepted_at: string | null;
  decline_reason: string | null;
  notes: string | null;
}

export interface Call {
  id: string;
  created_at: string;
  caller_phone: string | null;
  caller_name: string | null;
  patient_id: string | null;
  direction: string;
  status: string;
  duration_seconds: number | null;
  after_hours: boolean;
  intent: string | null;
  urgency: string;
  ai_handled: boolean;
  ai_summary: string | null;
  transcription: string | null;
  recording_url: string | null;
  action_taken: string | null;
  follow_up_required: boolean;
  follow_up_completed: boolean;
  notes: string | null;
}

export interface BillingClaim {
  id: string;
  created_at: string;
  updated_at: string;
  patient_id: string;
  appointment_id: string | null;
  claim_number: string | null;
  insurance_provider: string;
  status: string;
  procedure_codes: Json;
  billed_amount: number;
  insurance_paid: number;
  patient_responsibility: number;
  adjustment: number;
  submitted_at: string | null;
  paid_at: string | null;
  denial_reason: string | null;
  aging_days: number;
  notes: string | null;
}

export interface AiAction {
  id: string;
  created_at: string;
  action_type: string;
  module: string;
  description: string;
  input_data: Json | null;
  output_data: Json | null;
  status: string;
  approved_by: string | null;
  approved_at: string | null;
  patient_id: string | null;
  lead_id: string | null;
  confidence_score: number | null;
}

export interface SmsTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  category: "nurture" | "reactivation" | "recall" | "appointment" | "general";
  subcategory: string | null;
  body: string;
  variables: string[];
  active: boolean;
}

export interface LeadNurtureDefinition {
  id: string;
  created_at: string;
  inquiry_type: string;
  step_number: number;
  delay_hours: number;
  channel: "sms" | "email" | "both";
  template_key: string;
  subject_line: string | null;
  active: boolean;
}

export interface LeadNurtureSequence {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string;
  inquiry_type: string;
  current_step: number;
  status: "active" | "paused" | "completed" | "converted" | "opted_out";
  next_send_at: string;
  last_sent_at: string | null;
  completed_at: string | null;
  metadata: Json;
}

export interface ReactivationDefinition {
  id: string;
  created_at: string;
  reactivation_type: "recall" | "incomplete_treatment" | "missed_appointment" | "lapsed";
  step_number: number;
  delay_days: number;
  channel: "sms" | "email" | "both";
  template_key: string;
  subject_line: string | null;
  active: boolean;
}

export interface PatientReactivationSequence {
  id: string;
  created_at: string;
  updated_at: string;
  patient_id: string;
  reactivation_type: string;
  current_step: number;
  status: "active" | "paused" | "completed" | "reactivated" | "opted_out";
  next_send_at: string;
  last_sent_at: string | null;
  completed_at: string | null;
  metadata: Json;
}

export interface DailyMetrics {
  id: string;
  date: string;
  new_leads: number;
  leads_converted: number;
  appointments_scheduled: number;
  appointments_completed: number;
  no_shows: number;
  cancellations: number;
  production: number;
  collections: number;
  claims_submitted: number;
  claims_paid: number;
  claims_denied: number;
  ai_actions_taken: number;
  ai_actions_approved: number;
  avg_lead_response_seconds: number | null;
  patient_messages_sent: number;
  patient_messages_received: number;
}
