import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  const signInURL = new URL('/glpi', req.url)

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(signInURL)
  }
}

export const config = {
  matcher: ['/'],
}
