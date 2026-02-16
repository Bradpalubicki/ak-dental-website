-- Clinical Notes System
-- Phase 6: SOAP notes, templates, AI assistance, provider signing

CREATE TABLE IF NOT EXISTS oe_clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID DEFAULT '00000000-0000-0000-0000-000000000001',
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  appointment_id UUID,
  provider_name TEXT NOT NULL,
  provider_id TEXT, -- Clerk user ID
  note_type TEXT NOT NULL DEFAULT 'progress' CHECK (note_type IN ('progress','exam','consultation','procedure','follow_up','emergency','phone_call')),
  chief_complaint TEXT,
  subjective TEXT, -- SOAP: Subjective
  objective TEXT,  -- SOAP: Objective (clinical findings)
  assessment TEXT, -- SOAP: Assessment (diagnosis)
  plan TEXT,       -- SOAP: Plan (treatment plan)
  tooth_numbers TEXT[], -- Teeth involved (e.g., '{14,15,18}')
  procedure_codes TEXT[], -- CDT codes performed
  medications TEXT[],
  vitals JSONB DEFAULT '{}', -- BP, pulse, temp, O2
  ai_summary TEXT,
  ai_suggestions JSONB DEFAULT '[]',
  is_signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMPTZ,
  signed_by TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_progress','completed','signed','amended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clinical_notes_patient ON oe_clinical_notes(patient_id);
CREATE INDEX idx_clinical_notes_provider ON oe_clinical_notes(provider_id);
CREATE INDEX idx_clinical_notes_date ON oe_clinical_notes(created_at DESC);
CREATE INDEX idx_clinical_notes_status ON oe_clinical_notes(status);
CREATE INDEX idx_clinical_notes_type ON oe_clinical_notes(note_type);

ALTER TABLE oe_clinical_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON oe_clinical_notes FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_oe_clinical_notes_updated_at BEFORE UPDATE ON oe_clinical_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Note templates
CREATE TABLE IF NOT EXISTS oe_note_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID DEFAULT '00000000-0000-0000-0000-000000000001',
  name TEXT NOT NULL,
  note_type TEXT NOT NULL,
  template_data JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE oe_note_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON oe_note_templates FOR ALL USING (true) WITH CHECK (true);

-- Insert default templates
INSERT INTO oe_note_templates (name, note_type, template_data, is_default) VALUES
('General Exam', 'exam', '{"subjective":"Patient presents for routine dental examination.","objective":"Extraoral exam: WNL. Intraoral exam: ","assessment":"","plan":""}', true),
('Hygiene Visit', 'progress', '{"subjective":"Patient presents for scheduled hygiene appointment.","objective":"Periodontal charting completed. ","assessment":"","plan":"Continue 6-month recall."}', true),
('Crown Prep', 'procedure', '{"subjective":"Patient presents for crown preparation.","objective":"Tooth #__ prepared for full coverage crown. Impression taken. Temporary crown placed.","assessment":"","plan":"Return for crown delivery in 2 weeks."}', true),
('Emergency Visit', 'emergency', '{"subjective":"Patient presents with chief complaint of ","objective":"","assessment":"","plan":""}', true),
('Extraction', 'procedure', '{"subjective":"Patient presents for extraction of tooth #__.","objective":"Adequate anesthesia achieved. Tooth #__ extracted without complications. Hemostasis achieved.","assessment":"","plan":"Post-op instructions given. Follow up in 1 week."}', true),
('Root Canal', 'procedure', '{"subjective":"Patient presents for endodontic therapy on tooth #__.","objective":"Access obtained. Canals located, instrumented, and obturated. Temporary restoration placed.","assessment":"","plan":"Return for permanent restoration."}', true);
