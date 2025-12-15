import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    console.log('Middleware running for:', request.nextUrl.pathname)

    // Only run for /gtd routes
    if (request.nextUrl.pathname.startsWith('/gtd')) {
        console.log('GTD route detected')
        // Exclude /gtd/login itself to avoid loops
        if (request.nextUrl.pathname === '/gtd/login') {
            return NextResponse.next()
        }

        const authCookie = request.cookies.get('gtd_auth')
        console.log('Auth cookie:', authCookie)

        if (!authCookie || authCookie.value !== 'authenticated') {
            console.log('Redirecting to login')
            const loginUrl = new URL('/gtd/login', request.url)
            // Optional: Add redirect param to return after login
            // loginUrl.searchParams.set('from', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
