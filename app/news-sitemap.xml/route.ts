import { getPayload } from 'payload'
import config from '@payload-config'
import { SITE } from '@/lib/config'

/* Google News sitemap: only news articles published in the last 48 hours.
   Older stories drop out automatically — Google requires this window, and
   nothing needs to be removed by hand. The permanent URLs stay in
   /sitemap.xml, which keeps every article indefinitely. */
export const dynamic = 'force-dynamic'

const WINDOW_HOURS = 48

// Both & and < must be escaped, and headlines routinely contain them.
function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

export async function GET() {
    const since = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString()

    let entries = ''

    try {
        const payload = await getPayload({ config })

        // overrideAccess: false applies the collection's public read rule, so
        // drafts and hidden stories are excluded exactly as on the site.
        const { docs } = await payload.find({
            collection: 'news',
            where: { publishedAt: { greater_than: since } },
            sort: '-publishedAt',
            limit: 1000,
            depth: 0,
            overrideAccess: false,
        })

        entries = docs
            .filter((doc) => doc.slug && doc.publishedAt)
            .map(
                (doc) => `  <url>
    <loc>${escapeXml(`${SITE.url}/stories/${doc.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(doc.publishedAt as string).toISOString()}</news:publication_date>
      <news:title>${escapeXml(doc.title)}</news:title>
    </news:news>
  </url>`,
            )
            .join('\n')
    } catch (error) {
        // An empty but valid sitemap beats a 500 — Google retries either way,
        // but a malformed document gets the sitemap flagged.
        console.error('News sitemap generation failed:', error)
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            // Short cache: the 48-hour window moves continuously.
            'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
        },
    })
}
