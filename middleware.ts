import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Add paths that should be protected
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/bookings',
]

// Add paths that should be accessible only to non-authenticated users
const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname, origin } = request.nextUrl

  // Check if the path should be protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))

  // Redirect authenticated users away from auth pages
  if (isAuthPath && token) {
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // Redirect unauthenticated users to login
  if (isProtectedPath && !token) {
    const redirectUrl = `${origin}/login?callbackUrl=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(redirectUrl)
  }

  // Check email verification status for protected routes
  if (isProtectedPath && token && !token.emailVerified) {
    return NextResponse.redirect(`${origin}/verify-email`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. Paths starting with API, _next, or static (API routes and static files)
     * 2. Root path (/)
     * 3. Paths ending with file extensions (e.g. favicon.ico)
     */
    '/((?!api|_next|static|.*\\..*).*)',
  ],
} 