# Govcon Digest

News/magazine website built with Next.js 15 (App Router), React 19, TypeScript, Bootstrap 5, and Payload CMS 3.

## Setup

```bash
cp .env.example .env   # then adjust values for your environment
npm install
npm run dev            # http://localhost:3000
```

Site identity (name, URL, contact emails, social handles, address) is configured
via environment variables — see `.env.example` and `lib/config.ts`.
`NEXT_PUBLIC_*` values are inlined at build time, so rebuild after changing them.

## Database

SQLite by default (`@payloadcms/db-sqlite`); set `DATABASE_URI` in `.env` — a
local file works for development (`file:./data/payload.db`). Apply migrations
with `npm run migrate`. To use Postgres or MySQL instead, install the matching
`@payloadcms/db-*` adapter and swap the call in `payload.config.ts`.

## Demo content

```bash
node --env-file=.env --import tsx scripts/seed-govcon.ts           # seed
node --env-file=.env --import tsx scripts/seed-govcon.ts --reset   # wipe + reseed
```

Seeds 75 published posts across all seven sections and their subsections, with
generated cover art, so every homepage block fills. **Everything it writes is
placeholder copy — the companies, figures and events are invented to
demonstrate layout. Replace it before launch.**

## Commands

```bash
npm run dev                  # Dev server
npm run build                # Production build
npm run start                # Serve the production build
npm run lint                 # ESLint
npm run migrate              # Apply Payload DB migrations
npm run payload -- <cmd>     # Payload CLI
npm run generate:types       # Regenerate payload-types.ts after collection changes
npm run generate:importmap   # Regenerate the admin import map
npm run mfa -- <email>       # Enroll a CMS user in TOTP 2FA (--disable to remove)
```
