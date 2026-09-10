import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

// Cache configuration
const CACHE_TAG = 'articles';
const CACHE_REVALIDATE = 3600; // 1 hour

// Mock data - replace with actual database query
const getArticlesData = async () => {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
        {
            id: "1",
            title: "Poland's Presidential Election Was Close but Voters Remain Far Apart",
            content: "Poland's Presidential Election Was Close but Voters Remain Far Apart",
            excerpt: "Poland's Presidential Election Was Close but Voters Remain Far Apart",
            featuredImage: "/assets/imgs/news/news-6.jpg",
            slug: "/single",
            publishedAt: "2025-04-15",
            author: { id: "1", name: "Steven Kenedy", email: "steven@example.com", slug: "steven-kenedy" },
            category: { id: "1", name: "Politics", slug: "politics" },
            status: "published"
        },
        {
            id: "2",
            title: "After Months of Debate, England Requires Face Masks for Shoppers",
            content: "After Months of Debate, England Requires Face Masks for Shoppers",
            excerpt: "After Months of Debate, England Requires Face Masks for Shoppers",
            featuredImage: "/assets/imgs/news/news-15.jpg",
            slug: "/single",
            publishedAt: "2025-04-14",
            author: { id: "2", name: "Sarah Johnson", email: "sarah@example.com", slug: "sarah-johnson" },
            category: { id: "2", name: "Health", slug: "health" },
            status: "published"
        },
        {
            id: "3",
            title: "New Technology Breakthrough in Renewable Energy",
            content: "New Technology Breakthrough in Renewable Energy",
            excerpt: "Scientists discover revolutionary solar panel technology",
            featuredImage: "/assets/imgs/news/news-3.jpg",
            slug: "/single",
            publishedAt: "2025-04-13",
            author: { id: "3", name: "Michael Chen", email: "michael@example.com", slug: "michael-chen" },
            category: { id: "3", name: "Technology", slug: "technology" },
            status: "published"
        },
        {
            id: "4",
            title: "Championship Final Draws Record Viewership",
            content: "Championship Final Draws Record Viewership",
            excerpt: "The biggest sports event of the year breaks all records",
            featuredImage: "/assets/imgs/news/news-8.jpg",
            slug: "/single",
            publishedAt: "2025-04-12",
            author: { id: "4", name: "Emma Wilson", email: "emma@example.com", slug: "emma-wilson" },
            category: { id: "4", name: "Sports", slug: "sports" },
            status: "published"
        },
        {
            id: "5",
            title: "Hollywood's Biggest Night: Awards Ceremony Highlights",
            content: "Hollywood's Biggest Night: Awards Ceremony Highlights",
            excerpt: "Celebrities gather for the most prestigious awards show",
            featuredImage: "/assets/imgs/news/news-12.jpg",
            slug: "/single",
            publishedAt: "2025-04-11",
            author: { id: "1", name: "Steven Kenedy", email: "steven@example.com", slug: "steven-kenedy" },
            category: { id: "5", name: "Entertainment", slug: "entertainment" },
            status: "published"
        },
        {
            id: "6",
            title: "Global Economic Summit Addresses Climate Change",
            content: "Global Economic Summit Addresses Climate Change",
            excerpt: "World leaders discuss economic solutions to environmental challenges",
            featuredImage: "/assets/imgs/news/news-1.jpg",
            slug: "/single",
            publishedAt: "2025-04-10",
            author: { id: "2", name: "Sarah Johnson", email: "sarah@example.com", slug: "sarah-johnson" },
            category: { id: "1", name: "Politics", slug: "politics" },
            status: "published"
        },
        {
            id: "7",
            title: "Breakthrough in Cancer Treatment Research",
            content: "Breakthrough in Cancer Treatment Research",
            excerpt: "New immunotherapy approach shows promising results",
            featuredImage: "/assets/imgs/news/news-2.jpg",
            slug: "/single",
            publishedAt: "2025-04-09",
            author: { id: "2", name: "Sarah Johnson", email: "sarah@example.com", slug: "sarah-johnson" },
            category: { id: "2", name: "Health", slug: "health" },
            status: "published"
        },
        {
            id: "8",
            title: "AI Revolution: How Machine Learning is Changing Everything",
            content: "AI Revolution: How Machine Learning is Changing Everything",
            excerpt: "From healthcare to transportation, AI is transforming industries",
            featuredImage: "/assets/imgs/news/news-4.jpg",
            slug: "/single",
            publishedAt: "2025-04-08",
            author: { id: "3", name: "Michael Chen", email: "michael@example.com", slug: "michael-chen" },
            category: { id: "3", name: "Technology", slug: "technology" },
            status: "published"
        },
        {
            id: "9",
            title: "Olympic Games Preparation Reaches Final Stage",
            content: "Olympic Games Preparation Reaches Final Stage",
            excerpt: "Host city completes all infrastructure projects ahead of schedule",
            featuredImage: "/assets/imgs/news/news-5.jpg",
            slug: "/single",
            publishedAt: "2025-04-07",
            author: { id: "4", name: "Emma Wilson", email: "emma@example.com", slug: "emma-wilson" },
            category: { id: "4", name: "Sports", slug: "sports" },
            status: "published"
        },
        {
            id: "10",
            title: "Streaming Wars: New Platform Launches with Exclusive Content",
            content: "Streaming Wars: New Platform Launches with Exclusive Content",
            excerpt: "Major entertainment company enters the competitive streaming market",
            featuredImage: "/assets/imgs/news/news-7.jpg",
            slug: "/single",
            publishedAt: "2025-04-06",
            author: { id: "1", name: "Steven Kenedy", email: "steven@example.com", slug: "steven-kenedy" },
            category: { id: "5", name: "Entertainment", slug: "entertainment" },
            status: "published"
        }
    ];
};

