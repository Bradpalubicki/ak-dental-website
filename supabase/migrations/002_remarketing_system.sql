-- REMARKETING SYSTEM: Lead Nurture + Patient Reactivation
-- Adds automated sequence management for unconverted leads and lapsed patients

-- ============================================================================
-- SMS TEMPLATES
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('nurture', 'reactivation', 'recall', 'appointment', 'general')),
  subcategory TEXT,
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true
);

CREATE INDEX idx_oe_sms_templates_category ON oe_sms_templates(category);
CREATE INDEX idx_oe_sms_templates_subcategory ON oe_sms_templates(subcategory);

-- ============================================================================
-- LEAD NURTURE DEFINITIONS (sequence blueprints by inquiry type)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_lead_nurture_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  inquiry_type TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  delay_hours INTEGER NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'both')),
  template_key TEXT NOT NULL,
  subject_line TEXT,
  active BOOLEAN DEFAULT true,
  UNIQUE(inquiry_type, step_number)
);

CREATE INDEX idx_oe_nurture_defs_inquiry ON oe_lead_nurture_definitions(inquiry_type);

-- ============================================================================
-- LEAD NURTURE SEQUENCES (active sequences tracking per lead)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_lead_nurture_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lead_id UUID NOT NULL REFERENCES oe_leads(id),
  inquiry_type TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'converted', 'opted_out')),
  next_send_at TIMESTAMPTZ NOT NULL,
  last_sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_oe_nurture_seq_lead ON oe_lead_nurture_sequences(lead_id);
CREATE INDEX idx_oe_nurture_seq_status ON oe_lead_nurture_sequences(status);
CREATE INDEX idx_oe_nurture_seq_next ON oe_lead_nurture_sequences(next_send_at);

-- ============================================================================
-- REACTIVATION DEFINITIONS (sequence blueprints by reactivation type)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_reactivation_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reactivation_type TEXT NOT NULL CHECK (reactivation_type IN ('recall', 'incomplete_treatment', 'missed_appointment', 'lapsed')),
  step_number INTEGER NOT NULL,
  delay_days INTEGER NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'both')),
  template_key TEXT NOT NULL,
  subject_line TEXT,
  active BOOLEAN DEFAULT true,
  UNIQUE(reactivation_type, step_number)
);

CREATE INDEX idx_oe_react_defs_type ON oe_reactivation_definitions(reactivation_type);

-- ============================================================================
-- PATIENT REACTIVATION SEQUENCES (active sequences tracking per patient)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_patient_reactivation_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  reactivation_type TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'reactivated', 'opted_out')),
  next_send_at TIMESTAMPTZ NOT NULL,
  last_sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_oe_react_seq_patient ON oe_patient_reactivation_sequences(patient_id);
CREATE INDEX idx_oe_react_seq_status ON oe_patient_reactivation_sequences(status);
CREATE INDEX idx_oe_react_seq_next ON oe_patient_reactivation_sequences(next_send_at);

-- ============================================================================
-- ADD OPT-OUT COLUMNS TO EXISTING TABLES
-- ============================================================================
ALTER TABLE oe_patients ADD COLUMN IF NOT EXISTS sms_opt_out BOOLEAN DEFAULT false;
ALTER TABLE oe_patients ADD COLUMN IF NOT EXISTS email_opt_out BOOLEAN DEFAULT false;
ALTER TABLE oe_leads ADD COLUMN IF NOT EXISTS sms_opt_out BOOLEAN DEFAULT false;
ALTER TABLE oe_leads ADD COLUMN IF NOT EXISTS email_opt_out BOOLEAN DEFAULT false;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE oe_sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_lead_nurture_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_lead_nurture_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_reactivation_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_patient_reactivation_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON oe_sms_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_lead_nurture_definitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_lead_nurture_sequences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_reactivation_definitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_patient_reactivation_sequences FOR ALL USING (true) WITH CHECK (true);

