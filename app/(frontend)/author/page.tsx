/* The template's demo author listing is gone — the real page is /authors. */
import { redirect } from 'next/navigation'

export default function AuthorIndexRedirect() {
    redirect('/authors')
}
