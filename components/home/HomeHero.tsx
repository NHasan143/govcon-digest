/* Homepage hero band.
 *
 *   ┌────────┬──────────────────────┬──────────┐
 *   │ side 1 │                      │  LATEST  │
 *   ├────────┤     lead story       │  1..5    │
 *   │ side 2 │                      │          │
 *   └────────┴──────────────────────┴──────────┘
 *
 * `lead` + `side` are the three featured slots; `latest` is the rail of five
 * recent stories on the right.
 */
import type { Article } from '@/types'
import { DateLine, Excerpt, Headline, Kicker, SectionHead, Thumb, styles } from './primitives'

export default function HomeHero({
    lead,
    side,
    latest,
}: {
    lead: Article
    side: Article[]
    latest: Article[]
}) {
    return (
        <section className={styles.hero} aria-label="Top stories">
            {/* Left — two stacked stories */}
            <div className={styles.heroSide}>
                {side.map((article) => (
                    <article key={article.id} className={styles.heroSideItem}>
                        <Thumb article={article} ratio="ratio43" sizes="(max-width: 991px) 45vw, 200px" />
                        <Kicker article={article} />
                        <Headline article={article} clamp={3} as="h3" />
                        <DateLine article={article} />
                    </article>
                ))}
            </div>

            {/* Centre — the lead story */}
            <article className={styles.heroMain}>
                <Thumb article={lead} ratio="ratio32" sizes="(max-width: 991px) 100vw, 620px" priority />
                <div className={styles.heroMainBody}>
                    <Kicker article={lead} />
                    <Headline article={lead} clamp={3} as="h2" />
                    <Excerpt article={lead} clamp={4} />
                    <DateLine article={lead} />
                </div>
            </article>

            {/* Right — the LATEST rail */}
            <div className={styles.heroLatest}>
                <SectionHead title="Latest" href="/latest" />
                <ul className={styles.latestList}>
                    {latest.map((article) => (
                        <li key={article.id} className={styles.latestItem}>
                            <div>
                                <Headline article={article} clamp={3} as="h3" />
                                <DateLine article={article} />
                            </div>
                            <Thumb article={article} ratio="ratio11" sizes="74px" />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

