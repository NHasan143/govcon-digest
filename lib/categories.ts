// Category system per "seo and content requirements" doc.
// Slugs are the canonical URL paths (/{slug}/) and the values stored on posts.
export const CATEGORIES = [
    { slug: 'ai-automation', name: 'AI & Automation', menuLabel: 'AI' },
    { slug: 'us-economy', name: 'U.S. Economy', menuLabel: 'Economy' },
    { slug: 'business-finance', name: 'Business & Finance', menuLabel: 'Business' },
    { slug: 'science-technology', name: 'Science & Technology', menuLabel: 'Science & Tech' },
    { slug: 'health-medicine', name: 'Health & Medicine', menuLabel: 'Health' },
    { slug: 'international', name: 'International', menuLabel: 'World' },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]['slug']

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as CategorySlug[]

export const getCategory = (slug: string) =>
    CATEGORIES.find((c) => c.slug === slug)
