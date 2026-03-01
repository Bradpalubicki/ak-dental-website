-- Migration 034: In-App Notifications
-- Creates the oe_notifications table powering the bell icon in DashboardHeader.
-- Supports: unread badge count, dropdown list, mark-read, mark-all-read.
-- Realtime enabled so new rows appear instantly via Supabase channel.

CREATE TABLE IF NOT EXISTS oe_notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  type          TEXT NOT NULL DEFAULT 'info'
                  CHECK (type IN ('info', 'success', 'warning', 'critical', 'lead', 'appointment', 'hr', 'ai', 'insurance', 'billing')),
  title         TEXT NOT NULL,
  body          TEXT,
  link          TEXT,            -- /dashboard/... deep-link
  read          BOOLEAN NOT NULL DEFAULT false,
  read_at       TIMESTAMPTZ,
  actor         TEXT,            -- who triggered it (patient name, system, etc.)
  ref_id        UUID,            -- optional FK to related record
  ref_table     TEXT             -- which table ref_id belongs to
);

-- Index for unread badge query (the most common query)
CREATE INDEX IF NOT EXISTS oe_notifications_unread_idx ON oe_notifications (read, created_at DESC);

-- Enable Realtime on this table
ALTER TABLE oe_notifications REPLICA IDENTITY FULL;

-- RLS (no user isolation needed — this is a single-tenant practice dashboard)
ALTER TABLE oe_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role full access" ON oe_notifications
  FOR ALL USING (true) WITH CHECK (true);

-- Seed a handful of realistic notifications so the bell isn't empty on first load
INSERT INTO oe_notifications (type, title, body, link, actor) VALUES
  ('lead',        'New lead from Google',             'Sara M. submitted a new patient inquiry from Google Ads.', '/dashboard/leads', 'Sara M.'),
  ('appointment', 'Appointment confirmed',            'James R. confirmed tomorrow 9:00 AM cleaning.', '/dashboard/appointments', 'James R.'),
  ('ai',          'AI draft awaiting approval',       'Lead reply for Michael T. is ready for your review.', '/dashboard/approvals', 'AI Engine'),
  ('insurance',   'Insurance verification needed',    'Coverage check pending for Ana L. — appointment in 2 days.', '/dashboard/insurance', 'Ana L.'),
  ('hr',          'Offer letter signed',              'David K. signed the Dental Assistant offer letter.', '/dashboard/hr/onboarding', 'David K.'),
  ('billing',     'Claim paid',                       'Delta Dental paid $840 for claim #2024-1182.', '/dashboard/billing', 'Delta Dental'),
  ('warning',     'No-show follow-up pending',        '3 patients missed appointments this week — outreach not yet sent.', '/dashboard/appointments', 'System')
ON CONFLICT DO NOTHING;
