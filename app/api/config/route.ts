import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    logoUrl: process.env.LOGO_URL || '',
    appName: process.env.APP_NAME || 'regatta.club Document Generator'
  })
}
