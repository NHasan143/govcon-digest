/* Topics index: /topics/ — the seven sections and their subsections as a
   browsable list (also the landing page for the footer "Topics" links). */
import type { Metadata } from 'next'
import Link from 'next/link'
import { PARENT_CATEGORIES } from '@/lib/categories'
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
                <p className="text-muted">Browse our coverage by section.</p>
            </div>
            <div className="row">
                {PARENT_CATEGORIES.map((category) => (
                    <div key={category.slug} className="col-lg-4 col-md-6 mb-30">
                        <div className="pb-20 h-100" style={{ borderTop: `3px solid ${category.color}`, paddingTop: 14 }}>
                            <h4 className="font-weight-900 mb-10">
                                <Link href={`/${category.slug}`}>{category.name}</Link>
                            </h4>
                            <p className="text-muted font-small mb-15">{category.blurb}</p>
                            <ul className="list-unstyled font-small mb-0" style={{ paddingLeft: 0 }}>
                                {category.children.map((child) => (
                                    <li key={child.slug} className="mb-5">
                                        <Link href={`/${child.slug}`}>{child.name} →</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
