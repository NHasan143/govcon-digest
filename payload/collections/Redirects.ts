import type { CollectionConfig } from 'payload'

// Normalises a path for storage and lookup: strips the origin if a full URL
// was pasted, drops the query/hash and any trailing slash, and lower-cases it —
// so "/Old-Post/" and "https://site.com/old-post" match the same rule.
export function normalisePath(input: string): string {
    let path = (input || '').trim()
    if (!path) return ''

    if (/^https?:\/\//i.test(path)) {
        try {
            path = new URL(path).pathname
        } catch {
            /* fall through and treat it as a literal path */
        }
    }

    path = path.split('?')[0].split('#')[0]
    if (!path.startsWith('/')) path = `/${path}`
    path = path.replace(/\/+$/, '') || '/'

    return path.toLowerCase()
}

// The redirection panel (owner's request: "like WP Redirect"). Rules are
// applied when a URL would otherwise 404 — see app/(frontend)/not-found.tsx.
export const Redirects: CollectionConfig = {
    slug: 'redirects',
    admin: {
        useAsTitle: 'from',
        defaultColumns: ['from', 'to', 'type', 'enabled'],
        description:
            'Send old or dead URLs to a new location. Rules apply to URLs that would otherwise show the 404 page.',
    },
    access: {
        create: ({ req }) => req.user?.role === 'admin',
        read: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
    },
    fields: [
        {
            name: 'from',
            type: 'text',
            required: true,
            unique: true,
            index: true,
            label: 'From (old path)',
            admin: {
                description: 'e.g. /old-category/old-post — the site path only, no domain.',
            },
            hooks: {
                beforeValidate: [({ value }) => (typeof value === 'string' ? normalisePath(value) : value)],
            },
        },
        {
            name: 'to',
            type: 'text',
            required: true,
            label: 'To (new destination)',
            admin: {
                description:
                    'A path on this site (e.g. /new-category/new-post) or a full https:// URL to send visitors off-site.',
            },
            validate: (value: null | string | undefined) => {
                if (!value || !value.trim()) return 'Required.'
                const to = value.trim()
                if (!to.startsWith('/') && !/^https?:\/\//i.test(to)) {
                    return 'Must start with / for this site, or http(s):// for an external URL.'
                }
                return true
            },
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            defaultValue: '301',
            options: [
                { label: '301 — Permanent (passes SEO value)', value: '301' },
                { label: '302 — Temporary', value: '302' },
            ],
            admin: { position: 'sidebar' },
        },
        {
            name: 'enabled',
            type: 'checkbox',
            defaultValue: true,
            admin: {
                position: 'sidebar',
                description: 'Untick to switch a rule off without deleting it.',
            },
        },
        {
            name: 'note',
            type: 'text',
            admin: {
                position: 'sidebar',
                description: 'Optional reminder of why this rule exists.',
            },
        },
    ],
    timestamps: true,
}
