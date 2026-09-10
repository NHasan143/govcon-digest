/* Renders the editor-pasted "Custom schema (JSON-LD)" from the CMS SEO group,
   alongside (never instead of) the automatic article schema. Invalid JSON is
   skipped silently so a bad paste can never break the page. */
export default function CustomSchema({ json }: { json?: string | null }) {
    if (!json || !json.trim()) return null

    let parsed: unknown
    try {
        parsed = JSON.parse(json)
    } catch {
        return null
    }
    if (typeof parsed !== 'object' || parsed === null) return null

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                // Re-serialize (never echo the raw paste) and escape `<` so the
                // content can't break out of the script tag.
                __html: JSON.stringify(parsed).replace(/</g, '\\u003c'),
            }}
        />
    )
}
