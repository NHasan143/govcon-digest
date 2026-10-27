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
export const mediaDir = (): string => path.resolve(process.cwd(), process.env.MEDIA_DIR || 'media')

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
        mimeTypes: ['image/*', 'video/mp4'],
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
