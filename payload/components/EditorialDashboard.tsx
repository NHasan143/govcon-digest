import Link from 'next/link'
import type { AdminViewServerProps, PayloadRequest } from 'payload'
import { editorialFont } from '@/components/cms/EditorialBrand'
import styles from '@/components/cms/EditorialWorkspace.module.css'
import { getCategory } from '@/lib/categories'
import { SITE } from '@/lib/config'

const adminPath = '/dorbar'
const contentCollections = [{ slug: 'posts', label: 'Posts' }, { slug: 'news', label: 'News' }] as const

async function getContent(req: PayloadRequest, collection: 'posts' | 'news') {
    try {
        const [recent, drafts, published] = await Promise.all([
            req.payload.find({ collection, req, overrideAccess: false, draft: true, depth: 0, limit: 6, sort: '-updatedAt', select: { title: true, category: true, updatedAt: true, _status: true, hidden: true } }),
            req.payload.find({ collection, req, overrideAccess: false, draft: true, depth: 0, limit: 1, where: { _status: { equals: 'draft' } }, select: { title: true } }),
            req.payload.count({ collection, req, overrideAccess: false, where: { _status: { equals: 'published' } } }),
        ])
        return { collection, recent: recent.docs, drafts: drafts.totalDocs, published: published.totalDocs, available: true }
    } catch (error) {
        req.payload.logger.error({ err: error, msg: `Unable to load ${collection} dashboard content` })
        return { collection, recent: [], drafts: 0, published: 0, available: false }
    }
}

export async function EditorialDashboard({ initPageResult }: AdminViewServerProps) {
    const { req, permissions, visibleEntities } = initPageResult
    if (!req.user) return null
    const readable = contentCollections.filter(({ slug }) => visibleEntities.collections.includes(slug) && permissions.collections?.[slug]?.read)
    const content = await Promise.all(readable.map(({ slug }) => getContent(req, slug)))
    const recent = content.flatMap(result => result.recent.map(doc => ({ ...doc, collection: result.collection }))).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 6)
    const unavailable = content.some(result => !result.available)
    const drafts = content.reduce((sum, result) => sum + result.drafts, 0)
    const published = content.reduce((sum, result) => sum + result.published, 0)
    const tools = [
        { slug: 'media', label: 'Media library', description: 'Images and uploads' },
        { slug: 'users', label: 'People', description: 'Editors and account settings' },
        { slug: 'subscribers', label: 'Subscribers', description: 'Newsletter audience' },
        { slug: 'redirects', label: 'Redirects', description: 'Manage changed URLs' },
    ] as const
    const availableTools = tools.filter(({ slug }) => visibleEntities.collections.includes(slug) && permissions.collections?.[slug]?.read)

    return (
        <main className={`${editorialFont.variable} ${styles.workspace} ${styles.dashboard}`}>
            <header className={styles.deskHeader}>
                <div><h1>Editorial desk.</h1><p>Welcome back{req.user.name ? `, ${req.user.name}` : ''}. Pick up a story or start the next one.</p></div>
                <div className={styles.actions}>
                    {readable.filter(({ slug }) => permissions.collections?.[slug]?.create).map(({ slug }) => <Link key={slug} href={`${adminPath}/collections/${slug}/create`} className={`${styles.button} ${slug === 'news' ? styles.secondaryButton : ''}`}>{slug === 'posts' ? 'Write a post' : 'Write news'}<Arrow /></Link>)}
                </div>
            </header>
            {content.length > 0 && <div className={styles.overview} aria-label="Publishing overview">
                <span className={styles.overviewItem}><strong>{unavailable ? '—' : drafts}</strong> Drafts in progress</span>
                <span className={styles.overviewItem}><strong>{unavailable ? '—' : published}</strong> Published versions</span>
                <span className={styles.overviewItem}>Across {readable.map(({ label }) => label).join(' and ')}</span>
            </div>}
            <div className={styles.deskColumns}>
                <section aria-labelledby="recent-title">
                    <div className={styles.sectionHeader}><h2 id="recent-title">Recently edited</h2><span>Latest {recent.length} {recent.length === 1 ? 'story' : 'stories'}</span></div>
                    {unavailable && <p className={styles.error} role="status">Some content could not be loaded. <Link href={adminPath}>Reload the desk</Link> or open a collection below.</p>}
                    {recent.length > 0 ? <ul className={styles.storyList}>{recent.map(story => <li className={styles.story} key={`${story.collection}-${story.id}`}>
                        <Link className={styles.storyLink} href={`${adminPath}/collections/${story.collection}/${story.id}`}>
                            <div><h3>{story.title || 'Untitled story'}</h3><div className={styles.storyMeta}><span>{story.collection === 'posts' ? 'Post' : 'News'}</span><span>{getCategory(story.category)?.name || 'Uncategorized'}</span><time dateTime={story.updatedAt}>Edited {formatDate(story.updatedAt)}</time></div></div>
                            <div className={styles.storyStatus}><span className={`${styles.status} ${story._status === 'draft' ? styles.draft : ''}`}>{story._status === 'draft' ? 'Draft' : 'Published'}</span>{story.hidden && <span className={styles.hidden}>Hidden</span>}<span className={styles.storyArrow}><Arrow /></span></div>
                        </Link>
                    </li>)}</ul> : !unavailable && <div className={styles.empty}><h3>{readable.length ? 'A fresh editorial desk.' : 'Your workspace is ready.'}</h3><p>{readable.length ? 'Create a post or news story to begin. Your latest edits will appear here.' : 'Use the available collection tools to manage your workspace.'}</p></div>}
                </section>
                <aside aria-label="Workspace shortcuts">
                    {readable.length > 0 && <section className={styles.toolSection}><h2>Content</h2>{readable.map(({ slug, label }) => {
                        const result = content.find(item => item.collection === slug)
                        return <Link key={slug} className={styles.toolLink} href={`${adminPath}/collections/${slug}`}><span>{label}<small>{result?.available ? `${result.drafts} drafts · ${result.published} published versions` : 'Open collection'}</small></span><Arrow /></Link>
                    })}</section>}
                    {availableTools.length > 0 && <section className={styles.toolSection}><h2>Manage</h2>{availableTools.map(tool => <Link key={tool.slug} className={styles.toolLink} href={`${adminPath}/collections/${tool.slug}`}><span>{tool.label}<small>{tool.description}</small></span><Arrow /></Link>)}</section>}
                    <section className={styles.toolSection}><h2>Publication</h2><Link className={styles.toolLink} href="/"><span>Visit {SITE.name}<small>Open the public website</small></span><Arrow /></Link><Link className={styles.toolLink} href={`${adminPath}/account`}>Your account<Arrow /></Link></section>
                </aside>
            </div>
            <footer className={styles.deskFooter}>Drafts reflect the latest saved edits. Published versions can include stories with newer drafts or hidden stories.</footer>
        </main>
    )
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))
}

function Arrow() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
}
