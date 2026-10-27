// Checks what an anonymous visitor can learn about CMS accounts through the
// public API (REST, GraphQL and the frontend all go through these same
// operations with overrideAccess: false and no user).
//
// Run against a COPY of a database — it only reads, but there's no reason to
// point a probe at production:
//   DATABASE_URI=file:/path/to/copy.db node --env-file=.env --import tsx scripts/test-public-access.ts

import assert from 'node:assert/strict'
import { getPayload, type Where } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })

// The only user fields the public site needs (author name, page, socials).
const PUBLIC_USER_KEYS = new Set(['id', 'name', 'slug', 'socials', 'createdAt', 'updatedAt'])

// Every account field that must stay private, as query paths.
const PRIVATE_PATHS = [
    'email',
    'role',
    'mfa.enabled',
    'mfa.secret',
    'hash',
    'salt',
    'resetPasswordToken',
    'resetPasswordExpiration',
    'loginAttempts',
    'lockUntil',
    'sessions.id',
]

const failures = new Set<string>()
const check = (ok: boolean, message: string) => {
    if (!ok) failures.add(message)
}

// Real values to guess with — read with full access, never printed.
const { docs: realUsers } = await payload.find({
    collection: 'users',
    limit: 100,
    depth: 0,
    overrideAccess: true,
    showHiddenFields: true,
})
assert.ok(realUsers.length > 0, 'Need at least one user in the database to probe.')

const getPath = (doc: object, path: string): unknown =>
    path.split('.').reduce<unknown>((value, key) => {
        if (Array.isArray(value)) return value[0]?.[key]
        return value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined
    }, doc)

// Outcome of an anonymous query: the matching ids, or 'rejected'.
async function anonymousIds(collection: 'users' | 'posts' | 'news', where: Where): Promise<string> {
    try {
        const { docs } = await payload.find({ collection, where, limit: 500, depth: 0, overrideAccess: false })
        return docs.map((d) => d.id).sort().join(',')
    } catch {
        return 'rejected'
    }
}

// 1. Visible fields — list, single document, and relationship population.
const { docs: publicList } = await payload.find({ collection: 'users', limit: 100, overrideAccess: false })
for (const user of publicList) {
    const extra = Object.keys(user).filter((key) => !PUBLIC_USER_KEYS.has(key))
    check(extra.length === 0, `users list exposes: ${extra.join(', ')}`)
}
const one = await payload.findByID({ collection: 'users', id: realUsers[0].id, overrideAccess: false })
const oneExtra = Object.keys(one).filter((key) => !PUBLIC_USER_KEYS.has(key))
check(oneExtra.length === 0, `single user exposes: ${oneExtra.join(', ')}`)

for (const collection of ['posts', 'news'] as const) {
    const { docs } = await payload.find({ collection, limit: 20, depth: 1, overrideAccess: false })
    for (const doc of docs) {
        if (doc.author && typeof doc.author === 'object') {
            const extra = Object.keys(doc.author).filter((key) => !PUBLIC_USER_KEYS.has(key))
            check(extra.length === 0, `${collection}.author exposes: ${extra.join(', ')}`)
        }
    }
}

// 2. Query oracles — a correct guess and a wrong guess must look identical.
for (const path of PRIVATE_PATHS) {
    const target = realUsers.find((u) => getPath(u, path) != null)
    if (!target) continue
    const real = getPath(target, path)
    const wrong = typeof real === 'number' ? -987654 : typeof real === 'boolean' ? !real : 'zz-no-such-value-zz'

    const right = await anonymousIds('users', { [path]: { equals: real } })
    const miss = await anonymousIds('users', { [path]: { equals: wrong } })
    check(right === miss, `users can be filtered by "${path}"`)

    // Same guess routed through an article's author relationship.
    for (const collection of ['posts', 'news'] as const) {
        const viaRight = await anonymousIds(collection, { [`author.${path}`]: { equals: real } })
        const viaMiss = await anonymousIds(collection, { [`author.${path}`]: { equals: wrong } })
        check(viaRight === viaMiss, `${collection} can be filtered by "author.${path}"`)
    }
}

// Partial-match guessing (one character at a time), and the same guess
// hidden inside and/or groups or written in nested-object form.
const sample = realUsers.find((u) => u.email)
if (sample) {
    const prefix = sample.email.slice(0, 3)
    const variants: Array<[string, 'users' | 'posts', (v: string) => Where]> = [
        ['partial email', 'users', (v) => ({ email: { like: v } })],
        ['email inside "or"', 'users', (v) => ({ or: [{ email: { like: v } }, { id: { equals: -1 } }] as Where[] })],
        ['email inside nested "and"', 'users', (v) => ({ and: [{ or: [{ email: { like: v } }] }] })],
        ['author.email (nested object)', 'posts', (v) => ({ author: { email: { like: v } } }) as unknown as Where],
        ['author.email inside "and"', 'posts', (v) => ({ and: [{ 'author.email': { like: v } }] })],
    ]
    for (const [label, collection, build] of variants) {
        const right = await anonymousIds(collection, build(prefix))
        const miss = await anonymousIds(collection, build('zz-no-such-value-zz'))
        check(right === miss, `${collection} can be filtered by ${label}`)
    }
}

