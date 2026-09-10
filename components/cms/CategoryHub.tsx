/* Shared renderer for category hub pages (page 1 and /page/N). */
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { maybeRedirect } from '@/lib/redirect-guard'
import { getCategory } from '@/lib/categories'
import { PostList } from '@/components/cms/PostList'

export const POSTS_PER_PAGE = 12

export async function getCategoryPosts(categorySlug: string, page: number) {
    try {
        const payload = await getPayload({ config })
        return await payload.find({
            collection: 'posts',
            where: { category: { equals: categorySlug } },
            sort: '-publishedAt',
            limit: POSTS_PER_PAGE,
            page,
            depth: 1,
            overrideAccess: false, // published only
        })
    } catch {
        return null
    }
}

export async function CategoryHub({
    categorySlug,
    page,
}: {
    categorySlug: string
    page: number
}) {
    // The redirect check has to live here as well as in the routes'
    // generateMetadata: the page body and the metadata resolve concurrently, so
    // a notFound() thrown here would otherwise win the race and 404 a URL that
    // has a redirection-panel rule.
    const requestPath = page <= 1 ? `/${categorySlug}` : `/${categorySlug}/page/${page}`

    const category = getCategory(categorySlug)
    if (!category) {
        await maybeRedirect(requestPath)
        notFound()
    }

    const result = await getCategoryPosts(categorySlug, page)
    // Page numbers beyond the last page 404 rather than rendering empty shells
    if (!result || (page > 1 && page > (result.totalPages || 1))) {
        await maybeRedirect(requestPath)
        notFound()
    }

    const pageHref = (n: number) => (n <= 1 ? `/${category.slug}` : `/${category.slug}/page/${n}`)

    return (
        <div className="pt-30 pb-50">
            <div className="entry-header mb-30">
                <h1 className="entry-title font-weight-900 mb-10">{category.name}</h1>
            </div>
            <PostList posts={result.docs} />
            {result.totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-30 font-small text-uppercase">
                    {result.hasPrevPage && (
                        <Link className="mr-20" href={pageHref(page - 1)}>
                            ← Newer
                        </Link>
                    )}
                    <span className="text-muted mr-20">
                        Page {page} of {result.totalPages}
                    </span>
                    {result.hasNextPage && <Link href={pageHref(page + 1)}>Older →</Link>}
                </nav>
            )}
        </div>
    )
}
