/* Generates the cover art for seeded articles.
 *
 * Stock photography is the wrong fit here twice over: a GovCon trade title has
 * no use for generic lifestyle photos, and photos arrive at whatever aspect
 * ratio they were shot at — which is exactly what breaks a card grid. These
 * covers are drawn as SVG at a fixed 3:2 and rasterised with sharp, so every
 * image in every rail is dimensionally identical and on-palette with the
 * section it belongs to.
 *
 * Output is deterministic: the same (seed, colour, variant) always produces
 * the same file, so re-running the seed does not churn the media library.
 */
import sharp from 'sharp'

export const COVER_WIDTH = 1600
export const COVER_HEIGHT = 1067 // 3:2

/* Small deterministic PRNG (mulberry32) seeded from the article slug — the
   compositions vary per article but never between runs. */
const hashSeed = (input: string): number => {
    let h = 2166136261
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

const rng = (seed: number) => {
    let a = seed
    return () => {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// ---- colour helpers -------------------------------------------------------

const hexToRgb = (hex: string) => {
    const v = hex.replace('#', '')
    return {
        r: parseInt(v.slice(0, 2), 16),
        g: parseInt(v.slice(2, 4), 16),
        b: parseInt(v.slice(4, 6), 16),
    }
}

const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')

/** Mix toward black (amount < 0) or white (amount > 0). */
export const shade = (hex: string, amount: number) => {
    const { r, g, b } = hexToRgb(hex)
    const target = amount > 0 ? 255 : 0
    const t = Math.abs(amount)
    return `#${toHex(r + (target - r) * t)}${toHex(g + (target - g) * t)}${toHex(b + (target - b) * t)}`
}

// ---- pattern families -----------------------------------------------------

export const VARIANTS = ['mesh', 'radar', 'columns', 'network', 'chevron', 'contour'] as const
export type Variant = (typeof VARIANTS)[number]

type Ctx = {
    rand: () => number
    accent: string // bright line colour
    soft: string // dimmed line colour
    W: number
    H: number
}

/** Perspective grid — data/infrastructure. */
const mesh = ({ rand, accent, soft, W, H }: Ctx) => {
    const parts: string[] = []
    const horizon = H * (0.36 + rand() * 0.1)
    const cols = 16
    for (let i = 0; i <= cols; i++) {
        const x = (i / cols) * W
        const vx = W / 2 + (x - W / 2) * 2.6
        parts.push(
            `<line x1="${vx.toFixed(1)}" y1="${H}" x2="${(W / 2 + (x - W / 2) * 0.25).toFixed(1)}" y2="${horizon.toFixed(1)}" stroke="${soft}" stroke-width="1.5"/>`,
        )
    }
    for (let i = 1; i <= 14; i++) {
        const t = i / 14
        const y = horizon + (H - horizon) * t * t
        parts.push(
            `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="${i % 4 === 0 ? accent : soft}" stroke-width="${i % 4 === 0 ? 2 : 1.2}"/>`,
        )
    }
    return parts.join('')
}

/** Concentric sweep — radar, signals, surveillance. */
const radar = ({ rand, accent, soft, W, H }: Ctx) => {
    const cx = W * (0.24 + rand() * 0.5)
    const cy = H * (0.3 + rand() * 0.4)
    const parts: string[] = []
    for (let i = 1; i <= 11; i++) {
        const r = i * (W * 0.055)
        parts.push(
            `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="${i % 3 === 0 ? accent : soft}" stroke-width="${i % 3 === 0 ? 2.2 : 1.2}"/>`,
        )
    }
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + rand() * 0.2
        parts.push(
            `<line x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + Math.cos(a) * W).toFixed(1)}" y2="${(cy + Math.sin(a) * W).toFixed(1)}" stroke="${soft}" stroke-width="1"/>`,
        )
    }
    return parts.join('')
}

/** Stepped columns — budgets, obligations, markets. */
const columns = ({ rand, accent, soft, W, H }: Ctx) => {
    const n = 22
    const gap = W / n
    const parts: string[] = []
    let prev = 0.35
    for (let i = 0; i < n; i++) {
        // Random walk keeps the silhouette reading as a series, not noise.
        prev = Math.max(0.12, Math.min(0.92, prev + (rand() - 0.45) * 0.3))
        const h = H * prev
        const x = i * gap
        parts.push(
            `<rect x="${(x + gap * 0.16).toFixed(1)}" y="${(H - h).toFixed(1)}" width="${(gap * 0.68).toFixed(1)}" height="${h.toFixed(1)}" fill="${i % 5 === 0 ? accent : soft}" opacity="${i % 5 === 0 ? 0.75 : 0.4}"/>`,
        )
    }
    parts.push(
        `<line x1="0" y1="${(H * 0.5).toFixed(1)}" x2="${W}" y2="${(H * 0.5).toFixed(1)}" stroke="${accent}" stroke-width="1.6" stroke-dasharray="10 8" opacity="0.7"/>`,
    )
    return parts.join('')
}

/** Node graph — supply chains, org charts, threat maps. */
const network = ({ rand, accent, soft, W, H }: Ctx) => {
    const nodes = Array.from({ length: 26 }, () => ({
        x: rand() * W,
        y: rand() * H,
        r: 3 + rand() * 9,
    }))
    const parts: string[] = []
    nodes.forEach((a, i) => {
        // Connect to the two nearest nodes — enough structure to read as a
        // graph, sparse enough to stay quiet behind a headline.
        const near = nodes
            .map((b, j) => ({ b, j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
            .filter((x) => x.j !== i)
            .sort((x, y) => x.d - y.d)
            .slice(0, 2)
        near.forEach(({ b }) => {
            parts.push(
                `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${soft}" stroke-width="1.1"/>`,
            )
        })
    })
    nodes.forEach((n, i) => {
        parts.push(
            `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}" fill="${i % 4 === 0 ? accent : soft}" opacity="${i % 4 === 0 ? 0.95 : 0.55}"/>`,
        )
    })
    return parts.join('')
}

/** Diagonal chevrons — rank, insignia, movement. */
const chevron = ({ rand, accent, soft, W, H }: Ctx) => {
    const parts: string[] = []
    const step = 74 + rand() * 30
    for (let i = -Math.ceil(H / step); i < (W * 1.6) / step; i++) {
        const x = i * step
        const on = i % 4 === 0
        parts.push(
            `<path d="M ${x.toFixed(1)} ${H} L ${(x + H * 0.62).toFixed(1)} 0" stroke="${on ? accent : soft}" stroke-width="${on ? 9 : 4}" fill="none" opacity="${on ? 0.6 : 0.3}"/>`,
        )
    }
    return parts.join('')
}

/** Contour lines — terrain, geospatial, mapping. */
const contour = ({ rand, accent, soft, W, H }: Ctx) => {
    const parts: string[] = []
    const layers = 13
    for (let l = 0; l < layers; l++) {
        const baseY = (l / layers) * H * 1.25 - H * 0.12
        const amp = 26 + rand() * 46
        const freq = 1.4 + rand() * 1.8
        const phase = rand() * Math.PI * 2
        const pts: string[] = []
        for (let x = 0; x <= W; x += 24) {
            const y = baseY + Math.sin((x / W) * Math.PI * freq + phase) * amp
            pts.push(`${x},${y.toFixed(1)}`)
        }
        parts.push(
            `<polyline points="${pts.join(' ')}" fill="none" stroke="${l % 4 === 0 ? accent : soft}" stroke-width="${l % 4 === 0 ? 2.4 : 1.3}" opacity="${l % 4 === 0 ? 0.85 : 0.45}"/>`,
        )
    }
    return parts.join('')
}

const RENDERERS: Record<Variant, (ctx: Ctx) => string> = {
    mesh,
    radar,
    columns,
    network,
    chevron,
    contour,
}

// ---- composition ----------------------------------------------------------

export const variantFor = (seed: string): Variant => VARIANTS[hashSeed(seed) % VARIANTS.length]

export function coverSvg(seed: string, color: string, variant: Variant = variantFor(seed)): string {
    const rand = rng(hashSeed(seed))
    const W = COVER_WIDTH
    const H = COVER_HEIGHT

    const deep = shade(color, -0.62)
    const mid = shade(color, -0.3)
    const accent = shade(color, 0.52)
    const soft = shade(color, 0.3)

    const angle = Math.floor(rand() * 4) // gradient direction, quantised
    const [x2, y2] = [
        ['100%', '100%'],
        ['100%', '0%'],
        ['0%', '100%'],
        ['60%', '100%'],
    ][angle]

    const body = RENDERERS[variant]({ rand, accent, soft, W, H })

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="${x2}" y2="${y2}">
      <stop offset="0%" stop-color="${mid}"/>
      <stop offset="100%" stop-color="${deep}"/>
    </linearGradient>
    <radialGradient id="vig" cx="50%" cy="42%" r="78%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
    </radialGradient>
    <clipPath id="frame"><rect width="${W}" height="${H}"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g clip-path="url(#frame)" opacity="0.72">${body}</g>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect x="0" y="${H - 7}" width="${W}" height="7" fill="${shade(color, 0.3)}"/>
</svg>`
}

/** Rasterise a cover to a JPEG buffer. */
export async function renderCover(
    seed: string,
    color: string,
    variant: Variant = variantFor(seed),
): Promise<Buffer> {
    return sharp(Buffer.from(coverSvg(seed, color, variant)))
        .jpeg({ quality: 86, progressive: true, mozjpeg: true })
        .toBuffer()
}

/** Square author portrait built from the same palette — initials on a field. */
export async function renderAvatar(seed: string, color: string, initials: string): Promise<Buffer> {
    const S = 400
    const rand = rng(hashSeed(seed))
    const deep = shade(color, -0.5)
    const mid = shade(color, -0.12 + rand() * 0.2)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${mid}"/><stop offset="100%" stop-color="${deep}"/>
  </linearGradient></defs>
  <rect width="${S}" height="${S}" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, 'Times New Roman', serif" font-size="168" font-weight="700"
        fill="#ffffff" fill-opacity="0.92" letter-spacing="4">${initials}</text>
</svg>`
    return sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toBuffer()
}
