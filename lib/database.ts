import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'regatta.db')

let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    try {
      // Ensure the directory exists
      const dbDir = path.dirname(dbPath)
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true })
        console.log('Created database directory:', dbDir)
      }

      console.log('Connecting to database at:', dbPath)
      db = new Database(dbPath)
      db.pragma('journal_mode = WAL')
      
      // Verify tables exist
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[]
      const tableNames = tables.map(t => t.name)
      
      console.log('Database tables found:', tableNames)
      
      if (!tableNames.includes('race_committees') || !tableNames.includes('regatta_documents')) {
        console.error('Database tables missing. Tables found:', tableNames)
        console.error('Please run: pnpm db:init or node scripts/init-db.js')
        throw new Error('Database not initialized. Run: pnpm db:init')
      }

      console.log('Database connected successfully')
    } catch (error) {
      console.error('Database initialization error:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      // Set db to null and return null to prevent fatal errors during module initialization
      db = null
      return null
    }
  }
  return db
}

export interface RaceCommittee {
  id: number
  oidc_identifier: string
  name: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface RegattaDocument {
  id: number
  race_committee_id: number
  title: string
  event_details: string
  selected_rules: string
  custom_sections: string
  fleets: string
  created_at: string
  updated_at: string
}

export function getRaceCommitteeByOIDC(oidcIdentifier: string): RaceCommittee | undefined {
  try {
    const db = getDatabase()
    if (!db) {
      console.error('Database not available')
      return undefined
    }
    return db.prepare('SELECT * FROM race_committees WHERE oidc_identifier = ?').get(oidcIdentifier) as RaceCommittee | undefined
  } catch (error) {
    console.error('getRaceCommitteeByOIDC error:', error)
    return undefined
  }
}

export function createRaceCommittee(oidcIdentifier: string, name: string, logoUrl?: string): RaceCommittee | null {
  try {
    const db = getDatabase()
    if (!db) {
      console.error('Database not available')
      return null
    }
    const stmt = db.prepare('INSERT INTO race_committees (oidc_identifier, name, logo_url) VALUES (?, ?, ?)')
    const result = stmt.run(oidcIdentifier, name, logoUrl || null)
    return getRaceCommitteeByOIDC(oidcIdentifier) || null
  } catch (error) {
    console.error('createRaceCommittee error:', error)
    return null
  }
}

export function updateRaceCommitteeLogo(oidcIdentifier: string, logoUrl: string): boolean {
  try {
    const db = getDatabase()
    if (!db) {
      console.error('Database not available')
      return false
    }
    const stmt = db.prepare('UPDATE race_committees SET logo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE oidc_identifier = ?')
    stmt.run(logoUrl, oidcIdentifier)
    return true
  } catch (error) {
    console.error('updateRaceCommitteeLogo error:', error)
    return false
  }
}

export function getOrCreateRaceCommittee(oidcIdentifier: string, name: string, logoUrl?: string): RaceCommittee | null {
  try {
    let committee = getRaceCommitteeByOIDC(oidcIdentifier)
    if (!committee) {
      committee = createRaceCommittee(oidcIdentifier, name, logoUrl) || undefined
    } else if (logoUrl && committee.logo_url !== logoUrl) {
      // Update logo if it has changed
      updateRaceCommitteeLogo(oidcIdentifier, logoUrl)
      committee = getRaceCommitteeByOIDC(oidcIdentifier) || undefined
    }
    return committee || null
  } catch (error) {
    console.error('getOrCreateRaceCommittee error:', error)
    return null
  }
}

export function getRegattaDocuments(raceCommitteeId: number): RegattaDocument[] {
  try {
    const db = getDatabase()
    if (!db) {
      console.error('Database not available')
      return []
    }
    return db.prepare('SELECT * FROM regatta_documents WHERE race_committee_id = ? ORDER BY updated_at DESC').all(raceCommitteeId) as RegattaDocument[]
  } catch (error) {
    console.error('getRegattaDocuments error:', error)
    return []
  }
}

export function getRegattaDocument(id: number, raceCommitteeId: number): RegattaDocument | undefined {
  try {
    const db = getDatabase()
    if (!db) {
      console.error('Database not available')
      return undefined
    }
    return db.prepare('SELECT * FROM regatta_documents WHERE id = ? AND race_committee_id = ?').get(id, raceCommitteeId) as RegattaDocument | undefined
  } catch (error) {
    console.error('getRegattaDocument error:', error)
    return undefined
  }
}

export function createRegattaDocument(
  raceCommitteeId: number,
  title: string,
  eventDetails: string,
  selectedRules: string,
  customSections: string,
  fleets: string
): RegattaDocument | null {
  try {
    const db = getDatabase()
    if (!db) {
      console.error('Database not available')
      return null
    }
    const stmt = db.prepare(`
      INSERT INTO regatta_documents (race_committee_id, title, event_details, selected_rules, custom_sections, fleets)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(raceCommitteeId, title, eventDetails, selectedRules, customSections, fleets)
    return getRegattaDocument(Number(result.lastInsertRowid), raceCommitteeId) || null
  } catch (error) {
    console.error('createRegattaDocument error:', error)
    return null
  }
}

export function updateRegattaDocument(
  id: number,
  raceCommitteeId: number,
  title: string,
  eventDetails: string,
  selectedRules: string,
  customSections: string,
  fleets: string
): RegattaDocument | undefined {
  try {
    const db = getDatabase()
    if (!db) {
      console.error('Database not available')
      return undefined
    }
    const stmt = db.prepare(`
      UPDATE regatta_documents
      SET title = ?, event_details = ?, selected_rules = ?, custom_sections = ?, fleets = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND race_committee_id = ?
    `)
    stmt.run(title, eventDetails, selectedRules, customSections, fleets, id, raceCommitteeId)
    return getRegattaDocument(id, raceCommitteeId)
  } catch (error) {
    console.error('updateRegattaDocument error:', error)
    return undefined
  }
}

export function deleteRegattaDocument(id: number, raceCommitteeId: number): boolean {
  try {
    const db = getDatabase()
    if (!db) {
      console.error('Database not available')
      return false
    }
    const stmt = db.prepare('DELETE FROM regatta_documents WHERE id = ? AND race_committee_id = ?')
    const result = stmt.run(id, raceCommitteeId)
    return result.changes > 0
  } catch (error) {
    console.error('deleteRegattaDocument error:', error)
    return false
  }
}
