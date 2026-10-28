// Per-IP rate limiting for the endpoints bots like: CMS login and password
// flows, the newsletter signup and the contact form.
//
// In-memory and per process. That fits this app: SQLite means one Node
// process (PM2, no cluster mode), so every request sees the same counters.
// Counters reset on restart, which is acceptable for abuse throttling.

export type RateLimitBucket = keyof typeof RATE_LIMITS

// `limit` requests per `windowMs`, per client IP, counted over a sliding window.
export const RATE_LIMITS = {
    // Login, forgot/reset password, unlock. Generous enough for a newsroom
    // signing in from one office connection; Payload's own per-account
    // lockout (5 failures / 10 minutes) still applies on top.
    auth: { limit: 20, windowMs: 15 * 60_000 },
    newsletter: { limit: 5, windowMs: 10 * 60_000 },
    contact: { limit: 5, windowMs: 10 * 60_000 },
} as const

// Bounds memory if someone sprays requests from many addresses.
const MAX_TRACKED_KEYS = 50_000

// Kept on globalThis so every bundle (route handlers, server actions, Payload
// hooks) shares one store even if the module is duplicated across chunks.
const store = ((globalThis as { __govconRateLimit?: Map<string, number[]> }).__govconRateLimit ??=
    new Map<string, number[]>())

/**
 * The visitor's IP.
 *
 * Production runs behind Nginx with `proxy_set_header X-Real-IP $remote_addr`,
 * which overwrites anything the client sent — so X-Real-IP is trusted first.
 * The fallback takes the RIGHTMOST X-Forwarded-For entry (the one the nearest
 * proxy appended); entries to its left are whatever the client claimed.
 * With no proxy at all, Next.js fills X-Forwarded-For with the socket address
 * when the request has none, so the limiter still keys on the real client.
 *
 * Both headers can be forged by anyone who reaches the app directly, which is
 * why the app must listen on 127.0.0.1 only, behind Nginx.
 * Returns null only for calls without a real request (e.g. Local API scripts).
 */
export function clientIp(headers: Headers): string | null {
    const real = headers.get('x-real-ip')?.trim()
    if (real) return real
    const forwarded = headers
        .get('x-forwarded-for')
        ?.split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    return forwarded?.length ? forwarded[forwarded.length - 1] : null
}

let warnedNoIp = false

/**
 * Records one attempt and says whether it's allowed.
 * With no known client IP the request is allowed (and a one-time warning is
 * logged in production): putting such callers in one shared bucket would let
 * one of them lock out the rest.
 */
export function rateLimit(bucket: RateLimitBucket, ip: string | null): { ok: true } | { ok: false; retryAfterSeconds: number } {
    if (!ip) {
        if (!warnedNoIp && process.env.NODE_ENV === 'production') {
            warnedNoIp = true
            console.warn(
                'Rate limiting is inactive: no X-Real-IP / X-Forwarded-For header. ' +
                    'Run the app behind Nginx with `proxy_set_header X-Real-IP $remote_addr;`.',
            )
        }
        return { ok: true }
    }

    const { limit, windowMs } = RATE_LIMITS[bucket]
    const now = Date.now()
    const key = `${bucket}:${ip}`
    const recent = (store.get(key) ?? []).filter((t) => t > now - windowMs)

    if (recent.length >= limit) {
        store.set(key, recent)
        return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) }
    }

    recent.push(now)
    store.delete(key) // re-insert so Map order stays oldest-activity-first
    store.set(key, recent)
    if (store.size > MAX_TRACKED_KEYS) prune(now)
    return { ok: true }
}

function prune(now: number) {
    const longest = Math.max(...Object.values(RATE_LIMITS).map((r) => r.windowMs))
    for (const [key, times] of store) {
        if (times[times.length - 1] <= now - longest) store.delete(key)
    }
    // Still too many: drop the least recently active.
    for (const key of store.keys()) {
        if (store.size <= MAX_TRACKED_KEYS) break
        store.delete(key)
    }
}

export const RATE_LIMIT_MESSAGE = 'Too many attempts from your connection. Please wait a few minutes and try again.'
