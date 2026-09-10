'use client'

import type { DefaultCellComponentProps } from 'payload'

/* Custom cell for the Posts `hidden` column. The `.post-hidden-marker` class
   doubles as the hook for the row highlight in app/(payload)/custom.css. */
export const HiddenCell = ({ cellData }: DefaultCellComponentProps) => {
    if (!cellData) return <span>—</span>
    return <span className="post-hidden-marker">Hidden</span>
}
