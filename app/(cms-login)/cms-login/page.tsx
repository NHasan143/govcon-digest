'use client'

// Custom CMS login page, served via middleware rewrite when the admin path
// is visited without a session. Posts credentials to Payload's real login
// endpoint with the TOTP code attached as the 'x-authenticator-code' header
// (see payload/mfa/enforceMfa.ts).
import { useState } from 'react'

const ADMIN_PATH = '/dorbar'

export default function CmsLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setBusy(true)
        setError('')
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-authenticator-code': code.trim(),
                },
                body: JSON.stringify({ email, password }),
            })
            if (res.ok) {
                window.location.href = ADMIN_PATH
                return
            }
            const data = await res.json().catch(() => null)
            setError(data?.errors?.[0]?.message || 'Login failed')
        } catch {
            setError('Network error — please try again')
        } finally {
            setBusy(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 12px',
        marginBottom: 14,
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: 6,
        color: '#eee',
        fontSize: 15,
        outline: 'none',
        boxSizing: 'border-box',
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0d0d0d',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
        >
            <form
                onSubmit={submit}
                style={{
                    width: 340,
                    padding: 32,
                    background: '#141414',
                    border: '1px solid #262626',
                    borderRadius: 10,
                }}
            >
                <h1 style={{ color: '#eee', fontSize: 20, margin: '0 0 4px' }}>Morning Glance CMS</h1>
                <p style={{ color: '#888', fontSize: 13, margin: '0 0 24px' }}>Sign in to continue</p>

                <input
                    style={inputStyle}
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    style={inputStyle}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="Authenticator code (if enabled)"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                {error && (
                    <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 14px' }}>{error}</p>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: busy ? '#444' : '#eee',
                        color: busy ? '#999' : '#111',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: busy ? 'default' : 'pointer',
                    }}
                >
                    {busy ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    )
}
