-- Soft-delete support for media_assets
-- Client takes down a photo → status=archived, hidden from site immediately
-- After 30 days a hard-delete job removes the blob + row permanently

ALTER TABLE media_assets
  ADD COLUMN IF NOT EXISTS archived_at       timestamptz,
  ADD COLUMN IF NOT EXISTS archive_expires_at timestamptz;

-- Index so a cron job can efficiently find rows ready for permanent deletion
CREATE INDEX IF NOT EXISTS idx_media_assets_archive_expires
  ON media_assets (archive_expires_at)
  WHERE status = 'archived';
