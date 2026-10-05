import type { Metadata } from 'next'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
    title: `Sign in — ${SITE.name}`,
    robots: {
        index: false,
        follow: false,
    },
}

export default function CmsLoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    )
}
