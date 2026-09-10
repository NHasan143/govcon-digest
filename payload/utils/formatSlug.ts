import type { FieldHook } from 'payload'

// WordPress-style slug behavior: lowercase, strip specials,
// spaces/underscores/dashes → hyphens. Exported so seed scripts and
// link builders produce byte-identical slugs to the CMS hook.
export const slugify = (val: string): string =>
    val
        .replace(/[\s_—–]+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-')
        .toLowerCase()

// FieldHook factory: if the slug is empty, slugify the fallback field
// (e.g. title); if the editor typed one, slugify their input.
export const formatSlug =
    (fallback: string): FieldHook =>
    ({ value, originalDoc, data }) => {
        if (typeof value === 'string' && value.length > 0) {
            return slugify(value)
        }
        const fallbackValue = data?.[fallback] || originalDoc?.[fallback]
        if (typeof fallbackValue === 'string' && fallbackValue.length > 0) {
            return slugify(fallbackValue)
        }
        return value
    }
