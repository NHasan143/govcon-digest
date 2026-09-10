import type { CollectionConfig } from 'payload'
import { enforceMfa } from '../mfa/enforceMfa'
import { formatSlug } from '../utils/formatSlug'

export const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'email', 'role'],
    },
    access: {
        read: () => true,
    },
    hooks: {
        beforeLogin: [enforceMfa],
    },
    fields: [
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
            type: 'select',
            required: true,
            defaultValue: 'editor',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
            ],
        },
        {
            name: 'mfa',
            type: 'group',
            admin: {
                position: 'sidebar',
            },
            fields: [
                {
                    name: 'enabled',
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
                    type: 'text',
                    hidden: true,
                },
            ],
        },
    ],
}
