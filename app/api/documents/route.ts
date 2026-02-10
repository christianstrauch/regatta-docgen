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
    
    console.log('[v0] POST /api/documents - Session:', session)
    
    if (!session) {
      console.error('[v0] Unauthorized - no session object')
      return NextResponse.json({ error: 'Unauthorized', details: 'No session found' }, { status: 401 })
    }
    
    if (!session.raceCommitteeId) {
      console.error('[v0] Unauthorized - no race committee ID in session')
      return NextResponse.json({ error: 'Unauthorized', details: 'No race committee ID' }, { status: 401 })
    }

    const committee = getRaceCommitteeByOIDC(session.raceCommitteeId)
    if (!committee) {
      console.error('[v0] Race committee not found:', session.raceCommitteeId)
      return NextResponse.json({ error: 'Race committee not found' }, { status: 404 })
    }

    const body = await request.json()
    console.log('[v0] Request body:', JSON.stringify(body, null, 2))
    
    const { title, eventData, selectedRules, modifiedRules, customFields, fleets, fleetProvisions } = body

    if (!title) {
      console.error('[v0] Missing title')
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const fleetsData = {
      fleets: fleets || [],
      provisions: fleetProvisions || []
    }

    console.log('[v0] Creating document for committee:', committee.id)

    const document = createRegattaDocument(
      committee.id,
      title,
      JSON.stringify(eventData || {}),
      JSON.stringify(selectedRules || []),
      JSON.stringify(modifiedRules || {}),
      JSON.stringify(fleetsData)
    )

    console.log('[v0] Document created:', document)

    return NextResponse.json({ document })
  } catch (error) {
    console.error('[v0] Create document error:', error)
    console.error('[v0] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
