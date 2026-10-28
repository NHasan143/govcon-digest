import path from 'path'
import type { CollectionConfig } from 'payload'
import { MEDIA_PUBLIC_QUERIES, publicQueryAllowlist } from '../access/publicQueries'

// Where uploads live, decided when the site STARTS, not when it's built.
// A path derived from this file's location (import.meta.url) gets frozen into
// the build output as the build machine's absolute path, which breaks as soon
// as the build runs anywhere else — CI, a fresh release folder, a moved
// project. MEDIA_DIR (absolute, or relative to the working directory) points
// production at a folder that survives deploys; unset, it's ./media in the
// project folder, which is what local development uses.
// The turbopackIgnore comment keeps the build from tracing this runtime folder
// (it would otherwise treat the whole project as server files).
export const mediaDir = (): string =>
    path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.MEDIA_DIR || 'media')

export const Media: CollectionConfig = {
    slug: 'media',
    access: {
        read: () => true,
    },
    hooks: {
        // Anonymous visitors may only filter/sort on a few plain fields —
        // see payload/access/publicQueries.ts.
        beforeOperation: [publicQueryAllowlist(MEDIA_PUBLIC_QUERIES)],
    },
    upload: {
        staticDir: mediaDir(),
        // Raster images only. No SVG (it can carry scripts and is served from
        // our own domain) and no video (nothing on the site displays uploaded
        // video). Payload checks the file's actual content, not just its name.
        mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
        adminThumbnail: 'thumbnail',
        imageSizes: [
            { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
            { name: 'card', width: 768, height: 512, position: 'centre' },
            { name: 'hero', width: 1920, height: 1080, position: 'centre' },
        ],
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
        },
        {
            name: 'caption',
            type: 'text',
        },
    ],
}
