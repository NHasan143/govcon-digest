import { Metadata } from 'next';
import { SITE } from '@/lib/config';

// Utility function to generate structured data (JSON-LD)
export function generateStructuredData(type: 'article' | 'author' | 'organization' | 'website', data: any) {
    const baseUrl = SITE.url;

    switch (type) {
        case 'article':
            return {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: data.title,
                description: data.excerpt || data.content.substring(0, 160),
                image: data.featuredImage || `${baseUrl}/assets/imgs/news/news-1.jpg`,
                author: {
                    '@type': 'Person',
                    name: data.author.name,
                    url: `${baseUrl}/author/${data.author.slug}`,
                },
                publisher: {
                    '@type': 'Organization',
                    name: SITE.name,
                    logo: {
                        '@type': 'ImageObject',
                        url: `${baseUrl}/assets/imgs/theme/favicon.png`,
                    },
                },
                datePublished: data.publishedAt,
                dateModified: data.updatedAt || data.publishedAt,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': `${baseUrl}/single/${data.slug}`,
                },
                articleSection: data.category.name,
                keywords: data.tags?.map((tag: any) => tag.name).join(', ') || '',
            };

        case 'author':
            return {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: data.name,
                description: data.bio,
                image: data.avatar || `${baseUrl}/assets/imgs/authors/author-1.jpg`,
                url: `${baseUrl}/author/${data.slug}`,
                jobTitle: 'Journalist',
                worksFor: {
                    '@type': 'Organization',
                    name: SITE.name,
                },
                sameAs: data.socialLinks ? Object.values(data.socialLinks).filter(Boolean) : [],
            };

        // Organization markup per the owner's spec. `hasCredential: true` was
        // the one Rich Results Test error (a boolean where an
        // EducationalOccupationalCredential is expected) — dropped entirely,
        // along with foundingDate/areaServed, and the policy URLs now point at
        // /editorial-standards instead of /about and /contact.
        case 'organization':
            return {
                '@context': 'https://schema.org',
                '@type': 'NewsMediaOrganization',
                '@id': `${baseUrl}/#organization`,
                name: SITE.name,
                url: `${baseUrl}/`,
                logo: {
                    '@type': 'ImageObject',
                    url: `${baseUrl}/assets/imgs/theme/favicon.png`,
                },
                description: SITE.description,
                email: SITE.emails.contact,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: SITE.address.street,
                    addressLocality: SITE.address.locality,
                    addressRegion: SITE.address.region,
                    postalCode: SITE.address.postalCode,
                    addressCountry: SITE.address.country,
                },
                contactPoint: [
                    {
                        '@type': 'ContactPoint',
                        contactType:
                            'Editorial inquiries, news tips, corrections, and general inquiries',
                        email: SITE.emails.contact,
                        url: `${baseUrl}/contact`,
                        availableLanguage: 'English',
                    },
                    {
                        '@type': 'ContactPoint',
                        contactType: 'Advertising and partnerships',
                        email: SITE.emails.ads,
                        url: `${baseUrl}/contact`,
                        availableLanguage: 'English',
                    },
                ],
                publishingPrinciples: `${baseUrl}/editorial-standards`,
                ethicsPolicy: `${baseUrl}/editorial-standards`,
                correctionsPolicy: `${baseUrl}/editorial-standards`,
                verificationFactCheckingPolicy: `${baseUrl}/editorial-standards`,
                unnamedSourcesPolicy: `${baseUrl}/editorial-standards`,
                actionableFeedbackPolicy: `${baseUrl}/editorial-standards`,
                missionCoveragePrioritiesPolicy: `${baseUrl}/about`,
                knowsAbout: [
                    'Artificial intelligence and automation',
                    'Business and finance',
                    'United States economy',
                    'Science and technology',
                    'Health and medicine',
                    'International affairs',
                ],
            };

        case 'website':
            return {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: SITE.name,
                url: baseUrl,
                description: 'Latest news, breaking stories, and in-depth analysis from trusted journalists.',
                publisher: {
                    '@type': 'Organization',
                    name: SITE.name,
                    logo: {
                        '@type': 'ImageObject',
                        url: `${baseUrl}/assets/imgs/theme/favicon.png`,
                    },
                },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                },
            };

        default:
            return null;
    }
}

// Utility function to generate article metadata
export function generateArticleMetadata(article: any): Metadata {
    const baseUrl = SITE.url;
    const publishedDate = new Date(article.publishedAt).toISOString();
    const authorName = article.author.name;
    const categoryName = article.category.name;

    return {
        title: article.title,
        description: article.excerpt || article.content.substring(0, 160),
        keywords: [categoryName, authorName, 'news', 'article', ...(article.tags?.map((tag: any) => tag.name) || [])],
        authors: [{ name: authorName }],
        category: categoryName,
        openGraph: {
            title: article.title,
            description: article.excerpt || article.content.substring(0, 160),
            type: 'article',
            publishedTime: publishedDate,
            authors: [authorName],
            section: categoryName,
            images: [
                {
                    url: article.featuredImage || `${baseUrl}/assets/imgs/news/news-1.jpg`,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt || article.content.substring(0, 160),
            images: [article.featuredImage || `${baseUrl}/assets/imgs/news/news-1.jpg`],
            creator: `@${authorName.toLowerCase().replace(/\s+/g, '')}`,
        },
        alternates: {
            canonical: `/single/${article.slug}`,
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
        other: {
            'article:published_time': publishedDate,
            'article:author': authorName,
            'article:section': categoryName,
        },
    };
}

// Utility function to generate category metadata
export function generateCategoryMetadata(category: any, articles: any[] = []): Metadata {
    const baseUrl = SITE.url;
    const articleCount = articles.length;

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
            url: `${baseUrl}/category/${category.slug}`,
            siteName: SITE.name,
            type: 'website',
            images: [
                {
                    url: `${baseUrl}/assets/imgs/news/news-1.jpg`,
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
            images: [`${baseUrl}/assets/imgs/news/news-1.jpg`],
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
}

// Utility function to generate author metadata
export function generateAuthorMetadata(author: any, articles: any[] = []): Metadata {
    const baseUrl = SITE.url;
    const articleCount = articles.length;
    const bio = author.bio || `Read articles by ${author.name}`;

    return {
        title: `${author.name} - Author Profile and Articles`,
        description: `${bio} Discover ${articleCount} articles written by ${author.name} on ${SITE.name}. Expert analysis and insightful reporting.`,
        keywords: [author.name, 'author', 'journalist', 'reporter', 'articles', 'news', 'analysis'],
        authors: [{ name: author.name }],
        alternates: {
            canonical: `/author/${author.slug}`,
        },
        openGraph: {
            title: `${author.name} - Author Profile and Articles`,
            description: `${bio} Discover ${articleCount} articles written by ${author.name}.`,
            url: `${baseUrl}/author/${author.slug}`,
            siteName: SITE.name,
            type: 'profile',
            images: [
                {
                    url: author.avatar || `${baseUrl}/assets/imgs/authors/author-1.jpg`,
                    width: 400,
                    height: 400,
                    alt: `${author.name} - Author`,
                },
            ],
        },
        twitter: {
            card: 'summary',
            title: `${author.name} - Author Profile and Articles`,
            description: `${bio} Discover ${articleCount} articles written by ${author.name}.`,
            images: [author.avatar || `${baseUrl}/assets/imgs/authors/author-1.jpg`],
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
} 