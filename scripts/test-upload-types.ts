// Checks that the Media collection accepts only real raster images.
// Uploads go through the same Local API path as the CMS, as a temporary
// editor account, and every created document (and its files) is removed again.
//
// Writes files, so run it against COPIES — it refuses to start unless
// MEDIA_DIR is set:
//   DATABASE_URI=file:/tmp/copy.db MEDIA_DIR=/tmp/media-copy \
//     node --env-file=.env --import tsx scripts/test-upload-types.ts

import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '../payload.config'

assert.ok(process.env.MEDIA_DIR, 'Set MEDIA_DIR to a scratch folder — this test writes uploads.')

const payload = await getPayload({ config })
const failures: string[] = []
const created: number[] = []
let editorId: number | undefined

// A real image in each allowed format, made in memory. Large enough that
// Payload generates the thumbnail and card sizes (it never upscales).
const base = () =>
    sharp({ create: { width: 900, height: 600, channels: 3, background: { r: 30, g: 120, b: 200 } } })
const svgPlain = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>')
const svgScript = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>/* upload test */</script></svg>')
const svgXmlDecl = Buffer.from('<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>')

const allowed: Array<[string, string, Buffer]> = [
    ['photo.jpg', 'image/jpeg', await base().jpeg().toBuffer()],
    ['photo.png', 'image/png', await base().png().toBuffer()],
    ['photo.webp', 'image/webp', await base().webp().toBuffer()],
    ['photo.avif', 'image/avif', await base().avif().toBuffer()],
    ['photo.gif', 'image/gif', await base().gif().toBuffer()],
]

const rejected: Array<[string, string, string, Buffer]> = [
    ['plain SVG', 'logo.svg', 'image/svg+xml', svgPlain],
    ['SVG with a script', 'logo.svg', 'image/svg+xml', svgScript],
    ['SVG renamed .png', 'photo.png', 'image/png', svgPlain],
    ['SVG (xml declaration) renamed .jpg', 'photo.jpg', 'image/jpeg', svgXmlDecl],
    ['SVG with a script renamed .webp', 'photo.webp', 'image/webp', svgScript],
    ['HTML renamed .png', 'page.png', 'image/png', Buffer.from('<!doctype html><html><body><h1>not an image</h1></body></html>')],
    ['plain text renamed .jpg', 'notes.jpg', 'image/jpeg', Buffer.from('just some text, not an image')],
    ['PDF renamed .png', 'doc.png', 'image/png', Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF')],
]

try {
    const editor = await payload.create({
        collection: 'users',
        data: {
            email: `upload-test-${Date.now()}@example.invalid`,
            password: randomBytes(24).toString('base64url'),
            name: 'Upload test',
            role: 'editor',
        },
        overrideAccess: true,
    })
    editorId = editor.id
    const user = { ...editor, collection: 'users' as const }

    const upload = (name: string, mimetype: string, data: Buffer) =>
        payload.create({
            collection: 'media',
            data: { alt: `upload test ${name}` },
            file: { data, mimetype, name, size: data.length },
            overrideAccess: false,
            user,
        })

    for (const [name, mimetype, data] of allowed) {
        try {
            const doc = await upload(name, mimetype, data)
            created.push(doc.id)
            if (doc.mimeType !== mimetype) failures.push(`${name}: stored as ${doc.mimeType}, expected ${mimetype}`)
            if (!doc.sizes?.thumbnail?.filename) failures.push(`${name}: no thumbnail was generated`)
        } catch (error) {
            failures.push(`${name} (${mimetype}) was rejected: ${(error as Error).message}`)
        }
    }

    for (const [label, name, mimetype, data] of rejected) {
        try {
            const doc = await upload(name, mimetype, data)
            created.push(doc.id)
            failures.push(`${label} was ACCEPTED (stored as ${doc.mimeType})`)
        } catch {
            // rejected — expected
        }
    }
} finally {
    for (const id of created) {
        await payload.delete({ collection: 'media', id, overrideAccess: true }).catch(() => {})
    }
    if (editorId) await payload.delete({ collection: 'users', id: editorId, overrideAccess: true }).catch(() => {})
}

if (failures.length) {
    console.error(`FAIL — ${failures.length} problem(s):\n  - ${failures.join('\n  - ')}`)
    process.exit(1)
}
console.log(`PASS: ${allowed.length} raster formats upload with thumbnails; ${rejected.length} SVG and disguised non-image uploads are rejected. Test uploads and account removed.`)
process.exit(0)
