-- ============================================================================
-- DEMO SEED DATA for Alex Demonstration
-- Run this against Supabase SQL Editor to populate the dashboard
-- ============================================================================

-- Clear existing demo data (safe for fresh environments)
DELETE FROM oe_ai_actions;
DELETE FROM oe_outreach_messages;
DELETE FROM oe_outreach_workflows;
DELETE FROM oe_insurance_verifications;
DELETE FROM oe_billing_claims;
DELETE FROM oe_treatment_plans;
DELETE FROM oe_appointments;
DELETE FROM oe_lead_nurture_sequences;
DELETE FROM oe_patient_reactivation_sequences;
DELETE FROM oe_leads;
DELETE FROM oe_patients;
DELETE FROM oe_daily_metrics;

-- ============================================================================
-- PATIENTS (12 realistic Las Vegas patients)
-- ============================================================================
INSERT INTO oe_patients (id, first_name, last_name, email, phone, date_of_birth, address, city, state, zip, insurance_provider, insurance_member_id, insurance_group_number, status, last_visit, tags) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Maria', 'Gonzalez', 'maria.g@email.com', '(702) 555-0101', '1985-03-15', '4521 Spring Mountain Rd', 'Las Vegas', 'NV', '89102', 'Delta Dental', 'DD-892341', 'GRP-4401', 'active', CURRENT_DATE - INTERVAL '14 days', ARRAY['cleaning', 'loyal']),
  ('a0000001-0000-0000-0000-000000000002', 'James', 'Rodriguez', 'james.rod@email.com', '(702) 555-0102', '1978-07-22', '8891 W Flamingo Rd', 'Las Vegas', 'NV', '89147', 'Cigna Dental', 'CG-110234', 'GRP-8800', 'active', CURRENT_DATE - INTERVAL '45 days', ARRAY['implant-candidate']),
  ('a0000001-0000-0000-0000-000000000003', 'Sarah', 'Chen', 'sarah.chen@email.com', '(702) 555-0103', '1992-11-08', '3200 S Jones Blvd', 'Las Vegas', 'NV', '89146', 'MetLife Dental', 'ML-556712', 'GRP-2200', 'active', CURRENT_DATE - INTERVAL '3 days', ARRAY['cosmetic', 'vip']),
  ('a0000001-0000-0000-0000-000000000004', 'Robert', 'Thompson', 'rthompson@email.com', '(702) 555-0104', '1965-01-30', '7100 W Sahara Ave', 'Las Vegas', 'NV', '89117', 'Aetna Dental', 'AE-334521', 'GRP-1100', 'active', CURRENT_DATE - INTERVAL '180 days', ARRAY['recall-overdue']),
  ('a0000001-0000-0000-0000-000000000005', 'Lisa', 'Williams', 'lisa.w@email.com', '(702) 555-0105', '1990-06-14', '9500 W Tropicana Ave', 'Las Vegas', 'NV', '89147', 'Delta Dental', 'DD-778123', 'GRP-4401', 'active', CURRENT_DATE - INTERVAL '7 days', ARRAY['orthodontics']),
  ('a0000001-0000-0000-0000-000000000006', 'Michael', 'Kim', 'mkim@email.com', '(702) 555-0106', '1988-09-03', '6200 W Charleston Blvd', 'Las Vegas', 'NV', '89146', 'Guardian Dental', 'GD-443211', 'GRP-5500', 'active', CURRENT_DATE - INTERVAL '30 days', ARRAY['crown-needed']),
  ('a0000001-0000-0000-0000-000000000007', 'Jennifer', 'Davis', 'jdavis@email.com', '(702) 555-0107', '1975-12-19', '2100 N Rancho Dr', 'Las Vegas', 'NV', '89106', 'Cigna Dental', 'CG-221567', 'GRP-8800', 'active', CURRENT_DATE - INTERVAL '60 days', ARRAY['periodontics']),
  ('a0000001-0000-0000-0000-000000000008', 'David', 'Martinez', 'dmartinez@email.com', '(702) 555-0108', '1995-04-25', '5500 W Sunset Rd', 'Las Vegas', 'NV', '89118', NULL, NULL, NULL, 'active', CURRENT_DATE - INTERVAL '21 days', ARRAY['cash-pay']),
  ('a0000001-0000-0000-0000-000000000009', 'Emily', 'Nguyen', 'emily.n@email.com', '(702) 555-0109', '1983-08-11', '3800 S Hualapai Way', 'Las Vegas', 'NV', '89147', 'MetLife Dental', 'ML-889034', 'GRP-2200', 'active', CURRENT_DATE - INTERVAL '90 days', ARRAY['whitening']),
  ('a0000001-0000-0000-0000-000000000010', 'Anthony', 'Brown', 'abrown@email.com', '(702) 555-0110', '1970-02-28', '1800 E Sahara Ave', 'Las Vegas', 'NV', '89104', 'Delta Dental', 'DD-112890', 'GRP-4401', 'inactive', CURRENT_DATE - INTERVAL '400 days', ARRAY['lapsed']),
  ('a0000001-0000-0000-0000-000000000011', 'Rachel', 'Taylor', 'rtaylor@email.com', '(702) 555-0111', '1998-05-17', '4200 S Durango Dr', 'Las Vegas', 'NV', '89147', 'Aetna Dental', 'AE-567890', 'GRP-1100', 'prospect', NULL, ARRAY['new-patient']),
  ('a0000001-0000-0000-0000-000000000012', 'Carlos', 'Reyes', 'creyes@email.com', '(702) 555-0112', '1980-10-05', '6800 W Cheyenne Ave', 'Las Vegas', 'NV', '89129', 'Guardian Dental', 'GD-998877', 'GRP-5500', 'active', CURRENT_DATE - INTERVAL '10 days', ARRAY['family']);

