import Link from 'next/link'
import { SITE } from '@/lib/config'
import KitNewsletterForm from './KitNewsletterForm'

/* Subscribe form shown after every blog and news article. */
export default function NewsletterCta() {
    return (
        <div className="newsletter-cta text-center mt-50 mb-30">
            <h4 className="font-weight-bold mb-10">Enjoyed this story?</h4>
            <p className="text-muted mb-20" style={{ maxWidth: 480, margin: '0 auto 20px' }}>
                A few minutes with {SITE.name} can save you hours of scrolling. Get the next
                briefing in your inbox.
            </p>
            <KitNewsletterForm />
            <p className="font-x-small text-muted mt-15 mb-0">
                No spam. Unsubscribe anytime. Read our{' '}
                <Link href="/privacy">privacy policy</Link>.
            </p>
        </div>
    )
}
