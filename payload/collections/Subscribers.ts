import type { CollectionConfig } from 'payload'

// Newsletter subscribers captured by the subscribe forms (the after-article
// CTA, the sidebar widget, and /subscribe). Writes go through the server
// action with overrideAccess, so `create` stays closed to anonymous REST
// callers — otherwise /api/subscribers would be an open spam sink.
export const Subscribers: CollectionConfig = {
    slug: 'subscribers',
    admin: {
        useAsTitle: 'email',
        defaultColumns: ['email', 'status', 'source', 'createdAt'],
        description: 'People who submitted a newsletter subscribe form.',
    },
    access: {
        create: ({ req }) => req.user?.role === 'admin',
        read: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
    },
    fields: [
        {
            name: 'email',
            type: 'email',
            required: true,
            unique: true,
            index: true,
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'active',
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Unsubscribed', value: 'unsubscribed' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            // Which page the visitor submitted from — tells the owner which
            // article or widget actually converts.
            name: 'source',
            type: 'text',
            admin: {
                position: 'sidebar',
                readOnly: true,
                description: 'Page the visitor subscribed from.',
            },
        },
    ],
    timestamps: true,
}