// Cached data fetching function
const getCachedArticles = unstable_cache(
    async () => {
        const articles = await getArticlesData();
        return articles;
    },
    [CACHE_TAG],
    {
        revalidate: CACHE_REVALIDATE,
        tags: [CACHE_TAG],
    }
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const author = searchParams.get('author');

        // Get cached articles
        const articles = await getCachedArticles();

        // Apply filters
        let filteredArticles = articles;
        if (category) {
            filteredArticles = filteredArticles.filter(article =>
                article.category.slug === category
            );
        }
        if (author) {
            filteredArticles = filteredArticles.filter(article =>
                article.author.slug === author
            );
        }

        // Handle featured articles filter
        const featured = searchParams.get('featured');
        if (featured === 'true') {
            filteredArticles = filteredArticles.filter(article =>
                article.status === 'published'
            ).slice(0, 5); // Return first 5 as featured
        }

        // Handle sorting
        const sort = searchParams.get('sort');
        const order = searchParams.get('order') || 'desc';
        if (sort === 'publishedAt') {
            filteredArticles.sort((a, b) => {
                const dateA = new Date(a.publishedAt);
                const dateB = new Date(b.publishedAt);
                return order === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
            });
        } else if (sort === 'views') {
            // Mock views data
            filteredArticles = filteredArticles.map(article => ({
                ...article,
                views: Math.floor(Math.random() * 1000) + 100
            } as any));
            filteredArticles.sort((a: any, b: any) => {
                return order === 'desc' ? (b.views || 0) - (a.views || 0) : (a.views || 0) - (b.views || 0);
            });
        }

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

        const response = {
            success: true,
            data: paginatedArticles,
            meta: {
                total: filteredArticles.length,
                page,
                perPage: limit,
                totalPages: Math.ceil(filteredArticles.length / limit),
                hasNext: endIndex < filteredArticles.length,
                hasPrev: page > 1
            }
        };

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': `public, s-maxage=${CACHE_REVALIDATE}, stale-while-revalidate=${CACHE_REVALIDATE * 2}`,
            },
        });
    } catch (error) {
        console.error('Articles API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch articles' },
            { status: 500 }
        );
    }
} 