-- UPDATED_AT TRIGGERS
CREATE TRIGGER update_oe_sms_templates_updated_at BEFORE UPDATE ON oe_sms_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_nurture_seq_updated_at BEFORE UPDATE ON oe_lead_nurture_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_react_seq_updated_at BEFORE UPDATE ON oe_patient_reactivation_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- SEED: LEAD NURTURE DEFINITIONS
-- ============================================================================

-- New Patient inquiry (6 steps over 14 days)
INSERT INTO oe_lead_nurture_definitions (inquiry_type, step_number, delay_hours, channel, template_key, subject_line) VALUES
  ('new_patient', 1, 0, 'both', 'nurture_new_patient_1', 'Welcome to AK Ultimate Dental!'),
  ('new_patient', 2, 24, 'sms', 'nurture_new_patient_2', NULL),
  ('new_patient', 3, 72, 'email', 'nurture_new_patient_3', 'What Makes Us Different'),
  ('new_patient', 4, 168, 'sms', 'nurture_new_patient_4', NULL),
  ('new_patient', 5, 240, 'email', 'nurture_new_patient_5', 'Limited Time: New Patient Special'),
  ('new_patient', 6, 336, 'sms', 'nurture_new_patient_6', NULL);

-- Cosmetic inquiry
INSERT INTO oe_lead_nurture_definitions (inquiry_type, step_number, delay_hours, channel, template_key, subject_line) VALUES
  ('cosmetic', 1, 0, 'both', 'nurture_cosmetic_1', 'Your Smile Transformation Starts Here'),
  ('cosmetic', 2, 24, 'sms', 'nurture_cosmetic_2', NULL),
  ('cosmetic', 3, 72, 'email', 'nurture_cosmetic_3', 'See Real Patient Transformations'),
  ('cosmetic', 4, 168, 'sms', 'nurture_cosmetic_4', NULL),
  ('cosmetic', 5, 240, 'email', 'nurture_cosmetic_5', 'Complimentary Cosmetic Consultation'),
  ('cosmetic', 6, 336, 'sms', 'nurture_cosmetic_6', NULL);

-- Implant inquiry
INSERT INTO oe_lead_nurture_definitions (inquiry_type, step_number, delay_hours, channel, template_key, subject_line) VALUES
  ('implant', 1, 0, 'both', 'nurture_implant_1', 'Dental Implant Information from AK Ultimate Dental'),
  ('implant', 2, 24, 'sms', 'nurture_implant_2', NULL),
  ('implant', 3, 72, 'email', 'nurture_implant_3', 'Understanding Dental Implants'),
  ('implant', 4, 168, 'sms', 'nurture_implant_4', NULL),
  ('implant', 5, 240, 'email', 'nurture_implant_5', 'Flexible Financing for Implants'),
  ('implant', 6, 336, 'sms', 'nurture_implant_6', NULL);

-- Emergency inquiry
INSERT INTO oe_lead_nurture_definitions (inquiry_type, step_number, delay_hours, channel, template_key, subject_line) VALUES
  ('emergency', 1, 0, 'sms', 'nurture_emergency_1', NULL),
  ('emergency', 2, 4, 'sms', 'nurture_emergency_2', NULL),
  ('emergency', 3, 24, 'both', 'nurture_emergency_3', 'Following Up on Your Dental Emergency'),
  ('emergency', 4, 72, 'sms', 'nurture_emergency_4', NULL);

-- Insurance inquiry
INSERT INTO oe_lead_nurture_definitions (inquiry_type, step_number, delay_hours, channel, template_key, subject_line) VALUES
  ('insurance', 1, 0, 'both', 'nurture_insurance_1', 'We Accept Your Insurance!'),
  ('insurance', 2, 24, 'sms', 'nurture_insurance_2', NULL),
  ('insurance', 3, 72, 'email', 'nurture_insurance_3', 'Maximize Your Dental Benefits'),
  ('insurance', 4, 168, 'sms', 'nurture_insurance_4', NULL),
  ('insurance', 5, 336, 'sms', 'nurture_insurance_5', NULL);

