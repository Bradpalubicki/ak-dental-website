-- ============================================================================
-- Migration 024: Appointment Types & Resources
-- Adds oe_appointment_types and oe_resources tables.
-- Merged from dental-engine migration 011.
-- ============================================================================

-- ============================================================================
-- APPOINTMENT TYPES (service catalog for scheduling)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_appointment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  category TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  buffer_after_minutes INTEGER DEFAULT 0,
  default_fee NUMERIC(10,2) DEFAULT 0,
  color TEXT DEFAULT '#3b82f6',
  online_bookable BOOLEAN DEFAULT true,
  requires_provider BOOLEAN DEFAULT true,
  requires_resource BOOLEAN DEFAULT false,
  max_per_day_per_provider INTEGER,
  provider_restrictions UUID[],
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_oe_appointment_types_active ON oe_appointment_types(active);
CREATE INDEX IF NOT EXISTS idx_oe_appointment_types_code ON oe_appointment_types(code);

-- ============================================================================
-- RESOURCES (rooms, operatories, equipment)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'room' CHECK (type IN ('room', 'operatory', 'equipment', 'virtual')),
  description TEXT,
  capacity INTEGER DEFAULT 1,
  color TEXT DEFAULT '#6b7280',
  active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_oe_resources_type ON oe_resources(type);
CREATE INDEX IF NOT EXISTS idx_oe_resources_active ON oe_resources(active);

-- ============================================================================
-- ALTER oe_appointments — add enhanced scheduling columns
-- ============================================================================
ALTER TABLE oe_appointments
  ADD COLUMN IF NOT EXISTS appointment_type_id UUID REFERENCES oe_appointment_types(id),
  ADD COLUMN IF NOT EXISTS resource_id UUID REFERENCES oe_resources(id),
  ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS booking_source TEXT DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS recurrence_rule TEXT,
  ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_48h_sent BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_oe_appointments_type_id ON oe_appointments(appointment_type_id);
CREATE INDEX IF NOT EXISTS idx_oe_appointments_start ON oe_appointments(start_time);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE oe_appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON oe_appointment_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_resources FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON oe_appointment_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- RBAC: Add new modules
-- ============================================================================
DO $$
DECLARE
  r RECORD;
  new_modules TEXT[] := ARRAY['appointment_types', 'resources'];
  m TEXT;
BEGIN
  FOR r IN SELECT id FROM oe_roles LOOP
    FOREACH m IN ARRAY new_modules LOOP
      INSERT INTO oe_role_permissions (role_id, module, can_view, can_edit, can_delete, can_admin)
      VALUES (r.id, m, false, false, false, false)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

DO $$
DECLARE
  admin_role RECORD;
  admin_modules TEXT[] := ARRAY['appointment_types', 'resources'];
  m TEXT;
BEGIN
  FOR admin_role IN SELECT id FROM oe_roles WHERE name IN ('global_admin', 'admin') LOOP
    FOREACH m IN ARRAY admin_modules LOOP
      UPDATE oe_role_permissions
      SET can_view = true, can_edit = true, can_delete = true, can_admin = true
      WHERE role_id = admin_role.id AND module = m;
    END LOOP;
  END LOOP;
END $$;