-- ============================================================================
-- TODAY'S APPOINTMENTS (5 appointments for demo day)
-- ============================================================================
INSERT INTO oe_appointments (patient_id, provider_name, appointment_date, appointment_time, duration_minutes, type, status, confirmation_sent, reminder_24h_sent, reminder_2h_sent, insurance_verified) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Dr. Alex', CURRENT_DATE, '09:00', 60, 'Cleaning & Exam', 'confirmed', true, true, true, true),
  ('a0000001-0000-0000-0000-000000000003', 'Dr. Alex', CURRENT_DATE, '10:30', 90, 'Cosmetic Consultation', 'confirmed', true, true, false, true),
  ('a0000001-0000-0000-0000-000000000006', 'Dr. Alex', CURRENT_DATE, '13:00', 90, 'Crown Prep', 'scheduled', true, true, false, true),
  ('a0000001-0000-0000-0000-000000000005', 'Dr. Alex', CURRENT_DATE, '14:30', 60, 'Orthodontic Check', 'scheduled', true, false, false, false),
  ('a0000001-0000-0000-0000-000000000008', 'Dr. Alex', CURRENT_DATE, '16:00', 60, 'Emergency - Toothache', 'confirmed', true, true, true, false);

-- Future appointments
INSERT INTO oe_appointments (patient_id, provider_name, appointment_date, appointment_time, duration_minutes, type, status, confirmation_sent, insurance_verified) VALUES
  ('a0000001-0000-0000-0000-000000000002', 'Dr. Alex', CURRENT_DATE + INTERVAL '2 days', '09:00', 120, 'Implant Consultation', 'scheduled', false, false),
  ('a0000001-0000-0000-0000-000000000009', 'Dr. Alex', CURRENT_DATE + INTERVAL '3 days', '11:00', 60, 'Teeth Whitening', 'scheduled', false, true),
  ('a0000001-0000-0000-0000-000000000007', 'Dr. Alex', CURRENT_DATE + INTERVAL '5 days', '10:00', 90, 'Periodontal Scaling', 'scheduled', false, true);

