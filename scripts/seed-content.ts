/* Seeds the homepage's articles as real Payload posts:
 *   - uploads each post's photo into the Media collection (editable in the CMS)
 *   - creates author users (role: editor, random passwords)
 *   - creates published posts whose Lexical bodies mirror the /single demo
 *     article structure: lede, separator, paragraphs, h2 subheads,
 *     mid-article image, pull-quote
 *
 * Idempotent: posts are skipped when their slug already exists; authors and
 * media are reused by email/filename.
 *
 *   node --env-file=.env --import tsx scripts/seed-content.ts
 */
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'
import { slugify } from '../payload/utils/formatSlug'
import type { CategorySlug } from '../lib/categories'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const IMG_DIR = path.resolve(dirname, '../public/assets/imgs/news')

type SeedPost = {
    title: string
    excerpt: string
    category: CategorySlug
    image: string // filename in public/assets/imgs/news
    author: string // key into AUTHORS
    tags: string[]
    featured?: boolean // homepage hero, right column (max 4)
    sliderFeatured?: boolean // homepage hero, left slider
}

const AUTHORS: Record<string, { name: string; email: string }> = {
    steven: { name: 'Steven Kenedy', email: 'steven.kenedy@govcondigest.com' },
    sarah: { name: 'Sarah Johnson', email: 'sarah.johnson@govcondigest.com' },
    michael: { name: 'Michael Chen', email: 'michael.chen@govcondigest.com' },
    emma: { name: 'Emma Wilson', email: 'emma.wilson@govcondigest.com' },
    barbara: { name: 'Barbara Cartland', email: 'barbara.cartland@govcondigest.com' },
}

