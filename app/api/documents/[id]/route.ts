import { NextRequest, NextResponse } from 'next/server'
import { getUserSession } from '@/lib/auth'
import { 
  getRegattaDocument, 
  updateRegattaDocument, 
  deleteRegattaDocument,
  getRaceCommitteeByOIDC 
} from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserSession()
    
    if (!session || !session.raceCommitteeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const committee = getRaceCommitteeByOIDC(session.raceCommitteeId)
    if (!committee) {
      return NextResponse.json({ error: 'Race committee not found' }, { status: 404 })
    }

    const { id } = await params
    const document = getRegattaDocument(Number(id), committee.id)
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('[v0] Get document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserSession()
    
    if (!session || !session.raceCommitteeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const committee = getRaceCommitteeByOIDC(session.raceCommitteeId)
    if (!committee) {
      return NextResponse.json({ error: 'Race committee not found' }, { status: 404 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, eventDetails, selectedRules, customSections, fleets } = body

    const document = updateRegattaDocument(
      Number(id),
      committee.id,
      title,
      JSON.stringify(eventDetails),
      JSON.stringify(selectedRules),
      JSON.stringify(customSections),
      JSON.stringify(fleets)
    )

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('[v0] Update document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserSession()
    
    if (!session || !session.raceCommitteeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const committee = getRaceCommitteeByOIDC(session.raceCommitteeId)
    if (!committee) {
      return NextResponse.json({ error: 'Race committee not found' }, { status: 404 })
    }

    const { id } = await params
    const success = deleteRegattaDocument(Number(id), committee.id)

    if (!success) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Delete document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
