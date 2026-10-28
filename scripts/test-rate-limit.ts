// Unit checks for lib/rateLimit.ts: client-IP parsing (including forged
// X-Forwarded-For entries) and the per-bucket sliding window.
//   node --import tsx scripts/test-rate-limit.ts

import assert from 'node:assert/strict'
import { clientIp, RATE_LIMITS, rateLimit } from '../lib/rateLimit'

const h = (init: Record<string, string>) => new Headers(init)

// X-Real-IP (set by Nginx from the TCP connection) wins.
assert.equal(clientIp(h({ 'x-real-ip': '203.0.113.5', 'x-forwarded-for': '1.1.1.1' })), '203.0.113.5')
// Otherwise the RIGHTMOST X-Forwarded-For entry — the one our proxy appended.
// Entries to its left are whatever the client claimed and must be ignored.
assert.equal(clientIp(h({ 'x-forwarded-for': '9.9.9.9, 8.8.8.8, 203.0.113.6' })), '203.0.113.6')
// No proxy headers (local dev): unknown, and limiting stays off rather than
// lumping every visitor into one shared bucket.
assert.equal(clientIp(h({})), null)
for (let i = 0; i < 100; i++) assert.equal(rateLimit('auth', null).ok, true)

// Each bucket allows exactly its limit, then refuses with a retry hint.
for (const bucket of Object.keys(RATE_LIMITS) as Array<keyof typeof RATE_LIMITS>) {
    const ip = `198.51.100.${Object.keys(RATE_LIMITS).indexOf(bucket) + 1}`
    for (let i = 0; i < RATE_LIMITS[bucket].limit; i++) {
        assert.equal(rateLimit(bucket, ip).ok, true, `${bucket}: request ${i + 1} should pass`)
    }
    const blocked = rateLimit(bucket, ip)
    assert.equal(blocked.ok, false, `${bucket}: request ${RATE_LIMITS[bucket].limit + 1} should be refused`)
    if (!blocked.ok) assert.ok(blocked.retryAfterSeconds > 0 && blocked.retryAfterSeconds <= RATE_LIMITS[bucket].windowMs / 1000)
    // Another IP, and the same IP in another bucket, are unaffected.
    assert.equal(rateLimit(bucket, '192.0.2.99').ok, true, `${bucket}: other IPs must not be blocked`)
}
assert.equal(rateLimit('newsletter', '198.51.100.1').ok, true, 'buckets are independent')

console.log('PASS: client IP uses X-Real-IP or the proxy-added X-Forwarded-For entry (forged entries ignored); each bucket allows exactly its limit per IP, then refuses with a retry time; IPs and buckets are independent.')
