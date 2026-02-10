const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Read database path from environment variable or use default
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'regatta.db');

// Ensure parent directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('Created database directory:', dbDir);
}

console.log('Initializing database at:', dbPath);

const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create race_committees table with OIDC support
db.exec(`
  CREATE TABLE IF NOT EXISTS race_committees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    oidc_identifier TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✓ Created race_committees table');

// Create regatta_documents table
db.exec(`
  CREATE TABLE IF NOT EXISTS regatta_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    race_committee_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    event_details TEXT NOT NULL,
    selected_rules TEXT NOT NULL,
    custom_sections TEXT NOT NULL,
    fleets TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (race_committee_id) REFERENCES race_committees(id)
  );
`);

console.log('✓ Created regatta_documents table');

// Create index on race_committee_id for faster lookups
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_regatta_docs_race_committee 
  ON regatta_documents(race_committee_id);
`);

console.log('✓ Created indexes');

// Create index on oidc_identifier for faster lookups
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_race_committees_oidc 
  ON race_committees(oidc_identifier);
`);

console.log('✓ Created OIDC index');

console.log('\nDatabase initialized successfully!');
console.log('Database location:', dbPath);
console.log('Tables: race_committees, regatta_documents');

db.close();
