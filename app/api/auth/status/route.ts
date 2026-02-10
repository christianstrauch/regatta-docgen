import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/auth'
import { getRaceCommitteeByOIDC } from '@/lib/database'

export async function GET() {
  try {
    const session = await getUserSession()
    
    console.log('[v0] Auth status check - Session:', session)
    
    if (session) {
      let committeeName = session.raceCommitteeId // Default to the ID itself
      let committeeLogo = process.env.LOGO_URL || '' // Default fallback logo
      
      try {
        const committee = getRaceCommitteeByOIDC(session.raceCommitteeId)
        console.log('[v0] Race committee lookup result:', committee)
        
        if (committee?.name) {
          committeeName = committee.name
        }
        // Use committee-specific logo if available, otherwise keep default
        if (committee?.logo_url) {
          committeeLogo = committee.logo_url
        }
      } catch (dbError) {
        console.error('[v0] Database error getting committee:', dbError)
        // Continue with committeeName = raceCommitteeId and default logo
      }
      
      const userResponse = {
        authenticated: true,
        user: {
          userId: session.userId,
          name: session.name,
          email: session.email,
          raceCommitteeId: session.raceCommitteeId,
          raceCommitteeName: committeeName,
          raceCommitteeLogo: committeeLogo
        }
      }
      
      console.log('[v0] Auth status response:', userResponse)
      
      return NextResponse.json(userResponse)
    }

    console.log('[v0] No session found')
    return NextResponse.json({ authenticated: false })
  } catch (error) {
    console.error('[v0] Auth status error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
