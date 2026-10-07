/* Create a CMS administrator without exposing a generated password in logs. */
import { randomBytes } from 'node:crypto'
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

const email = process.argv[2]?.trim().toLowerCase()
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Provide the administrator email address.')
const credentialPath = resolve('.impeccable/admin-setup/credentials.txt')
try {
    await access(credentialPath)
    throw new Error('A credential file already exists. Preserve it before creating another account.')
} catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
}
const payload = await getPayload({ config })
const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true })
if (totalDocs) throw new Error('This email already has an account. No credentials or permissions were changed.')
const password = randomBytes(24).toString('base64url')
await payload.create({
    collection: 'users',
    data: { email, password, name: 'Naymul Hasan', role: 'admin' },
    overrideAccess: true,
})
await mkdir(resolve('.impeccable/admin-setup'), { recursive: true, mode: 0o700 })
await writeFile(credentialPath, `CMS administrator\nSign in: /newsroom/sign-in\nEmail: ${email}\nPassword: ${password}\n\nStore this password in your password manager.\nComplete Google Authenticator enrollment before live use.\n`, { mode: 0o600, flag: 'wx' })
// Also configure first-user seeding for a fresh deployment. Existing accounts
// are never reset by the seed hook.
const envPath = resolve('.env')
let env = await readFile(envPath, 'utf8')
for (const [key, value] of Object.entries({ CMS_ADMIN_EMAIL: email, CMS_ADMIN_PASSWORD: password })) {
    const line = new RegExp(`^${key}=.*$`, 'm')
    env = line.test(env) ? env.replace(line, `${key}=${value}`) : `${env.trimEnd()}\n${key}=${value}\n`
}
await writeFile(envPath, env, { mode: 0o600 })
console.log(`Administrator created for ${email}. Credentials saved privately at ${credentialPath}.`)
process.exit(0)
