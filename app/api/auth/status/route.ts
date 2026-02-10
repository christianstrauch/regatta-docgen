import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getUserSession()
    
    if (session) {
      return NextResponse.json({
        authenticated: true,
        user: {
          userId: session.userId,
          name: session.name,
          email: session.email,
          raceCommitteeId: session.raceCommitteeId
        }
      })
    }

    return NextResponse.json({ authenticated: false })
  } catch (error) {
    console.error('[v0] Auth status error:', error)
    return NextResponse.json({ authenticated: false })
  }
}
