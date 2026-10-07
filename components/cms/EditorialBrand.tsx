import { EB_Garamond } from 'next/font/google'
import { SITE } from '@/lib/config'
import styles from './EditorialWorkspace.module.css'

export const editorialFont = EB_Garamond({ subsets: ['latin'], weight: ['500', '600'], variable: '--cms-serif' })

export function EditorialBrand({ showDetail = true }: { showDetail?: boolean } = {}) {
    return <span className={`${editorialFont.variable} ${styles.brand}`}>{SITE.name}{showDetail && <span className={styles.brandDetail}>Editorial workspace</span>}</span>
}

export function EditorialIcon() {
    return <span className={`${editorialFont.variable} ${styles.brandIcon}`} aria-label="GovCon Digest">GovCon Digest</span>
}
