/* Legacy article URL: /{category}/{slug}/. Articles now live at /{slug}; old
   links and indexed URLs are sent there with a permanent redirect. */
import { notFound, permanentRedirect } from 'next/navigation'
import { maybeRedirect } from '@/lib/redirect-guard'
import { articleUrl, getArticleBySlug } from '@/lib/cms'

type Args = {
    params: Promise<{ category: string; slug: string }>
}

export default async function LegacyArticleRedirect({ params }: Args) {
    const { category, slug } = await params
    const article = await getArticleBySlug(slug)
    if (article) permanentRedirect(articleUrl(article.doc))
    await maybeRedirect(`/${category}/${slug}`)
    notFound()
}
