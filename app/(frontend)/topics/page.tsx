/* Topics index: /topics/ — the seven sections and their subsections as a
   browsable list (also the landing page for the footer "Topics" links). */
import type { Metadata } from 'next'
import TopicsDirectory from '@/components/topics/TopicsDirectory'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
    title: 'Topics',
    description: `Browse ${SITE.name} coverage by topic.`,
    alternates: { canonical: '/topics' },
}

export default function TopicsPage() {
    return <TopicsDirectory />
}
