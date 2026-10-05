'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { EditorialBrand, editorialFont } from '@/components/cms/EditorialBrand'
import styles from '@/components/cms/EditorialWorkspace.module.css'
import { SITE } from '@/lib/config'

export default function CmsLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)
    const submitting = useRef(false)

    const submit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (submitting.current) return
        submitting.current = true
        setBusy(true)
        setError('')
        let redirecting = false
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'x-authenticator-code': code.trim() },
                body: JSON.stringify({ email: email.trim(), password }),
            })
            if (response.ok) {
                window.location.href = '/dorbar'
                redirecting = true
                return
            }
            const data = await response.json().catch(() => null)
            setError(data?.errors?.[0]?.message || 'Unable to sign in. Check your details and try again.')
        } catch {
            setError('Unable to connect. Check your connection and try again.')
        } finally {
            if (!redirecting) {
                submitting.current = false
                setBusy(false)
            }
        }
    }

    return (
        <main className={`${editorialFont.variable} ${styles.workspace} ${styles.login}`}>
            <header className={styles.loginHeader}>
                <EditorialBrand showDetail={false} />
                <Link href="/" className={styles.publicationLink}>Visit publication <Arrow /></Link>
            </header>
            <div className={styles.loginBody}>
                <section className={styles.intro} aria-labelledby="workspace-title">
                    <div className={styles.introHeading}>
                        <h1 id="workspace-title"><span className={styles.introFirstLine}>The next story </span><span className={styles.introLastLine}>starts here.<span className={styles.introRule} aria-hidden="true" /></span></h1>
                    </div>
                    <p className={styles.introNote}>Write. Refine. Publish.<br />An editorial workspace for {SITE.name}.</p>
                </section>
                <form className={styles.loginForm} onSubmit={submit} aria-labelledby="signin-title" aria-busy={busy}>
                    <h2 id="signin-title">Welcome back.</h2>
                    <p className={styles.formIntro}>Sign in to your editorial workspace.</p>
                    <div className={styles.field}>
                        <label htmlFor="cms-email"><span>Email address <span aria-hidden="true">*</span></span></label>
                        <input id="cms-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="cms-password"><span>Password <span aria-hidden="true">*</span></span></label>
                        <div className={styles.passwordField}>
                            <input id="cms-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
                            <button className={styles.passwordToggle} type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-controls="cms-password" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="cms-code"><span>Authenticator code <span aria-hidden="true">*</span></span></label>
                        <input id="cms-code" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" aria-describedby="cms-code-hint" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} required />
                        <p id="cms-code-hint" className={styles.fieldHint}>Enter the six-digit code from your authenticator app.</p>
                    </div>
                    {error && <p className={styles.error} role="alert">{error}</p>}
                    <button type="submit" className={`${styles.button} ${styles.loginSubmit}`} data-loading={busy} disabled={busy}>
                        <span key={busy ? 'pending' : 'ready'} className={styles.submitLabel}>{busy ? 'Signing in…' : 'Sign in'}</span>
                        <span className={styles.submitIcon} aria-hidden="true">{busy ? <svg className={styles.submitSpinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="8" opacity=".3" /><circle cx="12" cy="12" r="8" strokeDasharray="18 33" strokeLinecap="round" /></svg> : <Arrow />}</span>
                        {busy && <span className={styles.submitProgress} aria-hidden="true" />}
                    </button>
                    <div className={styles.credentialNote} role="note" aria-label="Sign-in assistance">
                        <p><strong>Forgot your login credentials?</strong>{' '}Please contact the site administrator with a cup of <span className={styles.coffeeText}>coffee.</span></p>
                        <svg className={styles.coffeeMug} width="36" height="40" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path className={styles.coffeeSteam} d="M8 8c-2-2 2-3 0-5" />
                        <path className={`${styles.coffeeSteam} ${styles.coffeeSteamSecond}`} d="M13 8c-2-2 2-3 0-5" />
                        <path d="M16 12h2a3 3 0 0 1 0 6h-2" stroke="#8a5a1f" />
                        <path d="M5 11h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-7Z" fill="#c26542" stroke="#7c3d28" />
                        <path d="M6 15h9" stroke="#f4d49a" />
                        <path d="M3 24h16" stroke="#8a5a1f" />
                        </svg>
                    </div>
                </form>
            </div>
            <span className={styles.submitAnnouncement} role="status" aria-live="polite">{busy ? 'Signing in. Please wait.' : ''}</span>
        </main>
    )
}

function Arrow() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
}
