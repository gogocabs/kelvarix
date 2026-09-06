-- Leads for kelvarix.in contact form. No TTL — retained forever by design.
CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  name        TEXT NOT NULL,
  business    TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL DEFAULT '',
  message     TEXT NOT NULL,
  source      TEXT NOT NULL DEFAULT 'kelvarix.in',
  ip_hash     TEXT NOT NULL DEFAULT '',
  telegram_ok INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
