import { Forbidden, type CollectionBeforeOperationHook, type Where } from 'payload'

// Anonymous visitors may only filter, sort, count or list distinct values on
// the fields the public website itself queries. Everything else — rich-text
// and JSON contents, private account fields, relationship traversal — is
// refused before it reaches the database.
//
// Why: the public REST and GraphQL APIs accept arbitrary field paths and
// operators, and that is exactly where Payload's past SQL-injection bugs lived
// (GHSA-v49j-62m6-pgrr, GHSA-pj7x-6wpf-pgvp). Keeping anonymous queries to a
// short, known list means a future bug of the same kind can't be reached
// without a CMS login. Signed-in users and server code (overrideAccess) are
// not restricted.
//
// Entry syntax: an exact path ('tags.tag'), or 'group.*' for any field inside
// a group. When the site starts filtering on a new field, add it here.

const OPERATORS = new Set([
    'equals', 'not_equals', 'in', 'not_in', 'all', 'exists', 'like', 'not_like', 'contains',
    'greater_than', 'greater_than_equal', 'less_than', 'less_than_equal', 'near', 'within', 'intersects',
])

// Every field path a `where` touches, including nested `and`/`or` groups and
// the object form `{ author: { email: { equals } } }`.
function wherePaths(where: unknown, prefix = ''): string[] {
    if (!where || typeof where !== 'object' || Array.isArray(where)) return []
    const paths: string[] = []
    for (const [key, value] of Object.entries(where as Where)) {
        if (key.toLowerCase() === 'and' || key.toLowerCase() === 'or') {
            if (Array.isArray(value)) value.forEach((part) => paths.push(...wherePaths(part, prefix)))
            else paths.push(key) // malformed — treat as a path so it's refused
            continue
        }
        if (OPERATORS.has(key)) {
            if (prefix) paths.push(prefix)
            continue
        }
        const path = prefix ? `${prefix}.${key}` : key
        const nested = value && typeof value === 'object' && !Array.isArray(value) ? Object.keys(value) : []
        if (nested.some((k) => !OPERATORS.has(k))) paths.push(...wherePaths(value, path))
        else paths.push(path)
    }
    return paths
}

function sortPaths(sort: unknown): string[] {
    const list = Array.isArray(sort) ? sort : typeof sort === 'string' ? sort.split(',') : []
    return list.map((s) => String(s).trim().replace(/^-/, '')).filter(Boolean)
}

export function publicQueryAllowlist(allowed: string[]): CollectionBeforeOperationHook {
    const exact = new Set(allowed.filter((p) => !p.endsWith('.*')))
    const prefixes = allowed.filter((p) => p.endsWith('.*')).map((p) => p.slice(0, -1))
    const isAllowed = (path: string) =>
        exact.has(path) || prefixes.some((prefix) => path.startsWith(prefix) && path.length > prefix.length)

    return ({ args, collection, operation, req, overrideAccess }) => {
        if (overrideAccess || req.user) return args
        if (operation !== 'read' && operation !== 'count' && operation !== 'readDistinct') return args

        const a = args as { where?: unknown; sort?: unknown; field?: unknown }
        const paths = [...wherePaths(a.where), ...sortPaths(a.sort)]
        if (operation === 'readDistinct') paths.push(typeof a.field === 'string' ? a.field : '')

        const refused = paths.filter((path) => !isAllowed(path))
        if (refused.length) {
            // One readable line per refused query, so probing shows up in the
            // server log. The visitor gets Payload's generic 403, which must
            // not confirm which fields exist.
            req.payload.logger.warn({
                msg: 'Refused anonymous query',
                collection: collection.slug,
                fields: refused.slice(0, 10).map((p) => p.slice(0, 100)),
                ip: req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || undefined,
            })
            throw new Forbidden(req.t)
        }
        return args
    }
}

// What the public website filters and sorts on (lib/cms.ts, the hub, topic,
// author, sitemap and feed routes).
const ARTICLE_FIELDS = [
    'id', 'slug', 'title', 'excerpt', 'category', 'tags.tag', 'author',
    'publishedAt', 'lastUpdatedAt', 'createdAt', 'updatedAt',
]
export const POST_PUBLIC_QUERIES = [...ARTICLE_FIELDS, 'featured', 'sliderFeatured']
export const NEWS_PUBLIC_QUERIES = ARTICLE_FIELDS
export const USER_PUBLIC_QUERIES = ['id', 'name', 'slug', 'socials.*', 'createdAt', 'updatedAt']
export const MEDIA_PUBLIC_QUERIES = ['id', 'filename', 'createdAt', 'updatedAt']
