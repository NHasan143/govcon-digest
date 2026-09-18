/* Govcon Digest category system.
 *
 * Two levels: seven top-level sections, each with three subsections. Slugs are
 * FLAT and globally unique — a subsection lives at /{subSlug}/ exactly like a
 * section, so the existing /{category}/ hub and /{category}/{slug} article
 * routes cover both levels with no extra routing (and no collision between a
 * subsection path and an article path).
 *
 * The parent/child relationship is navigation + aggregation only:
 *   - the header renders the tree (hover dropdown per section)
 *   - a section hub and the homepage section rails show the parent's posts
 *     PLUS every child's, via getCategoryFamily()
 */

export type SubCategory = {
    slug: string
    name: string
}

export type ParentCategory = {
    slug: string
    name: string
    /** Shorter label for the header nav; falls back to `name`. */
    menuLabel?: string
    /** One-line hub/meta description. */
    blurb: string
    /** Accent colour — section rules, tags, generated cover art. */
    color: string
    children: SubCategory[]
}

export const CATEGORY_TREE: ParentCategory[] = [
    {
        slug: 'government-contracting',
        name: 'Government Contracting',
        menuLabel: 'Government Contracting',
        blurb: 'Awards, protests, vehicles and the business of selling to the federal government.',
        color: '#1d4e89',
        children: [
            { slug: 'contracts-awards', name: 'Contracts & Awards' },
            { slug: 'federal-procurement', name: 'Federal Procurement' },
            { slug: 'small-business-contracting', name: 'Small Business Contracting' },
        ],
    },
    {
        slug: 'defense',
        name: 'Defense',
        menuLabel: 'Defense',
        blurb: 'Pentagon programs, military technology and the industrial base behind them.',
        color: '#2f5d3a',
        children: [
            { slug: 'defense-contracts', name: 'Defense Contracts' },
            { slug: 'military-technology', name: 'Military Technology' },
            { slug: 'national-security', name: 'National Security' },
        ],
    },
    {
        slug: 'artificial-intelligence',
        name: 'Artificial Intelligence',
        menuLabel: 'Artificial Intelligence',
        blurb: 'How federal agencies and their contractors are buying, building and governing AI.',
        color: '#5b3a8e',
        children: [
            { slug: 'federal-ai', name: 'Federal AI' },
            { slug: 'ai-contracts', name: 'AI Contracts' },
            { slug: 'ai-companies', name: 'AI Companies' },
        ],
    },
    {
        slug: 'cybersecurity',
        name: 'Cybersecurity',
        menuLabel: 'Cybersecurity',
        blurb: 'Federal cyber policy, threat activity and the defenses agencies are funding.',
        color: '#8a2f3b',
        children: [
            { slug: 'federal-cybersecurity', name: 'Federal Cybersecurity' },
            { slug: 'cyber-policy', name: 'Cyber Policy' },
            { slug: 'cyber-threats', name: 'Cyber Threats' },
        ],
    },
    {
        slug: 'federal-technology',
        name: 'Federal Technology',
        menuLabel: 'Federal Technology',
        blurb: 'IT modernization, government data and the rules contractors have to build against.',
        color: '#0f6470',
        children: [
            { slug: 'it-modernization', name: 'IT Modernization' },
            { slug: 'government-data', name: 'Government Data' },
            { slug: 'contractor-policy', name: 'Contractor Policy' },
        ],
    },
    {
        slug: 'financial-news',
        name: 'Financial News',
        menuLabel: 'Financial News',
        blurb: 'Earnings, M&A, capital markets and the financial health of the GovCon sector.',
        color: '#8a5a1f',
        children: [
            { slug: 'corporate-finance', name: 'Corporate Finance' },
            { slug: 'markets', name: 'Markets' },
            { slug: 'govcon-financials', name: 'GovCon Financials' },
        ],
    },
    {
        slug: 'executive-moves',
        name: 'Executive Moves',
        menuLabel: 'Executive Moves',
        blurb: 'Appointments, departures and the people running federal agencies and contractors.',
        color: '#4a4a55',
        children: [
            { slug: 'federal-leadership', name: 'Federal Leadership' },
            { slug: 'govcon-leadership', name: 'GovCon Leadership' },
            { slug: 'workforce-leadership', name: 'Workforce Leadership' },
        ],
    },
]

export type CategoryEntry = {
    slug: string
    name: string
    menuLabel: string
    blurb: string
    color: string
    /** Parent section slug; undefined on the seven top-level sections. */
    parent?: string
}

/* Flat registry of every routable category — the seven sections followed by
   their subsections. Used for routing/validation, the CMS select options and
   the sitemap. */
export const CATEGORIES: CategoryEntry[] = CATEGORY_TREE.flatMap((parent) => [
    {
        slug: parent.slug,
        name: parent.name,
        menuLabel: parent.menuLabel ?? parent.name,
        blurb: parent.blurb,
        color: parent.color,
    },
    ...parent.children.map((child) => ({
        slug: child.slug,
        name: child.name,
        menuLabel: child.name,
        blurb: `${child.name} coverage from the ${parent.name} desk.`,
        color: parent.color,
        parent: parent.slug,
    })),
])

export type CategorySlug = string

export const CATEGORY_SLUGS: string[] = CATEGORIES.map((c) => c.slug)

/** Top-level sections only — the header nav, footer column and /topics list. */
export const PARENT_CATEGORIES = CATEGORY_TREE

export const getCategory = (slug: string): CategoryEntry | undefined =>
    CATEGORIES.find((c) => c.slug === slug)

export const getParentCategory = (slug: string): ParentCategory | undefined =>
    CATEGORY_TREE.find((c) => c.slug === slug)

/** The parent section a slug belongs to (itself, when it is a section). */
export const getSection = (slug: string): ParentCategory | undefined => {
    const direct = getParentCategory(slug)
    if (direct) return direct
    return CATEGORY_TREE.find((p) => p.children.some((c) => c.slug === slug))
}

/* Every slug whose posts belong under `slug`: a section returns itself plus
   its three subsections, a subsection returns just itself. Feeds the `in`
   query behind section hubs and the homepage section rails. */
export const getCategoryFamily = (slug: string): string[] => {
    const parent = getParentCategory(slug)
    if (parent) return [parent.slug, ...parent.children.map((c) => c.slug)]
    return [slug]
}

/** CMS select options, subsections indented under their section. */
export const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({
    label: c.parent ? `— ${c.name}` : c.name,
    value: c.slug,
}))

/** Grouped option list for admin UIs that support optgroups. */
export const CATEGORY_GROUPS = CATEGORY_TREE.map((parent) => ({
    label: parent.name,
    options: [
        { label: `${parent.name} (section)`, value: parent.slug },
        ...parent.children.map((c) => ({ label: c.name, value: c.slug })),
    ],
}))
