/* Authors index: /authors/ — every author with published articles, plus admin users. */
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SITE } from '@/lib/config'
import AuthorSocials from '@/components/elements/AuthorSocials'
import type { User } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Authors',
    description: `The writers and editors behind ${SITE.name}.`,
    alternates: { canonical: '/authors' },
}

type AuthorEntry = {
    name: string
    slug: string | null
    articles: number
    socials: User['socials']
}

async function getAuthors(): Promise<AuthorEntry[]> {
    try {
        const payload = await getPayload({ config })
        const { docs: users } = await payload.find({
            collection: 'users',
            limit: 100,
            overrideAccess: false,
        })
        const counted = await Promise.all(
            users.map(async (user) => {
                const [posts, news] = await Promise.all([
                    payload.count({
                        collection: 'posts',
                        where: { author: { equals: user.id } },
                        overrideAccess: false,
                    }),
                    payload.count({
                        collection: 'news',
                        where: { author: { equals: user.id } },
                        overrideAccess: false,
                    }),
                ])
                return {
                    name: user.name,
                    slug: (user.slug as string) || null,
                    articles: posts.totalDocs + news.totalDocs,
                    socials: user.socials,
                    isAdmin: user.role === 'admin',
                }
            }),
        )
        return counted
            .filter((a) => a.isAdmin || (a.slug && a.articles > 0))
            .sort((a, b) => b.articles - a.articles)
    } catch {
        return []
    }
}

export default async function AuthorsPage() {
    const authors = await getAuthors()

    return (
        <div className="pt-30 pb-50">
            <div className="entry-header mb-30">
                <h1 className="entry-title font-weight-900 mb-10">Authors</h1>
                <p className="text-muted">The writers and editors behind {SITE.name}.</p>
            </div>
            {authors.length === 0 ? (
                <div className="text-center pt-50 pb-50">
                    <p className="text-muted">No authors yet — check back soon.</p>
                </div>
            ) : (
                <div className="row">
                    {authors.map((author) => (
                        <div key={author.slug ?? author.name} className="col-lg-4 col-md-6 mb-30">
                            <div
                                className="p-20"
                                style={{ border: '1px solid rgba(0,0,0,.08)', borderRadius: 10 }}
                            >
                                <h6 className="font-weight-bold mb-5">
                                    {author.slug ? (
                                        <Link href={`/author/${author.slug}`}>{author.name}</Link>
                                    ) : (
                                        author.name
                                    )}
                                </h6>
                                <p className="font-small text-muted mb-0">
                                    <i className="ti-pencil-alt font-x-small mr-5" />
                                    {author.articles} article{author.articles === 1 ? '' : 's'}
                                </p>
                                <AuthorSocials socials={author.socials} name={author.name} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
