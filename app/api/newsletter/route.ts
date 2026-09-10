import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletterServer } from '@/app/actions/forms';

// A plain (no-JS) form POST has nowhere to render its result, so the visitor
// is sent back to the page they submitted from with a `?subscribed=` flag that
// NewsletterStatus renders. Referer is the only signal available.
//
// Only the *path* is taken from it — the origin always comes from request.url
// — so this can never become an open redirect. Protocol-relative paths
// ("//evil.com") would still escape, hence the explicit guard.
function refererPath(request: NextRequest): string {
    const referer = request.headers.get('referer');
    if (!referer) return '/subscribe';

    try {
        const { pathname } = new URL(referer);
        if (!pathname.startsWith('/') || pathname.startsWith('//')) return '/subscribe';
        return pathname;
    } catch {
        return '/subscribe';
    }
}

function backTo(request: NextRequest, path: string, status: string) {
    const target = new URL(path, request.url);
    target.searchParams.set('subscribed', status);
    // 303 so the browser follows with GET and a refresh can't re-POST.
    return NextResponse.redirect(target, 303);
}

export async function POST(request: NextRequest) {
    const path = refererPath(request);

    try {
        const formData = await request.formData();
        const result = await subscribeNewsletterServer(formData, path);
        return backTo(request, path, result.code);
    } catch (error) {
        console.error('Newsletter API error:', error);
        return backTo(request, path, 'error');
    }
}
