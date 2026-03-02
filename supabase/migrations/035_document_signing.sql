-- Migration 035: Document signing support (document_type column on oe_offer_letters)
-- Reuses oe_offer_letters as a general document signing table.
-- document_type NULL = employment offer (existing behavior)
-- document_type = 'master_platform_agreement' | 'technology_services_authorization' | 'state_addendum' = legal docs

ALTER TABLE oe_offer_letters
  ADD COLUMN IF NOT EXISTS document_type TEXT;

-- Index for quick lookup of legal docs
CREATE INDEX IF NOT EXISTS idx_oe_offer_letters_document_type ON oe_offer_letters(document_type);
