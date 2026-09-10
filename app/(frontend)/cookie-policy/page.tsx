/* Cookie Policy: /cookie-policy/ — indexed. Copy from the owner's "Morning Glance Pages" doc. */
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
    // Explicit site-name suffix — see the note in privacy/page.tsx.
    title: `Cookie Policy & Settings | ${SITE.name}`,
    description: `Learn how ${SITE.name} uses cookies and similar technologies, which categories may apply, and how to manage or change your cookie preferences.`,
    keywords: [
        `${SITE.name} cookie policy`,
        'cookie settings',
        'cookie preferences',
        'analytics cookies',
        'advertising cookies',
        'consent choices',
    ],
    alternates: { canonical: '/cookie-policy' },
}

export default function CookiePolicyPage() {
    return (
        <article className="entry-wraper mb-50 mt-50">
            <div className="entry-header entry-header-style-1 mb-30 pt-30">
                <h1 className="entry-title mb-20 font-weight-900">Cookie Policy &amp; Settings</h1>
                <p className="text-muted font-small">Effective Date: July 27, 2026</p>
            </div>
            <div className="entry-main-content">
                <p>
                    This {SITE.name} Cookie Policy explains what cookies and similar technologies
                    are, how we use them across our website and newsletter, and the choices you
                    have around them. It works alongside our{' '}
                    <Link href="/privacy">Privacy Policy</Link>, which covers how we handle your
                    personal information more broadly, so we&apos;d encourage reading the two
                    together.
                </p>

                <h2>1. What Cookies Are</h2>
                <p>
                    Cookies are small text files placed on your device when you visit a website.
                    They help the site remember things about your visit, like your preferences or
                    how you got there, and they&apos;re a normal part of how most websites operate
                    today.
                </p>
                <p>
                    We may also use similar technologies, like pixels or local storage, that serve
                    a comparable purpose, helping the site function and assist us understand how
                    it&apos;s being used.
                </p>

                <h2>2. The Kinds of Cookies We Use</h2>
                <p>
                    Not every cookie on {SITE.name} does the same job. Below is the breakdown of
                    how we categorize them.
                </p>
                <p>
                    <strong>Strictly necessary cookies:</strong> These keep the site functioning
                    properly, for example, remembering your session or keeping the site secure.
                    Because they&apos;re essential to how the site operates, they can&apos;t be
                    switched off.
                </p>
                <p>
                    <strong>Analytics and performance cookies:</strong> These help us understand
                    how readers actually use {SITE.name}, which stories get read, how people move
                    through the site, so we can make it better over time.
                </p>
                <p>
                    <strong>Functionality and preference cookies:</strong> These remember choices
                    you&apos;ve made, so you don&apos;t have to reset them every time you visit.
                </p>
                <p>
                    <strong>Advertising and measurement cookies:</strong> If {SITE.name} runs
                    advertising, these help us understand how ads perform and avoid showing you
                    the same one repeatedly. We&apos;ll only use these if and when advertising is
                    actually part of the site.
                </p>
                <p>
                    <strong>Embedded content:</strong> Some of our stories may include embedded
                    content from other platforms, like a video or a social post. These embeds may
                    set their own cookies, governed by that platform&apos;s own policy, not ours.
                </p>

                <h2>3. Our Current Cookie Table</h2>
                <p>
                    We use cookies to keep {SITE.name} running smoothly and to understand how
                    readers engage with our content. A detailed table listing each cookie in use,
                    along with its provider, purpose, type, and duration, will be published here
                    shortly and kept current as our tools change over time.
                </p>

                <h2>4. Your Choices</h2>
                <p>
                    You remain in control of how cookies are used during your visit. Most web
                    browsers allow you to accept, block, or delete cookies through their settings.
                    You can also change these settings at any time if your preferences change.
                </p>
                <p>
                    Where required by law, we will display a cookie consent banner when you first
                    visit our website. This allows you to accept all cookies, reject non-essential
                    cookies, or customize your preferences before cookies are placed on your
                    device. You can update your cookie preferences at any time by revisiting the
                    consent settings or adjusting your browser settings.
                </p>

                <h2>5. What Happens If You Block Cookies</h2>
                <p>
                    The site will still work if you block non-essential cookies. That said, some
                    features may not function as smoothly, for example, we may not be able to
                    remember your preferences between visits.
                </p>

                <h2>6. Regional Rights</h2>
                <p>
                    Depending on where you live, you may have specific legal rights around cookies
                    and tracking technologies, including the right to withdraw consent at any
                    time. We&apos;ll honor those rights wherever they apply.
                </p>

                <h2>7. Related Policy</h2>
                <p>
                    For more on how we handle your personal information more broadly, see our{' '}
                    <Link href="/privacy">Privacy Policy</Link>.
                </p>

                <h2>8. Contact Us</h2>
                <p>
                    Questions about this Cookie Policy? Reach out through our{' '}
                    <Link href="/contact">Contact Page</Link>.
                </p>
            </div>
        </article>
    )
}
