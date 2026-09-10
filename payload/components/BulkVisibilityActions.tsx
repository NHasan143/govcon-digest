'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { toast, useAuth, useSelection } from '@payloadcms/ui'
import type { User } from '@/payload-types'

/* Bulk "Hide on site" / "Show on site" buttons above the Posts list.
   Acts on the rows selected via the list checkboxes. Admin-only — the
   `hidden` field itself is also protected by field-level access, so this is
   UI on top of an enforced rule, not the enforcement itself. */
export const BulkVisibilityActions = () => {
    const { user } = useAuth<User>()
    const { count, selected } = useSelection()
    const [busy, setBusy] = useState(false)
    // Rendered on both the Posts and News list views — target the collection
    // whose list we're on (/dorbar/collections/<slug>)
    const pathname = usePathname()
    const collectionSlug = pathname?.match(/\/collections\/([^/?]+)/)?.[1] ?? 'posts'

    if (user?.role !== 'admin') return null

    const selectedIds = Array.from(selected.entries())
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id)

    const setHidden = async (hidden: boolean) => {
        if (selectedIds.length === 0 || busy) return
        setBusy(true)
        try {
            const qs = new URLSearchParams({
                'where[id][in]': selectedIds.join(','),
                depth: '0',
            })
            const res = await fetch(`/api/${collectionSlug}?${qs.toString()}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hidden }),
            })
            const json = await res.json()
            if (!res.ok || (json.errors?.length ?? 0) > 0) {
                throw new Error(json.errors?.[0]?.message || 'Bulk update failed')
            }
            toast.success(
                `${json.docs?.length ?? selectedIds.length} post(s) are now ${hidden ? 'hidden from' : 'visible on'} the site.`,
            )
            // Reload so the list, row highlights, and selection state refresh
            window.location.reload()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Bulk update failed')
            setBusy(false)
        }
    }

    const disabled = count === 0 || busy
    const buttonStyle: React.CSSProperties = {
        padding: '6px 14px',
        borderRadius: 4,
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-50)',
        color: 'var(--theme-elevation-800)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontSize: 13,
    }

    return (
        <div
            className="bulk-visibility-actions"
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}
        >
            <button type="button" style={buttonStyle} disabled={disabled} onClick={() => setHidden(true)}>
                {busy ? 'Working…' : 'Hide on site'}
            </button>
            <button type="button" style={buttonStyle} disabled={disabled} onClick={() => setHidden(false)}>
                {busy ? 'Working…' : 'Show on site'}
            </button>
            <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>
                {count === 0
                    ? 'Select posts with the checkboxes, then hide/show them on the site.'
                    : `${count} selected`}
            </span>
        </div>
    )
}
