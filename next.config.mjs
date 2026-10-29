// Security headers sent on every response (pages, API, CMS, files).
// HSTS is only sent when the site URL is https — browsers would then refuse
// plain HTTP for a year, so it must never go out before HTTPS works.
// NEXT_PUBLIC_SITE_URL is read at build time, like the rest of next.config.
// includeSubDomains is deliberately off until every govcondigest.com
// subdomain (mail, webmail, …) is confirmed to serve HTTPS.
const isHttps = (process.env.NEXT_PUBLIC_SITE_URL || '').startsWith('https://');
const securityHeaders = [
    ...(isHttps ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }] : []),
    // Never guess a file's type from its content — serve it as declared.
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    // Only our own pages may embed ours in a frame (clickjacking).
    // X-Frame-Options for older browsers, CSP frame-ancestors for current ones.
    // This CSP sets ONLY frame-ancestors — it doesn't restrict scripts, so
    // the Kit embed, reCAPTCHA and the Payload admin are unaffected.
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
    // Other sites see only our domain, never the full page URL.
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    // Nothing on the site (or any embed) may use these.
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Don't advertise the stack. Also stops Payload's withPayload adding
    // "X-Powered-By: Next.js, Payload".
    poweredByHeader: false,

    // Optimize CSS processing
    experimental: {
        // optimizeCss: true, // Temporarily disabled due to critters issues
        // Enable modern React features
        optimizePackageImports: ['swiper'],
    },

    // Configure asset optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        // Optimized-image cache lifetime in seconds. Set explicitly: Next.js 16
        // changed the default from 60 to 14400 (4 hours).
        minimumCacheTTL: 60,
        // SVGs are never passed through the optimizer (no dangerouslyAllowSVG).
        // This CSP still locks down every optimized image response.
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // No custom `webpack` function: Next.js 16 builds with Turbopack, which
    // ignores webpack config, and `next build` fails if one is present.

    // Every build gets a new ID, so cache-busting is automatic
    generateBuildId: async () => {
        return 'build-' + Date.now();
    },

    // Enable compression
    compress: true,

    // Security headers on everything, plus long-lived caching for static
    // assets. Never add a public cache header under /api — the Payload REST
    // API lives there and serves signed-in users' data.
    async headers() {
        return [
            {
                source: '/:path*',
                headers: securityHeaders,
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

// Bundle analysis: `npm run analyze` (Next.js 16's built-in `next analyze`).
import { withPayload } from '@payloadcms/next/withPayload';

export default withPayload(nextConfig);
