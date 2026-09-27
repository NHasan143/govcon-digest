/* Seeds Govcon Digest with placeholder editorial content.
 *
 *   node --env-file=.env --import tsx scripts/seed-govcon.ts
 *   node --env-file=.env --import tsx scripts/seed-govcon.ts --reset
 *
 * Creates a full run of published posts across all seven sections and their
 * twenty-one subsections — enough to fill the homepage (hero, Today's
 * Highlights, Editor's Picked and every section rail) and to give each
 * category hub more than one page.
 *
 * Cover art is GENERATED, not photographic (scripts/lib/cover-art.ts): every
 * image lands at an identical 3:2, which is what keeps the card grids aligned,
 * and each one is drawn in its section's accent colour.
 *
 * IMPORTANT: every article below is PLACEHOLDER COPY. Companies, figures and
 * events are invented to demonstrate layout; replace this with real reporting
 * before the site goes live. `--reset` deletes everything this script created
 * (matched by slug) so it can be re-run cleanly.
 *
 * Idempotent without --reset: existing slugs are skipped.
 */
import crypto from 'crypto'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'
import { slugify } from '../payload/utils/formatSlug'
import { CATEGORY_TREE, getSection } from '../lib/categories'
import type { Post } from '../payload-types'
import { VARIANTS, renderAvatar, renderCover, shade } from './lib/cover-art'

type SeedPost = {
    title: string
    excerpt: string
    category: Post['category']
    author: string
    tags: string[]
}

const AUTHORS: Record<string, { name: string; email: string; color: string }> = {
    dana: { name: 'Dana Whitfield', email: 'dana.whitfield@govcondigest.com', color: '#1d4e89' },
    marcus: { name: 'Marcus Reyes', email: 'marcus.reyes@govcondigest.com', color: '#2f5d3a' },
    priya: { name: 'Priya Raman', email: 'priya.raman@govcondigest.com', color: '#5b3a8e' },
    ellis: { name: 'Ellis Vance', email: 'ellis.vance@govcondigest.com', color: '#8a2f3b' },
    joanna: { name: 'Joanna Bright', email: 'joanna.bright@govcondigest.com', color: '#0f6470' },
    theo: { name: 'Theo Grant', email: 'theo.grant@govcondigest.com', color: '#8a5a1f' },
    naomi: { name: 'Naomi Clarke', email: 'naomi.clarke@govcondigest.com', color: '#4a4a55' },
}

/* Posts are listed newest-first; publishedAt is spaced backwards from now, so
   this order is exactly the order the homepage fills its slots in. The list is
   interleaved across sections on purpose — otherwise the hero and the two
   chronological blocks above the section rails would all come from one desk. */
