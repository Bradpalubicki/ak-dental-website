-- Migration 039: Fix RLS — enable on oe_email_style table
-- Security Advisor fix for pivfajkousqthlfaqtwr / xrjftoilbrxycaixwvia (AK Dental)
-- oe_email_style was created in 038_email_style.sql without RLS enabled

ALTER TABLE oe_email_style ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on oe_email_style"
  ON oe_email_style FOR ALL USING (true) WITH CHECK (true);
