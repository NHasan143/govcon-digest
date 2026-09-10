/* Old newsletter URL — the subscribe page now lives at /subscribe. */
import { redirect } from 'next/navigation'

export default function NewsletterRedirect() {
    redirect('/subscribe')
}