const POSTS: SeedPost[] = [
    // ---------------------------------------------------------------- newest
    {
        title: 'Agencies Race to Close Out a Record Fourth Quarter as Obligations Pile Up',
        excerpt:
            'Contracting shops are working through an unusually heavy backlog in the final weeks of the fiscal year, and industry is warning that the crush will push award dates into the next quarter.',
        category: 'federal-procurement',
        author: 'dana',
        tags: ['Fiscal Year', 'Obligations'],
    },
    {
        title: 'Pentagon Sharpens Its Software Pathway as Programs Move Off Legacy Milestones',
        excerpt:
            'A revised acquisition guide gives program offices more room to field capability in increments, and defense primes are restructuring bid teams to match.',
        category: 'defense-contracts',
        author: 'marcus',
        tags: ['Acquisition', 'Software'],
    },
    {
        title: 'Federal AI Buying Shifts From Pilots to Production Contracts',
        excerpt:
            'After two years of prototypes, agencies are writing requirements for sustained operations — with evaluation, monitoring and rollback plans written into the statement of work.',
        category: 'federal-ai',
        author: 'priya',
        tags: ['Artificial Intelligence', 'Procurement'],
    },
    {
        title: 'Zero Trust Deadlines Slip as Agencies Confront Identity Debt',
        excerpt:
            'Identity consolidation is proving to be the long pole. Several departments now expect to miss internal milestones even as the policy target holds.',
        category: 'federal-cybersecurity',
        author: 'ellis',
        tags: ['Zero Trust', 'Identity'],
    },
    {
        title: 'The Quiet Rewrite of Federal Data Standards Nobody Budgeted For',
        excerpt:
            'New interoperability expectations are landing on systems that were modernized only three years ago, and the cost of re-platforming is falling to integrators.',
        category: 'government-data',
        author: 'joanna',
        tags: ['Data', 'Standards'],
    },
    {
        title: 'GovCon Valuations Hold Up Even as Deal Volume Cools',
        excerpt:
            'Buyers are paying premiums for cleared workforces and incumbent positions on long-cycle vehicles, keeping multiples stable through a thinner quarter.',
        category: 'govcon-financials',
        author: 'theo',
        tags: ['M&A', 'Valuations'],
    },
    {
        title: 'A New Generation of Program Executives Takes Over the Biggest Portfolios',
        excerpt:
            'A wave of retirements has moved a cohort of career acquisition officials into roles that will shape the next decade of federal buying.',
        category: 'federal-leadership',
        author: 'naomi',
        tags: ['Leadership', 'Careers'],
    },
    {
        title: 'Protest Filings Climb as Bidders Challenge Evaluation Records',
        excerpt:
            'Debriefing disputes are driving a larger share of filings, and contracting officers are being told to document tradeoff decisions in far more detail.',
        category: 'contracts-awards',
        author: 'dana',
        tags: ['Protests', 'Evaluations'],
    },
    {
        title: 'Meridian Systems Wins a Multi-Year Enterprise Support Recompete',
        excerpt:
            'The award consolidates work previously split across four task orders and sets a template other agencies are expected to follow.',
        category: 'contracts-awards',
        author: 'dana',
        tags: ['Awards', 'Recompete'],
    },
    {
        title: 'Small Business Goaling Gets Its Toughest Test in Years',
        excerpt:
            'Consolidated vehicles are squeezing the set-aside pipeline, and advocates are pressing agencies to break requirements back out.',
        category: 'small-business-contracting',
        author: 'dana',
        tags: ['Small Business', 'Set-Asides'],
    },
    {
        title: 'Autonomy Programs Move From Demonstration to Sustained Fielding',
        excerpt:
            'Uncrewed systems that spent years in experimentation are being written into force structure, bringing sustainment contracts with them.',
        category: 'military-technology',
        author: 'marcus',
        tags: ['Autonomy', 'Fielding'],
    },
    {
        title: 'Supply Chain Rules Reshape How Primes Vet Their Lower Tiers',
        excerpt:
            'Flow-down requirements now reach further into the subcontractor base than most compliance programs were built to handle.',
        category: 'national-security',
        author: 'marcus',
        tags: ['Supply Chain', 'Compliance'],
    },
    {
        title: 'Calder Defense Analytics Raises a Late Round on Federal Momentum',
        excerpt:
            'The company says its government business now outpaces commercial, a reversal that is becoming common across the AI vendor landscape.',
        category: 'ai-companies',
        author: 'priya',
        tags: ['Funding', 'AI Vendors'],
    },
    {
        title: 'Evaluating AI Bids Is Harder Than Writing Them',
        excerpt:
            'Source selection boards are struggling to compare proposals whose performance claims rest on datasets the government cannot inspect.',
        category: 'ai-contracts',
        author: 'priya',
        tags: ['Source Selection', 'AI'],
    },
    {
        title: 'Threat Actors Turn to Trusted Vendor Channels',
        excerpt:
            'Intrusions increasingly arrive through legitimate integration paths, which is exactly where monitoring coverage is thinnest.',
        category: 'cyber-threats',
        author: 'ellis',
        tags: ['Threats', 'Third Party'],
    },
    {
        title: 'Cyber Incident Reporting Rules Land on Contractors First',
        excerpt:
            'The compliance burden of faster reporting windows is falling disproportionately on mid-tier firms without dedicated security operations.',
        category: 'cyber-policy',
        author: 'ellis',
        tags: ['Policy', 'Reporting'],
    },
    {
        title: 'Legacy Modernization Budgets Are Being Redirected Mid-Stream',
        excerpt:
            'Agencies are reallocating modernization money toward stabilization as older systems fail faster than replacement schedules assumed.',
        category: 'it-modernization',
        author: 'joanna',
        tags: ['Modernization', 'Budget'],
    },
    {
        title: 'Contractor Reporting Requirements Expand Again',
        excerpt:
            'Three separate rulemakings add overlapping disclosures, and industry groups are asking for a single consolidated submission.',
        category: 'contractor-policy',
        author: 'joanna',
        tags: ['Regulation', 'Reporting'],
    },
    {
        title: 'Defense-Exposed Equities Outperform a Flat Market',
        excerpt:
            'Investors are rewarding backlog visibility, and the gap between services and platform names has widened over the quarter.',
        category: 'markets',
        author: 'theo',
        tags: ['Markets', 'Equities'],
    },
    {
        title: 'Working Capital Is the Constraint Nobody Talks About',
        excerpt:
            'Slower invoice cycles are forcing smaller primes to finance performance out of pocket, and some are turning down work because of it.',
        category: 'corporate-finance',
        author: 'theo',
        tags: ['Cash Flow', 'Finance'],
    },
    {
        title: 'Two Industry Veterans Move Into Chief Growth Roles',
        excerpt:
            'The appointments continue a pattern of capture leaders being elevated as firms reorganize around fewer, larger pursuits.',
        category: 'govcon-leadership',
        author: 'naomi',
        tags: ['Appointments', 'Growth'],
    },
    {
        title: 'The Cleared Workforce Shortage Is Now a Bid Risk',
        excerpt:
            'Staffing assumptions are being scrutinized in evaluations after a run of awards where the winning team could not staff on schedule.',
        category: 'workforce-leadership',
        author: 'naomi',
        tags: ['Workforce', 'Clearances'],
    },

    // ------------------------------------------------------------- next tier
    {
        title: 'Task Order Competition Tightens on the Largest Vehicles',
        excerpt:
            'More holders are bidding more often, and win rates on the biggest governmentwide vehicles have fallen for a third straight period.',
        category: 'federal-procurement',
        author: 'dana',
        tags: ['Task Orders', 'Competition'],
    },
    {
        title: 'Agencies Test Shorter Proposal Windows to Speed Awards',
        excerpt:
            'Pilot solicitations cut response time in half. Industry says quality suffers; contracting officials say the schedule has to give somewhere.',
        category: 'federal-procurement',
        author: 'dana',
        tags: ['Solicitations', 'Schedule'],
    },
    {
        title: 'A Consolidated Services Award Redraws the Incumbent Map',
        excerpt:
            'Four incumbents become one, and the transition plan has become the most scrutinized part of the award record.',
        category: 'contracts-awards',
        author: 'dana',
        tags: ['Consolidation', 'Transition'],
    },
    {
        title: 'Mentor-Protégé Agreements Draw Fresh Scrutiny',
        excerpt:
            'Reviewers are asking harder questions about whether protégés are gaining real capability or serving as a pass-through.',
        category: 'small-business-contracting',
        author: 'dana',
        tags: ['Mentor-Protégé', 'Oversight'],
    },
    {
        title: 'Set-Aside Thresholds Are Pushing Firms to Delay Growth',
        excerpt:
            'Size-standard cliffs are shaping hiring decisions, with several firms openly managing revenue to stay eligible another year.',
        category: 'small-business-contracting',
        author: 'dana',
        tags: ['Size Standards', 'Small Business'],
    },
    {
        title: 'Munitions Capacity Becomes the Defining Industrial Question',
        excerpt:
            'Multi-year procurement authority has been granted; the constraint has moved to tooling, workforce and long-lead components.',
        category: 'defense-contracts',
        author: 'marcus',
        tags: ['Industrial Base', 'Munitions'],
    },
    {
        title: 'Shipbuilding Schedules Slip Again as Labor Gaps Widen',
        excerpt:
            'Yards are competing with one another for the same trades, and the delivery dates in program baselines are losing credibility.',
        category: 'defense-contracts',
        author: 'marcus',
        tags: ['Shipbuilding', 'Workforce'],
    },
    {
        title: 'Counter-Drone Requirements Outrun the Acquisition System',
        excerpt:
            'Units are fielding capability faster than programs of record can absorb it, creating a sustainment question nobody owns.',
        category: 'military-technology',
        author: 'marcus',
        tags: ['Counter-UAS', 'Requirements'],
    },
    {
        title: 'Space Ground Segments Get the Attention Payloads Used to Get',
        excerpt:
            'Investment is shifting toward the terrestrial half of space architectures, where most current capability gaps actually sit.',
        category: 'military-technology',
        author: 'marcus',
        tags: ['Space', 'Ground Segment'],
    },
    {
        title: 'Allied Co-Production Deals Change the Export Calculus',
        excerpt:
            'Licensing and technology transfer terms are becoming as important to a bid as price and past performance.',
        category: 'national-security',
        author: 'marcus',
        tags: ['Exports', 'Allies'],
    },
    {
        title: 'Model Evaluation Becomes a Contract Deliverable',
        excerpt:
            'Agencies are asking vendors to deliver evaluation harnesses alongside models, shifting testing from a claim to an artifact.',
        category: 'federal-ai',
        author: 'priya',
        tags: ['Evaluation', 'AI'],
    },
    {
        title: 'Agencies Standardize on a Narrower Set of AI Platforms',
        excerpt:
            'Consolidation is under way as departments trade breadth of experimentation for something their security teams can actually accredit.',
        category: 'federal-ai',
        author: 'priya',
        tags: ['Platforms', 'Accreditation'],
    },
    {
        title: 'Data Rights Become the Sticking Point in AI Awards',
        excerpt:
            'Negotiations are stalling over who owns fine-tuned weights and the government data used to produce them.',
        category: 'ai-contracts',
        author: 'priya',
        tags: ['Data Rights', 'Negotiation'],
    },
    {
        title: 'Commercial AI Firms Find the Federal On-Ramp Narrower Than Advertised',
        excerpt:
            'Authorization timelines are the gate. Firms that budgeted two quarters for compliance are finding it takes considerably longer.',
        category: 'ai-companies',
        author: 'priya',
        tags: ['FedRAMP', 'Vendors'],
    },
    {
        title: 'Continuous Monitoring Programs Confront an Alert Volume Problem',
        excerpt:
            'Coverage has expanded faster than the analyst workforce, and triage backlogs are becoming the measurable risk.',
        category: 'federal-cybersecurity',
        author: 'ellis',
        tags: ['Monitoring', 'SOC'],
    },
    {
        title: 'Software Attestation Requirements Reach the Subcontractor Tier',
        excerpt:
            'Primes are discovering that their own attestations depend on evidence their suppliers have never been asked to produce.',
        category: 'federal-cybersecurity',
        author: 'ellis',
        tags: ['Software Supply Chain', 'Attestation'],
    },
    {
        title: 'A Federal Cyber Workforce Plan Meets Private-Sector Pay',
        excerpt:
            'Special hiring authorities have helped at the margins, but retention remains the number agencies cannot move.',
        category: 'cyber-policy',
        author: 'ellis',
        tags: ['Workforce', 'Hiring'],
    },
    {
        title: 'Ransomware Groups Shift Toward Service Providers',
        excerpt:
            'Targeting managed providers multiplies reach, and government customers are frequently the downstream casualty.',
        category: 'cyber-threats',
        author: 'ellis',
        tags: ['Ransomware', 'MSP'],
    },
    {
        title: 'Cloud Exit Costs Are Reshaping Modernization Business Cases',
        excerpt:
            'Agencies that moved first are now pricing what it would take to move again, and the answer is changing procurement strategy.',
        category: 'it-modernization',
        author: 'joanna',
        tags: ['Cloud', 'Lock-In'],
    },
    {
        title: 'Mainframe Replacement Programs Are Being Rescoped, Not Cancelled',
        excerpt:
            'The pattern is consistent across departments: narrow the scope, protect the interfaces, and extend the timeline.',
        category: 'it-modernization',
        author: 'joanna',
        tags: ['Legacy', 'Rescope'],
    },
    {
        title: 'Open Data Commitments Collide With Privacy Reviews',
        excerpt:
            'Publication schedules are slipping as disclosure review catches datasets that were cleared under older standards.',
        category: 'government-data',
        author: 'joanna',
        tags: ['Open Data', 'Privacy'],
    },
    {
        title: 'Agencies Struggle to Inventory the Data They Already Hold',
        excerpt:
            'Cataloguing efforts keep surfacing systems of record that no current office claims ownership of.',
        category: 'government-data',
        author: 'joanna',
        tags: ['Data Governance', 'Inventory'],
    },
    {
        title: 'Compliance Costs Are Now a Line Item Bidders Price Openly',
        excerpt:
            'What used to be absorbed as overhead is appearing in proposals as a discrete cost, and evaluators are having to account for it.',
        category: 'contractor-policy',
        author: 'joanna',
        tags: ['Compliance', 'Pricing'],
    },
    {
        title: 'Quarterly Results Show Services Margins Holding',
        excerpt:
            'Cost discipline and a better labor mix offset softer award activity, though guidance across the sector stayed cautious.',
        category: 'govcon-financials',
        author: 'theo',
        tags: ['Earnings', 'Margins'],
    },
    {
        title: 'Backlog Quality Is Displacing Backlog Size in Investor Calls',
        excerpt:
            'Funded versus unfunded composition is getting more airtime than headline totals, and disclosure practice is starting to follow.',
        category: 'govcon-financials',
        author: 'theo',
        tags: ['Backlog', 'Disclosure'],
    },
    {
        title: 'Private Equity Keeps Buying the Middle of the Market',
        excerpt:
            'Sponsors are assembling mid-tier platforms around specific agency footprints rather than chasing scale for its own sake.',
        category: 'corporate-finance',
        author: 'theo',
        tags: ['Private Equity', 'M&A'],
    },
    {
        title: 'Rate Expectations Reset the Math on Sector Deals',
        excerpt:
            'Financing assumptions made eighteen months ago are being reworked, and a handful of processes have been paused outright.',
        category: 'markets',
        author: 'theo',
        tags: ['Rates', 'Deals'],
    },
    {
        title: 'A Career Acquisition Official Takes a Department-Wide Role',
        excerpt:
            'The appointment puts a longtime program executive in charge of policy that will touch every major buying office.',
        category: 'federal-leadership',
        author: 'naomi',
        tags: ['Appointments', 'Policy'],
    },
    {
        title: 'Chief Data Officers Are Being Handed the AI Portfolio Too',
        excerpt:
            'The consolidation gives one office end-to-end ownership, and gives industry a single accountable counterpart.',
        category: 'federal-leadership',
        author: 'naomi',
        tags: ['CDO', 'AI Governance'],
    },
    {
        title: 'Two Mid-Tier Primes Name New Chief Executives',
        excerpt:
            'Both boards went outside the company, a shift from a sector that has historically promoted from within.',
        category: 'govcon-leadership',
        author: 'naomi',
        tags: ['CEO', 'Boards'],
    },
    {
        title: 'Return-to-Office Rules Are Reshaping Contractor Recruiting',
        excerpt:
            'Firms competing for the same cleared talent are finding that site policy now decides offers as often as compensation does.',
        category: 'workforce-leadership',
        author: 'naomi',
        tags: ['Hiring', 'Workplace'],
    },
    {
        title: 'Apprenticeship Programs Return to the Industrial Base',
        excerpt:
            'Manufacturers are rebuilding pipelines they cut a decade ago, and some are asking the government to help fund them.',
        category: 'workforce-leadership',
        author: 'naomi',
        tags: ['Apprenticeships', 'Manufacturing'],
    },

    // -------------------------------------------------------------- back file
    {
        title: 'Bridge Contracts Are Becoming the Default, Not the Exception',
        excerpt:
            'Extensions intended to cover a short gap are running for years, and oversight offices have started asking why.',
        category: 'federal-procurement',
        author: 'dana',
        tags: ['Bridge Contracts', 'Oversight'],
    },
    {
        title: 'Past Performance Records Are Getting a Second Look',
        excerpt:
            'Evaluators are reaching further back and weighing relevance more heavily, which changes who is competitive on large recompetes.',
        category: 'contracts-awards',
        author: 'dana',
        tags: ['Past Performance', 'Evaluation'],
    },
    {
        title: 'Joint Ventures Give Small Firms a Path Onto Larger Vehicles',
        excerpt:
            'Structured correctly they open doors; structured carelessly they create affiliation problems that surface at the worst moment.',
        category: 'small-business-contracting',
        author: 'dana',
        tags: ['Joint Ventures', 'Affiliation'],
    },
    {
        title: 'Sustainment Costs Are Outgrowing Procurement Budgets',
        excerpt:
            'Older fleets are consuming a rising share of accounts that were meant to pay for replacement capability.',
        category: 'defense-contracts',
        author: 'marcus',
        tags: ['Sustainment', 'Budget'],
    },
    {
        title: 'Open Architecture Mandates Are Finally Being Enforced',
        excerpt:
            'Interface requirements that were aspirational in past solicitations are now evaluated criteria with documentation to match.',
        category: 'military-technology',
        author: 'marcus',
        tags: ['Open Architecture', 'Standards'],
    },
    {
        title: 'Critical Minerals Dependencies Reach Deeper Than Expected',
        excerpt:
            'Mapping exercises keep finding single points of failure several tiers below where programs thought their exposure ended.',
        category: 'national-security',
        author: 'marcus',
        tags: ['Critical Minerals', 'Risk'],
    },
    {
        title: 'Inference Costs Force a Rethink of Federal AI Architectures',
        excerpt:
            'Programs that priced pilots on burst usage are discovering that sustained operation changes the economics entirely.',
        category: 'federal-ai',
        author: 'priya',
        tags: ['Cost', 'Architecture'],
    },
    {
        title: 'Agencies Write Human Review Into AI Statements of Work',
        excerpt:
            'Oversight steps are being specified as deliverables rather than left to policy, giving contracting officers something enforceable.',
        category: 'ai-contracts',
        author: 'priya',
        tags: ['Human Oversight', 'SOW'],
    },
    {
        title: 'AI Startups Are Hiring Capture Teams Before Sales Teams',
        excerpt:
            'The sequencing tells you how hard the federal market is to enter, and how much of the work happens before a solicitation exists.',
        category: 'ai-companies',
        author: 'priya',
        tags: ['Capture', 'Startups'],
    },
    {
        title: 'Legacy Authentication Remains the Most Exploited Weak Point',
        excerpt:
            'Migration off older protocols is slow because the systems depending on them are the ones nobody is authorized to break.',
        category: 'federal-cybersecurity',
        author: 'ellis',
        tags: ['Authentication', 'Legacy'],
    },
    {
        title: 'Harmonizing Cyber Rules Proves Harder Than Writing Them',
        excerpt:
            'Overlapping frameworks impose similar controls through incompatible evidence requirements, and contractors pay for the difference.',
        category: 'cyber-policy',
        author: 'ellis',
        tags: ['Harmonization', 'Frameworks'],
    },
    {
        title: 'Intrusion Dwell Times Fall, but Detection Still Comes From Outside',
        excerpt:
            'The headline metric improved. The uncomfortable detail is how often notification still arrives from a third party.',
        category: 'cyber-threats',
        author: 'ellis',
        tags: ['Detection', 'Incident Response'],
    },
    {
        title: 'Shared Services Adoption Picks Up Where Budgets Are Tightest',
        excerpt:
            'Agencies with the least room to invest are moving fastest, reversing the usual pattern of modernization adoption.',
        category: 'it-modernization',
        author: 'joanna',
        tags: ['Shared Services', 'Budget'],
    },
    {
        title: 'Records Retention Rules Complicate Cloud Migrations',
        excerpt:
            'Retention schedules written for physical storage are being applied to architectures that were never designed around them.',
        category: 'government-data',
        author: 'joanna',
        tags: ['Records', 'Cloud'],
    },
    {
        title: 'Subcontracting Plans Face Tighter Enforcement',
        excerpt:
            'Reported shortfalls are drawing follow-up that used to be rare, and primes are revisiting how they document good-faith effort.',
        category: 'contractor-policy',
        author: 'joanna',
        tags: ['Subcontracting', 'Enforcement'],
    },
    {
        title: 'Debt Maturities Loom for Sponsor-Backed Contractors',
        excerpt:
            'A cluster of refinancings arrives over the next eighteen months into a market that has repriced substantially.',
        category: 'corporate-finance',
        author: 'theo',
        tags: ['Debt', 'Refinancing'],
    },
    {
        title: 'Index Rebalancing Shifts Exposure Across the Sector',
        excerpt:
            'Passive flows are moving between names for reasons that have nothing to do with contract performance.',
        category: 'markets',
        author: 'theo',
        tags: ['Indices', 'Flows'],
    },
    {
        title: 'Book-to-Bill Ratios Tell Two Different Stories',
        excerpt:
            'Services and platform businesses are diverging sharply, and a blended sector figure now obscures more than it reveals.',
        category: 'govcon-financials',
        author: 'theo',
        tags: ['Book-to-Bill', 'Analysis'],
    },
    {
        title: 'Agency CIO Turnover Reaches a Multi-Year High',
        excerpt:
            'Departures are concentrated among officials who led pandemic-era modernization, taking institutional memory with them.',
        category: 'federal-leadership',
        author: 'naomi',
        tags: ['CIO', 'Turnover'],
    },
    {
        title: 'Boards Add Operators as Cyber Oversight Expectations Rise',
        excerpt:
            'Directors with hands-on security backgrounds are being recruited into seats that used to go to finance and policy veterans.',
        category: 'govcon-leadership',
        author: 'naomi',
        tags: ['Boards', 'Governance'],
    },
    {
        title: 'Clearance Processing Times Improve, With a Catch',
        excerpt:
            'Initial investigations are moving faster; the reciprocity step between agencies is where candidates still lose months.',
        category: 'workforce-leadership',
        author: 'naomi',
        tags: ['Clearances', 'Reciprocity'],
    },
]