-- ============================================================================
-- LEADS (4 recent leads with varying urgency and status)
-- ============================================================================
INSERT INTO oe_leads (id, first_name, last_name, email, phone, source, status, inquiry_type, message, urgency, ai_response_draft, created_at) VALUES
  (
    'b0000001-0000-0000-0000-000000000001',
    'Amanda', 'Foster',
    'amanda.foster@email.com', '(702) 555-0201',
    'website', 'new', 'cosmetic',
    'Hi, I''m interested in veneers. I have a wedding coming up in April and want my smile to look perfect. Can you tell me about pricing and how many visits it would take?',
    'medium',
    'Hi Amanda! Congratulations on your upcoming wedding! We''d love to help you achieve the perfect smile for your special day. Our cosmetic consultation with Dr. Alex is complimentary, and veneers typically require just 2-3 visits over 2-3 weeks. We offer flexible financing options to fit any budget. Would you like to schedule a consultation this week? We have openings on Tuesday and Thursday mornings.',
    now() - INTERVAL '25 minutes'
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'Kevin', 'Marshall',
    'kevin.m@email.com', '(702) 555-0202',
    'google', 'new', 'implants',
    'I lost a tooth playing basketball and need to get it replaced. My dentist retired and I''m looking for a new office. Do you do implants?',
    'high',
    'Hi Kevin, sorry to hear about your tooth! Yes, we absolutely specialize in dental implants. Dr. Alex has extensive experience with implant placement and restoration. For a missing tooth, a single implant is typically the best long-term solution. We''d like to get you in quickly for an evaluation and X-rays. Can we schedule you this week? We also accept most major insurance plans. Call or text us at (702) 935-4395 to get on the schedule.',
    now() - INTERVAL '2 hours'
  ),
  (
    'b0000001-0000-0000-0000-000000000003',
    'Stephanie', 'Park',
    'spark@email.com', '(702) 555-0203',
    'website', 'contacted', 'cleaning',
    'New to Las Vegas, looking for a family dentist. We have two kids (ages 8 and 12). Do you accept MetLife?',
    'low',
    'Welcome to Las Vegas, Stephanie! We''d love to be your family''s dental home. Great news - we do accept MetLife dental insurance. We see patients ages 6 and up, so both of your children are welcome! We can even schedule back-to-back appointments for the whole family to make it convenient. Our office is right on West Sahara Avenue with easy parking. Would you like to book your family''s first visit?',
    now() - INTERVAL '1 day'
  ),
  (
    'b0000001-0000-0000-0000-000000000004',
    'Marcus', 'Rivera',
    NULL, '(702) 555-0204',
    'phone', 'new', 'emergency',
    'Called in with severe tooth pain, upper right side. Pain started last night, can''t sleep. Needs to be seen ASAP.',
    'emergency',
    'Marcus, we understand you''re in a lot of pain and want to help you right away. We have an emergency opening today. Please come in as soon as possible - our address is 7480 West Sahara Avenue. We''ll take X-rays, diagnose the issue, and get you comfortable. If the pain becomes unbearable before your visit, you can take over-the-counter ibuprofen (600mg) for temporary relief. We''ll text you a confirmation shortly.',
    now() - INTERVAL '15 minutes'
  );

-- ============================================================================
-- AI ACTIONS IN APPROVAL QUEUE (mix of types for demo)
-- ============================================================================

