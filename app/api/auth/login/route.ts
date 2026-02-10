import { NextResponse } from 'next/server'
import { getLoginUrl } from '@/lib/auth'

export async function GET() {
  const loginUrl = getLoginUrl()
  
  if (!loginUrl) {
    return NextResponse.json({ error: 'OIDC not configured' }, { status: 500 })
  }

  return NextResponse.redirect(loginUrl)
}
