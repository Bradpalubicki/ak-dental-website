-- Migration 022: Provider Directory & Scheduling Enhancement
-- Creates providers, availability, time-off blocks, and referral tracking

-- Providers table
CREATE TABLE IF NOT EXISTS oe_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID DEFAULT '00000000-0000-0000-0000-000000000001',
  clerk_user_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT, -- DDS, DMD, RDH, DA, etc.
  specialty TEXT, -- General, Orthodontics, Endodontics, etc.
  npi_number TEXT,
  license_number TEXT,
  license_state TEXT DEFAULT 'NV',
  email TEXT,
  phone TEXT,
  bio TEXT,
  photo_url TEXT,
  accepting_new_patients BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  color TEXT DEFAULT '#3B82F6', -- Calendar color
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider availability/schedule
CREATE TABLE IF NOT EXISTS oe_provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES oe_providers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  location TEXT DEFAULT 'Main Office',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider time-off/blocks
CREATE TABLE IF NOT EXISTS oe_provider_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES oe_providers(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('vacation','sick','meeting','lunch','personal','holiday','other')),
  title TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  all_day BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral tracking
CREATE TABLE IF NOT EXISTS oe_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID DEFAULT '00000000-0000-0000-0000-000000000001',
  patient_id UUID REFERENCES oe_patients(id),
  referring_provider_id UUID REFERENCES oe_providers(id),
  referred_to_name TEXT NOT NULL,
  referred_to_specialty TEXT,
  referred_to_phone TEXT,
  referred_to_fax TEXT,
  referred_to_address TEXT,
  reason TEXT NOT NULL,
  urgency TEXT DEFAULT 'routine' CHECK (urgency IN ('routine','urgent','emergency')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','accepted','completed','declined','cancelled')),
  notes TEXT,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_providers_active ON oe_providers(is_active);
CREATE INDEX IF NOT EXISTS idx_provider_availability_provider ON oe_provider_availability(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_blocks_provider ON oe_provider_blocks(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_blocks_dates ON oe_provider_blocks(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_referrals_patient ON oe_referrals(patient_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON oe_referrals(status);

-- RLS
ALTER TABLE oe_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_provider_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON oe_providers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_provider_availability FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_provider_blocks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_referrals FOR ALL USING (true) WITH CHECK (true);

-- Triggers
CREATE TRIGGER update_oe_providers_updated_at BEFORE UPDATE ON oe_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_referrals_updated_at BEFORE UPDATE ON oe_referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Add provider_id to appointments if not exists
DO $$ BEGIN
  ALTER TABLE oe_appointments ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES oe_providers(id);
EXCEPTION WHEN others THEN NULL;
END $$;