-- Lead response drafts (linked to leads above)
INSERT INTO oe_ai_actions (action_type, module, description, input_data, output_data, status, lead_id, confidence_score, created_at) VALUES
  (
    'lead_response_draft', 'lead_response',
    'Drafted response for lead: Amanda Foster - Cosmetic/Veneers inquiry',
    '{"lead_id": "b0000001-0000-0000-0000-000000000001", "inquiry_type": "cosmetic", "message": "Interested in veneers for wedding"}',
    '{"response": "Hi Amanda! Congratulations on your upcoming wedding! We''d love to help you achieve the perfect smile for your special day. Our cosmetic consultation with Dr. Alex is complimentary, and veneers typically require just 2-3 visits over 2-3 weeks. We offer flexible financing options to fit any budget. Would you like to schedule a consultation this week? We have openings on Tuesday and Thursday mornings."}',
    'pending_approval',
    'b0000001-0000-0000-0000-000000000001',
    0.92,
    now() - INTERVAL '24 minutes'
  ),
  (
    'lead_response_draft', 'lead_response',
    'Drafted response for lead: Kevin Marshall - Dental implant inquiry (HIGH URGENCY)',
    '{"lead_id": "b0000001-0000-0000-0000-000000000002", "inquiry_type": "implants", "message": "Lost tooth, needs implant replacement"}',
    '{"response": "Hi Kevin, sorry to hear about your tooth! Yes, we absolutely specialize in dental implants. Dr. Alex has extensive experience with implant placement and restoration. For a missing tooth, a single implant is typically the best long-term solution. We''d like to get you in quickly for an evaluation and X-rays. Can we schedule you this week? We also accept most major insurance plans. Call or text us at (702) 935-4395 to get on the schedule."}',
    'pending_approval',
    'b0000001-0000-0000-0000-000000000002',
    0.88,
    now() - INTERVAL '1 hour 55 minutes'
  ),
  (
    'lead_response_draft', 'lead_response',
    'Drafted EMERGENCY response for lead: Marcus Rivera - Severe tooth pain',
    '{"lead_id": "b0000001-0000-0000-0000-000000000004", "inquiry_type": "emergency", "message": "Severe tooth pain, needs to be seen ASAP"}',
    '{"response": "Marcus, we understand you''re in a lot of pain and want to help you right away. We have an emergency opening today. Please come in as soon as possible - our address is 7480 West Sahara Avenue. We''ll take X-rays, diagnose the issue, and get you comfortable. If the pain becomes unbearable before your visit, you can take over-the-counter ibuprofen (600mg) for temporary relief. We''ll text you a confirmation shortly."}',
    'pending_approval',
    'b0000001-0000-0000-0000-000000000004',
    0.95,
    now() - INTERVAL '14 minutes'
  );

-- Appointment reminder actions
INSERT INTO oe_ai_actions (action_type, module, description, input_data, output_data, status, patient_id, confidence_score, created_at) VALUES
  (
    'appointment_reminder', 'scheduling',
    'Send 2-hour reminder to Michael Kim for Crown Prep at 1:00 PM',
    '{"patient_id": "a0000001-0000-0000-0000-000000000006", "appointment_type": "Crown Prep", "time": "1:00 PM"}',
    '{"message": "Hi Michael! This is a friendly reminder from AK Ultimate Dental - your Crown Prep appointment is today at 1:00 PM with Dr. Alex. Please arrive 10 minutes early. If you need to reschedule, reply to this text or call (702) 935-4395. See you soon!"}',
    'pending_approval',
    'a0000001-0000-0000-0000-000000000006',
    0.97,
    now() - INTERVAL '10 minutes'
  ),
  (
    'insurance_followup', 'insurance',
    'Follow up on pending insurance verification for Lisa Williams - Orthodontic Check',
    '{"patient_id": "a0000001-0000-0000-0000-000000000005", "insurance_provider": "Delta Dental", "procedure": "Orthodontic Check"}',
    '{"message": "Insurance verification needed for Lisa Williams (Delta Dental, DD-778123). Orthodontic benefits: Please verify annual max remaining and orthodontic coverage percentage before 2:30 PM appointment today."}',
    'pending_approval',
    'a0000001-0000-0000-0000-000000000005',
    0.82,
    now() - INTERVAL '45 minutes'
  );

-- Recall outreach action
INSERT INTO oe_ai_actions (action_type, module, description, input_data, output_data, status, patient_id, confidence_score, created_at) VALUES
  (
    'patient_recall', 'recall',
    'Recall outreach for Robert Thompson - 6 months overdue for cleaning',
    '{"patient_id": "a0000001-0000-0000-0000-000000000004", "last_visit": "180 days ago", "type": "recall"}',
    '{"message": "Hi Robert! It''s been a while since your last visit to AK Ultimate Dental. Regular cleanings help prevent costly problems down the road. We have convenient morning and afternoon openings this week. Reply YES to book, or call us at (702) 935-4395. We''d love to see you! - Dr. Alex''s Team"}',
    'pending_approval',
    'a0000001-0000-0000-0000-000000000004',
    0.78,
    now() - INTERVAL '3 hours'
  );

