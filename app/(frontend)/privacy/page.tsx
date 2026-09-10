/* Privacy Policy: /privacy/ — indexed. Copy from the owner's "Morning Glance Pages" doc. */
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
    // Explicit site-name suffix: the global title template no longer adds one
    // (fix list item 10 — dynamic titles must not be suffixed).
    title: `Privacy Policy | ${SITE.name}`,
    description: `Read how ${SITE.name} collects, uses, protects, and shares personal information when you visit our website or subscribe to the newsletter.`,
    keywords: [
        `${SITE.name} privacy policy`,
        'personal information',
        'newsletter privacy',
        'data protection',
        'privacy rights',
        'data sharing',
    ],
    alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
    return (
        <article className="entry-wraper mb-50 mt-50">
            <div className="entry-header entry-header-style-1 mb-30 pt-30">
                <h1 className="entry-title mb-20 font-weight-900">Privacy Policy</h1>
                <p className="text-muted font-small">Effective Date: July 25, 2026</p>
            </div>
            <div className="entry-main-content">
                <p>
                    {SITE.name} is committed to protecting your privacy. This part explains how we
                    collect, use, disclose, and safeguard your information when you visit our
                    website and subscribe to our newsletter.
                </p>
                <p>
                    Please read this privacy policy for {SITE.name} carefully to understand our
                    practices regarding your personal data.
                </p>

                <h2>1. Information We Collect</h2>
                <p>{SITE.name} may collect and process the following data about you.</p>
                <p>
                    <strong>1. Personal Identification Information:</strong> Your name, email
                    address, and other contact details you provide when subscribing to our
                    newsletter or reaching out to us.
                </p>
                <p>
                    <strong>2. Usage Data:</strong> Information about how you use our website and
                    content, including pages visited, time spent, and general engagement patterns.
                </p>
                <p>
                    <strong>3. Marketing and Communications Data:</strong> Your preferences in
                    receiving communications from {SITE.name}, including how you interact with our
                    emails.
                </p>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect in the following ways:</p>
                <ul>
                    <li>To provide you with our newsletter and other services you request.</li>
                    <li>To improve our website and personalize your experience.</li>
                    <li>To send periodic emails regarding your subscription or other services.</li>
                    <li>To respond to your inquiries and provide customer support.</li>
                    <li>To comply with legal obligations and enforce our terms and conditions.</li>
                </ul>

                <h2>3. Legal Bases for Processing</h2>
                <p>We process your personal data under the following legal bases, where applicable.</p>
                <p>
                    <strong>1. Consent:</strong> Where you have provided consent for {SITE.name} to
                    process your personal data, such as subscribing to our newsletter.
                </p>
                <p>
                    <strong>2. Contractual Necessity:</strong> To fulfill a request you&apos;ve
                    made of us, or to take steps you&apos;ve asked for before entering into that
                    arrangement.
                </p>
                <p>
                    <strong>3. Legal Obligation:</strong> To comply with obligations we&apos;re
                    subject to under applicable law.
                </p>
                <p>
                    <strong>4. Legitimate Interests:</strong> For our legitimate interests in
                    operating and improving {SITE.name}, provided your interests and fundamental
                    rights do not override those interests.
                </p>

                <h2>4. Cookies and Similar Technologies</h2>
                <p>
                    Our website may use cookies and similar technologies to keep the site
                    functioning properly, understand how readers engage with our content, and, if
                    applicable, support advertising. Full details on the specific cookies we use,
                    including their purpose and duration, are available in our{' '}
                    <Link href="/cookie-policy">Cookie Policy</Link>.
                </p>

                <h2>5. Newsletter and Email Practices</h2>
                <p>
                    When you subscribe to {SITE.name}, we collect your email address so we can
                    deliver the content you signed up for. Some additional notes:
                </p>
                <p>
                    <strong>1. Sending practices:</strong> Every email we send includes a clear,
                    working way to unsubscribe, and we honor opt-out requests promptly.
                </p>
                <p>
                    <strong>2. No selling of your address:</strong> We do not sell or trade your
                    email address to third parties.
                </p>
                <p>
                    <strong>3. Sponsored content:</strong> If sponsored or partner content ever
                    appears in our newsletter, it will be clearly labeled as such, consistent with
                    our <Link href="/editorial-standards">editorial standards</Link>.
                </p>

                <h2>6. Sharing Your Information</h2>
                <p>
                    We do not sell, trade, or otherwise transfer your personal data to outside
                    parties except as described below.
                </p>
                <ul>
                    <li>
                        <strong>Service Providers:</strong> Trusted third-party vendors who help us
                        operate our website, deliver our newsletter, and support our business.
                    </li>
                    <li>
                        <strong>Legal Requirements:</strong> When required by law or to respond to
                        a valid legal process.
                    </li>
                    <li>
                        <strong>Business Transfers:</strong> In connection with a merger, sale, or
                        acquisition of all or a portion of our business.
                    </li>
                </ul>

                <h2>7. Your Choices Around Data Sharing</h2>
                <p>
                    Depending on where you live, you might have the right to opt out of certain
                    kinds of data sharing, including for advertising purposes. Privacy laws vary
                    quite a bit from one place to another, so this right may or may not apply to
                    you specifically. If it does apply to you, we&apos;ll honor it without any
                    hassle and make sure there&apos;s a clear, simple way for you to exercise it
                    whenever you&apos;d like.
                </p>

                <h2>8. Data Retention</h2>
                <p>
                    We keep your information for as long as it&apos;s actually useful to you. For
                    example, we hold onto it while you&apos;re subscribed to our newsletter, plus a
                    short while after in case we need it for record-keeping or legal reasons. Once
                    it&apos;s no longer needed, we let it go.
                </p>

                <h2>9. Data Security</h2>
                <p>
                    We implement reasonable technical and organizational measures designed to
                    protect your personal data against unauthorized access, alteration,
                    disclosure, or destruction. That said, no method of transmission over the
                    internet is entirely secure, and we cannot guarantee absolute security.
                </p>

                <h2>10. Your Data Protection Rights</h2>
                <p>
                    Depending on your location, you may have the following rights regarding your
                    personal data.
                </p>
                <p>
                    <strong>The right to access:</strong> You have the right to request copies of
                    your personal data.
                </p>
                <p>
                    <strong>The right to rectification:</strong> You have the right to request
                    correction of any information you believe is inaccurate.
                </p>
                <p>
                    <strong>The right to erasure:</strong> You have the right to request that we
                    erase your personal data under certain conditions.
                </p>
                <p>
                    <strong>The right to restrict processing:</strong> You have the right to
                    request that we restrict the processing of your personal data under certain
                    conditions.
                </p>
                <p>
                    <strong>The right to object to processing:</strong> You have the right to
                    object to our processing of your personal data under certain conditions.
                </p>
                <p>
                    <strong>The right to data portability:</strong> You have the right to request
                    that we transfer the data we have collected to another organization, or
                    directly to you, under certain conditions.
                </p>
                <p>
                    To exercise any of these rights, please reach out to us through our{' '}
                    <Link href="/contact">Contact page</Link>. We will respond within the
                    timeframe required by applicable law. You may also unsubscribe from our
                    newsletter at any time using the link included in every email we send.
                </p>

                <h2>11. Children&apos;s Privacy</h2>
                <p>
                    {SITE.name} is not directed at children, and we do not knowingly collect
                    personal information from children under the age of 13. If we become aware
                    that we have inadvertently collected such information, we will take steps to
                    delete it promptly.
                </p>

                <h2>12. International Readers</h2>
                <p>
                    {SITE.name} is based in the United States, and any information you provide
                    will be processed here, where privacy laws may differ from those in your
                    country of residence. By using our website or subscribing to our newsletter,
                    you understand that your information may be transferred to and processed in
                    the United States.
                </p>

                <h2>13. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time to reflect changes in our
                    practices or for legal, operational, or regulatory reasons. Any updates will
                    be reflected by a revised effective date at the top of this page. We encourage
                    you to review this policy periodically.
                </p>

                <h2>14. Contact Us</h2>
                <p>
                    If you have questions about this Privacy Policy or how we handle your
                    information, please reach out through our{' '}
                    <Link href="/contact">Contact page</Link>.
                </p>
            </div>
        </article>
    )
}
