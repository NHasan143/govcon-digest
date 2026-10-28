import { APIError, type CollectionConfig } from 'payload'
import { publicQueryAllowlist, USER_PUBLIC_QUERIES } from '../access/publicQueries'
import { rateLimitAuth } from '../access/rateLimitAuth'
import { signedIn, stripPrivateUserFields } from '../access/userPrivacy'
import { enforceMfa } from '../mfa/enforceMfa'
import { formatSlug } from '../utils/formatSlug'

export const Users: CollectionConfig = {
    slug: 'users',
    auth: { useSessions: true },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'email', 'role'],
    },
    access: {
        // Public because articles show their author. Only name, slug and
        // socials ever reach anonymous visitors — see payload/access/userPrivacy.ts.
        read: () => true,
        admin: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
    },
    hooks: {
        beforeOperation: [rateLimitAuth, publicQueryAllowlist(USER_PUBLIC_QUERIES)],
        afterRead: [stripPrivateUserFields],
        beforeLogin: [enforceMfa],
        beforeChange: [async ({ data, originalDoc, req, operation }) => {
            if (operation === 'update' && originalDoc?.role === 'admin' && data.role && data.role !== 'admin') {
                const { totalDocs } = await req.payload.count({
                    collection: 'users',
                    where: { role: { equals: 'admin' } },
                    overrideAccess: true,
                })
                if (totalDocs <= 1) throw new APIError('Keep at least one active administrator.', 400)
            }
            // Payload checks session membership on every authenticated request.
            // Removing sessions also invalidates already-issued JWT cookies.
            if (data.role === 'suspended') data.sessions = []
            return data
        }],
        beforeDelete: [async ({ id, req }) => {
            const target = await req.payload.findByID({ collection: 'users', id, overrideAccess: true })
            if (target.role === 'admin') {
                const { totalDocs } = await req.payload.count({
                    collection: 'users', where: { role: { equals: 'admin' } }, overrideAccess: true,
                })
                if (totalDocs <= 1) throw new APIError('Keep at least one active administrator.', 400)
            }
        }],
    },
    fields: [
        {
            // Merged into Payload's built-in email field — only adds the read rule.
            name: 'email',
            type: 'email',
            access: { read: signedIn },
        },
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            // Public author page URL: /author/{slug}/ (auto-generated from name)
            name: 'slug',
            type: 'text',
            unique: true,
            admin: {
                position: 'sidebar',
                description: 'Author page URL segment — leave blank to generate from name',
            },
            hooks: {
                beforeValidate: [formatSlug('name')],
            },
        },
        {
            // Public social profile links shown on /authors and /author/{slug}
            name: 'socials',
            type: 'group',
            admin: {
                description: 'Social profile links shown on the public author pages (full URLs)',
            },
            fields: [
                { name: 'linkedin', type: 'text', admin: { placeholder: 'https://www.linkedin.com/in/…' } },
                { name: 'facebook', type: 'text', admin: { placeholder: 'https://www.facebook.com/…' } },
                { name: 'twitter', label: 'Twitter / X', type: 'text', admin: { placeholder: 'https://x.com/…' } },
                { name: 'instagram', type: 'text', admin: { placeholder: 'https://www.instagram.com/…' } },
                { name: 'website', type: 'text', admin: { placeholder: 'https://…' } },
            ],
        },
        {
            name: 'role',
            access: {
                read: signedIn,
                create: ({ req }) => req.user?.role === 'admin',
                update: ({ req }) => req.user?.role === 'admin',
            },
            type: 'select',
            required: true,
            defaultValue: 'editor',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'Suspended', value: 'suspended' },
            ],
        },
        {
            name: 'mfa',
            type: 'group',
            access: { read: signedIn },
            admin: {
                position: 'sidebar',
            },
            fields: [
                {
                    name: 'enabled',
                    access: { read: signedIn, create: () => false, update: () => false },
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        readOnly: true,
                        description: 'Managed via `npm run mfa -- <email>` — see scripts/setup-mfa.ts',
                    },
                },
                {
                    // TOTP secret — never rendered in the admin UI
                    name: 'secret',
                    access: { read: () => false, create: () => false, update: () => false },
                    type: 'text',
                    hidden: true,
                },
            ],
        },
    ],
}
