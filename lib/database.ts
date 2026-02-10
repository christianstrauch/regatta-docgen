import Database from 'better-sqlite3'
import path from 'path'

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'regatta.db')

let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
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
  const db = getDatabase()
  return db.prepare('SELECT * FROM race_committees WHERE oidc_identifier = ?').get(oidcIdentifier) as RaceCommittee | undefined
}

export function createRaceCommittee(oidcIdentifier: string, name: string): RaceCommittee {
  const db = getDatabase()
  const stmt = db.prepare('INSERT INTO race_committees (oidc_identifier, name) VALUES (?, ?)')
  const result = stmt.run(oidcIdentifier, name)
  return getRaceCommitteeByOIDC(oidcIdentifier)!
}

export function getOrCreateRaceCommittee(oidcIdentifier: string, name: string): RaceCommittee {
  let committee = getRaceCommitteeByOIDC(oidcIdentifier)
  if (!committee) {
    committee = createRaceCommittee(oidcIdentifier, name)
  }
  return committee
}

export function getRegattaDocuments(raceCommitteeId: number): RegattaDocument[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM regatta_documents WHERE race_committee_id = ? ORDER BY updated_at DESC').all(raceCommitteeId) as RegattaDocument[]
}

export function getRegattaDocument(id: number, raceCommitteeId: number): RegattaDocument | undefined {
  const db = getDatabase()
  return db.prepare('SELECT * FROM regatta_documents WHERE id = ? AND race_committee_id = ?').get(id, raceCommitteeId) as RegattaDocument | undefined
}

export function createRegattaDocument(
  raceCommitteeId: number,
  title: string,
  eventDetails: string,
  selectedRules: string,
  customSections: string,
  fleets: string
): RegattaDocument {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO regatta_documents (race_committee_id, title, event_details, selected_rules, custom_sections, fleets)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(raceCommitteeId, title, eventDetails, selectedRules, customSections, fleets)
  return getRegattaDocument(Number(result.lastInsertRowid), raceCommitteeId)!
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
  const db = getDatabase()
  const stmt = db.prepare(`
    UPDATE regatta_documents
    SET title = ?, event_details = ?, selected_rules = ?, custom_sections = ?, fleets = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND race_committee_id = ?
  `)
  stmt.run(title, eventDetails, selectedRules, customSections, fleets, id, raceCommitteeId)
  return getRegattaDocument(id, raceCommitteeId)
}

export function deleteRegattaDocument(id: number, raceCommitteeId: number): boolean {
  const db = getDatabase()
  const stmt = db.prepare('DELETE FROM regatta_documents WHERE id = ? AND race_committee_id = ?')
  const result = stmt.run(id, raceCommitteeId)
  return result.changes > 0
}

export function updateRaceCommitteeLogo(oidcIdentifier: string, logoUrl: string): void {
  const db = getDatabase()
  const stmt = db.prepare('UPDATE race_committees SET logo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE oidc_identifier = ?')
  stmt.run(logoUrl, oidcIdentifier)
}
