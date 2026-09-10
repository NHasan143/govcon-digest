import { permanentRedirect, redirect } from 'next/navigation'
import { findRedirect } from '@/lib/cms'

/* Call this immediately before notFound() on any route that can 404:
 *
 *     if (!post) {
 *         await maybeRedirect(`/${category}/${slug}`)
 *         notFound()
 *     }
 *
 * It checks the redirection panel (the CMS `redirects` collection) for a rule
 * matching the path and redirects if one exists; otherwise it returns and the
 * caller's notFound() renders the 404 page. Editors can therefore point old or
 * dead URLs anywhere without a deploy.
 *
 * Deliberately returns void rather than never so TypeScript still narrows on
 * the caller's own notFound(), and deliberately lives on the routes rather than
 * in not-found.tsx — reading the request path there would force every page in
 * the group to be rendered per request instead of prerendered.
 */
export async function maybeRedirect(path: string): Promise<void> {
    const rule = await findRedirect(path)
    if (!rule) return

    // permanentRedirect issues 308 and redirect 307 — both preserve the request
    // method, and Google treats them as 301/302 respectively.
    if (rule.type === 301) permanentRedirect(rule.to)
    redirect(rule.to)
}
