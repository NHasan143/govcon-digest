import type { Metadata } from "next";
import { EB_Garamond, Lora } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import PerformanceMonitor from "@/components/elements/PerformanceMonitor";
import { NoScriptWarning } from "@/components/elements/NoScriptFallback";
import { generateStructuredData } from "@/lib/metadata";
import { SITE } from "@/lib/config";

const ebGaramond = EB_Garamond({
    weight: ["400", "500", "600", "700"], // Only bold for headings
    subsets: ["latin"],
    variable: "--eb-garamond",
    preload: true,
    fallback: ["serif"],
});

const lora = Lora({
    weight: ["400", "500", "600"],
    subsets: ["latin"],
    variable: "--lora",
    preload: true,
    fallback: ["serif"],
});

export const metadata: Metadata = {
    title: {
        default: `${SITE.name} - Latest News, Breaking Stories & In-Depth Analysis`,
        // No site-name suffix: page titles are used verbatim so editors keep
        // full control of the ~60 characters Google shows.
        template: '%s',
    },
    description: SITE.description,
    keywords: ["news", "breaking news", "current events", "journalism", "analysis", "politics", "technology", "business", "sports", "entertainment"],
    authors: [{ name: `${SITE.name} Team` }],
    creator: SITE.name,
    publisher: SITE.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(SITE.url),
    alternates: {
        canonical: "/",
    },
    // og:image comes from the file convention: app/(frontend)/opengraph-image.png
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE.url,
        title: `${SITE.name} — ${SITE.tagline}`,
        description: SITE.description,
        siteName: SITE.name,
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE.name} — ${SITE.tagline}`,
        description: SITE.description,
        creator: SITE.twitter,
        site: SITE.twitter,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "your-google-verification-code",
        yandex: "your-yandex-verification-code",
        yahoo: "your-yahoo-verification-code",
    },
    other: {
        "application-name": SITE.name,
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        "apple-mobile-web-app-title": SITE.name,
        "format-detection": "telephone=no",
        "mobile-web-app-capable": "yes",
        "msapplication-config": "/browserconfig.xml",
        "msapplication-TileColor": "#df4a2c",
        "msapplication-tap-highlight": "no",
        "theme-color": "#df4a2c",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Generate structured data for the website
    const websiteStructuredData = generateStructuredData("website", {});
    const organizationStructuredData = generateStructuredData("organization", {});

    return (
        <html lang="en">
            <head>
                {/* Structured Data for Website */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteStructuredData),
                    }}
                />
                {/* Structured Data for Organization */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationStructuredData),
                    }}
                />
            </head>
            <body className={`${ebGaramond.variable} ${lora.variable}`}>
                <NoScriptWarning />
                <ThemeProvider defaultTheme="light">
                    <Layout>{children}</Layout>
                    <PerformanceMonitor />
                </ThemeProvider>
            </body>
        </html>
    );
}