// Order matters: index 0 is the newest post. The homepage renders slots in
// this order — hero slider (0-1), hero sidebar (2-5), Today Highlight (6-15),
// Editor Picked (16-19), Recent posts (20-28), sidebar widget (29-31).
const POSTS: SeedPost[] = [
    {
        title: "This magical drug mansion in Upstate New York is where the psychedelic '60s took off",
        excerpt:
            'William Mellon Hitchcock was not your typical acid head. Billy, as he was called, was a tall, charming blonde stockbroker in his twenties who worked at Lehman Brothers — and heir to one of the largest fortunes in the country.',
        category: 'health-medicine',
        image: 'news-12.jpg',
        author: 'steven',
        tags: ["America's", 'New York'],
        sliderFeatured: true,
    },
    {
        title: 'What I Learned From a Year of Reading Only Books by Women',
        excerpt:
            "Alice Fishburn set herself a challenge for 2018 to only read female authors. Here's what she discovered — starting, as so many of the best things do, with an attempt to one-up a sibling.",
        category: 'business-finance',
        image: 'news-19.jpg',
        author: 'emma',
        tags: ['Books', 'Publishing'],
        sliderFeatured: true,
    },
    {
        title: "There's a 49 Percent Chance the World As We Know It Will End by 2050",
        excerpt: "Jared Diamond's new book, Upheaval, addresses itself to a world very obviously in crisis.",
        category: 'science-technology',
        image: 'news-2.jpg',
        author: 'steven',
        tags: ['Climate'],
        featured: true,
    },
    {
        title: 'Why The New York City subway signage is considered iconic? The true story',
        excerpt: 'Black and white signs with Helvetica showing just the information subway riders need.',
        category: 'science-technology',
        image: 'news-3.jpg',
        author: 'sarah',
        tags: ['Design'],
        featured: true,
    },
    {
        title: 'This Freedom Rider was shot at, attacked, and put on death row — all by 20 years old',
        excerpt: "As Trumpauer left Jackson behind, she didn't know if her life was about to get better or worse.",
        category: 'us-economy',
        image: 'news-4.jpg',
        author: 'michael',
        tags: ['History'],
        featured: true,
    },
    {
        title: 'This athlete conquered poverty, racism, and polio in order to became an Olympian',
        excerpt: 'Six-year-old Wilma Rudolph was different from the other kids.',
        category: 'us-economy',
        image: 'news-5.jpg',
        author: 'emma',
        tags: ['Olympics'],
        featured: true,
    },
    // --- Today Highlight ---
    {
        title: "Poland's Presidential Election Was Close but Voters Remain Far Apart",
        excerpt: 'A narrow result leaves a divided electorate — and little common ground in sight.',
        category: 'international',
        image: 'news-6.jpg',
        author: 'steven',
        tags: ['Politics'],
    },
    {
        title: 'After Months of Debate, England Requires Face Masks for Shoppers',
        excerpt: 'The rule ends a long public argument over masks in shops — but enforcement questions remain.',
        category: 'health-medicine',
        image: 'news-15.jpg',
        author: 'sarah',
        tags: ['Health'],
    },
    {
        title: 'A Racial Awakening in France, Where Race Is a Taboo Topic',
        excerpt: 'A new generation is forcing a conversation the republic has long avoided.',
        category: 'international',
        image: 'news-14.jpg',
        author: 'michael',
        tags: ['Society'],
    },
    {
        title: "Strains Show in Russia's Make-Believe Politics",
        excerpt: 'The performance of stability is getting harder to maintain.',
        category: 'international',
        image: 'news-3.jpg',
        author: 'steven',
        tags: ['Politics'],
    },
    {
        title: 'Ireland Has a New Coronavirus Fear: Americans Who Flout Quarantine',
        excerpt: 'Visitors skipping the two-week isolation rule are testing Irish patience.',
        category: 'international',
        image: 'news-2.jpg',
        author: 'emma',
        tags: ['Health'],
    },
    {
        title: 'World Population Could Peak Decades Ahead of U.N. Forecast, Study Asserts',
        excerpt: 'New modeling suggests the global population curve may bend far sooner than expected.',
        category: 'science-technology',
        image: 'news-7.jpg',
        author: 'michael',
        tags: ['Research'],
    },
    {
        title: 'Egyptian Dissident Battles Extradition in Spanish Court',
        excerpt: 'A test case for how far European courts will go to protect political exiles.',
        category: 'international',
        image: 'news-8.jpg',
        author: 'sarah',
        tags: ['Politics'],
    },
    {
        title: "He Changed His Country's Name. Will North Macedonia Punish Him?",
        excerpt: 'The deal ended a decades-long dispute — and may end a political career.',
        category: 'international',
        image: 'news-9.jpg',
        author: 'steven',
        tags: ['Politics'],
    },
    {
        title: "'I Felt Defenseless': Seoul Mayor's Secretary Speaks Out About Alleged Abuse",
        excerpt: 'Her account has reignited a national debate about power and accountability.',
        category: 'international',
        image: 'news-10.jpg',
        author: 'emma',
        tags: ['Society'],
    },
    {
        title: 'Bahrain to Execute 2 Shiite Protesters After Years of Desperate Appeals',
        excerpt: 'Rights groups say the confessions were coerced; the courts have run out of patience.',
        category: 'international',
        image: 'news-11.jpg',
        author: 'michael',
        tags: ['Politics'],
    },
    // --- Editor Picked ---
    {
        title: 'Unlucky Charms: The Rise and Fall of Billion-Dollar Jewelry Empire Alex and Ani',
        excerpt: 'From mall kiosks to a billion-dollar valuation — and back down again.',
        category: 'business-finance',
        image: 'news-21.jpg',
        author: 'barbara',
        tags: ['Business', 'Retail'],
    },
    {
        title: 'Coronavirus May Be a Blood Vessel Disease, Which Explains Everything',
        excerpt:
            'In April, blood clots emerged as one of the many mysterious symptoms attributed to Covid-19, a disease first thought to largely affect the lungs.',
        category: 'health-medicine',
        image: 'news-22.jpg',
        author: 'sarah',
        tags: ['Covid19', 'Health'],
    },
    {
        title: 'Gaming During the Pandemic Is Starting to Feel Like Work',
        excerpt: 'When the hobby that got you through lockdown becomes another obligation.',
        category: 'science-technology',
        image: 'news-8.jpg',
        author: 'steven',
        tags: ['Gaming'],
    },
    {
        title: 'Tiny Weed-Killing Robots Could Make Pesticides Obsolete',
        excerpt: "Clint Brauer's farm outside of Cheney, Kansas, could be described as Old MacDonald's Farm — plus robots.",
        category: 'ai-automation',
        image: 'news-9.jpg',
        author: 'michael',
        tags: ['Robotics', 'Agriculture'],
    },
    // --- Recent posts ---
    {
        title: 'How to Reopen Schools: What Science and Other Countries Teach Us',
        excerpt:
            'The pressure to bring American students back to classrooms is intense, but the calculus is tricky with infections still out of control in many communities.',
        category: 'us-economy',
        image: 'news-15.jpg',
        author: 'emma',
        tags: ['World', 'Education'],
    },
    {
        title: 'The Endgame for LinkedIn Is Coming',
        excerpt: 'Every time this LinkedIn commercial pops up on YouTube I am reminded of how low the company has fallen.',
        category: 'ai-automation',
        image: 'thumb-2.jpg',
        author: 'steven',
        tags: ['Technology'],
    },
    {
        title: 'Neuroscience Says Listening to This Song Reduces Anxiety by Up to 65 Percent',
        excerpt: 'Researchers measured what calm actually sounds like — and one track kept winning.',
        category: 'health-medicine',
        image: 'thumb-4.jpg',
        author: 'sarah',
        tags: ['Music'],
    },
    {
        title: 'I Have A Theory That Donald Glover And Childish Gambino Are Secretly The Same Person',
        excerpt:
            'Donald Glover is a beloved actor, writer, and comedian; Childish Gambino is a popular musician. Coincidence?',
        category: 'business-finance',
        image: 'thumb-8.jpg',
        author: 'michael',
        tags: ['Entertainment'],
    },
    {
        title: 'Half a million people have seen me naked',
        excerpt:
            'Twitch has quickly become a household name after its acquisition by Amazon — and its creators live with a new kind of exposure.',
        category: 'business-finance',
        image: 'thumb-9.jpg',
        author: 'emma',
        tags: ['Internet'],
    },
    {
        title: "What Is Your True 'Character'? And Who's to Judge It?",
        excerpt:
            "Marjorie Garber's new book prods at confusion surrounding the word — its philosophical roots, literary history, political uses and inadvertent comedy.",
        category: 'us-economy',
        image: 'news-4.jpg',
        author: 'barbara',
        tags: ['Books'],
    },
    {
        title: 'How the United Arab Emirates Set Its Sights on Mars',
        excerpt:
            'The launch of the Hope orbiter was delayed because of weather. The goal is for it to make contributions to research on the red planet.',
        category: 'science-technology',
        image: 'news-13.jpg',
        author: 'steven',
        tags: ['Space'],
    },
    {
        title: "A Big California Quake Just Got 'a Little Likelier'",
        excerpt: 'A new analysis puts the likelihood of an earthquake slightly higher than earlier forecasts.',
        category: 'science-technology',
        image: 'news-17.jpg',
        author: 'michael',
        tags: ['Research'],
    },
    {
        title: 'A Record 5.4 Million Americans Have Lost Health Insurance',
        excerpt:
            "California's governor announced a sweeping rollback of the state's reopening, and Los Angeles and San Diego school districts will be online-only in the fall.",
        category: 'us-economy',
        image: 'news-18.jpg',
        author: 'sarah',
        tags: ['Healthcare'],
    },
    // --- Sidebar "Most comments" widget ---
    {
        title: 'How I Made $11,000 From Writing in 30 Days',
        excerpt: 'A month-long experiment in publishing every single day — and what it actually paid.',
        category: 'business-finance',
        image: 'thumb-3.jpg',
        author: 'emma',
        tags: ['Writing'],
    },
    {
        title: "Incognito Mode Won't Keep Your Browsing Private",
        excerpt: 'The purple mask hides less than you think. Here is what private browsing actually does.',
        category: 'ai-automation',
        image: 'thumb-4.jpg',
        author: 'michael',
        tags: ['Privacy'],
    },
    {
        title: "So You Want To Know The Cause of Avicii's Death?",
        excerpt: 'What the coverage got wrong — and why the questions still linger.',
        category: 'health-medicine',
        image: 'thumb-5.jpg',
        author: 'barbara',
        tags: ['Music'],
    },
]

