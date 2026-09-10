import type { Field } from 'payload'

/* Optional per-article JSON-LD pasted by the SEO team (e.g. FAQPage, HowTo).
   Rendered on the article page IN ADDITION to the automatic NewsArticle
   schema. Validated here so broken JSON can't be saved. */
export const customSchemaField: Field = {
    name: 'customSchema',
    type: 'textarea',
    label: 'Custom schema (JSON-LD)',
    admin: {
        description:
            'Optional. Paste extra Schema.org JSON-LD for this article (e.g. FAQPage). ' +
            'Added alongside the automatic NewsArticle schema — do not repeat it here. ' +
            'Paste only the JSON itself, without <script> tags.',
        rows: 8,
    },
    validate: (value: null | string | undefined) => {
        if (!value || !value.trim()) return true
        if (value.includes('<script')) {
            return 'Paste only the JSON itself, without <script> tags.'
        }
        try {
            const parsed = JSON.parse(value)
            if (typeof parsed !== 'object' || parsed === null) {
                return 'Must be a JSON object or array, e.g. {"@context": "https://schema.org", ...}'
            }
        } catch {
            return 'Not valid JSON — check for missing quotes, commas, or brackets.'
        }
        return true
    },
}