-- General inquiry
INSERT INTO oe_lead_nurture_definitions (inquiry_type, step_number, delay_hours, channel, template_key, subject_line) VALUES
  ('general', 1, 0, 'both', 'nurture_general_1', 'Thanks for Reaching Out to AK Ultimate Dental'),
  ('general', 2, 24, 'sms', 'nurture_general_2', NULL),
  ('general', 3, 72, 'email', 'nurture_general_3', 'Getting to Know AK Ultimate Dental'),
  ('general', 4, 168, 'sms', 'nurture_general_4', NULL),
  ('general', 5, 336, 'sms', 'nurture_general_5', NULL);

-- ============================================================================
-- SEED: REACTIVATION DEFINITIONS
-- ============================================================================

-- Recall (overdue for checkup, 4 steps over 30 days)
INSERT INTO oe_reactivation_definitions (reactivation_type, step_number, delay_days, channel, template_key, subject_line) VALUES
  ('recall', 1, 0, 'both', 'react_recall_1', 'Time for Your Dental Checkup!'),
  ('recall', 2, 7, 'sms', 'react_recall_2', NULL),
  ('recall', 3, 14, 'email', 'react_recall_3', 'We Miss You at AK Ultimate Dental'),
  ('recall', 4, 30, 'sms', 'react_recall_4', NULL);

-- Incomplete Treatment
INSERT INTO oe_reactivation_definitions (reactivation_type, step_number, delay_days, channel, template_key, subject_line) VALUES
  ('incomplete_treatment', 1, 0, 'both', 'react_treatment_1', 'Complete Your Treatment Plan'),
  ('incomplete_treatment', 2, 3, 'sms', 'react_treatment_2', NULL),
  ('incomplete_treatment', 3, 10, 'email', 'react_treatment_3', 'Your Treatment Plan Is Waiting'),
  ('incomplete_treatment', 4, 21, 'sms', 'react_treatment_4', NULL);

-- Missed Appointment
INSERT INTO oe_reactivation_definitions (reactivation_type, step_number, delay_days, channel, template_key, subject_line) VALUES
  ('missed_appointment', 1, 0, 'sms', 'react_missed_1', NULL),
  ('missed_appointment', 2, 1, 'both', 'react_missed_2', 'We Missed You Today!'),
  ('missed_appointment', 3, 7, 'sms', 'react_missed_3', NULL);

-- Lapsed (inactive > 12 months)
INSERT INTO oe_reactivation_definitions (reactivation_type, step_number, delay_days, channel, template_key, subject_line) VALUES
  ('lapsed', 1, 0, 'both', 'react_lapsed_1', 'We Would Love to See You Again!'),
  ('lapsed', 2, 7, 'sms', 'react_lapsed_2', NULL),
  ('lapsed', 3, 21, 'email', 'react_lapsed_3', 'Special Welcome Back Offer'),
  ('lapsed', 4, 45, 'sms', 'react_lapsed_4', NULL);

-- ============================================================================
-- SEED: SMS TEMPLATES
-- ============================================================================

