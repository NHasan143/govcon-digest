/* CLI to enroll a user in TOTP 2FA (or disable it — lockout recovery).
 *
 *   npm run mfa -- user@email.com             enroll: prints QR + manual key
 *   npm run mfa -- user@email.com --disable   disable (lost phone)
 *
 * Run it inside the target checkout — it uses that environment's .env, so it
 * edits the user in whichever database .env points at.
 */
import { getPayload } from 'payload'
import qrcode from 'qrcode'
import config from '../payload.config'
import { generateSecret, otpauthUri } from '../payload/mfa/totp'

const run = async () => {
    const email = process.argv.find((a) => a.includes('@'))
    const disable = process.argv.includes('--disable')

    if (!email) {
        console.error('Usage: npm run mfa -- <email> [--disable]')
        process.exit(1)
    }

    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
        overrideAccess: true,
    })
    const user = docs[0]
    if (!user) {
        console.error(`No user found with email ${email}`)
        process.exit(1)
    }

    if (disable) {
        await payload.update({
            collection: 'users',
            id: user.id,
            data: { mfa: { enabled: false, secret: null } },
            overrideAccess: true,
        })
        console.log(`MFA disabled for ${email}`)
        process.exit(0)
    }

    const secret = generateSecret()
    await payload.update({
        collection: 'users',
        id: user.id,
        data: { mfa: { enabled: true, secret } },
        overrideAccess: true,
    })

    const uri = otpauthUri(email, secret)
    console.log(await qrcode.toString(uri, { type: 'terminal', small: true }))
    console.log(`Manual entry key: ${secret}`)
    console.log('Scan with Google Authenticator / Authy / any TOTP app.')
    console.log('From now on, logging in requires the 6-digit code.')
    process.exit(0)
}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})
