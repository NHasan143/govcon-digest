/* News index: /stories/ — indexed feed of the newest published news posts. */
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { newsUrl, PostList } from '@/components/cms/PostList'
import { SITE } from '@/lib/config'

// Render per-request so newly published news appears immediately
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'News',
    description: `The latest news from ${SITE.name}.`,
    alternates: { canonical: '/stories' },
    openGraph: {
        title: 'News',
        description: `The latest news from ${SITE.name}.`,
        url: '/stories',
        siteName: SITE.name,
        type: 'website',
    },
}

export default async function StoriesPage() {
    let docs: Awaited<ReturnType<typeof getNews>> = []
    try {
        docs = await getNews()
    } catch {
        docs = []
    }

    return (
        <div className="pt-30 pb-50">
            <div className="entry-header mb-30">
                <h1 className="entry-title font-weight-900 mb-10">News</h1>
            </div>
            <PostList posts={docs} hrefFor={(doc) => newsUrl(doc)} />
        </div>
    )
}

async function getNews() {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
        collection: 'news',
        sort: '-publishedAt',
        limit: 20,
        depth: 1,
        overrideAccess: false,
    })
    return docs
}