-- Lead Nurture: New Patient
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('nurture_new_patient_1', 'nurture', 'new_patient', 'Hi {{first_name}}! Thanks for contacting AK Ultimate Dental. We''d love to help you with your dental needs. Call us at (702) 935-4395 or reply to this message to schedule. - AK Ultimate Dental', '{first_name}'),
  ('nurture_new_patient_2', 'nurture', 'new_patient', 'Hi {{first_name}}, just following up from AK Ultimate Dental. We have appointments available this week and would love to get you in. Would any of these times work for you? Reply or call (702) 935-4395.', '{first_name}'),
  ('nurture_new_patient_3', 'nurture', 'new_patient', 'Hi {{first_name}}, our team at AK Ultimate Dental prides ourselves on gentle, personalized care. We''d love to show you why our patients trust us with their smiles. Schedule at (702) 935-4395.', '{first_name}'),
  ('nurture_new_patient_4', 'nurture', 'new_patient', '{{first_name}}, friendly reminder from AK Ultimate Dental - we still have openings for new patients this week! Your first visit includes a comprehensive exam and personalized treatment plan. (702) 935-4395', '{first_name}'),
  ('nurture_new_patient_5', 'nurture', 'new_patient', 'Hi {{first_name}}, AK Ultimate Dental is offering a special for new patients. Don''t miss out - call (702) 935-4395 to schedule your appointment today!', '{first_name}'),
  ('nurture_new_patient_6', 'nurture', 'new_patient', '{{first_name}}, this is our last reminder from AK Ultimate Dental. We''d love to welcome you as a patient. Whenever you''re ready, we''re here: (702) 935-4395. Reply STOP to opt out.', '{first_name}');

-- Lead Nurture: Cosmetic
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('nurture_cosmetic_1', 'nurture', 'cosmetic', 'Hi {{first_name}}! Thanks for your interest in cosmetic dentistry at AK Ultimate Dental. We offer veneers, whitening, bonding & more. Schedule a free consult: (702) 935-4395', '{first_name}'),
  ('nurture_cosmetic_2', 'nurture', 'cosmetic', '{{first_name}}, did you know a smile makeover can be completed in as few as 2 visits? Our cosmetic team at AK Ultimate Dental can create your custom plan. Call (702) 935-4395.', '{first_name}'),
  ('nurture_cosmetic_3', 'nurture', 'cosmetic', 'Hi {{first_name}}, wondering what your new smile could look like? AK Ultimate Dental offers complimentary cosmetic consultations with digital smile previews. Book yours: (702) 935-4395', '{first_name}'),
  ('nurture_cosmetic_4', 'nurture', 'cosmetic', '{{first_name}}, many of our cosmetic patients say they wish they started sooner! AK Ultimate Dental also offers flexible financing. Ready to get started? (702) 935-4395', '{first_name}'),
  ('nurture_cosmetic_5', 'nurture', 'cosmetic', 'Hi {{first_name}}, AK Ultimate Dental is offering a complimentary cosmetic consultation this month. Your dream smile is closer than you think! Schedule: (702) 935-4395', '{first_name}'),
  ('nurture_cosmetic_6', 'nurture', 'cosmetic', '{{first_name}}, just a final note from AK Ultimate Dental - we''re here whenever you''re ready to explore your cosmetic options. (702) 935-4395. Reply STOP to opt out.', '{first_name}');

-- Lead Nurture: Implant
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('nurture_implant_1', 'nurture', 'implant', 'Hi {{first_name}}! Thanks for your interest in dental implants at AK Ultimate Dental. Implants are the gold standard for tooth replacement. Free consult: (702) 935-4395', '{first_name}'),
  ('nurture_implant_2', 'nurture', 'implant', '{{first_name}}, dental implants look, feel, and function like natural teeth. Our team at AK Ultimate Dental has extensive implant experience. Questions? Call (702) 935-4395.', '{first_name}'),
  ('nurture_implant_3', 'nurture', 'implant', 'Hi {{first_name}}, many patients worry about implant cost. At AK Ultimate Dental, we offer flexible financing and work with your insurance. Let us create a plan: (702) 935-4395', '{first_name}'),
  ('nurture_implant_4', 'nurture', 'implant', '{{first_name}}, did you know dental implants can last a lifetime with proper care? AK Ultimate Dental uses the latest technology for optimal results. Schedule: (702) 935-4395', '{first_name}'),
  ('nurture_implant_5', 'nurture', 'implant', 'Hi {{first_name}}, AK Ultimate Dental offers complimentary implant consultations including a CT scan. See if you''re a candidate - no obligation! (702) 935-4395', '{first_name}'),
  ('nurture_implant_6', 'nurture', 'implant', '{{first_name}}, this is our last note about implants. Whenever you''re ready, AK Ultimate Dental is here to help restore your smile. (702) 935-4395. Reply STOP to opt out.', '{first_name}');

