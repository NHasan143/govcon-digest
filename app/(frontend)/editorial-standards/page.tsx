/* Editorial Standards & Corrections: /editorial-standards/ — indexed. Copy from
   the owner's "Morning Glance Pages" doc. */
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
    // Explicit site-name suffix — see the note in privacy/page.tsx.
    title: `Editorial Standards & Corrections | ${SITE.name}`,
    description: `See how ${SITE.name} selects, sources, verifies, updates, and corrects stories—and how we use AI while keeping human editors accountable.`,
    keywords: [
        `${SITE.name} editorial standards`,
        'corrections policy',
        'fact-checking process',
        'sourcing standards',
        'editorial independence',
        'AI policy',
        'human review',
    ],
    alternates: { canonical: '/editorial-standards' },
}

export default function EditorialStandardsPage() {
    return (
        <article className="entry-wraper mb-50 mt-50">
            <div className="entry-header entry-header-style-1 mb-30 pt-30">
                <h1 className="entry-title mb-20 font-weight-900">
                    Editorial Standards &amp; Corrections
                </h1>
                <p className="text-muted font-small">Effective Date: July 27, 2026</p>
            </div>
            <div className="entry-main-content">
                <p>
                    {SITE.name} was created to help busy, curious readers stay informed without
                    any spin, without fillers, and without asking for more of your time than
                    necessary.
                </p>
                <p>
                    This page lays out the {SITE.name} editorial standards including how we
                    choose, verify, write, and correct our journalism, along with our corrections
                    policy. We have also mentioned our approach to {SITE.name} fact-checking, so
                    you know exactly what to expect from us every time you open an issue.
                </p>

                <h2>1. Our Mission and Audience</h2>
                <p>
                    We write for readers whose schedules are tight but whose curiosity isn&apos;t.
                    Many important pieces take far longer to read than they need to. These
                    dedicated readers usually find themselves opening multiple articles before
                    they have a complete understanding of what actually happened. {SITE.name} was
                    created to provide that clarity in one place with the facts, context, and key
                    developments without unnecessary length.
                </p>

                <h2>2. Editorial Independence</h2>
                <p>
                    Our editorial decisions are made independently. Advertisers, sponsors, and
                    outside organizations have no influence over what we cover or how we cover it,
                    and no partner relationship ever determines what makes it into an issue. If we
                    ever run sponsored content, it&apos;s clearly labeled and kept separate from
                    our reporting, and it does not reflect our editorial team&apos;s judgment or
                    views.
                </p>

                <h2>3. Story Selection and Newsworthiness</h2>
                <p>
                    We prioritize stories that are genuinely important to our readers&apos; lives,
                    work, and understanding of the world, across AI &amp; automation, business
                    &amp; finance, the US economy, science &amp; technology, health &amp;
                    medicine, entertainment, and international affairs.
                </p>
                <p>
                    A piece earns a place in {SITE.name} only when it clears one of a few bars
                    like - it changes something readers need to plan around, it reveals a pattern
                    the wider news cycle hasn&apos;t connected yet, or it corrects a widely
                    repeated misconception.
                </p>
                <p>
                    We deliberately pass on stories that are already thoroughly covered everywhere
                    else unless we can bring - a different angle, a primary-source detail, a data
                    point, or context that adds real understanding rather than repeating
                    what&apos;s already out there.
                </p>

                <h2>4. Our Sourcing Hierarchy</h2>
                <p>
                    Not all sources carry equal weight, and we treat them accordingly, roughly in
                    this order of preference.
                </p>
                <p>
                    <strong>1. Primary sources first:</strong> Government data, regulatory
                    filings, company earnings reports, official statements, and original research
                    sit at the top of our sourcing hierarchy. Wherever possible, we go straight to
                    these rather than relying on some unsure sources.
                </p>
                <p>
                    <strong>2. Established reporting second:</strong> When we can&apos;t access a
                    primary source directly, we lean on reporting from outlets with a demonstrated
                    record of accuracy and independent verification.
                </p>
                <p>
                    <strong>3. Everything else, with caution:</strong> Social commentary,
                    unverified claims, and secondhand aggregation are treated as leads worth
                    checking, never as facts worth publishing on their own.
                </p>

                <h2>5. Verification and Fact-Checking</h2>
                <p>
                    Before anything goes live, we run it through a consistent {SITE.name}{' '}
                    fact-checking process.
                </p>
                <ul>
                    <li>
                        <strong>Quotes:</strong> checked against the original statement or
                        transcript, never rephrased in a way that changes meaning.
                    </li>
                    <li>
                        <strong>Names and titles:</strong> verified against an official or primary
                        source, not assumed from a prior article.
                    </li>
                    <li>
                        <strong>Dates:</strong> cross-checked against the original announcement,
                        filing, or event, since a wrong date can quietly turn an accurate piece
                        into a misleading one.
                    </li>
                    <li>
                        <strong>Numbers and figures:</strong> verified against the original data
                        release or filing, not carried over from a secondary summary that may have
                        rounded, misread, or miscalculated.
                    </li>
                    <li>
                        <strong>Product and company status:</strong> confirmed as current at time
                        of publication, since claims about pricing, availability, or company
                        standing can shift quickly and go stale fast.
                    </li>
                </ul>

                <h2>6. Anonymous Sources</h2>
                <p>
                    We prefer on-the-record sourcing wherever it&apos;s possible to get it. When
                    anonymity is significantly necessary, for instance to protect someone from
                    real professional or personal risk, we apply a high threshold before granting
                    it. Additionally, we explain to readers (where possible) why a source&apos;s
                    identity is being withheld rather than asking for blind trust.
                </p>

                <h2>7. Headlines, Images, and Attribution</h2>
                <p>
                    Our headlines are written to accurately reflect the story underneath them, not
                    to mislead, overstate, or bait a click that the story doesn&apos;t back up.
                    Images and other visual elements are chosen to represent the story honestly
                    rather than for shock value, and we credit and attribute every source clearly,
                    so you can always trace a claim back to where it came from.
                </p>

                <h2>8. Updates and Our Corrections Process</h2>
                <p>
                    News develops quickly, and new information can change the understanding of a
                    story. On the rare occasions we publish an error, we correct it promptly and
                    explain the update with complete transparency. The clearance is below:
                </p>
                <p>
                    <strong>1. Updates:</strong> When a story develops after publication, we
                    update it and note that an update was made.
                </p>
                <p>
                    <strong>2. Corrections:</strong> When we get something wrong, we fix it and
                    add a visible correction note directly on the piece, describing what changed
                    and when.
                </p>
                <p>
                    <strong>3. How to flag something:</strong> If you spot an error, you can
                    report it to us directly through our correction-request channel on our{' '}
                    <Link href="/contact">Contact Page</Link>, and we&apos;ll review it promptly.
                    We take every correction request seriously, whether it comes from a reader, a
                    source, or our own follow-up reporting.
                </p>

                <h2>9. Our Use of AI</h2>
                <p>
                    AI tools may assist us with research, drafting, and formatting, helping us
                    work efficiently and cover more ground for our readers.
                </p>
                <p>
                    <strong>1. What AI may help with:</strong> Research support, first-draft
                    structuring, and formatting.
                </p>
                <p>
                    <strong>2. What AI never does:</strong> Fabricate facts, quotes, sources,
                    statistics, or events. AI-assisted content is checked against the same
                    sourcing and verification standards as anything else we publish with no
                    exceptions.
                </p>
                <p>
                    <strong>3. Who&apos;s accountable:</strong> Every piece of AI-assisted content
                    is reviewed by a human editor before publication, and final editorial judgment
                    always rests with a person.
                </p>

                <h2>10. Human Accountability and Final Approval</h2>
                <p>
                    Every story published on {SITE.name} is reviewed and approved by our editorial
                    team before it goes live. Responsibility for what we publish rests with us,
                    not with any tool, source, or process involved in producing it. If something
                    is wrong, that responsibility is ours to own and fix.
                </p>

                <h2>11. Conflicts, Disclosures, and Outside Activity</h2>
                <p>
                    Our team discloses relevant conflicts of interest, including gifts,
                    investments, outside work, political activity, and any affiliation that could
                    reasonably influence our coverage. Where we cover a topic connected to one of
                    these, we aim to be upfront about it with readers rather than letting it go
                    unmentioned. Reporters and editors are expected to avoid situations where a
                    personal interest could reasonably be seen as shaping a story&apos;s outcome.
                </p>

                <h2>12. Sponsored, Affiliate, and Partner Content</h2>
                <p>
                    Any sponsored content, affiliate link, advertiser relationship, or paid
                    partnership is clearly labeled as such and kept fully separate from our
                    editorial reporting, consistent with our{' '}
                    <Link href="/terms">Terms of Use</Link>. Commercial relationships never
                    determine editorial coverage, and our reporting team operates independently of
                    our advertising and partnership relationships.
                </p>

                <h2>13. Plagiarism and Copyright</h2>
                <p>
                    All content published on {SITE.name} is original or properly attributed.
                    Unattributed copying or close paraphrasing of another outlet&apos;s work has
                    no place here, and neither does using someone else&apos;s original reporting,
                    data, or analysis without clear credit. We take copyright seriously, both in
                    respecting the work of others and in protecting our own.
                </p>

                <h2>14. Complaints and Escalation</h2>
                <p>
                    If you have a concern about something we&apos;ve published that a standard
                    correction request doesn&apos;t fully resolve, you can escalate it through our{' '}
                    <Link href="/contact">Contact Page</Link>, and our editorial team will review
                    it directly. We treat escalated complaints as seriously as first-time
                    correction requests, and every single one gets a real review.
                </p>

                <h2>15. Updates to This Page</h2>
                <p>
                    We may update these Editorial Standards from time to time to reflect changes
                    in our practices. Updates will be reflected with a revised effective date at
                    the top of this page.
                </p>
            </div>
        </article>
    )
}
