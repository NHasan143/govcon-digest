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

The database is a placeholder — configure it for this project before using the
CMS. See the `db` block in `payload.config.ts` and `DATABASE_URI` in
`.env.example`. There are no migrations yet; after defining the content model:

```bash
npm run payload -- migrate:create initial
npm run migrate
```

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
