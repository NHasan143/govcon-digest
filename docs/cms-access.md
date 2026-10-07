# CMS access

Sign in at `/newsroom/sign-in`. The workspace lives at `/newsroom`; legacy
`/dorbar` URLs redirect there.

The administrative account is `naymulhasan143@gmail.com`. Administrators can
create users, edit their permissions, suspend them, and delete them through
**Users** in the workspace. New users default to **Editor**. Editors cannot
create, update, or delete users or promote themselves.

To suspend a user, change **Role** to **Suspended** and save. This blocks new
logins and revokes existing sessions. Restore **Editor** (or **Admin**, if
appropriate) to let them sign in again; revoked sessions remain invalid.
The final active administrator cannot be deleted, suspended, or demoted.

## Initial administrator

A fresh deployment can seed its first administrator using `CMS_ADMIN_EMAIL`
and `CMS_ADMIN_PASSWORD`. Set these privately in the deployment environment;
changing them does not reset an existing account. Existing accounts and MFA
state live in the database, so preserve that database during deployment.

For an existing database, the local setup tool can create the administrator:

```sh
node --env-file=.env --import tsx scripts/setup-admin.ts naymulhasan143@gmail.com
```

It generates a password and saves it privately to
`.impeccable/admin-setup/credentials.txt` and the local `.env`. It refuses to
reset an existing account or overwrite an existing credential file. Save the
password in a password manager; do not commit these files.

## Google Authenticator

Run enrollment in the environment containing the account's database:

```sh
npm run mfa -- naymulhasan143@gmail.com
```

Scan the QR code with Google Authenticator and enter the code from the new CMS
entry in the terminal. Enrollment enables MFA only after a code is verified.
Existing enrolled secrets are preserved. Gmail's own verification code is
separate and will not work here.

If the authenticator is lost, an operator with server terminal access can run:

```sh
npm run mfa -- naymulhasan143@gmail.com --disable
```

Then enroll again. Disabling MFA restores password-only server authentication;
complete re-enrollment before using the account. The CLI is the only supported
way to update MFA secrets and enrollment flags.

## Verification

```sh
node --import tsx scripts/test-cms-auth.ts
node --env-file=.env --import tsx scripts/test-user-management.ts
npx tsc --noEmit --incremental false
```

The user-management test creates a temporary editor, checks permissions and
session revocation, then removes it. Run it against the local development
database.
