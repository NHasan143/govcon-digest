/* Topics index: /topics/ — the six categories as a browsable list (also the
   landing page for the nav/footer "Topics" links). */
import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
    title: 'Topics',
    description: `Browse ${SITE.name} coverage by topic.`,
    alternates: { canonical: '/topics' },
}

export default function TopicsPage() {
    return (
        <div className="pt-30 pb-50">
            <div className="entry-header mb-30">
                <h1 className="entry-title font-weight-900 mb-10">Topics</h1>
                <p className="text-muted">Browse our coverage by topic.</p>
            </div>
            <ul className="list-unstyled font-medium" style={{ listStyle: 'none', paddingLeft: 0 }}>
                {CATEGORIES.map((category) => (
                    <li key={category.slug} className="mb-15 pb-15 border-bottom">
                        <Link href={`/${category.slug}`} className="font-weight-bold">
                            {category.name} →
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
