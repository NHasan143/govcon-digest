import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import * as otplibModule from 'otplib'
import { middleware } from '../middleware'
import { generateSecret, otpauthUri, verifyToken } from '../payload/mfa/totp'
import { enforceMfa } from '../payload/mfa/enforceMfa'
import { Users } from '../payload/collections/Users'

const origin = 'https://example.com'
for (const [path, destination] of [
    ['/newsroom', '/newsroom/sign-in'],
    ['/newsroom/', '/newsroom/sign-in'],
    ['/newsroom/login', '/newsroom/sign-in'],
    ['/cms-login', '/newsroom/sign-in'],
    ['/dorbar', '/newsroom'],
    ['/dorbar/collections/posts?limit=10', '/newsroom/collections/posts?limit=10'],
]) {
    const response = middleware(new NextRequest(origin + path))
    assert.equal(response.headers.get('location'), origin + destination)
}
assert.equal(middleware(new NextRequest(origin + '/newsroom/sign-in')).headers.get('x-middleware-next'), '1')
assert.equal(middleware(new NextRequest(origin + '/newsroom', { headers: { cookie: 'payload-token=existing-session' } })).headers.get('x-middleware-next'), '1')
assert.equal(middleware(new NextRequest(origin + '/newsroom/create-first-user')).headers.get('x-middleware-next'), '1')
assert.match(middleware(new NextRequest(origin + '/newsroom/login')).headers.get('set-cookie') || '', /payload-token=;/)

const otplib = ((otplibModule as Record<string, unknown>).default ?? otplibModule) as typeof import('otplib')
const secret = generateSecret()
const code = otplib.authenticator.generate(secret)
assert.equal(verifyToken(code, secret), true)
assert.equal(verifyToken('abcdef', secret), false)
assert.equal(verifyToken(code, ''), false)
assert.match(decodeURIComponent(otpauthUri('editor@example.com', secret)), /CMS/)
assert.doesNotMatch(otpauthUri('editor@example.com', secret), /Morning/)

const user = { id: 1 }
const login = (mfa: { enabled: boolean; secret?: string }, token?: string) => enforceMfa({
    user,
    req: {
        headers: new Headers(token ? { 'x-authenticator-code': token } : {}),
        payload: { findByID: async () => ({ ...user, mfa }) },
    },
} as unknown as Parameters<typeof enforceMfa>[0])
await assert.rejects(async () => login({ enabled: true, secret }), /Invalid authenticator code/)
await assert.rejects(async () => login({ enabled: true }, code), /Invalid authenticator code/)
await assert.rejects(async () => login({ enabled: true, secret }, 'abcdef'), /Invalid authenticator code/)
assert.deepEqual(await login({ enabled: true, secret }, code), user)
assert.deepEqual(await login({ enabled: false }), user)

const mfa = Users.fields.find(field => 'name' in field && field.name === 'mfa')
assert.ok(mfa && 'fields' in mfa)
for (const field of mfa.fields) {
    assert.ok('access' in field && field.access)
    assert.equal(await field.access.create!({} as never), false)
    assert.equal(await field.access.update!({} as never), false)
}
console.log('PASS: CMS redirects, session routing, TOTP verification, MFA login enforcement and protected enrollment fields.')
