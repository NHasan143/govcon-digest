import { Metadata } from "next";
import { SITE } from "@/lib/config";
import { PARENT_CATEGORIES, getCategoryFamily } from "@/lib/categories";
import {
  getFeaturedPosts,
  getHomepagePosts,
  getSectionPosts,
  getSliderFeaturedPosts,
  postToArticle,
} from "@/lib/cms";
import HomeHero from "@/components/home/HomeHero";
import { CardRow, EditorsPicks, FeatureRail } from "@/components/home/Rails";
import { styles } from "@/components/home/primitives";

// Render per-request so newly published CMS posts appear immediately
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Government Contracting, Defense & Federal Technology News",
  description:
    "Govcon Digest covers the business of government: contract awards, federal procurement, defense programs, artificial intelligence, cybersecurity, federal technology, financial news and executive moves.",
  keywords: [
    "government contracting",
    "federal procurement",
    "contract awards",
    "defense contracts",
    "federal AI",
    "federal cybersecurity",
    "IT modernization",
    "GovCon financials",
    "executive moves",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — Government Contracting, Defense & Federal Technology News`,
    description:
      "Daily reporting on contract awards, federal procurement, defense programs, AI, cybersecurity and the executives shaping the federal market.",
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Government Contracting & Federal Technology News`,
    description:
      "Daily reporting on contract awards, federal procurement, defense programs, AI, cybersecurity and the executives shaping the federal market.",
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

/* Homepage slot budget — the page allocates from newest-first pools and each
   block takes exactly this many posts. */
const HERO_SIDE = 2; //  left column, stacked
const HERO_LATEST = 5; //  right-hand LATEST rail
const HIGHLIGHTS = 5; //  Today's Highlights
const EDITORS = 5; //  Editor's Picked
const SECTION_POSTS = 5; //  each of the seven section rails

export default async function Home() {
  /* The hero's three featured slots stay editor-controlled: "Slider featured"
     supplies the lead story, "Featured" the two beside it. Anything an editor
     leaves unticked is filled from the newest posts, so the band is never
     ragged. Everything below the hero is purely chronological. */
  const [sliderPosts, featuredPosts, latestPosts] = await Promise.all([
    getSliderFeaturedPosts(),
    getFeaturedPosts(),
    getHomepagePosts(60),
  ]);

  const used = new Set<number>();
  const take = (pool: typeof latestPosts, n: number) => {
    const picked = pool.filter((p) => !used.has(p.id)).slice(0, n);
    picked.forEach((p) => used.add(p.id));
    return picked;
  };

  // Hero: editor picks first, then newest-first filler for any empty slot.
  const lead = take(sliderPosts, 1)[0] ?? take(latestPosts, 1)[0];
  const side = [...take(featuredPosts, HERO_SIDE), ...take(latestPosts, HERO_SIDE)].slice(
    0,
    HERO_SIDE,
  );
  const latest = take(latestPosts, HERO_LATEST);

  // Nothing published yet — show the empty state rather than a broken grid.
  if (!lead) {
    return (
      <div className={styles.empty}>
        <h2 className="font-weight-900 mb-15">No articles yet</h2>
        <p className="text-muted">New stories are on the way — check back soon.</p>
      </div>
    );
  }

  const highlights = take(latestPosts, HIGHLIGHTS);
  const editors = take(latestPosts, EDITORS);

  /* Section rails. Each queries its own family (the section plus its three
     subsections) so a rail is filled from that desk's coverage rather than
     from whatever happens to be newest site-wide. Run in parallel; posts
     already placed above are excluded so nothing appears twice. */
  const sectionRails = await Promise.all(
    PARENT_CATEGORIES.map(async (section) => ({
      section,
      posts: await getSectionPosts(getCategoryFamily(section.slug), SECTION_POSTS, used),
    })),
  );

  return (
    <div className={styles.home}>
      <HomeHero
        lead={postToArticle(lead)}
        side={side.map(postToArticle)}
        latest={latest.map(postToArticle)}
      />

      <CardRow
        title="Today's Highlights"
        href="/latest"
        articles={highlights.map(postToArticle)}
        columns={5}
      />

      <EditorsPicks title="Editor's Picked" articles={editors.map(postToArticle)} />

      {/* One rail per section, in registry order. A rail with nothing to show
          is skipped rather than rendered empty. Layout alternates between the
          four-across row and the feature grid to break up the page. */}
      {sectionRails.map(({ section, posts }, index) => {
        if (posts.length === 0) return null;
        const articles = posts.map(postToArticle);
        const props = {
          title: section.name,
          href: `/${section.slug}`,
          accent: section.color,
          articles,
        };
        // Every third rail gets the feature treatment, and only when it has
        // the full five posts that layout is designed around.
        return index % 3 === 2 && articles.length === SECTION_POSTS ? (
          <FeatureRail key={section.slug} {...props} />
        ) : (
          <CardRow key={section.slug} {...props} articles={articles.slice(0, 4)} />
        );
      })}
    </div>
  );
}
