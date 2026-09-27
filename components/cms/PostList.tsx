/* Shared listing UI for CMS posts and news (category hubs, /latest, /stories,
   author, topic, and search pages). */
import Link from 'next/link'
import type { News, Post } from '@/payload-types'
import { getCategory } from '@/lib/categories'
import { mediaUrl } from '@/lib/cms'

const mediaDoc = (value: unknown): { url?: string; alt?: string } | null =>
    value && typeof value === 'object' ? (value as { url?: string; alt?: string }) : null

export const postUrl = (post: Pick<Post, 'category' | 'slug'>) =>
    `/${post.category}/${post.slug}`

// News articles live at /stories/{slug} — category is metadata, not the path
export const newsUrl = (doc: Pick<News, 'slug'>) => `/stories/${doc.slug}`

type ListDoc = Post | News

export function PostList({
    posts,
    hrefFor = postUrl,
}: {
    posts: ListDoc[]
    hrefFor?: (doc: ListDoc) => string
}) {
    if (posts.length === 0) {
        return (
            <div className="text-center pt-50 pb-50">
                <p className="text-muted">No articles published here yet — check back soon.</p>
            </div>
        )
    }

    return (
        <div className="post-block-list post-module-1">
            <ul className="list-post" style={{ listStyle: 'none', paddingLeft: 0 }}>
                {posts.map((post) => {
                    const cover = mediaDoc(post.coverImage)
                    const author =
                        post.author && typeof post.author === 'object' ? post.author : null
                    const category = getCategory(post.category)
                    const date = post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                          })
                        : null
                    return (
                        <li key={post.id} className="mb-30 pb-30 border-bottom">
                            <div className="d-flex">
                                {cover?.url && (
                                    /* Fixed basis, not just the img's width attribute: as a
                                       flex item the thumb would otherwise shrink by however
                                       much room the headline beside it wanted, leaving each
                                       row's image a slightly different size. */
                                    <div
                                        className="post-thumb d-flex mr-15 border-radius-5 img-hover-scale"
                                        style={{ flex: '0 0 220px', width: 220 }}
                                    >
                                        <Link href={hrefFor(post)} style={{ width: '100%' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={mediaUrl(cover.url)}
                                                alt={cover.alt || post.title}
                                                width={220}
                                                height={140}
                                                style={{
                                                    width: '100%',
                                                    height: 140,
                                                    objectFit: 'cover',
                                                    borderRadius: 5,
                                                }}
                                            />
                                        </Link>
                                    </div>
                                )}
                                <div className="post-content media-body">
                                    {category && (
                                        <div className="entry-meta meta-0 font-small mb-5">
                                            <Link href={`/${category.slug}`}>
                                                <span className="post-cat text-uppercase font-x-small">
                                                    {category.name}
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                    <h5 className="post-title mb-10">
                                        <Link href={hrefFor(post)}>{post.title}</Link>
                                    </h5>
                                    {post.excerpt && (
                                        <p className="post-exerpt font-medium text-muted mb-10">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="entry-meta meta-1 font-x-small color-grey">
                                        {author?.name && (
                                            <span className="post-by mr-10">
                                                By{' '}
                                                {author.slug ? (
                                                    <Link href={`/author/${author.slug}`}>
                                                        {author.name}
                                                    </Link>
                                                ) : (
                                                    author.name
                                                )}
                                            </span>
                                        )}
                                        {date && <span className="post-on">{date}</span>}
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
