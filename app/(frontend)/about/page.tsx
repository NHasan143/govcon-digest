/* About Us: /about/ — indexed. Placeholder copy — replace with the publication's own. */
import { Metadata } from "next";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: { absolute: `About ${SITE.name} | Source-Led News, Clearly Explained` },
  description: `Learn how ${SITE.name} helps busy readers understand important AI, business, economy, science, health, and world news—clearly and without spin.`,
  keywords: [
    `About ${SITE.name}`,
    "source-led news",
    "morning news briefing",
    "news newsletter",
    "clear news summaries",
    "news for busy readers",
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: `About ${SITE.name} | Source-Led News, Clearly Explained`,
    description: `Learn how ${SITE.name} helps busy readers understand important AI, business, economy, science, health, and world news—clearly and without spin.`,
    url: '/about',
    siteName: SITE.name,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `About ${SITE.name} | Source-Led News, Clearly Explained`,
    description: `Learn how ${SITE.name} helps busy readers understand important news—clearly and without spin.`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function About() {
  return (
    <article className="entry-wraper mb-50 mt-50">
      <div className="entry-header entry-header-style-1 mb-30 pt-30">
        <h1 className="entry-title mb-20 font-weight-900">About {SITE.name}</h1>
      </div>
      <div className="entry-main-content">
        <h2>Who We Are</h2>
        <p>A few minutes with us, The {SITE.name}, can save you hours of scrolling.</p>
        <p>
          We cover every story with the goal of giving you both depth and clarity behind the
          headlines in brief. Because we believe you deserve to stay informed, even when time is
          limited. Every morning, we want you to move on with your day feeling caught up, not
          overwhelmed.
        </p>

        <h2>Who This Is For</h2>
        <p>
          If you&apos;ve ever found yourself reading article after article on the same story and
          still struggling to understand what actually happened, the {SITE.name} is for you.
        </p>
        <p>
          We write for readers whose schedules are busy enough that every minute counts, yet
          curious enough to want more than a surface-level headline. Our every edition gives you
          the context behind the news without asking for more of your time than necessary.
        </p>

        <h2>What We Do</h2>
        <p>
          We cover: AI &amp; automation, business &amp; finance, the US economy, science &amp;
          technology, health &amp; medicine, entertainment, and international affairs, all at one
          in {SITE.name}.
        </p>
        <p>
          Every story we publish is linked to its original source, so you can always verify the
          information yourself. We also go beyond the headlines by reading government reports,
          research papers, company filings, and official announcements firsthand, then add the
          context. Only after that, you get a clear, easy-to-read briefing explaining what
          happened, why it&apos;s significant, and what could happen next, all in just a few
          minutes.
        </p>

        <h2>Our Mission</h2>
        <p>
          In {SITE.name}, our mission is to give the busy but curious people a reliable way to
          stay informed, without any spin.
        </p>
        <p>
          We believe good journalism doesn&apos;t need to perform urgency to earn attention. It
          just needs to be accurate, clear, and written straight by people who did the work of
          reading the primary source, so you don&apos;t have to.
        </p>

        <h2>Our Vision</h2>
        <p>
          Our vision in {SITE.name} is to become the source that the readers love with a coffee
          before starting the day. In short, we hope to build a reputation that makes{' '}
          {SITE.name} the first name readers think of when they want reliable, source-led news
          explained clearly.
        </p>
      </div>
    </article>
  );
}
