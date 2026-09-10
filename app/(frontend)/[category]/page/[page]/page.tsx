/* Category pagination: /{category}/page/N/ — crawlable, self-canonical. */
import type { Metadata } from 'next'
import { maybeRedirect } from '@/lib/redirect-guard'
import { notFound } from 'next/navigation'
import { getCategory } from '@/lib/categories'
import { CategoryHub } from '@/components/cms/CategoryHub'
import { SITE } from '@/lib/config'

type Args = {
    params: Promise<{ category: string; page: string }>
}

const parsePage = (raw: string): number | null => {
    const n = Number(raw)
    // Page 1 lives at the hub root, not /page/1
    return Number.isInteger(n) && n >= 2 ? n : null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
    const { category: categorySlug, page: rawPage } = await params
    const category = getCategory(categorySlug)
    const page = parsePage(rawPage)
    if (!category || !page) {
        await maybeRedirect(`/${categorySlug}/page/${rawPage}`)
        notFound()
    }

    return {
        title: `${category.name} News & Analysis — Page ${page}`,
        description: `The latest ${category.name} coverage from ${SITE.name}, page ${page}.`,
        alternates: { canonical: `/${category.slug}/page/${page}` },
    }
}

export default async function CategoryPaginationPage({ params }: Args) {
    const { category, page: rawPage } = await params
    const page = parsePage(rawPage)
    if (!page) {
        await maybeRedirect(`/${category}/page/${rawPage}`)
        notFound()
    }
    return <CategoryHub categorySlug={category} page={page} />
}
