/* Shared building blocks for the homepage blocks. Server components — no
   client JS is needed for any of this layout. */
import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/types'
import { getSection } from '@/lib/categories'
import styles from './home.module.css'

const PLACEHOLDER = '/assets/imgs/news/news-1.jpg'

export const formatDate = (value: Date | string) =>
    new Date(value).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

/** Section accent colour, resolved from the article's category slug. */
export const accentOf = (article: Article): string => {
    const slug = String(article.category?.slug || '').replace(/^\//, '')
    return getSection(slug)?.color || '#101010'
}

type Ratio = 'ratio43' | 'ratio32' | 'ratio11' | 'ratio169'

export function Thumb({
    article,
    ratio = 'ratio43',
    sizes,
    priority = false,
    className = '',
}: {
    article: Article
    ratio?: Ratio
    sizes: string
    priority?: boolean
    className?: string
}) {
    const src = article.featuredImage || article.thumbnailImage || PLACEHOLDER
    return (
        <Link href={article.slug} className={`${styles.thumb} ${styles[ratio]} ${className}`} tabIndex={-1} aria-hidden>
            <Image src={src} alt={article.title} fill sizes={sizes} priority={priority} />
        </Link>
    )
}

/* Category eyebrow. Shows the article's own category, plus its parent section
   when the two differ — the reference layout's "BUSINESS · INTERVIEW" pair. */
export function Kicker({ article }: { article: Article }) {
    const slug = String(article.category?.slug || '').replace(/^\//, '')
    const section = getSection(slug)
    const isSubsection = Boolean(section && section.slug !== slug)

    return (
        <span className={styles.kicker} style={{ ['--kickerColor' as string]: accentOf(article) }}>
            {isSubsection && section && (
                <>
                    <Link href={`/${section.slug}`}>{section.name}</Link>
                    <span className={styles.sep}>·</span>
                </>
            )}
            <Link href={article.category.slug}>{article.category.name}</Link>
        </span>
    )
}

export function Headline({
    article,
    clamp = 3,
    as: Tag = 'h3',
}: {
    article: Article
    clamp?: 2 | 3 | 4
    as?: 'h2' | 'h3' | 'h4'
}) {
    return (
        <Tag className={`${styles.headline} ${styles[`clamp${clamp}`]}`}>
            <Link href={article.slug}>{article.title}</Link>
        </Tag>
    )
}

export function DateLine({ article }: { article: Article }) {
    return (
        <p className={styles.date}>
            <time dateTime={new Date(article.publishedAt).toISOString()}>{formatDate(article.publishedAt)}</time>
        </p>
    )
}

export function Excerpt({ article, clamp = 3 }: { article: Article; clamp?: 2 | 3 | 4 }) {
    if (!article.excerpt) return null
    return <p className={`${styles.excerpt} ${styles[`clamp${clamp}`]}`}>{article.excerpt}</p>
}

export function Byline({ article }: { article: Article }) {
    return (
        <div className={styles.byline}>
            <time dateTime={new Date(article.publishedAt).toISOString()}>{formatDate(article.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>
                by <Link href={article.author.slug}>{article.author.name}</Link>
            </span>
        </div>
    )
}

/** Heading rule above a block: label on the left, "View all" on the right. */
export function SectionHead({
    title,
    href,
    accent,
}: {
    title: string
    href?: string
    accent?: string
}) {
    return (
        <div className={styles.sectionHead} style={accent ? { borderBottomColor: accent } : undefined}>
            <h2 className={styles.sectionTitle} style={accent ? { color: accent } : undefined}>
                {href ? <Link href={href}>{title}</Link> : title}
            </h2>
            {href && (
                <Link href={href} className={styles.viewAll}>
                    View all &raquo;
                </Link>
            )}
        </div>
    )
}

export { styles }
