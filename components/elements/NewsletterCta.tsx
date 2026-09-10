import Link from 'next/link'
import { Suspense } from 'react'
import { SITE } from '@/lib/config'
import NewsletterStatus from './NewsletterStatus'

/* Subscribe form shown after every blog and news article — same form as /subscribe. */
export default function NewsletterCta() {
    return (
        <div
            className="newsletter-cta widget_newsletter text-center mt-50 mb-30 p-30"
            style={{
                border: '1px solid rgba(0,0,0,.08)',
                borderRadius: 10,
                background: 'rgba(0,0,0,.02)',
            }}
        >
            <h4 className="font-weight-bold mb-10">Enjoyed this story?</h4>
            <p className="text-muted mb-20" style={{ maxWidth: 480, margin: '0 auto 20px' }}>
                A few minutes with {SITE.name} can save you hours of scrolling. Get the next
                briefing in your inbox.
            </p>
            <form
                action="/api/newsletter"
                method="POST"
                className="subscribe_form relative mail_part"
                style={{ maxWidth: 480, margin: '0 auto' }}
            >
                <div className="form-newsletter-cover">
                    <div className="form-newsletter d-flex">
                        <input
                            type="email"
                            name="EMAIL"
                            placeholder="Your email address"
                            required
                            aria-label="Email address"
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="font-weight-bold">
                            Subscribe
                        </button>
                    </div>
                </div>
            </form>
            <Suspense fallback={null}>
                <NewsletterStatus />
            </Suspense>
            <p className="font-x-small text-muted mt-15 mb-0">
                No spam. Unsubscribe anytime. Read our{' '}
                <Link href="/privacy">privacy policy</Link>.
            </p>
        </div>
    )
}