-- Some recently approved/executed actions (for the "Recent Decisions" section)
INSERT INTO oe_ai_actions (action_type, module, description, input_data, output_data, status, confidence_score, approved_by, approved_at, created_at) VALUES
  ('lead_response_draft', 'lead_response', 'Drafted response for lead: Stephanie Park - New patient family inquiry', '{}', '{}', 'executed', 0.91, 'Dr. Alex', now() - INTERVAL '20 hours', now() - INTERVAL '1 day'),
  ('appointment_confirmation', 'scheduling', 'Sent confirmation to Maria Gonzalez for Cleaning & Exam', '{}', '{}', 'executed', 0.96, 'Dr. Alex', now() - INTERVAL '2 days', now() - INTERVAL '2 days'),
  ('appointment_confirmation', 'scheduling', 'Sent confirmation to Sarah Chen for Cosmetic Consultation', '{}', '{}', 'approved', 0.94, 'Dr. Alex', now() - INTERVAL '1 day', now() - INTERVAL '1 day'),
  ('patient_recall', 'recall', 'Recall outreach for inactive patient: Anthony Brown', '{}', '{}', 'rejected', 0.65, 'Dr. Alex', now() - INTERVAL '3 days', now() - INTERVAL '3 days');

-- ============================================================================
-- INSURANCE VERIFICATIONS
-- ============================================================================
INSERT INTO oe_insurance_verifications (patient_id, insurance_provider, member_id, group_number, status, coverage_type, deductible, deductible_met, annual_maximum, annual_used, preventive_coverage, basic_coverage, major_coverage, orthodontic_coverage, verified_by, verified_at) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Delta Dental', 'DD-892341', 'GRP-4401', 'verified', 'PPO', 50.00, 50.00, 2000.00, 320.00, 100, 80, 50, 0, 'System', now() - INTERVAL '2 days'),
  ('a0000001-0000-0000-0000-000000000003', 'MetLife Dental', 'ML-556712', 'GRP-2200', 'verified', 'PPO', 75.00, 75.00, 1500.00, 0.00, 100, 80, 50, 50, 'System', now() - INTERVAL '1 day'),
  ('a0000001-0000-0000-0000-000000000006', 'Guardian Dental', 'GD-443211', 'GRP-5500', 'verified', 'HMO', 0.00, 0.00, 1000.00, 450.00, 100, 70, 50, 0, 'System', now() - INTERVAL '3 days');

-- Pending verifications
INSERT INTO oe_insurance_verifications (patient_id, insurance_provider, member_id, group_number, status) VALUES
  ('a0000001-0000-0000-0000-000000000005', 'Delta Dental', 'DD-778123', 'GRP-4401', 'pending'),
  ('a0000001-0000-0000-0000-000000000002', 'Cigna Dental', 'CG-110234', 'GRP-8800', 'pending');

