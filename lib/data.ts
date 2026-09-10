import { unstable_cache } from 'next/cache';
import { Article, Category, Author } from '@/types';

// Base API URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Cache configuration
const CACHE_CONFIG = {
    revalidate: 3600, // 1 hour
    tags: ['articles', 'categories', 'authors'],
};

// Generic fetch function with caching
async function fetchWithCache<T>(
    url: string,
    options?: RequestInit,
    cacheKey?: string
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Cached fetch function
export const cachedFetch = <T>(
    url: string,
    cacheKey: string,
    options?: RequestInit
) => {
    return unstable_cache(
        () => fetchWithCache<T>(url, options),
        [cacheKey],
        CACHE_CONFIG
    );
};

// Articles data fetching
export const getArticles = cachedFetch<{ data: Article[]; meta: any }>(
    `${API_BASE}/articles`,
    'articles'
);

export const getArticleBySlug = (slug: string) => {
    return cachedFetch<{ data: Article }>(
        `${API_BASE}/articles/${slug}`,
        `article-${slug}`
    );
};

export const getArticlesByCategory = (categorySlug: string) => {
    return cachedFetch<{ data: Article[]; meta: any }>(
        `${API_BASE}/articles?category=${categorySlug}`,
        `articles-category-${categorySlug}`
    );
};

export const getArticlesByAuthor = (authorSlug: string) => {
    return cachedFetch<{ data: Article[]; meta: any }>(
        `${API_BASE}/articles?author=${authorSlug}`,
        `articles-author-${authorSlug}`
    );
};

// Categories data fetching
export const getCategories = cachedFetch<{ data: Category[] }>(
    `${API_BASE}/categories`,
    'categories'
);

export const getCategoryBySlug = (slug: string) => {
    return cachedFetch<{ data: Category }>(
        `${API_BASE}/categories/${slug}`,
        `category-${slug}`
    );
};

// Authors data fetching
export const getAuthors = cachedFetch<{ data: Author[] }>(
    `${API_BASE}/authors`,
    'authors'
);

export const getAuthorBySlug = (slug: string) => {
    return cachedFetch<{ data: Author }>(
        `${API_BASE}/authors/${slug}`,
        `author-${slug}`
    );
};

// Search functionality
export const searchArticles = (query: string, filters?: Record<string, any>) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return cachedFetch<{ data: Article[]; meta: any }>(
        `${API_BASE}/articles/search?${params}`,
        `search-${query}-${JSON.stringify(filters)}`
    );
};

// Featured articles
export const getFeaturedArticles = cachedFetch<{ data: Article[] }>(
    `${API_BASE}/articles?featured=true`,
    'featured-articles'
);

// Recent articles
export const getRecentArticles = cachedFetch<{ data: Article[] }>(
    `${API_BASE}/articles?sort=publishedAt&order=desc&limit=10`,
    'recent-articles'
);

// Popular articles
export const getPopularArticles = cachedFetch<{ data: Article[] }>(
    `${API_BASE}/articles?sort=views&order=desc&limit=10`,
    'popular-articles'
);

// Parallel data fetching for better performance
export async function getHomePageData() {
    const [featured, recent, popular, categories] = await Promise.all([
        getFeaturedArticles(),
        getRecentArticles(),
        getPopularArticles(),
        getCategories(),
    ]);

    return {
        featured: featured.data,
        recent: recent.data,
        popular: popular.data,
        categories: categories.data,
    };
}

export async function getCategoryPageData(categorySlug: string) {
    const [articles, category] = await Promise.all([
        getArticlesByCategory(categorySlug)(),
        getCategoryBySlug(categorySlug)(),
    ]);

    return {
        articles: articles.data,
        category: category.data,
        meta: articles.meta,
    };
}

export async function getAuthorPageData(authorSlug: string) {
    const [articles, author] = await Promise.all([
        getArticlesByAuthor(authorSlug)(),
        getAuthorBySlug(authorSlug)(),
    ]);

    return {
        articles: articles.data,
        author: author.data,
        meta: articles.meta,
    };
} 