-- Legal Documents Tracker
-- Tracks NuStack → client legal agreements: MPA/BAA, TSA, addendums, etc.
-- Phase 0: AK Ultimate Dental seed data included

CREATE TABLE IF NOT EXISTS de_legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  agreement_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'master_platform_agreement',
    'technology_services_authorization',
    'state_addendum',
    'sub_ba',
    'nda',
    'term_sheet',
    'subscription_agreement',
    'ip_assignment',
    'other'
  )),

  client_entity TEXT NOT NULL,
  nustack_entity TEXT NOT NULL DEFAULT 'Dental Engine Partners LLC',

  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'sent',
    'signed',
    'expired',
    'voided'
  )),

  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  effective_date DATE,
  expiration_date DATE,

  document_url TEXT,
  signed_document_url TEXT,
  boldsign_document_id TEXT,

  requires_notarization BOOLEAN NOT NULL DEFAULT false,
  baa_included BOOLEAN NOT NULL DEFAULT false,
  hipaa_required BOOLEAN NOT NULL DEFAULT false,

  notes TEXT,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_de_legal_docs_status ON de_legal_documents(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_de_legal_docs_category ON de_legal_documents(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_de_legal_docs_client ON de_legal_documents(client_entity) WHERE deleted_at IS NULL;

CREATE OR REPLACE FUNCTION update_de_legal_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_de_legal_documents_updated_at
  BEFORE UPDATE ON de_legal_documents
  FOR EACH ROW EXECUTE FUNCTION update_de_legal_documents_updated_at();

-- ============================================================================
-- SEED: AK Ultimate Dental Phase 0 Documents
-- ============================================================================

INSERT INTO de_legal_documents (
  agreement_number, name, description, category,
  client_entity, nustack_entity, status, effective_date,
  baa_included, hipaa_required, notes
) VALUES
(
  'DEP-2026-001',
  'Master Platform Agreement + Business Associate Agreement',
  'Governs all services between AK Ultimate Dental LLC and Dental Engine Partners LLC. Includes full BAA (Article VI) per 45 CFR 164.504(e). AK founding member fee waiver: $0/month while Alex Chireau remains active vested member of DEP.',
  'master_platform_agreement',
  'AK Ultimate Dental LLC',
  'Dental Engine Partners LLC',
  'pending', '2026-03-01',
  true, true,
  'Priority 1 — must be signed before any PHI flows to platform. Includes Exhibit D approved subcontractor BAs.'
),
(
  'DEP-2026-001-TSA',
  'Technology Services Authorization',
  'Authorizes Dental Engine Partners LLC and NuStack Digital Ventures LLC to access 13 systems on behalf of AK Ultimate Dental LLC. Three tiers: PHI-Present (Supabase, Twilio, Sikka, Vapi, Claude), Account Access (Google, Meta), Platform-Provisioned (Clerk, Vercel).',
  'technology_services_authorization',
  'AK Ultimate Dental LLC',
  'Dental Engine Partners LLC',
  'pending', '2026-03-01',
  false, true,
  'Sign concurrently with MPA. Exhibit B-1 lists all 13 systems.'
),
(
  'DEP-2026-001-NV',
  'Nevada SB 370 Processing Addendum',
  'Required for all Nevada clients per NRS Chapter 629B (effective March 31, 2024). Controller (AK Ultimate Dental) / Processor (Dental Engine Partners) framework. NRS 629.051 records retention: 10 years adults.',
  'state_addendum',
  'AK Ultimate Dental LLC',
  'Dental Engine Partners LLC',
  'pending', '2026-03-01',
  false, true,
  'AUTO-REQUIRED — Nevada practice. Sign concurrently with MPA.'
),
(
  'NUSTACK-INTERNAL-SUB-BA-001',
  'Sub-Business Associate Agreement (Internal)',
  'Internal Sub-BA between Dental Engine Partners LLC (Business Associate) and NuStack Digital Ventures LLC (Sub-contractor Business Associate). Required by 45 CFR 164.308(b)(2). INTERNAL — AK Ultimate Dental does not sign this.',
  'sub_ba',
  'NuStack Digital Ventures LLC',
  'Dental Engine Partners LLC',
  'pending', '2026-03-01',
  true, true,
  'CRITICAL HIPAA GAP — must be executed before any PHI is processed. Brad signs on behalf of both entities.'
);
