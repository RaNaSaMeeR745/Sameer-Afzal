-- Phase 24: idempotent credits + outcome score snapshots

ALTER TABLE credits_ledger
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'grant';

ALTER TABLE credits_ledger
  ADD COLUMN IF NOT EXISTS event_id text;

-- Backfill any existing rows without event_id using id as a stable key
UPDATE credits_ledger
SET event_id = id::text
WHERE event_id IS NULL;

ALTER TABLE credits_ledger
  ALTER COLUMN event_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS credits_ledger_event_uidx
  ON credits_ledger (event_id);

ALTER TABLE outcomes
  ADD COLUMN IF NOT EXISTS score_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb;
