import { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/_next/",
                    // Search results are noindex — keep crawlers out entirely
                    "/search",
                    "/basic-search",
                    // Template demo layouts kept in the codebase but not part
                    // of the public site — never crawl or index these
                    "/single",
                    "/single-2",
                    "/single-3",
                    "/home-2",
                    "/home-3",
                    "/category",
                    "/category-big",
                    "/category-grid",
                    "/category-list",
                    "/category-masonry",
                    "/login",
                    "/signup",
                    "/typography",
                    "/cms-login",
                ],
            },
        ],
        sitemap: [`${SITE.url}/sitemap.xml`, `${SITE.url}/news-sitemap.xml`],
    };
}
