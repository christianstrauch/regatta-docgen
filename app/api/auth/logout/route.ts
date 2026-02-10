import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getLogoutUrl } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  cookieStore.delete('session_token')

  const logoutUrl = await getLogoutUrl()
  
  console.log('Logout URL:', logoutUrl)
  
  if (logoutUrl && logoutUrl !== '/api/auth/logout') {
    return NextResponse.redirect(logoutUrl)
  }

  return NextResponse.redirect(new URL('/', request.url))
}
