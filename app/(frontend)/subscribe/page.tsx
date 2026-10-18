/* Newsletter landing: /subscribe/ — indexed. (/newsletter redirects here.)
   (Newsletter archive and web editions are Phase 2 per the requirements doc.) */
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/config'
import KitNewsletterForm from '@/components/elements/KitNewsletterForm'

export const metadata: Metadata = {
    title: `The ${SITE.name} Newsletter`,
    description: `${SITE.tagline} — get ${SITE.name}'s newsletter in your inbox. News, explainers, and analysis worth your morning.`,
    alternates: { canonical: '/subscribe' },
    openGraph: {
        title: `The ${SITE.name} Newsletter`,
        description: `Get ${SITE.name}'s newsletter in your inbox.`,
        url: '/subscribe',
        siteName: SITE.name,
        type: 'website',
    },
}

export default function NewsletterPage() {
    return (
        <div className="pt-50 pb-50">
            <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-9">
                    <div className="entry-header text-center mb-30">
                        <h1 className="entry-title font-weight-900 mb-20">
                            The {SITE.name} Newsletter
                        </h1>
                        <p className="text-muted font-large mb-10">{SITE.tagline}</p>
                        <p className="font-medium">
                            The stories that matter — AI, the economy, business, science,
                            health, and the world — delivered straight to your inbox.
                            Free, concise, and readable before your coffee gets cold.
                        </p>
                    </div>
                    <div>
                        <KitNewsletterForm />
                        <p className="font-x-small text-muted mt-15 mb-0 text-center">
                            No spam. Unsubscribe anytime. Read our{' '}
                            <Link href="/privacy">privacy policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
