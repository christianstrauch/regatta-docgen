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

export interface OIDCDiscovery {
  authorization_endpoint: string
  token_endpoint: string
  userinfo_endpoint: string
  jwks_uri: string
  end_session_endpoint?: string
  issuer: string
}

let cachedDiscovery: OIDCDiscovery | null = null
let discoveryExpiry: number = 0

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

export async function getOIDCDiscovery(): Promise<OIDCDiscovery | null> {
  const config = getAuthConfig()
  if (!config.oidcIssuer) {
    return null
  }

  // Return cached discovery if still valid (cache for 1 hour)
  if (cachedDiscovery && Date.now() < discoveryExpiry) {
    return cachedDiscovery
  }

  try {
    const discoveryUrl = `${config.oidcIssuer}/.well-known/openid-configuration`
    console.log('[v0] Fetching OIDC discovery from:', discoveryUrl)
    
    const response = await fetch(discoveryUrl)
    if (!response.ok) {
      console.error('[v0] OIDC discovery failed:', response.status, response.statusText)
      return null
    }

    const discovery: OIDCDiscovery = await response.json()
    
    // Cache the discovery for 1 hour
    cachedDiscovery = discovery
    discoveryExpiry = Date.now() + (60 * 60 * 1000)
    
    console.log('[v0] OIDC discovery successful:', {
      issuer: discovery.issuer,
      authorization_endpoint: discovery.authorization_endpoint,
      token_endpoint: discovery.token_endpoint
    })
    
    return discovery
  } catch (error) {
    console.error('[v0] OIDC discovery error:', error)
    return null
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
    const discovery = await getOIDCDiscovery()
    
    if (!discovery) {
      console.error('[v0] Cannot verify token: OIDC discovery failed')
      return null
    }

    const JWKS = createRemoteJWKSet(new URL(discovery.jwks_uri))
    
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: discovery.issuer,
      audience: config.oidcClientId,
    })

    return payload
  } catch (error) {
    console.error('[v0] Token verification failed:', error)
    return null
  }
}

export async function getUserSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value

    console.log('[v0] getUserSession - Has token:', !!sessionToken)

    if (!sessionToken) {
      console.log('[v0] No session token found in cookies')
      return null
    }

    const payload = await verifyToken(sessionToken)
    if (!payload) {
      console.log('[v0] Token verification failed - payload is null')
      return null
    }

    const config = getAuthConfig()
    
    const session = {
      userId: String(payload[config.oidcUserIdClaim] || payload.sub),
      raceCommitteeId: String(payload[config.oidcRaceCommitteeClaim] || ''),
      name: String(payload.name || ''),
      email: String(payload.email || '')
    }

    console.log('[v0] Session created:', {
      userId: session.userId,
      raceCommitteeId: session.raceCommitteeId,
      hasName: !!session.name,
      hasEmail: !!session.email
    })

    if (!session.raceCommitteeId) {
      console.error('[v0] Warning: No race committee ID in session')
    }
    
    return session
  } catch (error) {
    console.error('[v0] Session verification failed:', error)
    return null
  }
}

export async function getLoginUrl(): Promise<string> {
  const config = getAuthConfig()
  const discovery = await getOIDCDiscovery()
  
  if (!discovery) {
    console.error('[v0] Cannot generate login URL: OIDC discovery failed')
    return ''
  }

  const params = new URLSearchParams({
    client_id: config.oidcClientId,
    redirect_uri: config.oidcCallbackUrl,
    response_type: 'code',
    scope: 'openid profile email',
    state: generateState()
  })

  return `${discovery.authorization_endpoint}?${params.toString()}`
}

export async function getLogoutUrl(): Promise<string> {
  const discovery = await getOIDCDiscovery()
  
  if (!discovery?.end_session_endpoint) {
    return '/api/auth/logout'
  }

  return discovery.end_session_endpoint
}

export async function exchangeCodeForToken(code: string): Promise<any> {
  const config = getAuthConfig()
  const discovery = await getOIDCDiscovery()
  
  if (!discovery) {
    throw new Error('OIDC discovery failed')
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.oidcCallbackUrl,
    client_id: config.oidcClientId,
    client_secret: config.oidcClientSecret
  })

  console.log('[v0] Exchanging code for token at:', discovery.token_endpoint)
  
  const response = await fetch(discovery.token_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString()
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[v0] Token exchange failed:', response.status, errorText)
    throw new Error(`Token exchange failed: ${response.status}`)
  }

  return response.json()
}

function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
