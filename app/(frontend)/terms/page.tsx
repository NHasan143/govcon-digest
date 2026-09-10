/* Terms of Use: /terms/ — indexed. Copy from the owner's "Morning Glance Pages" doc. */
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
    // Explicit site-name suffix — see the note in privacy/page.tsx.
    title: `Terms of Use | ${SITE.name}`,
    description: `Review the terms that govern your use of the ${SITE.name} website, newsletter, articles, links, submissions, and related services.`,
    keywords: [
        `${SITE.name} terms of use`,
        'website terms',
        'newsletter terms',
        'content use',
        'intellectual property',
        'acceptable use',
    ],
    alternates: { canonical: '/terms' },
}

export default function TermsPage() {
    return (
        <article className="entry-wraper mb-50 mt-50">
            <div className="entry-header entry-header-style-1 mb-30 pt-30">
                <h1 className="entry-title mb-20 font-weight-900">Terms of Use</h1>
                <p className="text-muted font-small">Effective Date: July 25, 2026</p>
            </div>
            <div className="entry-main-content">
                <p>
                    Welcome to {SITE.name}. These Terms of Use govern your access to and use of
                    our website, newsletter, and related content. By visiting our site or
                    subscribing to our newsletter, you agree to these terms.
                </p>
                <p>Please read the following Terms of Use for {SITE.name} carefully.</p>

                <h2>1. Acceptance and Eligibility</h2>
                <p>
                    By accessing or using {SITE.name}, you confirm that you are at least 13 years
                    old and able to form a binding agreement under applicable law. If you do not
                    agree with these terms, please do not use our website or subscribe to our
                    newsletter.
                </p>

                <h2>2. What {SITE.name} Is</h2>
                <p>
                    {SITE.name} is a news and commentary publication covering AI &amp; automation,
                    business &amp; finance, the US economy, science &amp; technology, health &amp;
                    medicine, and international affairs. We deliver this content through our
                    website and our email newsletter.
                </p>

                <h2>3. Intellectual Property</h2>
                <p>
                    <strong>Our content:</strong> All articles, graphics, logos, and other
                    material published on {SITE.name} are owned by us or our licensors and
                    protected by copyright and other intellectual property laws.
                </p>
                <p>
                    <strong>Your permitted use:</strong> You may view, read, and share our content
                    for personal, non-commercial purposes, including linking to our articles. You
                    may not republish, reproduce, distribute, or create derivative works from our
                    content without our prior written permission.
                </p>

                <h2>4. Prohibited Conduct</h2>
                <p>When using {SITE.name}, you agree not to do the following.</p>
                <p>
                    <strong>1. Unlawful use:</strong> Using our website or newsletter for any
                    unlawful purpose or in violation of these terms.
                </p>
                <p>
                    <strong>2. Interference:</strong> Attempting to disrupt, damage, or gain
                    unauthorized access to our website, systems, or data.
                </p>
                <p>
                    <strong>3. Misrepresentation:</strong> Impersonating any person or entity, or
                    misrepresenting your affiliation with us.
                </p>
                <p>
                    <strong>4. Content misuse:</strong> Scraping, copying, or redistributing our
                    content in bulk without our permission.
                </p>

                <h2>5. User Submissions and Tips</h2>
                <p>
                    If you send us a news tip, correction request, or other submission, you grant
                    us permission to use that information for editorial and operational purposes.
                    Please do not submit anything confidential that you&apos;re not comfortable
                    sharing with us, unless a specific confidential submission channel is offered
                    and clearly described elsewhere on our site.
                </p>

                <h2>6. Third-Party Links and Services</h2>
                <p>
                    Our content and website may include links to third-party websites, sources,
                    and services that we do not own or control. We are not responsible for the
                    content, accuracy, or practices of those third parties, and including a link
                    does not imply our endorsement.
                </p>

                <h2>7. Informational Purpose Only</h2>
                <p>
                    {SITE.name} is provided for general informational purposes. Nothing on our
                    website or in our newsletter should be considered financial, legal, medical,
                    investment, or other professional advice. You should consult a qualified
                    professional before making decisions based on anything you read here.
                </p>

                <h2>8. Accuracy and Availability</h2>
                <p>
                    We work to provide accurate, well-sourced &amp; timely content, and every
                    story links back to its original source so you can verify it yourself. That
                    said, we make no guarantee that our content is complete, error-free, or
                    continuously available, and we reserve the right to correct, update, or remove
                    content at any time. Forward-looking statements or predictions referenced in
                    our coverage are not guarantees of future outcomes.
                </p>

                <h2>9. Sponsored and Affiliate Content</h2>
                <p>
                    If {SITE.name} ever includes sponsored content, affiliate links, or paid
                    partnerships, they will be clearly labeled as such, consistent with our{' '}
                    <Link href="/editorial-standards">editorial standards</Link>.
                </p>

                <h2>10. Newsletter Terms</h2>
                <p>
                    <strong>Subscribing:</strong> By subscribing to our newsletter, you consent to
                    receive periodic emails from us at the address you provide.
                </p>
                <p>
                    <strong>Unsubscribing:</strong> You may unsubscribe at any time using the link
                    included in every email. We will honor unsubscribe requests promptly.
                </p>
                <p>
                    <strong>Acceptable use:</strong> You agree to provide accurate subscription
                    information and not to use our newsletter signup process for any fraudulent or
                    abusive purpose.
                </p>

                <h2>11. Disclaimers and Limitation of Liability</h2>
                <p>
                    Our website and newsletter are provided on an &quot;as is&quot; and &quot;as
                    available&quot; basis, without warranties of any kind, whether express or
                    implied. To the fullest extent permitted by law, {SITE.name} and its team are
                    not liable for any indirect, incidental, or consequential damages arising from
                    your use of our website or newsletter.
                </p>

                <h2>12. Changes to These Terms</h2>
                <p>
                    We may update these Terms of Use from time to time to reflect changes in our
                    practices or for legal, operational, or regulatory reasons. Any updates will
                    be reflected by a revised effective date at the top of this page. Continued
                    use of {SITE.name} after changes take effect constitutes acceptance of the
                    revised terms.
                </p>

                <h2>13. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your access to {SITE.name},
                    including your newsletter subscription, if we believe you&apos;ve violated
                    these terms.
                </p>

                <h2>14. Contact Us</h2>
                <p>
                    If you have questions about these Terms of Use, please reach out through our{' '}
                    <Link href="/contact">Contact page</Link>.
                </p>
            </div>
        </article>
    )
}