// 3. Sort oracle — ordering by a private field must not reveal anything.
if (realUsers.length > 1) {
    for (const path of ['email', 'role', 'hash', 'mfa.enabled', 'loginAttempts']) {
        const order = async (sort: string) => {
            try {
                const { docs } = await payload.find({ collection: 'users', sort, limit: 100, depth: 0, overrideAccess: false })
                return docs.map((d) => d.id).join(',')
            } catch {
                return 'rejected'
            }
        }
        check((await order(path)) === (await order(`-${path}`)), `users can be sorted by "${path}"`)
    }
}

// 4. Counting with a private filter.
try {
    const right = await payload.count({ collection: 'users', where: { role: { equals: 'admin' } }, overrideAccess: false })
    const miss = await payload.count({ collection: 'users', where: { role: { equals: 'no-such-role' } }, overrideAccess: false })
    check(right.totalDocs === miss.totalDocs, 'users can be counted by role')
} catch {
    // rejected — fine
}

// 5. Private collections stay closed to anonymous visitors.
for (const collection of ['subscribers', 'redirects'] as const) {
    let readable = false
    try {
        await payload.find({ collection, limit: 1, overrideAccess: false })
        readable = true
    } catch {
        // access denied — expected
    }
    check(!readable, `${collection} is readable without logging in`)
}

// 6. The public pages still work: author lookup by slug, articles by author id.
const author = realUsers.find((u) => u.slug)
if (author) {
    const bySlug = await payload.find({ collection: 'users', where: { slug: { equals: author.slug } }, overrideAccess: false })
    check(bySlug.docs[0]?.id === author.id, 'public author lookup by slug no longer works')
    const posts = await payload.find({ collection: 'posts', where: { author: { equals: author.id } }, limit: 1, overrideAccess: false })
    check(posts.totalDocs >= 0, 'public posts-by-author query no longer works')
}

// 7. Anonymous queries are limited to the fields the site uses
// (payload/access/publicQueries.ts). Rich-text, JSON-like and admin-only
// fields must be refused before reaching the database.
const refused = async (run: () => Promise<unknown>) => {
    try {
        await run()
        return false
    } catch {
        return true
    }
}
const offList: Array<['posts' | 'news' | 'media', string]> = [
    ['posts', 'content.root.children.text'],
    ['posts', 'content'],
    ['posts', 'seo.customSchema'],
    ['posts', 'hidden'],
    ['posts', '_status'],
    ['posts', 'author.name'],
    ['news', 'content.root.children.text'],
    ['news', 'seo.metaTitle'],
    ['media', 'alt'],
    ['media', 'sizes.card.filename'],
]
for (const [collection, path] of offList) {
    check(
        await refused(() => payload.find({ collection, where: { [path]: { like: 'a' } }, limit: 1, overrideAccess: false })),
        `${collection} can be filtered by "${path}" without logging in`,
    )
    check(
        await refused(() => payload.find({ collection, sort: path, limit: 1, overrideAccess: false })),
        `${collection} can be sorted by "${path}" without logging in`,
    )
}
check(
    await refused(() => payload.find({ collection: 'posts', where: { or: [{ title: { like: 'a' } }, { 'content.root': { like: 'a' } }] }, limit: 1, overrideAccess: false })),
    'an off-list field hidden inside "or" is not refused',
)

// Every query shape the public website makes must still work.
const sitePosts = await payload.find({ collection: 'posts', limit: 1, depth: 0, overrideAccess: true })
const anyPost = sitePosts.docs[0]
const allowedQueries: Array<[string, () => Promise<unknown>]> = [
    ['slug', () => payload.find({ collection: 'posts', where: { slug: { equals: anyPost?.slug ?? 'x' } }, overrideAccess: false })],
    ['category in', () => payload.find({ collection: 'posts', where: { category: { in: ['defense'] } }, sort: '-publishedAt', overrideAccess: false })],
    ['search', () => payload.find({ collection: 'news', where: { or: [{ title: { like: 'a' } }, { excerpt: { like: 'a' } }, { 'tags.tag': { like: 'a' } }] }, sort: '-publishedAt', overrideAccess: false })],
    ['featured', () => payload.find({ collection: 'posts', where: { featured: { equals: true } }, sort: '-publishedAt', overrideAccess: false })],
    ['sliderFeatured', () => payload.find({ collection: 'posts', where: { sliderFeatured: { equals: true } }, overrideAccess: false })],
    ['news since', () => payload.find({ collection: 'news', where: { publishedAt: { greater_than: new Date(0).toISOString() } }, sort: '-publishedAt', overrideAccess: false })],
    ['authors by id', () => payload.find({ collection: 'users', where: { id: { in: realUsers.map((u) => u.id) } }, overrideAccess: false })],
]
for (const [label, run] of allowedQueries) {
    check(!(await refused(run)), `the site's own "${label}" query is now refused`)
}

if (failures.size) {
    console.error(`FAIL — ${failures.size} problem(s):\n  - ${[...failures].join('\n  - ')}`)
    process.exit(1)
}
console.log('PASS: anonymous visitors see only public author fields, cannot filter, sort or count by private account fields, and can only query the fields the site itself uses.')
process.exit(0)
