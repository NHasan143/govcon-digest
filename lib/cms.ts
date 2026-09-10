/* Bridges Payload CMS posts into the template's `Article` prop shape so the
   existing section components can render CMS content unchanged. */
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { normalisePath } from '@/payload/collections/Redirects'
import type { News as NewsDoc, Post } from '@/payload-types'
import type { Article } from '@/types'
import { getCategory } from '@/lib/categories'
import { slugify } from '@/payload/utils/formatSlug'

// Payload generates media URLs prefixed with serverURL (absolute). Strip the
// origin so images stay same-origin relative paths — absolute URLs break
// next/image and go stale after a domain change (reference doc §7).
export const mediaUrl = (url?: string | null): string | undefined => {
    if (!url) return undefined
    if (url.startsWith('http')) {
        try {
            return new URL(url).pathname
        } catch {
            return url
        }
    }
    return url
}

export async function getHomepagePosts(limit = 40): Promise<Post[]> {
    try {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'posts',
            sort: '-publishedAt',
            limit,
            depth: 1,
            overrideAccess: false, // published only
        })
        return docs
    } catch {
        return []
    }
}

// Published news for the homepage sections (rendered at /stories/{slug})
export async function getHomepageNews(limit = 40): Promise<NewsDoc[]> {
    try {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'news',
            sort: '-publishedAt',
            limit,
            depth: 1,
            overrideAccess: false, // published only
        })
        return docs
    } catch {
        return []
    }
}

// A search result is a blog post or a news doc; `isNews` decides the URL
export type SearchHit = (Post | NewsDoc) & { isNews?: boolean }

// Full-text-ish search over published posts AND news (title, excerpt, tags)
export async function searchPosts(query: string, limit = 50): Promise<SearchHit[]> {
    const q = query.trim()
    if (!q) return []
    const where: Where = {
        or: [{ title: { like: q } }, { excerpt: { like: q } }, { 'tags.tag': { like: q } }],
    }
    try {
        const payload = await getPayload({ config })
        const [postsRes, newsRes] = await Promise.all([
            payload.find({
                collection: 'posts',
                where,
                sort: '-publishedAt',
                limit,
                depth: 1,
                overrideAccess: false, // published only
            }),
            payload.find({
                collection: 'news',
                where,
                sort: '-publishedAt',
                limit,
                depth: 1,
                overrideAccess: false,
            }),
        ])
        const hits: SearchHit[] = [
            ...postsRes.docs,
            ...newsRes.docs.map((d) => ({ ...d, isNews: true })),
        ]
        return hits
            .sort(
                (a, b) =>
                    new Date(b.publishedAt || b.createdAt).getTime() -
                    new Date(a.publishedAt || a.createdAt).getTime(),
            )
            .slice(0, limit)
    } catch {
        return []
    }
}

// Homepage hero, left slider — every post flagged "Slider featured"
export async function getSliderFeaturedPosts(limit = 10): Promise<Post[]> {
    try {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'posts',
            where: { sliderFeatured: { equals: true } },
            sort: '-publishedAt',
            limit,
            depth: 1,
            overrideAccess: false,
        })
        return docs
    } catch {
        return []
    }
}

// Homepage hero, right column — "Featured" posts (max 4, enforced by the
// Posts collection; slider-featured posts are a separate flag)
export async function getFeaturedPosts(limit = 4): Promise<Post[]> {
    try {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'posts',
            where: { featured: { equals: true } },
            sort: '-publishedAt',
            limit,
            depth: 1,
            overrideAccess: false,
        })
        return docs
    } catch {
        return []
    }
}

// News docs share every field postToArticle touches; only the URL differs
export function newsToArticle(doc: NewsDoc): Article {
    return {
        ...postToArticle(doc as unknown as Post),
        slug: `/stories/${doc.slug}`,
    }
}

export function postToArticle(post: Post): Article {
    const media = post.coverImage && typeof post.coverImage === 'object' ? post.coverImage : null
    const author = post.author && typeof post.author === 'object' ? post.author : null
    const category = getCategory(post.category)

    return {
        id: post.id,
        title: post.title,
        content: post.excerpt || '',
        excerpt: post.excerpt || '',
        slug: `/${post.category}/${post.slug}`,
        publishedAt: post.publishedAt || post.createdAt,
        featuredImage: mediaUrl(media?.url),
        thumbnailImage: mediaUrl(media?.sizes?.thumbnail?.url) || mediaUrl(media?.url),
        readTime: 8,
        status: 'published',
        author: {
            id: author?.id ?? 0,
            name: author?.name || 'Staff',
            email: '',
            slug: author?.slug ? `/author/${author.slug}` : '/latest',
        },
        category: {
            id: post.category,
            name: category?.name || post.category,
            slug: `/${post.category}`,
        },
        tags:
            post.tags
                ?.filter((t): t is { tag: string; id?: string | null } => Boolean(t.tag))
                .map((t, i) => ({
                    id: i,
                    name: t.tag,
                    slug: `/topic/${slugify(t.tag)}`,
                })) || [],
    }
}

/* Redirection panel lookup. Called from the 404 boundary, so it only costs a
   query on URLs that would otherwise have shown the 404 page — normal pages
   never touch it. Returns null when no enabled rule matches. */
export async function findRedirect(
    path: string,
): Promise<{ to: string; type: 301 | 302 } | null> {
    const from = normalisePath(path)
    if (!from || from === '/') return null

    try {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'redirects',
            where: { and: [{ from: { equals: from } }, { enabled: { not_equals: false } }] },
            limit: 1,
            overrideAccess: true,
        })

        const rule = docs[0]
        if (!rule?.to) return null

        // A rule pointing at itself would loop forever.
        if (!/^https?:\/\//i.test(rule.to) && normalisePath(rule.to) === from) return null

        return { to: rule.to, type: rule.type === '302' ? 302 : 301 }
    } catch (error) {
        // A broken redirect lookup must never replace the 404 with a crash.
        console.error('Redirect lookup failed:', error)
        return null
    }
}
