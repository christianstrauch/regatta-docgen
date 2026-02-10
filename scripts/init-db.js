const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'regatta.db');
console.log('Initializing database at:', dbPath);

const db = new Database(dbPath);

// Create race_committees table
db.exec(`
  CREATE TABLE IF NOT EXISTS race_committees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create regatta_documents table
db.exec(`
  CREATE TABLE IF NOT EXISTS regatta_documents (
    id TEXT PRIMARY KEY,
    race_committee_id TEXT NOT NULL,
    title TEXT NOT NULL,
    event_details TEXT NOT NULL,
    selected_rules TEXT NOT NULL,
    custom_sections TEXT NOT NULL,
    fleets TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (race_committee_id) REFERENCES race_committees(id)
  );
`);

// Create index on race_committee_id for faster lookups
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_regatta_docs_race_committee 
  ON regatta_documents(race_committee_id);
`);

console.log('Database initialized successfully!');
console.log('Tables created: race_committees, regatta_documents');

db.close();
