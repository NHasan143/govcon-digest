import { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { SITE } from "@/lib/config";
import { CATEGORIES } from "@/lib/categories";

// Generated per request so newly published posts appear automatically —
// a build-time static sitemap would go stale between deploys.
export const dynamic = "force-dynamic";

// Canonical URLs per the SEO & content requirements doc. Search is noindex
// and excluded; topic hubs are excluded until approved for indexing;
// newsletter archive is Phase 2.
async function getCmsEntries(baseUrl: string): Promise<MetadataRoute.Sitemap> {
    try {
        const payload = await getPayload({ config });

        // Published articles: /{category}/{slug}
        const { docs: posts } = await payload.find({
            collection: "posts",
            limit: 1000,
            depth: 0,
            overrideAccess: false,
        });
        const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
            url: `${baseUrl}/${post.category}/${post.slug}`,
            lastModified: new Date(post.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

        // Published news: /stories/{slug}
        const { docs: news } = await payload.find({
            collection: "news",
            limit: 1000,
            depth: 0,
            overrideAccess: false,
        });
        const newsEntries: MetadataRoute.Sitemap = news.map((doc) => ({
            url: `${baseUrl}/stories/${doc.slug}`,
            lastModified: new Date(doc.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

        // Active authors: /author/{slug} (only authors with published posts)
        const authorIds = [
            ...new Set(
                posts
                    .map((p) => (typeof p.author === "object" ? p.author?.id : p.author))
                    .filter((id): id is number => typeof id === "number"),
            ),
        ];
        let authorEntries: MetadataRoute.Sitemap = [];
        if (authorIds.length > 0) {
            const { docs: authors } = await payload.find({
                collection: "users",
                where: { id: { in: authorIds } },
                limit: 100,
                overrideAccess: false,
            });
            authorEntries = authors
                .filter((a) => a.slug)
                .map((a) => ({
                    url: `${baseUrl}/author/${a.slug}`,
                    lastModified: new Date(a.updatedAt),
                    changeFrequency: "weekly" as const,
                    priority: 0.5,
                }));
        }

        return [...postEntries, ...newsEntries, ...authorEntries];
    } catch {
        // Database not migrated yet (e.g. first build on a fresh checkout)
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE.url;
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
        { url: `${baseUrl}/latest`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/stories`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
        ...CATEGORIES.map((c) => ({
            url: `${baseUrl}/${c.slug}`,
            lastModified: now,
            changeFrequency: "daily" as const,
            priority: 0.9,
        })),
        { url: `${baseUrl}/subscribe`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/editorial-standards`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
        { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${baseUrl}/cookie-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ];

    const cmsEntries = await getCmsEntries(baseUrl);

    return [...staticPages, ...cmsEntries];
}
