-- Add birthday to workflow type constraint
ALTER TABLE oe_outreach_workflows DROP CONSTRAINT IF EXISTS oe_outreach_workflows_type_check;
ALTER TABLE oe_outreach_workflows ADD CONSTRAINT oe_outreach_workflows_type_check
  CHECK (type IN ('welcome', 'recall', 'treatment_followup', 'reactivation', 'no_show', 'review_request', 'birthday', 'custom'));
