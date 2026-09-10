/* Topic hub: /topic/{slug}/ — noindex,follow until a topic passes the
   approval threshold (per the SEO requirements doc, topic hubs are indexed
   only after editorial approval; flip robots per-topic when that happens). */
import type { Metadata } from 'next'
import { maybeRedirect } from '@/lib/redirect-guard'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { newsUrl, postUrl, PostList } from '@/components/cms/PostList'
import { SITE } from '@/lib/config'
import type { News, Post } from '@/payload-types'

type Args = {
    params: Promise<{ slug: string }>
}

const topicName = (slug: string) =>
    slug
        .split('-')
        .filter(Boolean)
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(' ')

type TopicDoc = (Post | News) & { isNews?: boolean }

async function getTopicPosts(slug: string): Promise<TopicDoc[] | null> {
    try {
        const payload = await getPayload({ config })
        // Tags are free text ("Federal Reserve"); match the de-slugged term.
        // Both blog posts and news articles carry tags.
        const where = { 'tags.tag': { like: slug.replace(/-/g, ' ') } }
        const [postsRes, newsRes] = await Promise.all([
            payload.find({
                collection: 'posts',
                where,
                sort: '-publishedAt',
                limit: 50,
                depth: 1,
                overrideAccess: false,
            }),
            payload.find({
                collection: 'news',
                where,
                sort: '-publishedAt',
                limit: 50,
                depth: 1,
                overrideAccess: false,
            }),
        ])
        const docs: TopicDoc[] = [
            ...postsRes.docs,
            ...newsRes.docs.map((d) => ({ ...d, isNews: true })),
        ]
        return docs.sort(
            (a, b) =>
                new Date(b.publishedAt || b.createdAt).getTime() -
                new Date(a.publishedAt || a.createdAt).getTime(),
        )
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
    const { slug } = await params
    if (!/^[a-z0-9-]+$/.test(slug)) {
        await maybeRedirect(`/topic/${slug}`)
        notFound()
    }
    const name = topicName(slug)

    return {
        title: `${name} — Topic`,
        description: `${SITE.name} coverage of ${name}.`,
        alternates: { canonical: `/topic/${slug}` },
        robots: { index: false, follow: true },
    }
}

export default async function TopicPage({ params }: Args) {
    const { slug } = await params
    if (!/^[a-z0-9-]+$/.test(slug)) {
        await maybeRedirect(`/topic/${slug}`)
        notFound()
    }
    const posts = await getTopicPosts(slug)
    if (!posts || posts.length === 0) {
        await maybeRedirect(`/topic/${slug}`)
        notFound()
    }

    return (
        <div className="pt-30 pb-50">
            <div className="entry-header mb-30">
                <h1 className="entry-title font-weight-900 mb-10">{topicName(slug)}</h1>
            </div>
            <PostList
                posts={posts}
                hrefFor={(doc) =>
                    (doc as TopicDoc).isNews
                        ? newsUrl(doc)
                        : postUrl(doc as Parameters<typeof postUrl>[0])
                }
            />
        </div>
    )
}
