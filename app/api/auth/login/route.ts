import { NextResponse } from 'next/server'
import { getLoginUrl } from '@/lib/auth'

export async function GET() {
  const loginUrl = await getLoginUrl()
  
  if (!loginUrl) {
    console.error('[v0] Cannot generate login URL - OIDC not configured or discovery failed')
    return NextResponse.json({ error: 'OIDC not configured' }, { status: 500 })
  }

  console.log('[v0] Redirecting to login URL:', loginUrl)
  return NextResponse.redirect(loginUrl)
}
