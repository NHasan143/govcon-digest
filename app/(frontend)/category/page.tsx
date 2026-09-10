import Section1 from "@/components/sections/category/Section1";
import Section2 from "@/components/sections/category/Section2";
import Section3 from "@/components/sections/home/Section7";
import { Metadata } from "next";
import { getCategoryPageData } from "@/lib/data";
import { SITE } from "@/lib/config";

// Generate metadata for category pages
export async function generateMetadata({ params }: { params: Promise<{ slug?: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const categorySlug = slug || "default-category";
    const { category, articles } = await getCategoryPageData(categorySlug);

    if (!category) {
      return {
        title: 'Category Not Found',
        description: 'The requested category could not be found.',
      };
    }

    const articleCount = articles?.length || 0;

    return {
      title: `${category.name} News - Latest ${category.name} Stories`,
      description: `Stay updated with the latest ${category.name.toLowerCase()} news, breaking stories, and in-depth analysis. Read ${articleCount} articles about ${category.name.toLowerCase()} on ${SITE.name}.`,
      keywords: [category.name, 'news', 'articles', 'stories', 'analysis', category.name.toLowerCase()],
      alternates: {
        canonical: `/category/${category.slug}`,
      },
      openGraph: {
        title: `${category.name} News - Latest ${category.name} Stories`,
        description: `Stay updated with the latest ${category.name.toLowerCase()} news, breaking stories, and in-depth analysis.`,
        url: `/category/${category.slug}`,
        siteName: SITE.name,
        type: 'website',
        images: [
          {
            url: '/assets/imgs/news/news-1.jpg',
            width: 1200,
            height: 630,
            alt: `${category.name} News`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} News - Latest ${category.name} Stories`,
        description: `Stay updated with the latest ${category.name.toLowerCase()} news, breaking stories, and in-depth analysis.`,
        images: ['/assets/imgs/news/news-1.jpg'],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    return {
      title: 'Category News',
      description: 'Browse news articles by category.',
    };
  }
}

export default function Category() {
  return (
    <>
      <Section1 showLine={false} />
      <Section2 />
      <Section3 />
    </>
  );
}
