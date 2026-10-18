import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SITE } from '@/lib/config'

export const alt = `${SITE.name} logo`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
    const logo = await readFile(join(process.cwd(), 'public/logo.png'))

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: '#ffffff',
                }}
            >
                {/* ImageResponse renders the existing logo directly into the PNG. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`data:image/png;base64,${logo.toString('base64')}`}
                    alt={alt}
                    width={690}
                    height={259}
                    style={{ objectFit: 'contain' }}
                />
            </div>
        ),
        size,
    )
}
