import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { maybeRedirect } from '@/lib/redirect-guard'

type Args = { params: Promise<{ notFound?: string[] }> }

const requestPath = async (params: Args['params']) =>
    `/${((await params).notFound ?? []).join('/')}`

// With multiple root layouts (frontend / payload / cms-login) there is no
// app-root not-found for unmatched URLs — this catch-all routes them into
// the frontend group so they render the styled 404 page. It is also where the
// redirection panel gets its widest coverage: any URL matching no other route
// passes through here.
//
// notFound() is thrown from generateMetadata, NOT the page body: metadata
// resolves before the response starts streaming, so the HTTP status is a
// real 404. Thrown from the page body it would be a soft-404 (200) because
// the loading.tsx boundary starts streaming first.
export async function generateMetadata({ params }: Args): Promise<Metadata> {
    await maybeRedirect(await requestPath(params))
    notFound()
}

export default async function CatchAllNotFound({ params }: Args) {
    await maybeRedirect(await requestPath(params))
    notFound()
}
