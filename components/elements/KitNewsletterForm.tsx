'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './KitNewsletterForm.module.css'

const KIT_FORM_URL = 'https://govcon-digest.kit.com/5b16268d1e'

export default function KitNewsletterForm() {
    const host = useRef<HTMLDivElement>(null)
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

    useEffect(() => {
        const container = host.current
        if (!container) return

        // Kit replaces this script with its form. Keep that DOM outside React's
        // children and recreate it on each mount, including client navigation.
        const script = document.createElement('script')
        script.async = true
        script.dataset.uid = '5b16268d1e'
        script.src = `${KIT_FORM_URL}/index.js`
        script.onload = () => setStatus(container.querySelector('form') ? 'ready' : 'error')
        script.onerror = () => setStatus('error')
        container.replaceChildren(script)

        return () => {
            script.onload = null
            script.onerror = null
            container.replaceChildren()
        }
    }, [])

    return (
        <div className={styles.embed}>
            <div ref={host} className={styles.host} />
            {status !== 'ready' && (
                <p className={styles.status} role="status">
                    {status === 'loading' ? 'Loading signup form…' : (
                        <>The signup form couldn’t load. <a href={KIT_FORM_URL}>Subscribe directly</a>.</>
                    )}
                </p>
            )}
            <noscript>
                <p className={styles.status}>
                    <a href={KIT_FORM_URL}>Open the newsletter signup form</a> to subscribe.
                </p>
            </noscript>
        </div>
    )
}