-- Lead Nurture: Emergency
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('nurture_emergency_1', 'nurture', 'emergency', 'Hi {{first_name}}, AK Ultimate Dental received your emergency request. We have same-day appointments available. Call us now: (702) 935-4395', '{first_name}'),
  ('nurture_emergency_2', 'nurture', 'emergency', '{{first_name}}, still in pain? AK Ultimate Dental can see you today. Don''t wait - dental emergencies can worsen quickly. Call (702) 935-4395 right away.', '{first_name}'),
  ('nurture_emergency_3', 'nurture', 'emergency', 'Hi {{first_name}}, following up from AK Ultimate Dental. We hope you''re feeling better! If you still need dental care, we have appointments available this week. (702) 935-4395', '{first_name}'),
  ('nurture_emergency_4', 'nurture', 'emergency', '{{first_name}}, just checking in from AK Ultimate Dental. Even if your emergency has passed, a follow-up visit is important to prevent future issues. (702) 935-4395. Reply STOP to opt out.', '{first_name}');

-- Lead Nurture: Insurance
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('nurture_insurance_1', 'nurture', 'insurance', 'Hi {{first_name}}! AK Ultimate Dental works with most major insurance plans. We''ll verify your benefits before your visit - no surprises! Schedule: (702) 935-4395', '{first_name}'),
  ('nurture_insurance_2', 'nurture', 'insurance', '{{first_name}}, did you know most dental insurance covers 2 cleanings per year at 100%? Don''t let your benefits go to waste! AK Ultimate Dental: (702) 935-4395', '{first_name}'),
  ('nurture_insurance_3', 'nurture', 'insurance', 'Hi {{first_name}}, at AK Ultimate Dental we handle insurance claims for you. No paperwork headaches! Let us verify your benefits - call (702) 935-4395', '{first_name}'),
  ('nurture_insurance_4', 'nurture', 'insurance', '{{first_name}}, reminder: unused dental benefits expire Dec 31! AK Ultimate Dental can help you maximize your coverage. (702) 935-4395', '{first_name}'),
  ('nurture_insurance_5', 'nurture', 'insurance', '{{first_name}}, last reminder from AK Ultimate Dental - we''d love to help you use your dental benefits. Appointments available this week! (702) 935-4395. Reply STOP to opt out.', '{first_name}');

-- Lead Nurture: General
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('nurture_general_1', 'nurture', 'general', 'Hi {{first_name}}! Thanks for reaching out to AK Ultimate Dental. We''d love to help with your dental needs. Call (702) 935-4395 or reply to schedule.', '{first_name}'),
  ('nurture_general_2', 'nurture', 'general', '{{first_name}}, just following up from AK Ultimate Dental. We have convenient appointments available. How can we help you? (702) 935-4395', '{first_name}'),
  ('nurture_general_3', 'nurture', 'general', 'Hi {{first_name}}, AK Ultimate Dental offers comprehensive dental care - from cleanings to cosmetic work to implants. Whatever you need, we''re here! (702) 935-4395', '{first_name}'),
  ('nurture_general_4', 'nurture', 'general', '{{first_name}}, friendly reminder from AK Ultimate Dental - we''d love to welcome you as a patient. Appointments available this week! (702) 935-4395', '{first_name}'),
  ('nurture_general_5', 'nurture', 'general', '{{first_name}}, this is our last note from AK Ultimate Dental. We''re here whenever you''re ready to schedule. (702) 935-4395. Reply STOP to opt out.', '{first_name}');

