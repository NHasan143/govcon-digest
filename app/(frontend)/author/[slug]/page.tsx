/* Author page: /author/{slug}/ — indexed for active, real authors. Lists every
   published article by the author across both blog posts and news. */
import type { Metadata } from 'next'
import { maybeRedirect } from '@/lib/redirect-guard'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { newsUrl, postUrl, PostList } from '@/components/cms/PostList'
import AuthorSocials from '@/components/elements/AuthorSocials'
import { SITE } from '@/lib/config'
import type { News, Post } from '@/payload-types'

type Args = {
    params: Promise<{ slug: string }>
}

type AuthorDoc = (Post | News) & { isNews?: boolean }

async function getAuthorWithPosts(slug: string) {
    try {
        const payload = await getPayload({ config })
        const { docs: users } = await payload.find({
            collection: 'users',
            where: { slug: { equals: slug } },
            limit: 1,
            overrideAccess: false,
        })
        const author = users[0]
        if (!author) return null
        const [postsRes, newsRes] = await Promise.all([
            payload.find({
                collection: 'posts',
                where: { author: { equals: author.id } },
                sort: '-publishedAt',
                limit: 500,
                depth: 1,
                overrideAccess: false,
            }),
            payload.find({
                collection: 'news',
                where: { author: { equals: author.id } },
                sort: '-publishedAt',
                limit: 500,
                depth: 1,
                overrideAccess: false,
            }),
        ])
        const posts: AuthorDoc[] = [
            ...postsRes.docs,
            ...newsRes.docs.map((d) => ({ ...d, isNews: true })),
        ].sort(
            (a, b) =>
                new Date(b.publishedAt || b.createdAt).getTime() -
                new Date(a.publishedAt || a.createdAt).getTime(),
        )
        return { author, posts }
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
    const { slug } = await params
    const data = await getAuthorWithPosts(slug)
    if (!data) {
        await maybeRedirect(`/author/${slug}`)
        notFound()
    }

    return {
        title: `${data.author.name} — Articles`,
        description: `Articles by ${data.author.name} on ${SITE.name}.`,
        alternates: { canonical: `/author/${slug}` },
    }
}

export default async function AuthorPage({ params }: Args) {
    const { slug } = await params
    const data = await getAuthorWithPosts(slug)
    if (!data) {
        await maybeRedirect(`/author/${slug}`)
        notFound()
    }

    return (
        <div className="pt-30 pb-50">
            <div className="entry-header mb-30">
                <h1 className="entry-title font-weight-900 mb-10">{data.author.name}</h1>
                <p className="text-muted font-medium">
                    {data.posts.length > 0
                        ? `${data.posts.length} article${data.posts.length === 1 ? '' : 's'} by ${data.author.name} on ${SITE.name}.`
                        : `${data.author.name} has not published any articles yet.`}
                </p>
                <AuthorSocials socials={data.author.socials} name={data.author.name} />
            </div>
            <PostList
                posts={data.posts}
                hrefFor={(doc) =>
                    (doc as AuthorDoc).isNews
                        ? newsUrl(doc)
                        : postUrl(doc as Parameters<typeof postUrl>[0])
                }
            />
        </div>
    )
}
