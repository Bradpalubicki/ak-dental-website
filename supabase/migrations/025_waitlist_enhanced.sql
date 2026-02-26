-- ============================================================================
-- Migration 025: Enhanced Waitlist
-- Adds oe_waitlist with provider/appointment-type FK references.
-- Merged from dental-engine migration 011.
-- NOTE: ak-dental-website may have a simpler oe_waitlist already.
-- This uses IF NOT EXISTS to be safe.
-- ============================================================================

CREATE TABLE IF NOT EXISTS oe_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  preferred_provider_id UUID REFERENCES oe_providers(id),
  appointment_type_id UUID REFERENCES oe_appointment_types(id),
  preferred_days INTEGER[],
  preferred_time_start TIME,
  preferred_time_end TIME,
  urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'offered', 'scheduled', 'cancelled', 'expired')),
  notes TEXT,
  offered_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  scheduled_appointment_id UUID
);

CREATE INDEX IF NOT EXISTS idx_oe_waitlist_status ON oe_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_oe_waitlist_patient ON oe_waitlist(patient_id);
CREATE INDEX IF NOT EXISTS idx_oe_waitlist_urgency ON oe_waitlist(urgency, created_at);

ALTER TABLE oe_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON oe_waitlist FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON oe_waitlist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM oe_roles LOOP
    INSERT INTO oe_role_permissions (role_id, module, can_view, can_edit, can_delete, can_admin)
    VALUES (r.id, 'waitlist', false, false, false, false)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

DO $$
DECLARE
  admin_role RECORD;
BEGIN
  FOR admin_role IN SELECT id FROM oe_roles WHERE name IN ('global_admin', 'admin') LOOP
    UPDATE oe_role_permissions
    SET can_view = true, can_edit = true, can_delete = true, can_admin = true
    WHERE role_id = admin_role.id AND module = 'waitlist';
  END LOOP;
END $$;
