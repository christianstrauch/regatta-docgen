import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'

export interface AuthConfig {
  oidcIssuer: string
  oidcClientId: string
  oidcClientSecret: string
  oidcUserIdClaim: string
  oidcRaceCommitteeClaim: string
  oidcCallbackUrl: string
}

export function getAuthConfig(): AuthConfig {
  return {
    oidcIssuer: process.env.OIDC_ISSUER || '',
    oidcClientId: process.env.OIDC_CLIENT_ID || '',
    oidcClientSecret: process.env.OIDC_CLIENT_SECRET || '',
    oidcUserIdClaim: process.env.OIDC_USER_ID_CLAIM || 'sub',
    oidcRaceCommitteeClaim: process.env.OIDC_RACE_COMMITTEE_CLAIM || 'org',
    oidcCallbackUrl: process.env.OIDC_CALLBACK_URL || 'http://localhost:3000/api/auth/callback'
  }
}

export interface UserSession {
  userId: string
  raceCommitteeId: string
  name?: string
  email?: string
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const config = getAuthConfig()
    if (!config.oidcIssuer) {
      return null
    }

    const JWKS = createRemoteJWKSet(new URL(`${config.oidcIssuer}/.well-known/jwks.json`))
    
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: config.oidcIssuer,
      audience: config.oidcClientId,
    })

    return payload
  } catch (error) {
    console.error('[v0] Token verification failed:', error)
    return null
  }
}

export async function getUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')?.value

  if (!sessionToken) {
    return null
  }

  try {
    const payload = await verifyToken(sessionToken)
    if (!payload) {
      return null
    }

    const config = getAuthConfig()
    
    return {
      userId: String(payload[config.oidcUserIdClaim] || payload.sub),
      raceCommitteeId: String(payload[config.oidcRaceCommitteeClaim] || ''),
      name: String(payload.name || ''),
      email: String(payload.email || '')
    }
  } catch (error) {
    console.error('[v0] Session verification failed:', error)
    return null
  }
}

export function getLoginUrl(): string {
  const config = getAuthConfig()
  if (!config.oidcIssuer) {
    return ''
  }

  const params = new URLSearchParams({
    client_id: config.oidcClientId,
    redirect_uri: config.oidcCallbackUrl,
    response_type: 'code',
    scope: 'openid profile email',
  })

  return `${config.oidcIssuer}/authorize?${params.toString()}`
}

export function getLogoutUrl(): string {
  const config = getAuthConfig()
  if (!config.oidcIssuer) {
    return '/api/auth/logout'
  }

  return `${config.oidcIssuer}/logout`
}
