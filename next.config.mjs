/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimize CSS processing
    experimental: {
        // optimizeCss: true, // Temporarily disabled due to critters issues
        // Enable modern React features
        optimizePackageImports: ['swiper'],
    },

    // Configure asset optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        // Enable image caching
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Enable CSS optimization
    webpack: (config, { dev, isServer }) => {
        // Optimize CSS in production
        if (!dev && !isServer) {
            config.optimization.splitChunks.cacheGroups.styles = {
                name: 'styles',
                test: /\.(css|scss)$/,
                chunks: 'all',
                enforce: true,
            };
        }

        return config;
    },

    // Cache configuration for Next.js 15
    generateBuildId: async () => {
        return 'build-' + Date.now();
    },

    // Enable compression
    compress: true,

    // Configure headers for caching.
    // Scoped to the mock-data endpoints only — the Payload REST API also
    // lives under /api and must never get a public cache header.
    async headers() {
        return [
            {
                source: '/api/(articles|authors|categories)/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=3600, stale-while-revalidate=7200',
                    },
                ],
            },
            {
                source: '/api/(articles|authors|categories)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=3600, stale-while-revalidate=7200',
                    },
                ],
            },
            {
                source: '/assets/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

// Bundle analyzer configuration
import bundleAnalyzer from '@next/bundle-analyzer';
import { withPayload } from '@payloadcms/next/withPayload';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

export default withPayload(withBundleAnalyzer(nextConfig));
