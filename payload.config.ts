import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Posts } from './payload/collections/Posts'
import { News } from './payload/collections/News'
import { Subscribers } from './payload/collections/Subscribers'
import { Redirects } from './payload/collections/Redirects'
import { SITE } from './lib/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// PAYLOAD_SECRET must be set in production. In development we fall back to a
// throwaway value so a fresh checkout runs before `.env` is created.
const isProd = process.env.NODE_ENV === 'production'
if (!process.env.PAYLOAD_SECRET && isProd) {
    throw new Error('PAYLOAD_SECRET is required — set it in .env')
}
const payloadSecret = process.env.PAYLOAD_SECRET || 'dev-only-insecure-secret'

// Both apex and www must be allowed: if a visitor browses on www and the API
// only allows apex, every authenticated fetch fails CORS.
const wwwUrl = SITE.url.replace('://', '://www.')
const allowedOrigins = [SITE.url, wwwUrl, 'http://localhost:3000']

export default buildConfig({
    serverURL: SITE.url,

    // Custom admin path — hides the CMS from bots probing /admin, /wp-admin.
    // NEVER mention this path in robots.txt. The physical route folder
    // app/(payload)/dorbar must be renamed if this ever changes.
    routes: {
        admin: '/dorbar',
    },

    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        meta: {
            titleSuffix: `— ${SITE.name}`,
        },
    },

    // Tables: pasted doc tables flatten into loose paragraphs unless the
    // (still experimental-named, but stable) table feature is enabled.
    editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
    }),

    // ---------------------------------------------------------------------
    // DATABASE — PLACEHOLDER. Configure this for the Govcon Digest project.
    //
    // Defaults to SQLite (@payloadcms/db-sqlite). Set DATABASE_URI in .env;
    // if it is unset, a local file is used so `npm run dev` still works.
    // To use Postgres/MySQL instead, install the matching @payloadcms/db-*
    // adapter and swap the call below.
    //
    // There are no committed migrations yet — generate the first one with
    //   npm run payload -- migrate:create initial
    // then `npm run migrate`. Dev push stays disabled (push: false) so the
    // schema only ever changes through committed migrations.
    // ---------------------------------------------------------------------
    db: sqliteAdapter({
        push: false,
        client: {
            url: process.env.DATABASE_URI || 'file:./data/payload.db',
        },
    }),

    collections: [Posts, News, Media, Users, Subscribers, Redirects],

    cors: allowedOrigins,
    csrf: allowedOrigins,

    upload: {
        limits: {
            fileSize: 10_000_000, // 10MB
        },
    },

    secret: payloadSecret,
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    sharp,

    // Seed the first admin from .env on boot (instead of the
    // /create-first-user screen). Runs only when the users collection is
    // empty; changing the env values later does NOT update the user.
    onInit: async (payload) => {
        const email = process.env.CMS_ADMIN_EMAIL
        const password = process.env.CMS_ADMIN_PASSWORD
        if (!email || !password) return
        try {
            const { totalDocs } = await payload.count({ collection: 'users' })
            if (totalDocs === 0) {
                await payload.create({
                    collection: 'users',
                    data: { email, password, name: 'Admin', role: 'admin' },
                    overrideAccess: true,
                })
                payload.logger.info(`Seeded first admin user: ${email}`)
            }
        } catch {
            // Tables not migrated yet (e.g. during `payload migrate` on a
            // fresh DB) — seeding happens on the next boot instead.
        }
    },
})