/* ---------------------------------------------------------------- Lexical */

const text = (t: string) => ({
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: t,
    type: 'text',
    version: 1,
})
const p = (t: string) => ({
    type: 'paragraph',
    version: 1,
    textFormat: 0,
    children: [text(t)],
    direction: 'ltr',
    format: '',
    indent: 0,
})
const h2 = (t: string) => ({
    type: 'heading',
    tag: 'h2',
    version: 1,
    children: [text(t)],
    direction: 'ltr',
    format: '',
    indent: 0,
})
const quote = (t: string) => ({
    type: 'quote',
    version: 1,
    children: [text(t)],
    direction: 'ltr',
    format: '',
    indent: 0,
})
const hr = () => ({ type: 'horizontalrule', version: 1 })
const uploadNode = (mediaId: number) => ({
    type: 'upload',
    version: 3,
    relationTo: 'media',
    value: mediaId,
    fields: null,
    format: '',
})

const buildContent = (post: SeedPost, mediaId: number, sectionName: string) => ({
    root: {
        type: 'root',
        version: 1,
        direction: 'ltr',
        format: '' as const,
        indent: 0,
        children: [
            p(post.excerpt),
            hr(),
            p(
                'This article is placeholder content used to build out the Govcon Digest layout. The companies, figures and events described here are illustrative and are not reporting on real transactions.',
            ),
            h2('Why it matters'),
            p(
                `Decisions in ${sectionName.toLowerCase()} rarely land in a single announcement. They accumulate through solicitations, policy memos and the quiet renegotiation of terms — which is why the trend lines matter more than any individual award.`,
            ),
            uploadNode(mediaId),
            quote(post.excerpt),
            h2('What to watch next'),
            p(
                `We will keep following ${post.tags.join(' and ')} as this develops, and will update the piece as the details firm up. For continuing coverage, follow the ${sectionName} section.`,
            ),
        ],
    },
})

