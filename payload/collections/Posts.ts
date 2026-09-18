import { APIError, type CollectionConfig, type Where } from 'payload'
import { formatSlug } from '../utils/formatSlug'
import { customSchemaField } from '../fields/customSchema'
import { CATEGORY_OPTIONS } from '../../lib/categories'

export const MAX_FEATURED = 4

export const Posts: CollectionConfig = {
    slug: 'posts',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'author', 'publishedAt', '_status', 'hidden'],
        components: {
            beforeListTable: ['/payload/components/BulkVisibilityActions#BulkVisibilityActions'],
        },
    },
    // Docs must be PUBLISHED (not just saved) to appear on the public API.
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
    hooks: {
        beforeChange: [
            // Homepage hero rules: 'featured' fills the right column (hard cap
            // of MAX_FEATURED), 'sliderFeatured' fills the left slider
            // (unlimited). A post can't be both.
            async ({ data, originalDoc, req }) => {
                const featured = data?.featured ?? originalDoc?.featured
                const sliderFeatured = data?.sliderFeatured ?? originalDoc?.sliderFeatured
                if (featured && sliderFeatured) {
                    throw new APIError(
                        'A post cannot be both "Featured" and "Slider featured" — untick one of them.',
                        400,
                    )
                }
                if (featured) {
                    const { totalDocs } = await req.payload.count({
                        collection: 'posts',
                        where: {
                            and: [
                                { featured: { equals: true } },
                                { id: { not_equals: originalDoc?.id ?? 0 } },
                            ],
                        },
                    })
                    if (totalDocs >= MAX_FEATURED) {
                        throw new APIError(
                            `Featured posts cannot be more than ${MAX_FEATURED} — unfeature another post first.`,
                            400,
                        )
                    }
                }
                return data
            },
        ],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            // Determines the article's canonical URL: /{category}/{slug}/
            name: 'category',
            type: 'select',
            required: true,
            options: CATEGORY_OPTIONS,
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
            // Editor-controlled "Last updated" date shown on the article page.
            // Falls back to the document's automatic updatedAt when empty.
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
            // Admin-only kill switch: removes the post from the public site
            // (lists, search, article URL, sitemap) without unpublishing it.
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
                    'Hide this post from the website without deleting or unpublishing it. Only admins can change this.',
                components: {
                    Cell: '/payload/components/HiddenCell#HiddenCell',
                },
            },
        },
        {
            name: 'featured',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Homepage hero, right column — maximum 4 featured posts',
            },
        },
        {
            name: 'sliderFeatured',
            type: 'checkbox',
            defaultValue: false,
            label: 'Slider featured',
            admin: {
                position: 'sidebar',
                description: 'Homepage hero, left slider — any number of posts, rotates continuously',
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