-- ============================================================================
-- OUTREACH MESSAGES (for the Inbox)
-- ============================================================================
INSERT INTO oe_outreach_messages (patient_id, channel, direction, status, content, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'sms', 'outbound', 'delivered', 'Hi Maria! Just a reminder - your cleaning appointment is tomorrow at 9:00 AM. Reply CONFIRM to confirm. - AK Ultimate Dental', now() - INTERVAL '1 day'),
  ('a0000001-0000-0000-0000-000000000001', 'sms', 'inbound', 'delivered', 'CONFIRM - see you tomorrow!', now() - INTERVAL '23 hours'),
  ('a0000001-0000-0000-0000-000000000003', 'email', 'outbound', 'opened', 'Dear Sarah, Thank you for choosing AK Ultimate Dental for your cosmetic consultation. We look forward to discussing your smile goals with Dr. Alex. Your appointment is confirmed for today at 10:30 AM.', now() - INTERVAL '2 days'),
  ('a0000001-0000-0000-0000-000000000006', 'sms', 'outbound', 'delivered', 'Hi Michael, your crown prep appointment is scheduled for today at 1:00 PM with Dr. Alex. Please arrive 10 min early. Reply C to confirm or R to reschedule.', now() - INTERVAL '1 day'),
  ('a0000001-0000-0000-0000-000000000006', 'sms', 'inbound', 'delivered', 'C', now() - INTERVAL '22 hours'),
  ('a0000001-0000-0000-0000-000000000004', 'sms', 'outbound', 'delivered', 'Hi Robert, it''s been a while since your last visit to AK Ultimate Dental! We miss seeing you. Would you like to schedule a cleaning? Reply YES or call (702) 935-4395.', now() - INTERVAL '5 days'),
  ('a0000001-0000-0000-0000-000000000009', 'email', 'outbound', 'delivered', 'Hi Emily, just a friendly reminder that you''re due for your 6-month cleaning. We have several openings next week. Book online or call us at (702) 935-4395!', now() - INTERVAL '3 days'),
  ('a0000001-0000-0000-0000-000000000008', 'sms', 'inbound', 'delivered', 'Hey, I have a really bad toothache on my upper right side. Can I come in today?', now() - INTERVAL '3 hours'),
  ('a0000001-0000-0000-0000-000000000008', 'sms', 'outbound', 'delivered', 'Hi David, sorry to hear that! We can definitely see you today. We have an emergency slot at 4:00 PM. Does that work? - AK Ultimate Dental', now() - INTERVAL '2 hours 45 minutes'),
  ('a0000001-0000-0000-0000-000000000008', 'sms', 'inbound', 'delivered', 'Yes please! Thank you so much', now() - INTERVAL '2 hours 30 minutes');

-- ============================================================================
-- DAILY METRICS (last 7 days for analytics)
-- ============================================================================
INSERT INTO oe_daily_metrics (date, new_leads, leads_converted, appointments_scheduled, appointments_completed, no_shows, cancellations, production, collections, claims_submitted, claims_paid, ai_actions_taken, ai_actions_approved, avg_lead_response_seconds, patient_messages_sent, patient_messages_received) VALUES
  (CURRENT_DATE - INTERVAL '6 days', 3, 1, 6, 5, 1, 0, 4200.00, 3800.00, 4, 2, 8, 7, 45, 12, 6),
  (CURRENT_DATE - INTERVAL '5 days', 2, 1, 5, 5, 0, 1, 3800.00, 3500.00, 3, 3, 6, 6, 38, 10, 4),
  (CURRENT_DATE - INTERVAL '4 days', 4, 2, 7, 6, 0, 1, 5100.00, 4800.00, 5, 2, 11, 10, 52, 15, 8),
  (CURRENT_DATE - INTERVAL '3 days', 1, 0, 4, 4, 0, 0, 2900.00, 2600.00, 2, 4, 5, 5, 30, 8, 3),
  (CURRENT_DATE - INTERVAL '2 days', 3, 1, 6, 5, 1, 0, 4500.00, 4100.00, 4, 1, 9, 8, 41, 14, 7),
  (CURRENT_DATE - INTERVAL '1 day', 2, 1, 5, 4, 0, 1, 3200.00, 3000.00, 3, 3, 7, 6, 35, 11, 5),
  (CURRENT_DATE, 4, 0, 5, 0, 0, 0, 0.00, 0.00, 0, 0, 6, 3, 22, 6, 4);

-- ============================================================================
-- DONE! Dashboard should now show:
-- - 12 patients
-- - 5 appointments today (2 confirmed, 2 scheduled, 1 confirmed emergency)
-- - 4 recent leads (1 emergency, 1 high, 1 medium, 1 low)
-- - 6 pending AI actions in approval queue
-- - 4 recently processed actions
-- - 2 pending insurance verifications
-- - Patient messages in inbox
-- - 7 days of metrics
-- ============================================================================
