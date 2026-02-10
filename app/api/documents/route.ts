import { NextRequest, NextResponse } from 'next/server'
import { getUserSession } from '@/lib/auth'
import { 
  getRegattaDocuments, 
  createRegattaDocument, 
  getRaceCommitteeByOIDC 
} from '@/lib/database'

export async function GET() {
  try {
    const session = await getUserSession()
    
    if (!session || !session.raceCommitteeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const committee = getRaceCommitteeByOIDC(session.raceCommitteeId)
    if (!committee) {
      return NextResponse.json({ error: 'Race committee not found' }, { status: 404 })
    }

    const documents = getRegattaDocuments(committee.id)
    
    return NextResponse.json({ documents })
  } catch (error) {
    console.error('[v0] Get documents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getUserSession()
    
    if (!session || !session.raceCommitteeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const committee = getRaceCommitteeByOIDC(session.raceCommitteeId)
    if (!committee) {
      return NextResponse.json({ error: 'Race committee not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, eventDetails, selectedRules, customSections, fleets } = body

    const document = createRegattaDocument(
      committee.id,
      title,
      JSON.stringify(eventDetails),
      JSON.stringify(selectedRules),
      JSON.stringify(customSections),
      JSON.stringify(fleets)
    )

    return NextResponse.json({ document })
  } catch (error) {
    console.error('[v0] Create document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
