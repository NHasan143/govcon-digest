import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
    slug: 'media',
    access: {
        read: () => true,
    },
    upload: {
        staticDir: path.resolve(dirname, '../../media'),
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
