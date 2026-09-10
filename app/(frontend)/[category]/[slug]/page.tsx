/* Canonical article page: /{category}/{slug}/ (news/explainer — indexed). */
import { getPayload } from 'payload'
import { maybeRedirect } from '@/lib/redirect-guard'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/config'
import { getCategory } from '@/lib/categories'
import { mediaUrl } from '@/lib/cms'
import StructuredData from '@/components/StructuredData'
import CustomSchema from '@/components/CustomSchema'
import NewsletterCta from '@/components/elements/NewsletterCta'

type Args = {
    params: Promise<{ category: string; slug: string }>
}

async function getPost(category: string, slug: string) {
    if (!getCategory(category)) return null
    try {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'posts',
            where: {
                and: [{ slug: { equals: slug } }, { category: { equals: category } }],
            },
            limit: 1,
            depth: 2,
            overrideAccess: false, // published posts only
        })
        return docs[0] ?? null
    } catch {
        return null
    }
}

const mediaDoc = (value: unknown): { url?: string; alt?: string } | null =>
    value && typeof value === 'object' ? (value as { url?: string; alt?: string }) : null

export async function generateMetadata({ params }: Args): Promise<Metadata> {
    const { category, slug } = await params
    const post = await getPost(category, slug)
    if (!post) {
        await maybeRedirect(`/${category}/${slug}`)
        notFound()
    }

    const ogImage = mediaDoc(post.seo?.ogImage) || mediaDoc(post.coverImage)
    const canonical = `/${post.category}/${post.slug}`

    return {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt || undefined,
        alternates: { canonical },
        openGraph: {
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt || undefined,
            type: 'article',
            url: canonical,
            siteName: SITE.name,
            ...(ogImage?.url ? { images: [{ url: mediaUrl(ogImage.url)! }] } : {}),
        },
    }
}

export default async function PostPage({ params }: Args) {
    const { category: categorySlug, slug } = await params
    const post = await getPost(categorySlug, slug)
    if (!post) {
        await maybeRedirect(`/${categorySlug}/${slug}`)
        notFound()
    }

    const category = getCategory(post.category)
    const author = post.author && typeof post.author === 'object' ? post.author : null
    const cover = mediaDoc(post.coverImage)
    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    const publishedDate = post.publishedAt ? formatDate(post.publishedAt) : null
    // Editor-set "Last updated" wins; otherwise fall back to the auto save date
    const lastUpdatedDate = formatDate(post.lastUpdatedAt || post.updatedAt)

    const structuredData = {
        title: post.title,
        excerpt: post.excerpt,
        content: post.excerpt || post.title,
        featuredImage: cover?.url,
        slug: `${post.category}/${post.slug}`,
        publishedAt: post.publishedAt,
        updatedAt: post.lastUpdatedAt || post.updatedAt,
        author: {
            name: author?.name || SITE.name,
            slug: author?.slug || '',
        },
        category: { name: category?.name || 'News' },
        tags: post.tags?.map((t) => ({ name: t.tag })) || [],
    }

    return (
        <>
            <StructuredData type="article" data={structuredData} />
            <CustomSchema json={post.seo?.customSchema} />
            <article className="entry-wraper mb-50 mt-50">
                <div className="entry-header entry-header-style-1 mb-30 pt-30">
                    {category && (
                        <div className="entry-meta meta-0 font-small mb-10">
                            <Link href={`/${category.slug}`}>
                                <span className="post-cat text-uppercase">{category.name}</span>
                            </Link>
                        </div>
                    )}
                    <h1 className="entry-title mb-20 font-weight-900">{post.title}</h1>
                    {post.excerpt && <h2 className="text-muted font-medium mb-20">{post.excerpt}</h2>}
                    <div className="entry-meta align-items-center meta-2 font-small color-muted">
                        {author && (
                            <p className="mb-5">
                                By{' '}
                                {author.slug ? (
                                    <Link href={`/author/${author.slug}`}>
                                        <span className="author-name font-weight-bold">{author.name}</span>
                                    </Link>
                                ) : (
                                    <span className="author-name font-weight-bold">{author.name}</span>
                                )}
                            </p>
                        )}
                        {publishedDate && <span className="mr-10">{publishedDate}</span>}
                        {lastUpdatedDate && (
                            <span className="has-dot">Last updated {lastUpdatedDate}</span>
                        )}
                    </div>
                </div>
                {cover?.url && (
                    <figure className="image mb-30 border-radius-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className="border-radius-10 w-100"
                            src={mediaUrl(cover.url)}
                            alt={cover.alt || post.title}
                        />
                    </figure>
                )}
                <div className="entry-main-content">
                    <RichText data={post.content} />
                </div>
                {post.tags && post.tags.length > 0 && (
                    <div className="entry-bottom mt-50 mb-30">
                        <div className="tags">
                            {post.tags.map(
                                (t, i) =>
                                    t.tag && (
                                        <span key={i} className="mr-10">
                                            <Link
                                                href={`/topic/${t.tag
                                                    .toLowerCase()
                                                    .replace(/[\s_]+/g, '-')
                                                    .replace(/[^\w-]+/g, '')}`}
                                            >
                                                #{t.tag}
                                            </Link>
                                        </span>
                                    ),
                            )}
                        </div>
                    </div>
                )}
                <NewsletterCta />
            </article>
        </>
    )
}
