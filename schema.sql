-- Run this once after creating the D1 database
-- npx wrangler d1 execute aquatracker --remote --file schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_hint TEXT,
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_data (
  user_id    TEXT PRIMARY KEY REFERENCES users(id),
  data       TEXT NOT NULL,
  pref       TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
