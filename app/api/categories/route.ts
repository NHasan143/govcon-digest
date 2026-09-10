import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

// Cache configuration
const CACHE_TAG = 'categories';
const CACHE_REVALIDATE = 3600; // 1 hour

// Mock data - replace with actual database query
const getCategoriesData = async () => {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
        {
            id: "1",
            name: "Politics",
            slug: "politics",
            description: "Political news and analysis",
            featuredImage: "/assets/imgs/news/news-6.jpg",
            articleCount: 15
        },
        {
            id: "2",
            name: "Health",
            slug: "health",
            description: "Health and medical news",
            featuredImage: "/assets/imgs/news/news-15.jpg",
            articleCount: 12
        },
        {
            id: "3",
            name: "Technology",
            slug: "technology",
            description: "Technology and innovation news",
            featuredImage: "/assets/imgs/news/news-3.jpg",
            articleCount: 20
        },
        {
            id: "4",
            name: "Sports",
            slug: "sports",
            description: "Sports news and updates",
            featuredImage: "/assets/imgs/news/news-8.jpg",
            articleCount: 18
        },
        {
            id: "5",
            name: "Entertainment",
            slug: "entertainment",
            description: "Entertainment and celebrity news",
            featuredImage: "/assets/imgs/news/news-12.jpg",
            articleCount: 14
        }
    ];
};

// Cached data fetching function
const getCachedCategories = unstable_cache(
    async () => {
        const categories = await getCategoriesData();
        return categories;
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

        // Get cached categories
        const categories = await getCachedCategories();

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedCategories = categories.slice(startIndex, endIndex);

        const response = {
            success: true,
            data: paginatedCategories,
            meta: {
                total: categories.length,
                page,
                perPage: limit,
                totalPages: Math.ceil(categories.length / limit),
                hasNext: endIndex < categories.length,
                hasPrev: page > 1
            }
        };

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': `public, s-maxage=${CACHE_REVALIDATE}, stale-while-revalidate=${CACHE_REVALIDATE * 2}`,
            },
        });
    } catch (error) {
        console.error('Categories API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
} 