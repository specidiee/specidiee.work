import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Legacy redirect for old login path
    if (request.nextUrl.pathname === '/gtd/login') {
        const loginUrl = new URL('/login', request.url)
        // Preserve 'from' param if it exists, otherwise default to /gtd
        const from = request.nextUrl.searchParams.get('from')
        if (from) loginUrl.searchParams.set('from', from)
        else loginUrl.searchParams.set('from', '/gtd')
        return NextResponse.redirect(loginUrl)
    }

    const protectedPrefixes = ['/gtd', '/write', '/image']
    const isProtected = protectedPrefixes.some(prefix =>
        request.nextUrl.pathname.startsWith(prefix)
    )

    if (isProtected) {
        const authCookie = request.cookies.get('gtd_auth')

        if (!authCookie || authCookie.value !== 'authenticated') {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('from', request.nextUrl.pathname)
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
