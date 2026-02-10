import { NextRequest, NextResponse } from 'next/server'
import { getAuthConfig, exchangeCodeForToken } from '@/lib/auth'
import { getOrCreateRaceCommittee } from '@/lib/database'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    console.error('Auth error from provider:', error)
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url))
  }

  if (!code) {
    console.error('No authorization code received')
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

    console.log('ID token payload claims:', Object.keys(payload))
    console.log('Full payload:', payload)

    const userId = payload[config.oidcUserIdClaim] || payload.sub
    const userName = payload.name || 'User'
    
    // The race committee claim contains the ACTUAL race committee name
    const raceCommitteeName = payload[config.oidcRaceCommitteeClaim] || 'Default Race Committee'
    
    // Extract logo URL if the claim is configured
    let logoUrl: string | undefined
    if (config.oidcRaceCommitteeLogoClaim && payload[config.oidcRaceCommitteeLogoClaim]) {
      logoUrl = String(payload[config.oidcRaceCommitteeLogoClaim])
    }

    console.log('Extracted values:', {
      userId,
      userName,
      raceCommitteeName,
      logoUrl,
      userIdClaim: config.oidcUserIdClaim,
      raceCommitteeClaim: config.oidcRaceCommitteeClaim,
      logoClaimName: config.oidcRaceCommitteeLogoClaim,
      claimValue: payload[config.oidcRaceCommitteeClaim]
    })

    // Create or get race committee using the race committee name as the identifier
    const committee = getOrCreateRaceCommittee(raceCommitteeName, raceCommitteeName, logoUrl)
    console.log('Race committee created/retrieved:', committee)

    // Set session cookie with the ID token
    const cookieStore = await cookies()
    cookieStore.set('session_token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log('Session cookie set successfully')
    console.log('Redirecting to home page')

    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
}
