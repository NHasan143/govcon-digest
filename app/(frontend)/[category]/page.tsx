/* Root-level page: /{segment}/. Categories and articles share this namespace —
   a category slug renders its hub, anything else is looked up as an article
   (Posts, then News). Both are indexed. Article slugs can never collide with a
   category or a static page: payload/fields/articleSlug.ts rejects them. */
import type { Metadata } from 'next'
import { maybeRedirect } from '@/lib/redirect-guard'
import { notFound } from 'next/navigation'
import { getCategory } from '@/lib/categories'
import { getArticleBySlug } from '@/lib/cms'
import { CategoryHub } from '@/components/cms/CategoryHub'
import { ArticleView, articleMetadata } from '@/components/cms/Article'
import { SITE } from '@/lib/config'

type Args = {
    params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
    const { category: segment } = await params
    const category = getCategory(segment)
    if (!category) {
        const article = await getArticleBySlug(segment)
        if (article) return articleMetadata(article.doc)
        await maybeRedirect(`/${segment}`)
        notFound()
    }

    return {
        title: `${category.name} News & Analysis`,
        description: `The latest ${category.name} coverage from ${SITE.name}: news, explainers, and analysis.`,
        alternates: { canonical: `/${category.slug}` },
        openGraph: {
            title: `${category.name} News & Analysis`,
            description: `The latest ${category.name} coverage from ${SITE.name}.`,
            url: `/${category.slug}`,
            siteName: SITE.name,
            type: 'website',
        },
    }
}

export default async function RootSegmentPage({ params }: Args) {
    const { category: segment } = await params
    if (getCategory(segment)) return <CategoryHub categorySlug={segment} page={1} />

    const article = await getArticleBySlug(segment)
    if (!article) {
        await maybeRedirect(`/${segment}`)
        notFound()
    }
    return <ArticleView post={article.doc} />
}
