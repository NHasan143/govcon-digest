// otplib v12 is CJS — grab the module namespace and unwrap whichever shape
// the runtime (Node ESM interop vs bundler) hands us.
import * as otplibModule from 'otplib'

const otplib = ((otplibModule as Record<string, unknown>).default ??
    otplibModule) as typeof import('otplib')
const { authenticator } = otplib

const ISSUER = 'Morning Glance CMS'

// window: 1 → tolerate ±30s clock drift between server and phone
authenticator.options = { window: 1 }

export const generateSecret = (): string => authenticator.generateSecret()

export const otpauthUri = (account: string, secret: string): string =>
    authenticator.keyuri(account, ISSUER, secret)

export const verifyToken = (token: string, secret: string): boolean => {
    try {
        return authenticator.verify({ token, secret })
    } catch {
        return false
    }
}