// ---- Lexical builders (structure mirrors the /single demo article) ----
const text = (t: string) => ({
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: t,
    type: 'text',
    version: 1,
})
const p = (t: string) => ({
    type: 'paragraph',
    version: 1,
    textFormat: 0,
    children: [text(t)],
    direction: 'ltr',
    format: '',
    indent: 0,
})
const h2 = (t: string) => ({
    type: 'heading',
    tag: 'h2',
    version: 1,
    children: [text(t)],
    direction: 'ltr',
    format: '',
    indent: 0,
})
const quote = (t: string) => ({
    type: 'quote',
    version: 1,
    children: [text(t)],
    direction: 'ltr',
    format: '',
    indent: 0,
})
const hr = () => ({ type: 'horizontalrule', version: 1 })
const uploadNode = (mediaId: number) => ({
    type: 'upload',
    version: 3,
    relationTo: 'media',
    value: mediaId,
    fields: null,
    format: '',
})

const buildContent = (post: SeedPost, mediaId: number) => ({
    root: {
        type: 'root',
        version: 1,
        direction: 'ltr',
        format: '' as const,
        indent: 0,
        children: [
            p(post.excerpt),
            hr(),
            p(
                'The story has moved quickly since it first surfaced, and the details our reporters have confirmed so far paint a fuller picture than the early headlines suggested. What follows is what we know, what remains unclear, and why it matters this morning.',
            ),
            h2('The story so far'),
            p(
                'Sources close to the matter describe a situation that developed over months rather than days. Documents and interviews reviewed by Morning Glance show a pattern that was visible to insiders well before it reached public attention — and that pattern is what gives this story its weight.',
            ),
            uploadNode(mediaId),
            quote(post.excerpt),
            h2('What to watch next'),
            p(
                'The coming weeks should bring more clarity. We will keep following the principals involved, the official responses, and the numbers that tell the real story — and we will update this piece as the facts develop. For the latest coverage, keep an eye on the ' +
                    post.tags[0] +
                    ' topic and our daily briefing.',
            ),
        ],
    },
})

