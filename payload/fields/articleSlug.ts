import type { TextField } from 'payload'
import { text } from 'payload/shared'
import { formatSlug } from '../utils/formatSlug'
import { CATEGORIES } from '../../lib/categories'

/* Posts and News both render at /{slug}, alongside the category hubs
   (/{category}) and every static page. A slug is therefore one namespace for
   all of them: it must not repeat an article in either collection, a category,
   or a top-level route. Next.js serves a static route before the dynamic one,
   so a post slugged "about" would save fine and simply never be reachable.

   Keep RESERVED_SLUGS in step with the top-level folders of app/ and
   app/(frontend)/ — add a name here whenever a new top-level page is created. */
const RESERVED_SLUGS = new Set([
    // app/(frontend)/
    'about', 'author', 'authors', 'basic-search', 'category', 'category-big',
    'category-grid', 'category-list', 'category-masonry', 'contact',
    'cookie-policy', 'editorial-standards', 'home-2', 'home-3', 'latest',
    'login', 'newsletter', 'privacy', 'search', 'signup', 'single', 'single-2',
    'single-3', 'stories', 'subscribe', 'terms', 'topic', 'topics', 'typography',
    // app/ root, the admin panel, the login gate and static assets
    'api', 'actions', 'dorbar', 'cms-login', 'assets', 'media', 'page',
])

const ARTICLE_COLLECTIONS = ['posts', 'news'] as const

export const articleSlugField: TextField = {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    admin: {
        position: 'sidebar',
        description: 'The article URL is /{slug}. Must be unique across Posts and News.',
    },
    hooks: {
        beforeValidate: [formatSlug('title')],
    },
    validate: async (value, options) => {
        const base = await text(value, options)
        if (base !== true || !value) return base

        if (RESERVED_SLUGS.has(value) || CATEGORIES.some((c) => c.slug === value)) {
            return `"${value}" is already a page or category URL — choose a different slug.`
        }

        const { req, id, collectionSlug } = options
        for (const collection of ARTICLE_COLLECTIONS) {
            const { docs } = await req.payload.find({
                collection,
                where: {
                    and: [
                        { slug: { equals: value } },
                        // The doc being edited may match itself
                        ...(collection === collectionSlug && id ? [{ id: { not_equals: id } }] : []),
                    ],
                },
                limit: 1,
                depth: 0,
                draft: true,
                pagination: false,
                req,
            })
            if (docs.length) {
                const where = collection === 'news' ? 'a News article' : 'a Post'
                return `"${value}" is already used by ${where} ("${docs[0].title}").`
            }
        }
        return true
    },
}
