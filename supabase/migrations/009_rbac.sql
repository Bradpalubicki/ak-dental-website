-- =============================================
-- Migration 009: Role-Based Access Control (RBAC)
-- =============================================
-- Authority levels: global_admin, admin, manager, staff
-- Permissions are seeded for every sidebar item and major action.
-- Per-user overrides allow toggling permissions on/off beyond role defaults.

-- Permission registry
CREATE TABLE IF NOT EXISTS oe_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Role default permissions (what each authority level gets out of the box)
CREATE TABLE IF NOT EXISTS oe_role_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authority_level TEXT NOT NULL CHECK (authority_level IN ('global_admin', 'admin', 'manager', 'staff')),
  permission_key TEXT NOT NULL REFERENCES oe_permissions(key) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(authority_level, permission_key)
);

-- Per-user permission overrides
CREATE TABLE IF NOT EXISTS oe_user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  permission_key TEXT NOT NULL REFERENCES oe_permissions(key) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL,
  granted_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(clerk_user_id, permission_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_role_defaults_level ON oe_role_defaults(authority_level);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user ON oe_user_permissions(clerk_user_id);

-- =============================================
-- Seed permissions
-- =============================================
INSERT INTO oe_permissions (key, label, category, sort_order) VALUES
  -- Dashboard
  ('dashboard.view', 'View Dashboard', 'dashboard', 1),
  ('advisor.use', 'Use Business Advisor', 'dashboard', 2),
  ('approvals.view', 'View Approvals', 'dashboard', 3),
  ('approvals.manage', 'Manage Approvals', 'dashboard', 4),
  -- Operations
  ('leads.view', 'View Leads', 'operations', 10),
  ('leads.manage', 'Manage Leads', 'operations', 11),
  ('patients.view', 'View Patients', 'operations', 12),
  ('patients.manage', 'Manage Patients', 'operations', 13),
  ('appointments.view', 'View Appointments', 'operations', 14),
  ('appointments.manage', 'Manage Appointments', 'operations', 15),
  ('treatments.view', 'View Treatments', 'operations', 16),
  ('treatments.manage', 'Manage Treatments', 'operations', 17),
  ('insurance.view', 'View Insurance', 'operations', 18),
  ('insurance.manage', 'Manage Insurance', 'operations', 19),
  -- Business Hub
  ('financials.view', 'View Financials', 'business', 20),
  ('billing.view', 'View Billing', 'business', 21),
  ('billing.manage', 'Manage Billing', 'business', 22),
  ('hr.view', 'View HR & Payroll', 'business', 23),
  ('hr.manage', 'Manage HR & Payroll', 'business', 24),
  ('licensing.view', 'View Licensing', 'business', 25),
  ('licensing.manage', 'Manage Licensing', 'business', 26),
  -- Intelligence
  ('inbox.view', 'View Inbox', 'intelligence', 30),
  ('analytics.view', 'View Analytics', 'intelligence', 31),
  ('calls.view', 'View Calls', 'intelligence', 32),
  ('outreach.view', 'View Outreach', 'intelligence', 33),
  ('outreach.manage', 'Manage Outreach', 'intelligence', 34),
  -- Admin
  ('settings.view', 'View Settings', 'admin', 40),
  ('settings.manage', 'Manage Settings', 'admin', 41),
  ('users.manage', 'Manage Users & Roles', 'admin', 42),
  -- Documents
  ('documents.upload', 'Upload Documents', 'documents', 50),
  ('documents.delete', 'Delete Documents', 'documents', 51)
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- Seed role defaults
-- =============================================

-- Admin gets everything
INSERT INTO oe_role_defaults (authority_level, permission_key, enabled)
SELECT 'admin', key, true FROM oe_permissions
ON CONFLICT (authority_level, permission_key) DO NOTHING;

-- Manager gets all view permissions + limited manage
INSERT INTO oe_role_defaults (authority_level, permission_key, enabled)
SELECT 'manager', key, true FROM oe_permissions
WHERE key LIKE '%.view' OR key IN (
  'dashboard.view', 'advisor.use',
  'leads.manage', 'appointments.manage', 'treatments.manage',
  'documents.upload'
)
ON CONFLICT (authority_level, permission_key) DO NOTHING;

-- Manager explicitly denied admin permissions
INSERT INTO oe_role_defaults (authority_level, permission_key, enabled)
SELECT 'manager', key, false FROM oe_permissions
WHERE key IN ('settings.manage', 'users.manage', 'hr.manage', 'billing.manage', 'documents.delete')
ON CONFLICT (authority_level, permission_key) DO NOTHING;

-- Staff gets view-only for their relevant areas
INSERT INTO oe_role_defaults (authority_level, permission_key, enabled)
SELECT 'staff', key, true FROM oe_permissions
WHERE key IN (
  'dashboard.view', 'advisor.use',
  'appointments.view', 'patients.view', 'treatments.view',
  'insurance.view', 'inbox.view'
)
ON CONFLICT (authority_level, permission_key) DO NOTHING;

-- Staff explicitly denied everything else
INSERT INTO oe_role_defaults (authority_level, permission_key, enabled)
SELECT 'staff', key, false FROM oe_permissions
WHERE key NOT IN (
  'dashboard.view', 'advisor.use',
  'appointments.view', 'patients.view', 'treatments.view',
  'insurance.view', 'inbox.view'
)
ON CONFLICT (authority_level, permission_key) DO NOTHING;
