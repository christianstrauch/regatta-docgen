import { NextRequest, NextResponse } from 'next/server'
import { getAuthConfig, exchangeCodeForToken } from '@/lib/auth'
import { getOrCreateRaceCommittee } from '@/lib/database'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    console.error('[v0] Auth error from provider:', error)
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url))
  }

  if (!code) {
    console.error('[v0] No authorization code received')
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  try {
    const config = getAuthConfig()

    // Exchange code for token using the proper OIDC token endpoint
    const tokens = await exchangeCodeForToken(code)
    const idToken = tokens.id_token

    if (!idToken) {
      throw new Error('No ID token received from provider')
    }

    // Decode the ID token (without verification for now, just to get claims)
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())

    console.log('[v0] ID token payload claims:', Object.keys(payload))

    const userId = payload[config.oidcUserIdClaim] || payload.sub
    const raceCommitteeId = payload[config.oidcRaceCommitteeClaim] || 'default'
    const name = payload.name || 'Race Committee'

    console.log('[v0] Extracted values:', {
      userId,
      raceCommitteeId,
      name,
      userIdClaim: config.oidcUserIdClaim,
      raceCommitteeClaim: config.oidcRaceCommitteeClaim
    })

    // Create or get race committee
    const committee = getOrCreateRaceCommittee(raceCommitteeId, name)
    console.log('[v0] Race committee created/retrieved:', committee)

    // Set session cookie with the ID token
    const cookieStore = await cookies()
    cookieStore.set('session_token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log('[v0] Session cookie set successfully')
    console.log('[v0] Redirecting to home page')

    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('[v0] Auth callback error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
}
