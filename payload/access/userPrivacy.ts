import type { CollectionAfterReadHook, FieldAccess } from 'payload'

// User accounts are public only as authors: the site needs a name, a page
// slug and social links. Everything else (email, role, 2FA status, sessions,
// lockout state) is private to signed-in CMS users.
//
// Three layers, because Payload exposes account data in three ways:
//   1. what a response contains        → stripPrivateUserFields (allowlist)
//   2. what can be filtered or sorted  → publicQueryAllowlist in publicQueries.ts
//   3. per-field read rules            → signedIn, on each private field
// The allowlists mean a field added to Users later is private by default.

export const PUBLIC_USER_FIELDS = new Set(['id', 'name', 'slug', 'socials', 'createdAt', 'updatedAt'])

export const signedIn: FieldAccess = ({ req }) => Boolean(req.user)

// Strips every non-public field from users read by anonymous visitors —
// including users populated into a post's `author`. Internal lookups
// (overrideAccess, e.g. the 2FA check at login) are left untouched.
// This also covers `sessions`: Payload's built-in rule for it
// (`user?.id === doc?.id`) passes for anonymous visitors whenever no doc is
// in scope, because undefined === undefined.
export const stripPrivateUserFields: CollectionAfterReadHook = ({ doc, req, overrideAccess }) => {
    if (overrideAccess || req.user || !doc) return doc
    return Object.fromEntries(Object.entries(doc).filter(([key]) => PUBLIC_USER_FIELDS.has(key)))
}
