'use client'

import { useSearchParams } from 'next/navigation'

// Renders the result of a newsletter form POST. The API route redirects back
// to the originating page with ?subscribed=<code>; without this the visitor
// got no feedback at all.
const MESSAGES: Record<string, { text: string; ok: boolean }> = {
    subscribed: { text: 'You\u2019re subscribed. Watch for the next briefing in your inbox.', ok: true },
    already: { text: 'You\u2019re already subscribed \u2014 thanks for reading!', ok: true },
    invalid: { text: 'That email address doesn\u2019t look right. Please try again.', ok: false },
    error: { text: 'Something went wrong. Please try again in a moment.', ok: false },
}

export default function NewsletterStatus() {
    const status = useSearchParams().get('subscribed')
    if (!status) return null

    const message = MESSAGES[status]
    if (!message) return null

    return (
        <p
            role="status"
            className="font-small mt-15 mb-0"
            // Readable against both the light and dark theme backgrounds.
            style={{ color: message.ok ? '#2da44e' : '#e5534b' }}
        >
            {message.text}
        </p>
    )
}