-- Reactivation: Recall
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('react_recall_1', 'reactivation', 'recall', 'Hi {{first_name}}! It''s been a while since your last visit to AK Ultimate Dental. It''s time for your checkup and cleaning! Schedule: (702) 935-4395', '{first_name}'),
  ('react_recall_2', 'reactivation', 'recall', '{{first_name}}, regular dental checkups prevent costly problems down the road. AK Ultimate Dental has openings this week. Book now: (702) 935-4395', '{first_name}'),
  ('react_recall_3', 'reactivation', 'recall', 'Hi {{first_name}}, we miss seeing you at AK Ultimate Dental! Your dental health matters to us. Let''s get you scheduled for a checkup. (702) 935-4395', '{first_name}'),
  ('react_recall_4', 'reactivation', 'recall', '{{first_name}}, final reminder from AK Ultimate Dental - you''re overdue for your dental checkup. We''re here when you''re ready! (702) 935-4395. Reply STOP to opt out.', '{first_name}');

-- Reactivation: Incomplete Treatment
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('react_treatment_1', 'reactivation', 'incomplete_treatment', 'Hi {{first_name}}, this is AK Ultimate Dental. You have an outstanding treatment plan we discussed. We want to make sure your dental health stays on track. Call (702) 935-4395.', '{first_name}'),
  ('react_treatment_2', 'reactivation', 'incomplete_treatment', '{{first_name}}, delaying dental treatment can lead to more complex (and expensive) problems. Let us help you get back on track at AK Ultimate Dental. (702) 935-4395', '{first_name}'),
  ('react_treatment_3', 'reactivation', 'incomplete_treatment', 'Hi {{first_name}}, your treatment plan at AK Ultimate Dental is still available. We offer flexible financing to make it work for your budget. Let''s talk: (702) 935-4395', '{first_name}'),
  ('react_treatment_4', 'reactivation', 'incomplete_treatment', '{{first_name}}, just a final check-in from AK Ultimate Dental about your treatment plan. We''re here whenever you''re ready to continue. (702) 935-4395. Reply STOP to opt out.', '{first_name}');

-- Reactivation: Missed Appointment
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('react_missed_1', 'reactivation', 'missed_appointment', 'Hi {{first_name}}, we noticed you missed your appointment at AK Ultimate Dental today. No worries! Let us reschedule: (702) 935-4395', '{first_name}'),
  ('react_missed_2', 'reactivation', 'missed_appointment', '{{first_name}}, we missed you at AK Ultimate Dental! Life gets busy - we understand. We have openings this week to get you rescheduled. Call (702) 935-4395.', '{first_name}'),
  ('react_missed_3', 'reactivation', 'missed_appointment', '{{first_name}}, just a friendly follow-up from AK Ultimate Dental. Your dental health is important! Ready to reschedule? (702) 935-4395. Reply STOP to opt out.', '{first_name}');

-- Reactivation: Lapsed
INSERT INTO oe_sms_templates (name, category, subcategory, body, variables) VALUES
  ('react_lapsed_1', 'reactivation', 'lapsed', 'Hi {{first_name}}! It''s been a long time since we''ve seen you at AK Ultimate Dental. We''d love to welcome you back! Schedule: (702) 935-4395', '{first_name}'),
  ('react_lapsed_2', 'reactivation', 'lapsed', '{{first_name}}, your smile deserves attention! AK Ultimate Dental has flexible scheduling and we''d love to get you back on track. (702) 935-4395', '{first_name}'),
  ('react_lapsed_3', 'reactivation', 'lapsed', 'Hi {{first_name}}, AK Ultimate Dental is offering a special welcome-back offer for returning patients. We''d love to see you again! (702) 935-4395', '{first_name}'),
  ('react_lapsed_4', 'reactivation', 'lapsed', '{{first_name}}, this is our last note from AK Ultimate Dental. We miss you and we''re here whenever you''re ready to come back. (702) 935-4395. Reply STOP to opt out.', '{first_name}');
