-- Migration 040: Message Templates + Call Logs
-- Phase 2A+2B from BUILD-PROMPT.md

-- Message templates table
create table if not exists oe_message_templates (
  id uuid primary key default gen_random_uuid(),
  type text not null unique,
  label text not null,
  "group" text not null,
  channel text not null check (channel in ('sms', 'email', 'both')),
  subject text,
  body text not null,
  approved boolean default false,
  requires_approval boolean default false,
  approved_at timestamptz,
  approved_by text,
  edited_from text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Call logs table (for Vapi transcripts + intent detection)
create table if not exists oe_call_logs (
  id uuid primary key default gen_random_uuid(),
  vapi_call_id text,
  caller_phone_masked text,
  duration_seconds int,
  intent text,
  transcript text,
  lead_id uuid references oe_leads(id),
  created_at timestamptz default now()
);

-- RLS
alter table oe_message_templates enable row level security;
alter table oe_call_logs enable row level security;

create policy "Authenticated users can read templates"
  on oe_message_templates for select
  using (auth.role() = 'authenticated');

create policy "Admins can update templates"
  on oe_message_templates for update
  using (auth.jwt() ->> 'authorityLevel' in ('admin', 'global_admin'));

create policy "Authenticated users can read call logs"
  on oe_call_logs for select
  using (auth.role() = 'authenticated');

create policy "Service role can insert call logs"
  on oe_call_logs for insert
  with check (true);

-- Seed all 18 templates
insert into oe_message_templates (type, label, "group", channel, subject, body, approved, requires_approval) values
  ('appointment_confirmation', 'Appointment Confirmation', 'Scheduling', 'both',
   'Your appointment is confirmed — AK Ultimate Dental',
   'Hi {{patient_name}}, your appointment at AK Ultimate Dental is confirmed for {{appointment_date}} at {{appointment_time}} with {{provider_name}}. Please arrive 10 minutes early. Need to cancel? {{cancel_link}}',
   false, false),

  ('reminder_48h', '48-Hour Reminder', 'Scheduling', 'email',
   'Reminder: Your appointment is in 2 days — AK Ultimate Dental',
   'Hi {{patient_name}}, just a reminder that you have an appointment at AK Ultimate Dental on {{appointment_date}} at {{appointment_time}} with {{provider_name}}. We look forward to seeing you! Need to reschedule? {{cancel_link}}',
   false, false),

  ('reminder_24h', '24-Hour Reminder', 'Scheduling', 'both',
   'Your appointment is tomorrow — AK Ultimate Dental',
   'Hi {{patient_name}} — a reminder that you have an appointment at AK Ultimate Dental tomorrow at {{appointment_time}} with {{provider_name}}. Reply CONFIRM to confirm or CANCEL to reschedule. See you soon!',
   false, false),

  ('reminder_2h', '2-Hour Reminder', 'Scheduling', 'sms',
   null,
   'Hi {{patient_name}}, your appointment at AK Dental is in 2 hours ({{appointment_time}}). We''re ready for you! Reply CANCEL if you can''t make it.',
   false, false),

  ('new_patient_welcome', 'New Patient Welcome', 'Patient Intake', 'email',
   'Welcome to AK Ultimate Dental — We''re excited to meet you!',
   'Hi {{patient_name}}, welcome to AK Ultimate Dental! We''re thrilled to have you as a new patient. Dr. Chireau and the team are looking forward to meeting you. If you have any questions before your visit, just reply to this email. See you soon!',
   false, false),

  ('intake_forms', 'Intake Forms', 'Patient Intake', 'sms',
   null,
   'Hi {{patient_name}}, please complete your new patient forms before your first visit at AK Dental: {{intake_link}} Takes about 5 minutes and saves time at check-in. Thank you!',
   false, false),

  ('no_show_recovery_30m', 'No-Show Recovery (30 min)', 'No-Show Recovery', 'sms',
   null,
   'Hi {{patient_name}}, we missed you at your {{appointment_time}} appointment today. We''d love to get you rescheduled — reply here or call us. We have availability this week.',
   false, false),

  ('no_show_recovery_24h', 'No-Show Recovery (Next Day)', 'No-Show Recovery', 'sms',
   null,
   'Hi {{patient_name}}, we noticed you weren''t able to make your appointment yesterday at AK Dental. No worries — we''d love to get you back on the schedule. Book here: {{booking_link}}',
   false, true),

  ('recall_6mo', '6-Month Recall', 'Recall & Reactivation', 'both',
   'Time for your 6-month cleaning — AK Ultimate Dental',
   'Hi {{patient_name}}! It''s been 6 months since your last cleaning at AK Dental. Dr. Chireau recommends staying on schedule — book your next visit here: {{booking_link}} We look forward to seeing you!',
   false, false),

  ('recall_overdue', 'Overdue Recall (9 months)', 'Recall & Reactivation', 'sms',
   null,
   'Hi {{patient_name}}, it''s been a while since we''ve seen you at AK Dental! Regular checkups help prevent bigger problems. Schedule your cleaning today: {{booking_link}}',
   false, true),

  ('treatment_accepted', 'Treatment Plan Accepted', 'Scheduling', 'email',
   'Your Treatment Plan Is Confirmed — AK Ultimate Dental',
   'Hi {{patient_name}}, thank you for moving forward with your treatment plan. Dr. Chireau and the team are ready for you. Your appointment details: {{appointment_date}} at {{appointment_time}}. Any questions before then, just reply to this email.',
   false, false),

  ('treatment_followup', 'Post-Procedure Follow-Up', 'Scheduling', 'sms',
   null,
   'Hi {{patient_name}}, checking in after your {{treatment_name}} procedure at AK Dental. How are you feeling? Any discomfort or questions, call us at (702) 935-4395. We''re here for you!',
   false, false),

  ('treatment_plan_ready', 'Treatment Plan Ready', 'Scheduling', 'email',
   'Your Treatment Plan Is Ready — AK Ultimate Dental',
   'Hi {{patient_name}}, Dr. Chireau has finalized your personalized treatment plan. Log in to review it and ask any questions: {{booking_link}} We''re committed to getting you the best outcome possible.',
   false, false),

  ('insurance_verified', 'Insurance Verified', 'Patient Intake', 'sms',
   null,
   'Hi {{patient_name}}, great news — your insurance coverage has been verified for your upcoming visit at AK Dental. See you on {{appointment_date}}!',
   false, false),

  ('insurance_pending', 'Insurance Issue', 'Patient Intake', 'sms',
   null,
   'Hi {{patient_name}}, we ran into an issue verifying your insurance for your upcoming visit at AK Dental. Please call us at (702) 935-4395 so we can get it sorted before your appointment.',
   false, true),

  ('review_request', 'Review Request', 'Review & Referral', 'sms',
   null,
   'Hi {{patient_name}} — thank you for visiting AK Dental! If your experience was great, a quick Google review helps others find quality dental care: {{review_link}} Takes 60 seconds and means a lot to us.',
   false, false),

  ('referral_thank_you', 'Referral Thank You', 'Review & Referral', 'email',
   'Thank you for your referral — AK Ultimate Dental',
   'Hi {{patient_name}}, thank you so much for referring a friend or family member to AK Ultimate Dental! Referrals like yours are the highest compliment we can receive. We''re grateful to have patients like you.',
   false, false),

  ('payment_receipt', 'Payment Receipt', 'Financial', 'email',
   'Payment received — AK Ultimate Dental',
   'Hi {{patient_name}}, thank you for your payment. Your receipt is attached. If you have any questions about your account, reply to this email or call us at (702) 935-4395.',
   false, false)

on conflict (type) do nothing;
