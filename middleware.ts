import { NextRequest, NextResponse } from 'next/server'

// The admin login gate (mirrors the Express /dorbar interception from the
// reference setup). Anyone hitting the admin path without a session cookie
// gets the custom login page — which is the only form that can attach the
// 2FA authenticator code header.
const ADMIN_PATH = '/dorbar'

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Payload's built-in login form can't carry the authenticator code —
    // always bounce it back to the gate and clear any stale session cookie
    // so the gate shows the login form instead of looping.
    if (pathname === `${ADMIN_PATH}/login`) {
        const res = NextResponse.redirect(new URL(ADMIN_PATH, req.url))
        res.cookies.delete('payload-token')
        return res
    }

    // Gate ONLY the admin root (like the reference's Express gate): no session
    // cookie → serve the custom login page (URL stays on the admin path; the
    // rewrite is invisible). Deeper admin paths pass through — Payload's own
    // auth protects them, and first-run /create-first-user must stay reachable.
    if (
        (pathname === ADMIN_PATH || pathname === `${ADMIN_PATH}/`) &&
        !req.cookies.has('payload-token')
    ) {
        return NextResponse.rewrite(new URL('/cms-login', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dorbar/:path*'],
}
