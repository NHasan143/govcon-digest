import { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${SITE.name} - Latest News and Breaking Stories`,
        short_name: SITE.name,
        description: "Latest news, breaking stories, and in-depth analysis from trusted journalists",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#df4a2c",
        orientation: "portrait-primary",
        scope: "/",
        lang: "en-US",
        categories: ["news", "media", "politics", "technology", "business"],
        icons: [
            {
                src: "/icon.png",
                sizes: "350x369",
                type: "image/png",
            },
        ],
        shortcuts: [
            {
                name: "Latest News",
                short_name: "News",
                description: "View the latest breaking news",
                url: "/",
                icons: [{ src: "/icon.png", sizes: "350x369" }],
            },
            {
                name: "Search",
                short_name: "Search",
                description: "Search for articles",
                url: "/search",
                icons: [{ src: "/icon.png", sizes: "350x369" }],
            },
        ],
    };
}
