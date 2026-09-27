/* The three repeating homepage block layouts.
 *
 *   CardRow      — N equal cards side by side (reference layout's BUSINESS row)
 *   FeatureRail  — one large story beside a 2×2 grid of four (its POLITICS block)
 *   EditorsPicks — one large story beside a numbered list of four
 *
 * All three take a pre-sliced list and render exactly what they are given, so
 * the page decides how many posts a block gets, not the block.
 */
import type { Article } from '@/types'
import { Byline, DateLine, Excerpt, Headline, Kicker, SectionHead, Thumb, styles } from './primitives'

/* ------------------------------------------------------------------ CardRow */

export function CardRow({
    title,
    href,
    accent,
    articles,
    columns = 4,
    showExcerpt = true,
}: {
    title: string
    href?: string
    accent?: string
    articles: Article[]
    columns?: 4 | 5
    showExcerpt?: boolean
}) {
    if (articles.length === 0) return null

    // next/image needs a realistic width hint per breakpoint so it does not
    // ship a full-width source for a quarter-width card.
    const sizes =
        columns === 5
            ? '(max-width: 575px) 100vw, (max-width: 991px) 50vw, 230px'
            : '(max-width: 575px) 100vw, (max-width: 991px) 50vw, 285px'

    return (
        <section className={styles.block}>
            <SectionHead title={title} href={href} accent={accent} />
            <div className={styles.cardRow} style={{ ['--cols' as string]: columns }}>
                {articles.map((article) => (
                    <article key={article.id} className={styles.card}>
                        <Thumb article={article} ratio="ratio43" sizes={sizes} />
                        <Kicker article={article} />
                        <Headline article={article} clamp={3} as="h3" />
                        <div className={styles.cardMeta}>
                            <DateLine article={article} />
                        </div>
                        {showExcerpt && <Excerpt article={article} clamp={3} />}
                    </article>
                ))}
            </div>
        </section>
    )
}

/* -------------------------------------------------------------- FeatureRail */

export function FeatureRail({
    title,
    href,
    accent,
    articles,
}: {
    title: string
    href?: string
    accent?: string
    articles: Article[]
}) {
    if (articles.length === 0) return null

    const [lead, ...rest] = articles
    const satellites = rest.slice(0, 4)

    return (
        <section className={styles.block}>
            <SectionHead title={title} href={href} accent={accent} />
            <div className={styles.feature}>
                <article className={styles.featureMain}>
                    {/* 4:3 rather than 3:2 — the satellite grid beside it is two
                        card-rows tall, and the shorter crop left the column
                        ending well above it. */}
                    <Thumb
                        article={lead}
                        ratio="ratio43"
                        sizes="(max-width: 991px) 100vw, 660px"
                    />
                    <Kicker article={lead} />
                    <Headline article={lead} clamp={3} as="h3" />
                    <Excerpt article={lead} clamp={3} />
                    <Byline article={lead} />
                </article>

                {satellites.length > 0 && (
                    <div className={styles.featureGrid}>
                        {satellites.map((article) => (
                            <article key={article.id} className={styles.card}>
                                <Thumb
                                    article={article}
                                    ratio="ratio43"
                                    sizes="(max-width: 575px) 100vw, (max-width: 991px) 45vw, 250px"
                                />
                                <Kicker article={article} />
                                <Headline article={article} clamp={3} as="h4" />
                                <Excerpt article={article} clamp={2} />
                                <DateLine article={article} />
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

/* ------------------------------------------------------------- EditorsPicks */

export function EditorsPicks({
    title,
    href,
    articles,
}: {
    title: string
    href?: string
    articles: Article[]
}) {
    if (articles.length === 0) return null

    const [lead, ...rest] = articles
    const list = rest.slice(0, 4)

    return (
        <section className={styles.block}>
            <SectionHead title={title} href={href} />
            <div className={styles.picks}>
                <article className={styles.picksMain}>
                    <Thumb article={lead} ratio="ratio32" sizes="(max-width: 991px) 100vw, 640px" />
                    <Kicker article={lead} />
                    <Headline article={lead} clamp={3} as="h3" />
                    <Excerpt article={lead} clamp={3} />
                    <Byline article={lead} />
                </article>

                {list.length > 0 && (
                    <ol className={styles.picksList}>
                        {list.map((article, index) => (
                            <li key={article.id} className={styles.picksItem}>
                                <span className={styles.picksNum} aria-hidden>
                                    {String(index + 2).padStart(2, '0')}
                                </span>
                                <div>
                                    <Kicker article={article} />
                                    <Headline article={article} clamp={3} as="h4" />
                                    <DateLine article={article} />
                                </div>
                                <Thumb article={article} ratio="ratio11" sizes="96px" />
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </section>
    )
}
