/* Legacy news URL: /stories/{slug}/. News articles now live at /{slug}, like
   posts; old links are sent there with a permanent redirect. The /stories
   index itself is unchanged. */
import { notFound, permanentRedirect } from 'next/navigation'
import { maybeRedirect } from '@/lib/redirect-guard'
import { articleUrl, getArticleBySlug } from '@/lib/cms'

type Args = {
    params: Promise<{ slug: string }>
}

export default async function LegacyNewsRedirect({ params }: Args) {
    const { slug } = await params
    const article = await getArticleBySlug(slug)
    if (article) permanentRedirect(articleUrl(article.doc))
    await maybeRedirect(`/stories/${slug}`)
    notFound()
}
