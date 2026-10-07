import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PATH = '/newsroom'
const SIGN_IN_PATH = '/newsroom/sign-in'

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Keep existing bookmarks working after moving the editorial workspace.
    if (pathname === '/dorbar' || pathname.startsWith('/dorbar/')) {
        const url = req.nextUrl.clone()
        url.pathname = pathname.replace(/^\/dorbar/, ADMIN_PATH)
        return NextResponse.redirect(url)
    }
    if (pathname === '/cms-login' || pathname === '/cms-login/') {
        return NextResponse.redirect(new URL(SIGN_IN_PATH, req.url))
    }

    // Payload's built-in login form can't carry the authenticator code —
    // always bounce it back to the gate and clear any stale session cookie
    // so the gate shows the login form instead of looping.
    if (pathname === `${ADMIN_PATH}/login`) {
        const res = NextResponse.redirect(new URL(SIGN_IN_PATH, req.url))
        res.cookies.delete('payload-token')
        return res
    }

    // Gate ONLY the admin root (like the reference's Express gate): no session
    // cookie → redirect to the canonical sign-in URL. Deeper paths use Payload's
    // authentication, and first-run /create-first-user must stay reachable.
    if (
        (pathname === ADMIN_PATH || pathname === `${ADMIN_PATH}/`) &&
        !req.cookies.has('payload-token')
    ) {
        return NextResponse.redirect(new URL(SIGN_IN_PATH, req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/newsroom/:path*', '/dorbar/:path*', '/cms-login/:path*'],
}
