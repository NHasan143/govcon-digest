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
node --import tsx scripts/test-rate-limit.ts
node --env-file=.env --import tsx scripts/test-user-management.ts
DATABASE_URI=file:/path/to/a-copy.db node --env-file=.env --import tsx scripts/test-public-access.ts
DATABASE_URI=file:/path/to/a-copy.db MEDIA_DIR=/path/to/a-media-copy node --env-file=.env --import tsx scripts/test-upload-types.ts
npx tsc --noEmit --incremental false
```

The public-access test checks what a logged-out visitor can learn about CMS
accounts. They may see an author's name, page slug and social links, and
nothing else. They can't filter, sort or count users (or articles through
`author.*`) by email, role, 2FA status, sessions or password fields. More
broadly, anonymous queries on Posts, News, Users and Media may only use the
fields the website itself filters on — everything else, including article
content, is refused with a 403. The rules live in `payload/access/userPrivacy.ts`
(what a response contains) and `payload/access/publicQueries.ts` (what can be
queried). Both are allowlists, so a new field stays private until it's
explicitly added. Run the test against a copy of the database.

The upload-types test uploads, as a temporary editor, one real image in each
allowed format (JPEG, PNG, WebP, AVIF, GIF) and checks thumbnails are made, then
tries SVGs and disguised files (an SVG renamed `.png`, HTML or text renamed as
an image, a PDF renamed `.png`) and expects every one to be rejected. It writes
files, so it refuses to run unless `MEDIA_DIR` points at a scratch folder.

The user-management test creates a temporary editor, checks permissions and
session revocation, then removes it. Run it against the local development
database.
