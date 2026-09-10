import Section1 from "@/components/sections/home-2/Section1";
import Section2 from "@/components/sections/home-2/Section2";
import Section3 from "@/components/sections/home-2/Section3";
import Section4 from "@/components/sections/home/Section7";
import SuspenseWrapper from "@/components/elements/SuspenseWrapper";
import { Metadata } from "next";
import { SITE } from "@/lib/config";
import {
  getFeaturedPosts,
  getHomepageNews,
  getHomepagePosts,
  getSliderFeaturedPosts,
  newsToArticle,
  postToArticle,
} from "@/lib/cms";

// Render per-request so newly published CMS posts appear immediately
export const dynamic = "force-dynamic";

// Home page metadata
export const metadata: Metadata = {
  title: "Latest News, Breaking Stories & In-Depth Analysis",
  description: "Get the latest breaking news, in-depth analysis, and comprehensive coverage of current events. Stay informed with our trusted journalism and insightful reporting on politics, technology, business, sports, and entertainment.",
  keywords: ["breaking news", "latest news", "current events", "politics", "technology", "business", "sports", "entertainment", "analysis", "journalism"],
  alternates: {
    canonical: "/",
  },
  // og:image comes from app/(frontend)/opengraph-image.png (file convention)
  openGraph: {
    title: `${SITE.name} — Clear, Source-Led News in Minutes`,
    description: `A few minutes with ${SITE.name} can save you hours of scrolling. Briefings on AI, business, the US economy, science, health, and world affairs — every story linked to its source.`,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Clear, Source-Led News in Minutes`,
    description: `A few minutes with ${SITE.name} can save you hours of scrolling. Briefings on AI, business, the US economy, science, health, and world affairs.`,
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
};

export default async function Home() {
  // Hero comes from editor-controlled flags: the left slider rotates every
  // "Slider featured" post; the right column holds the (max 4) "Featured"
  // posts. The remaining sections take the latest published posts, minus
  // whatever the hero already shows. With too little content, sections fall
  // back to their built-in template markup.
  const [sliderPosts, featuredPosts, latestPosts, latestNews] = await Promise.all([
    getSliderFeaturedPosts(),
    getFeaturedPosts(),
    getHomepagePosts(),
    getHomepageNews(),
  ]);

  // The right-hand hero column is editor-controlled ("Featured", max 4), but
  // with nothing ticked it left a visible gap beside the slider. Any unused
  // slots are filled with the newest posts the hero isn't already showing, so
  // the column is never empty; ticking "Featured" still takes precedence.
  const HERO_SIDEBAR_SLOTS = 4;
  const heroRendered = sliderPosts.length > 0 || featuredPosts.length > 0;
  const alreadyInHero = new Set([...sliderPosts, ...featuredPosts].map((p) => p.id));
  const sidebarFiller = heroRendered
    ? latestPosts
        .filter((p) => !alreadyInHero.has(p.id))
        .slice(0, Math.max(0, HERO_SIDEBAR_SLOTS - featuredPosts.length))
    : [];

  const sliderArticles = sliderPosts.map(postToArticle);
  const featuredArticles = [...featuredPosts, ...sidebarFiller].map(postToArticle);
  const heroIds = new Set(
    [...sliderPosts, ...featuredPosts, ...sidebarFiller].map((p) => p.id),
  );
  // Blog posts and news share the non-hero sections, newest first; news
  // articles link to /stories/{slug}
  const rest = [
    ...latestPosts
      .filter((p) => !heroIds.has(p.id))
      .map((p) => ({ article: postToArticle(p), date: p.publishedAt || p.createdAt })),
    ...latestNews.map((d) => ({ article: newsToArticle(d), date: d.publishedAt || d.createdAt })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((x) => x.article);

  // Only real CMS posts are ever rendered — sections with nothing to show are
  // skipped entirely (the template demo defaults must never leak through).
  const hasHero = sliderArticles.length > 0 || featuredArticles.length > 0;
  const hasAnything = hasHero || rest.length > 0;

  if (!hasAnything) {
    return (
      <div className="text-center pt-100 pb-100">
        <h2 className="font-weight-900 mb-15">No articles yet</h2>
        <p className="text-muted">New stories are on the way — check back soon.</p>
      </div>
    );
  }

  return (
    <>
      {hasHero && (
        <SuspenseWrapper skeletonType="grid" skeletonCount={4}>
          <Section1 sliderArticles={sliderArticles} sidebarArticles={featuredArticles} />
        </SuspenseWrapper>
      )}
      {rest.length > 0 && <Section2 articles={rest.slice(0, 10)} />}
      {rest.length > 10 && (
        <Section3 mainArticles={rest.slice(10, 12)} sidebarArticles={rest.slice(12, 14)} />
      )}
      {rest.length > 14 && (
        <SuspenseWrapper skeletonType="list" skeletonCount={5}>
          <Section4 articles={rest.slice(14, 23)} />
        </SuspenseWrapper>
      )}
    </>
  );
}
