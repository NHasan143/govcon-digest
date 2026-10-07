/* CLI to enroll a user in TOTP 2FA (or disable it — lockout recovery).
 *
 *   npm run mfa -- user@email.com             enroll: scan QR, then confirm a code
 *   npm run mfa -- user@email.com --disable   disable (lost phone)
 *
 * Run it inside the target checkout — it uses that environment's .env, so it
 * edits the user in whichever database .env points at.
 */
import { getPayload } from 'payload'
import qrcode from 'qrcode'
import config from '../payload.config'
import { generateSecret, otpauthUri, verifyToken } from '../payload/mfa/totp'
import { createInterface } from 'node:readline/promises'
import { chmod } from 'node:fs/promises'

const run = async () => {
    const email = process.argv.find((a) => a.includes('@'))
    const disable = process.argv.includes('--disable')
    const qrFileIndex = process.argv.indexOf('--qr-file')
    const qrFile = qrFileIndex >= 0 ? process.argv[qrFileIndex + 1] : undefined
    if (qrFileIndex >= 0 && (!qrFile || qrFile.startsWith('--'))) {
        throw new Error('--qr-file requires a file path')
    }

    if (!email) {
        console.error('Usage: npm run mfa -- <email> [--disable | --qr-file <path>]')
        process.exit(1)
    }

    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
        overrideAccess: true,
        showHiddenFields: true,
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

    if (user.mfa?.enabled) {
        console.log(`MFA is already enabled for ${email}. Existing enrollment was preserved.`)
        process.exit(0)
    }

    const secret = generateSecret()
    const uri = otpauthUri(email, secret)
    if (qrFile) {
        await qrcode.toFile(qrFile, uri, { width: 360, margin: 2 })
        await chmod(qrFile, 0o600)
        console.log(`Scan the QR code at ${qrFile} using Google Authenticator.`)
    } else {
        console.log(await qrcode.toString(uri, { type: 'terminal', small: true }))
        console.log(`Manual entry key: ${secret}`)
        console.log('Scan with Google Authenticator / any TOTP app.')
    }

    // Do not change the account until the app proves it has the correct secret.
    const terminal = createInterface({ input: process.stdin, output: process.stdout })
    let confirmed = false
    try {
        for (let attempt = 0; attempt < 3; attempt++) {
            const code = await terminal.question('Enter the six-digit code for this CMS entry (or press Enter to cancel): ')
            if (!code.trim()) break
            if (verifyToken(code.trim(), secret)) {
                confirmed = true
                break
            }
            console.log('Code did not match. Check the CMS entry and try its current code.')
        }
    } finally {
        terminal.close()
    }
    if (!confirmed) {
        console.log('Enrollment cancelled. Your account was not changed.')
        process.exit(1)
    }
    await payload.update({
        collection: 'users',
        id: user.id,
        data: { mfa: { enabled: true, secret } },
        overrideAccess: true,
    })
    console.log(`MFA enabled for ${email}. Sign in at /newsroom/sign-in with your password and authenticator code.`)

    process.exit(0)
}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})
