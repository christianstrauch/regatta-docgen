import { NextRequest, NextResponse } from 'next/server'
import { getAuthConfig } from '@/lib/auth'
import { getOrCreateRaceCommittee } from '@/lib/database'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  try {
    const config = getAuthConfig()

    // Exchange code for token
    const tokenResponse = await fetch(`${config.oidcIssuer}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.oidcCallbackUrl,
        client_id: config.oidcClientId,
        client_secret: config.oidcClientSecret,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokens = await tokenResponse.json()
    const idToken = tokens.id_token

    // Decode the ID token (without verification for now, just to get claims)
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())

    const userId = payload[config.oidcUserIdClaim] || payload.sub
    const raceCommitteeId = payload[config.oidcRaceCommitteeClaim] || 'default'
    const name = payload.name || 'Race Committee'

    // Create or get race committee
    getOrCreateRaceCommittee(raceCommitteeId, name)

    // Set session cookie with the ID token
    const cookieStore = await cookies()
    cookieStore.set('session_token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('[v0] Auth callback error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
}
