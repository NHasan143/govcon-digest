import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const { docs: admins } = await payload.find({ collection: 'users', where: { email: { equals: 'naymulhasan143@gmail.com' } }, overrideAccess: true })
assert.equal(admins[0]?.role, 'admin')
const admin = { ...admins[0], collection: 'users' as const }
const email = `permission-test-${Date.now()}@example.invalid`
const password = randomBytes(24).toString('base64url')
let userId: number | undefined
try {
    await assert.rejects(() => payload.create({ collection: 'users', data: { email, password, name: 'Permission test', role: 'admin' }, overrideAccess: false }))
    const editor = await payload.create({ collection: 'users', data: { email, password, name: 'Permission test', role: 'editor' }, overrideAccess: false, user: admin })
    userId = editor.id
    const editorIdentity = { ...editor, collection: 'users' as const }
    await assert.rejects(() => payload.update({ collection: 'users', id: editor.id, data: { role: 'admin' }, overrideAccess: false, user: editorIdentity }))
    await assert.rejects(() => payload.delete({ collection: 'users', id: admin.id, overrideAccess: false, user: editorIdentity }))
    const session = await payload.login({ collection: 'users', data: { email, password } })
    assert.ok(session.token)
    const headers = new Headers({ Authorization: `JWT ${session.token}`, DisableAutologin: 'true' })
    assert.equal((await payload.auth({ headers })).user?.id, editor.id)
    await payload.update({ collection: 'users', id: editor.id, data: { role: 'suspended' }, overrideAccess: false, user: admin })
    await assert.rejects(() => payload.login({ collection: 'users', data: { email, password } }), /suspended/)
    assert.equal((await payload.auth({ headers })).user, null)
    await payload.update({ collection: 'users', id: editor.id, data: { role: 'editor' }, overrideAccess: false, user: admin })
    assert.equal((await payload.auth({ headers })).user, null)
    await payload.delete({ collection: 'users', id: editor.id, overrideAccess: false, user: admin })
    userId = undefined
    console.log('PASS: administrator creation/deletion, editor permission boundaries, suspension login denial and existing-session revocation. Temporary test account removed.')
} finally {
    if (userId) await payload.delete({ collection: 'users', id: userId, overrideAccess: true })
}
process.exit(0)