/* ------------------------------------------------------------------ seeding */

/* Cover art palette.
 *
 * A rail shows four or five covers side by side, so they have to read as a
 * set without looking duplicated. Hue comes from the section (the rail is
 * recognisably "Defense green"), lightness is stepped by subsection so
 * neighbouring cards separate, and the pattern family is assigned round-robin
 * by position rather than hashed from the slug — hashing left whole rails
 * drawing the same figure. */
const colorFor = (categorySlug: string): string => {
    const section = getSection(categorySlug)
    if (!section) return '#1d4e89'
    const childIndex = section.children.findIndex((c) => c.slug === categorySlug)
    // -1 (the section itself) → base colour; children step lighter/darker.
    const steps = [0, 0.14, -0.12, 0.07]
    return shade(section.color, steps[(childIndex + 1) % steps.length])
}

const variantAt = (index: number) => VARIANTS[index % VARIANTS.length]

const initialsOf = (name: string) =>
    name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')

const run = async () => {
    const reset = process.argv.includes('--reset')
    const payload: Payload = await getPayload({ config })

    // Sanity-check the fixture against the live registry before writing
    // anything — a typo in a category slug would otherwise fail 80 times.
    const validSlugs = new Set(
        CATEGORY_TREE.flatMap((s) => [s.slug, ...s.children.map((c) => c.slug)]),
    )
    const bad = POSTS.filter((post) => !validSlugs.has(post.category))
    if (bad.length > 0) {
        console.error('Unknown category slugs:', [...new Set(bad.map((b) => b.category))].join(', '))
        process.exit(1)
    }

    if (reset) {
        const slugs = POSTS.map((post) => slugify(post.title))
        const { docs } = await payload.find({
            collection: 'posts',
            where: { slug: { in: slugs } },
            limit: 500,
            overrideAccess: true,
        })
        for (const doc of docs) {
            await payload.delete({ collection: 'posts', id: doc.id, overrideAccess: true })
        }

        // Covers too — they are regenerated from the art settings, so leaving
        // them behind would make a palette or pattern change a no-op.
        const media = await payload.find({
            collection: 'media',
            where: { filename: { like: 'cover-' } },
            limit: 500,
            overrideAccess: true,
        })
        const seeded = media.docs.filter((m) => m.filename?.startsWith('cover-'))
        for (const doc of seeded) {
            await payload.delete({ collection: 'media', id: doc.id, overrideAccess: true })
        }
        console.log(`reset — ${docs.length} posts and ${seeded.length} covers removed`)
    }

    // Authors (reused by email; each gets a generated portrait)
    const authorIds: Record<string, number> = {}
    for (const [key, a] of Object.entries(AUTHORS)) {
        const existing = await payload.find({
            collection: 'users',
            where: { email: { equals: a.email } },
            limit: 1,
            overrideAccess: true,
        })
        if (existing.docs[0]) {
            authorIds[key] = existing.docs[0].id
            continue
        }
        const user = await payload.create({
            collection: 'users',
            data: {
                email: a.email,
                password: crypto.randomBytes(16).toString('base64url'),
                name: a.name,
                slug: slugify(a.name),
                role: 'editor',
            },
            overrideAccess: true,
        })
        authorIds[key] = user.id
        console.log(`author created: ${a.name}`)
    }

    // Media — one generated cover per post, keyed by slug so re-runs reuse it
    const uploadCover = async (slug: string, title: string, categorySlug: string, index: number) => {
        const filename = `cover-${slug}.jpg`.slice(0, 120)
        const existing = await payload.find({
            collection: 'media',
            where: { filename: { equals: filename } },
            limit: 1,
            overrideAccess: true,
        })
        if (existing.docs[0]) return existing.docs[0].id

        const buffer = await renderCover(slug, colorFor(categorySlug), variantAt(index))
        const media = await payload.create({
            collection: 'media',
            data: { alt: title },
            file: {
                data: buffer,
                mimetype: 'image/jpeg',
                name: filename,
                size: buffer.length,
            },
            overrideAccess: true,
        })
        return media.id
    }

    // Posts — newest first, spaced ~5 hours apart going backwards
    const now = Date.now()
    let created = 0
    let skipped = 0

    for (const [index, post] of POSTS.entries()) {
        const slug = slugify(post.title)
        const existing = await payload.find({
            collection: 'posts',
            where: { slug: { equals: slug } },
            limit: 1,
            overrideAccess: true,
        })
        if (existing.docs[0]) {
            skipped++
            continue
        }

        const section = getSection(post.category)
        const mediaId = await uploadCover(slug, post.title, post.category, index)

        await payload.create({
            collection: 'posts',
            data: {
                title: post.title,
                slug,
                category: post.category,
                excerpt: post.excerpt,
                author: authorIds[post.author],
                publishedAt: new Date(now - index * 5 * 60 * 60 * 1000).toISOString(),
                coverImage: mediaId,
                tags: post.tags.map((tag) => ({ tag })),
                seo: { metaTitle: post.title, metaDescription: post.excerpt },
                content: buildContent(post, mediaId, section?.name ?? 'Govcon Digest') as any, // eslint-disable-line @typescript-eslint/no-explicit-any
                _status: 'published',
            },
            overrideAccess: true,
        })
        created++
        if (created % 10 === 0) console.log(`  …${created} posts`)
    }

    console.log(`done — ${created} posts created, ${skipped} skipped (already present)`)
    console.log('NOTE: all seeded articles are placeholder copy — replace before launch.')
    process.exit(0)
}

// Avatar generation is exported for reuse but not run by default; author pages
// fall back to initials when no portrait is set.
export { renderAvatar, initialsOf }

run().catch((e) => {
    console.error(e)
    process.exit(1)
})
