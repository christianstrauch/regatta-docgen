-- regatta.club Database Schema
-- SQLite database for storing regatta documents by race committee

-- Race Committees Table
CREATE TABLE IF NOT EXISTS race_committees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Regatta Documents Table
CREATE TABLE IF NOT EXISTS regatta_documents (
  id TEXT PRIMARY KEY,
  race_committee_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_details TEXT NOT NULL, -- JSON
  selected_rules TEXT NOT NULL, -- JSON
  custom_sections TEXT NOT NULL, -- JSON
  fleets TEXT, -- JSON for fleets/flags data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (race_committee_id) REFERENCES race_committees(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_regatta_documents_race_committee 
  ON regatta_documents(race_committee_id);

CREATE INDEX IF NOT EXISTS idx_regatta_documents_updated 
  ON regatta_documents(race_committee_id, updated_at DESC);
