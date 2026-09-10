import { type CollectionConfig, type Where } from 'payload'
import { formatSlug } from '../utils/formatSlug'
import { customSchemaField } from '../fields/customSchema'
import { focusKeywordField, relevantKeywordsField } from '../fields/seoKeywords'
import { CATEGORIES } from '../../lib/categories'

/* News posts — same shape and categories as blog Posts, but rendered at
   /stories/{slug} instead of /{category}/{slug}. The separate collection IS
   the "news flag": categories are defined once in lib/categories.ts and
   shared by both collections. No homepage-hero flags here (those are
   blog-only). */
export const News: CollectionConfig = {
    slug: 'news',
    labels: {
        singular: 'News',
        plural: 'News',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'author', 'publishedAt', '_status', 'hidden'],
        components: {
            beforeListTable: ['/payload/components/BulkVisibilityActions#BulkVisibilityActions'],
        },
    },
    versions: {
        drafts: true,
    },
    access: {
        // Public: published AND not hidden. Logged-in CMS users see everything.
        read: ({ req }) =>
            req.user
                ? true
                : ({
                      and: [
                          { _status: { equals: 'published' } },
                          { hidden: { not_equals: true } },
                      ],
                  } as Where),
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            // Same six categories as blog posts — shown on the article and in
            // listings; the URL stays /stories/{slug} regardless of category.
            name: 'category',
            type: 'select',
            required: true,
            options: CATEGORIES.map((c) => ({ label: c.name, value: c.slug })),
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
        },
        {
            name: 'excerpt',
            type: 'textarea',
            maxLength: 300,
        },
        {
            name: 'seo',
            type: 'group',
            fields: [
                { name: 'metaTitle', type: 'text' },
                { name: 'metaDescription', type: 'textarea' },
                { name: 'ogImage', type: 'upload', relationTo: 'media' },
                customSchemaField,
                focusKeywordField,
                relevantKeywordsField,
            ],
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                position: 'sidebar',
            },
            hooks: {
                beforeValidate: [formatSlug('title')],
            },
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            defaultValue: ({ user }) => user?.id,
        },
        {
            name: 'publishedAt',
            type: 'date',
            defaultValue: () => new Date().toISOString(),
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'lastUpdatedAt',
            type: 'date',
            label: 'Last updated',
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
                description: 'Shown on the article as "Last updated". Leave empty to use the save date.',
            },
        },
        {
            name: 'hidden',
            type: 'checkbox',
            defaultValue: false,
            label: 'Hidden',
            access: {
                update: ({ req }) => req.user?.role === 'admin',
            },
            admin: {
                position: 'sidebar',
                description:
                    'Hide this news post from the website without deleting or unpublishing it. Only admins can change this.',
                components: {
                    Cell: '/payload/components/HiddenCell#HiddenCell',
                },
            },
        },
        {
            name: 'coverImage',
            type: 'upload',
            relationTo: 'media',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'tags',
            type: 'array',
            admin: {
                position: 'sidebar',
            },
            fields: [{ name: 'tag', type: 'text' }],
        },
    ],
}
