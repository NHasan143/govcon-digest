/* Latest: /latest/ — indexed feed of the newest published articles. */
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PostList } from '@/components/cms/PostList'
import { SITE } from '@/lib/config'

// Render per-request so newly published posts appear immediately
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Latest News',
    description: `The newest reporting, explainers, and analysis from ${SITE.name}.`,
    alternates: { canonical: '/latest' },
    openGraph: {
        title: 'Latest News',
        description: `The newest reporting, explainers, and analysis from ${SITE.name}.`,
        url: '/latest',
        siteName: SITE.name,
        type: 'website',
    },
}

export default async function LatestPage() {
    let posts: Awaited<ReturnType<typeof getPosts>> = []
    try {
        posts = await getPosts()
    } catch {
        posts = []
    }

    return (
        <div className="pt-30 pb-50">
            <div className="entry-header mb-30">
                <h1 className="entry-title font-weight-900 mb-10">Latest</h1>
            </div>
            <PostList posts={posts} />
        </div>
    )
}

async function getPosts() {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
        collection: 'posts',
        sort: '-publishedAt',
        limit: 20,
        depth: 1,
        overrideAccess: false,
    })
    return docs
}