// ---- Seeding ----
const run = async () => {
    const payload: Payload = await getPayload({ config })

    // Authors
    const authorIds: Record<string, number> = {}
    for (const [key, a] of Object.entries(AUTHORS)) {
        const existing = await payload.find({
            collection: 'users',
            where: { email: { equals: a.email } },
            limit: 1,
            overrideAccess: true,
        })
        if (existing.docs[0]) {
            authorIds[key] = existing.docs[0].id
            continue
        }
        const user = await payload.create({
            collection: 'users',
            data: {
                email: a.email,
                password: crypto.randomBytes(16).toString('base64url'),
                name: a.name,
                role: 'editor',
            },
            overrideAccess: true,
        })
        authorIds[key] = user.id
        console.log(`author created: ${a.name}`)
    }

    // Media (one upload per unique file)
    const mediaIds: Record<string, number> = {}
    const uploadImage = async (filename: string, alt: string): Promise<number> => {
        if (mediaIds[filename]) return mediaIds[filename]
        const existing = await payload.find({
            collection: 'media',
            where: { filename: { equals: filename } },
            limit: 1,
            overrideAccess: true,
        })
        if (existing.docs[0]) {
            mediaIds[filename] = existing.docs[0].id
            return existing.docs[0].id
        }
        const media = await payload.create({
            collection: 'media',
            data: { alt },
            filePath: path.join(IMG_DIR, filename),
            overrideAccess: true,
        })
        mediaIds[filename] = media.id
        console.log(`media uploaded: ${filename}`)
        return media.id
    }

    // Posts (newest first in POSTS → descending publishedAt)
    const now = Date.now()
    let created = 0
    for (const [index, post] of POSTS.entries()) {
        const slug = slugify(post.title)
        const existing = await payload.find({
            collection: 'posts',
            where: { slug: { equals: slug } },
            limit: 1,
            overrideAccess: true,
        })
        if (existing.docs[0]) {
            // Keep hero flags in sync when re-running against an existing DB
            const doc = existing.docs[0]
            const wantFeatured = Boolean(post.featured)
            const wantSlider = Boolean(post.sliderFeatured)
            if (doc.featured !== wantFeatured || doc.sliderFeatured !== wantSlider) {
                await payload.update({
                    collection: 'posts',
                    id: doc.id,
                    data: { featured: wantFeatured, sliderFeatured: wantSlider },
                    overrideAccess: true,
                })
                console.log(`flags synced: ${slug}`)
            } else {
                console.log(`skip (exists): ${slug}`)
            }
            continue
        }
        const mediaId = await uploadImage(post.image, post.title)
        await payload.create({
            collection: 'posts',
            data: {
                title: post.title,
                slug,
                category: post.category,
                excerpt: post.excerpt,
                author: authorIds[post.author],
                publishedAt: new Date(now - index * 3 * 60 * 60 * 1000).toISOString(),
                featured: Boolean(post.featured),
                sliderFeatured: Boolean(post.sliderFeatured),
                coverImage: mediaId,
                tags: post.tags.map((tag) => ({ tag })),
                seo: { metaTitle: post.title, metaDescription: post.excerpt },
                content: buildContent(post, mediaId) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
                _status: 'published',
            },
            overrideAccess: true,
        })
        created++
        console.log(`post created: /${post.category}/${slug}`)
    }

    console.log(`done — ${created} posts created, ${POSTS.length - created} skipped`)
    process.exit(0)
}

run().catch((e) => {
    console.error(e)
    process.exit(1)
})
