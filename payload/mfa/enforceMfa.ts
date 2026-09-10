import { APIError, type CollectionBeforeLoginHook } from 'payload'
import { verifyToken } from './totp'

// The 2FA gate. Payload verifies the password first, then this hook runs:
// users with MFA enrolled must present a valid TOTP code in the
// 'x-authenticator-code' header (attached by the custom login page).
// Users without MFA set up log in normally.
export const enforceMfa: CollectionBeforeLoginHook = async ({ req, user }) => {
    // Re-read the user with hidden fields — the TOTP secret is hidden:true
    const fullUser = await req.payload.findByID({
        collection: 'users',
        id: user.id,
        overrideAccess: true,
        showHiddenFields: true,
    })

    const mfa = (fullUser as { mfa?: { enabled?: boolean; secret?: string } }).mfa

    if (mfa?.enabled && mfa?.secret) {
        const code = req.headers.get('x-authenticator-code')
        if (!code || !verifyToken(code.trim(), mfa.secret)) {
            throw new APIError('Invalid authenticator code', 401)
        }
    }

    return user
}
