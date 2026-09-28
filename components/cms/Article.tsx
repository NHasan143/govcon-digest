/* Article page body and metadata, shared by Posts and News — both render at
   /{slug} from app/(frontend)/[category]/page.tsx. */
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/config'
import { getCategory } from '@/lib/categories'
import { articleUrl, mediaUrl } from '@/lib/cms'
import type { News, Post } from '@/payload-types'
import StructuredData from '@/components/StructuredData'
import CustomSchema from '@/components/CustomSchema'
import NewsletterCta from '@/components/elements/NewsletterCta'

type ArticleDoc = Post | News

const mediaDoc = (value: unknown): { url?: string; alt?: string } | null =>
    value && typeof value === 'object' ? (value as { url?: string; alt?: string }) : null

export function articleMetadata(post: ArticleDoc): Metadata {
    const ogImage = mediaDoc(post.seo?.ogImage) || mediaDoc(post.coverImage)
    const canonical = articleUrl(post)

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

export function ArticleView({ post }: { post: ArticleDoc }) {
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
        slug: post.slug,
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
                    <h1 className="entry-title mb-20 font-weight-900">{post.title}</h1>
                    {post.excerpt && <p className="font-heading text-muted font-medium mb-20">{post.excerpt}</p>}
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
