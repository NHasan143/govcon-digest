/* Category hub: /{category}/ — indexed. */
import type { Metadata } from 'next'
import { maybeRedirect } from '@/lib/redirect-guard'
import { notFound } from 'next/navigation'
import { getCategory } from '@/lib/categories'
import { CategoryHub } from '@/components/cms/CategoryHub'
import { SITE } from '@/lib/config'

type Args = {
    params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
    const { category: categorySlug } = await params
    const category = getCategory(categorySlug)
    if (!category) {
        await maybeRedirect(`/${categorySlug}`)
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

export default async function CategoryPage({ params }: Args) {
    const { category } = await params
    return <CategoryHub categorySlug={category} page={1} />
}
