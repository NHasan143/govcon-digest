import type { Field } from 'payload'

/* Admin-only SEO bookkeeping (owner's request). These are stored in the
   database for later keyword analysis — checking the focus keyword against the
   title, URL, H1 and body — and must NEVER reach the public site.
   
   Two things keep them private:
   1. No page component renders them, so they never appear in HTML or meta tags.
   2. Field-level read access is restricted to logged-in CMS users, so they are
      also stripped from the public REST/GraphQL responses (/api/posts and
      /api/news are readable by anonymous visitors). */
const adminOnlyRead = { read: ({ req }: { req: { user?: unknown } }) => Boolean(req.user) }

export const focusKeywordField: Field = {
    name: 'focusKeyword',
    type: 'text',
    label: 'Focus keyword',
    access: adminOnlyRead,
    admin: {
        description:
            'Internal only — never shown on the site or in meta tags. The single keyword this article targets.',
    },
}

export const relevantKeywordsField: Field = {
    name: 'relevantKeywords',
    type: 'text',
    hasMany: true,
    label: 'Relevant keywords',
    access: adminOnlyRead,
    admin: {
        description:
            'Internal only — never shown on the site or in meta tags. Press Enter after each keyword.',
    },
}
