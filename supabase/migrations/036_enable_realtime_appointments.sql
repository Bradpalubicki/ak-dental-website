-- Enable Supabase Realtime on oe_appointments table
-- This allows postgres_changes events to fire for INSERT, UPDATE, DELETE

ALTER PUBLICATION supabase_realtime ADD TABLE oe_appointments;
