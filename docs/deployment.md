# Deploy GovCon Digest to a Hostinger VPS

This guide deploys `govcondigest.com` from GitHub to an existing Hostinger VPS running other applications. The domain can remain in a different Hostinger account.

```text
GitHub repository → VPS → PM2 → existing Nginx/Apache → govcondigest.com
```

Use a separate application directory, PM2 process, and domain configuration for GovCon Digest. Reuse the existing public web server.

## 1. Check the VPS

Connect using Hostinger's terminal or SSH, then run:

```bash
cat /etc/os-release
node --version
npm --version
pm2 list
sudo ss -ltnp
```

Confirm:

- The installed Ubuntu version. The previously supplied `26.40 LTS` appears to be a typo; check the actual version rather than changing the operating system.
- Which web server handles ports **80/443**: Nginx or Apache.
- Which application ports are already in use.
- Which regular user manages the Node.js applications and PM2.
- That the selected user has a project-compatible Node.js version, npm, and PM2 available. Keep the other applications' existing runtimes intact.

The examples below use **3100** for GovCon Digest. If that port is occupied, choose another unused port and replace `3100` throughout this guide.

## 2. Clone the repository

Run application commands as the regular deployment user, using `sudo` only for server configuration:

```bash
sudo mkdir -p /var/www/govcon-digest
sudo chown "$USER":"$(id -gn)" /var/www/govcon-digest

git clone https://github.com/NHasan143/govcon-digest.git /var/www/govcon-digest
cd /var/www/govcon-digest
```

For a private repository, configure a read-only GitHub deploy key on the VPS first, then use the SSH clone URL:

```bash
git clone git@github.com:NHasan143/govcon-digest.git /var/www/govcon-digest
```

Use only one clone command. The destination must be empty before cloning.

## 3. Configure production settings and CMS storage

From the application directory:

```bash
cp .env.example .env
chmod 600 .env
mkdir -p data media
nano .env
```

Set these values, along with the publication's other settings:

```dotenv
NEXT_PUBLIC_SITE_URL=https://govcondigest.com
DATABASE_URI=file:./data/payload.db

PAYLOAD_SECRET=YOUR_RANDOM_SECRET
CMS_ADMIN_EMAIL=YOUR_ADMIN_EMAIL
CMS_ADMIN_PASSWORD=YOUR_STRONG_PASSWORD
```

Generate a unique production secret:

```bash
openssl rand -hex 32
```

Replace every placeholder before continuing. Review the site name, tagline, description, contact emails, address, social links, and any reCAPTCHA keys in `.env`.

`NEXT_PUBLIC_*` values are included at build time, so changing them requires rebuilding the application.

### Preserve existing CMS content

Articles, users, and uploaded images are **not in GitHub**. They live in the local SQLite database and the `media/` directory, both of which are gitignored.

To preserve the current content:

1. Make a consistent backup of the local database using SQLite's backup facility, or stop local database writers before copying it.
2. Transfer the database backup to `/var/www/govcon-digest/data/payload.db` on the VPS.
3. Transfer the uploaded files to `/var/www/govcon-digest/media/`.
4. Ensure the deployment user can read and write both locations.
5. Apply pending migrations in the next step.

For a fresh installation, leave those directories empty and apply the migrations. The configured first administrator is created when the application initializes after migration. Changing `CMS_ADMIN_PASSWORD` later does not reset an existing account's password.

Keep `.env`, `data/`, and `media/` across deployments, and back up the database and uploads regularly. Keep the production `PAYLOAD_SECRET` stable after initial setup.

## 4. Install, build, and start

From `/var/www/govcon-digest`:

```bash
npm ci --include=dev
NODE_ENV=production npm run migrate
npm run build
```

Build dependencies are needed even though this is a production deployment. Confirm migrations and the build complete successfully before starting the application.

Start a separate PM2 process bound to the local interface:

```bash
NODE_ENV=production pm2 start node_modules/next/dist/bin/next \
  --name govcon-digest \
  -- start -H 127.0.0.1 -p 3100

pm2 save
```

Verify:

```bash
curl -I http://127.0.0.1:3100
pm2 logs govcon-digest --lines 50
```

Press `Ctrl+C` to leave the live log view; this does not stop the application.

Ensure this user's PM2 processes restart after reboot. If startup is not already configured, run:

```bash
pm2 startup
```

Follow the command PM2 generates, then run `pm2 save` again. Manage this application by its name rather than using commands that restart or stop every PM2 application.

## 5. Add routing for the domain

Use the existing public web server. Next.js recommends placing a reverse proxy in front of its application server.

Follow **either the Nginx instructions or the Apache instructions**, according to the server's existing setup. If a hosting panel manages virtual hosts, add the equivalent configuration through that panel.

### Option A: Nginx

Create a new domain configuration:

```bash
sudo nano /etc/nginx/sites-available/govcondigest.com
```

Add:

```nginx
server {
    listen 80;
    server_name govcondigest.com www.govcondigest.com;

    client_max_body_size 12M;

    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_buffering off;
    }
}
```

Enable the new configuration:

```bash
sudo ln -s /etc/nginx/sites-available/govcondigest.com \
  /etc/nginx/sites-enabled/govcondigest.com

sudo nginx -t
```

Only after validation succeeds:

```bash
sudo systemctl reload nginx
```

### Option B: Apache

Create a separate virtual host:

```bash
sudo nano /etc/apache2/sites-available/govcondigest.com.conf
```

Add:

```apache
<VirtualHost *:80>
    ServerName govcondigest.com
    ServerAlias www.govcondigest.com

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3100/
    ProxyPassReverse / http://127.0.0.1:3100/
</VirtualHost>
```

Enable the proxy modules and the new site:

```bash
sudo a2enmod proxy proxy_http
sudo a2ensite govcondigest.com.conf
sudo apachectl configtest
```

Only after validation succeeds:

```bash
sudo systemctl reload apache2
```

When enabling HTTPS, ensure the HTTPS virtual host forwards `X-Forwarded-Proto: https` to Next.js. With `mod_headers` enabled, add `RequestHeader set X-Forwarded-Proto "https"` inside that HTTPS virtual host, then validate and reload Apache.

## 6. Point the domain to the VPS

In the account managing the domain's authoritative DNS, open the DNS zone for `govcondigest.com`. If Hostinger manages the DNS, this is normally under **Domains → Manage → DNS / Nameservers** in the account holding the domain.

Configure:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | VPS public IPv4 address |
| A | `www` | VPS public IPv4 address |

Replace conflicting website A, AAAA, or CNAME records for those names. Preserve email records such as MX and TXT. Use the default TTL unless you have a specific reason to change it.

The domain can stay in its current Hostinger account; transferring it to the VPS account is unnecessary. DNS propagation can take up to 24 hours.

Check the records:

```bash
dig +short A govcondigest.com
dig +short A www.govcondigest.com
```

Both should return the VPS IPv4 address. Ports 80 and 443 must be reachable through the VPS firewall for the public website and HTTP certificate validation. Port 3100 stays local to the VPS.

## 7. Enable HTTPS

Once both names resolve to the VPS, use the server's existing certificate tooling. If Certbot is not installed, follow its official installation instructions for the actual OS and web server.

With Certbot installed, choose the command for the public web server.

For Nginx:

```bash
sudo certbot --nginx -d govcondigest.com -d www.govcondigest.com
```

For Apache:

```bash
sudo certbot --apache -d govcondigest.com -d www.govcondigest.com
```

Choose `https://govcondigest.com` as the canonical address. Configure HTTPS redirects and redirect `www` to the canonical address using the existing web server or hosting panel.

Verify certificate renewal:

```bash
sudo certbot renew --dry-run
```

## 8. Verify the production website

Check:

- `https://govcondigest.com` loads with a valid certificate.
- HTTP and `www` redirect to the canonical HTTPS address.
- Homepage, category pages, article pages, search, and navigation work.
- `/subscribe` and the form at the end of an article load the Kit embed.
- Existing media loads, and new CMS uploads work.
- CMS sign-in works at `/newsroom/sign-in`.
- Administrator and editor permissions behave as expected.
- The other applications on the VPS still work.

For CMS users who need authenticator enrollment, run the project's enrollment command from the production checkout:

```bash
npm run mfa -- YOUR_ADMIN_EMAIL
```

Follow the QR-code and verification prompts privately.

## 9. Connect future deployments to GitHub Actions

After the first deployment works, add a workflow at `.github/workflows/deploy.yml` that connects to the VPS over SSH. This section describes the workflow to configure; adding this guide alone does not enable automatic deployment.

Configure these repository secrets under **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Purpose |
| --- | --- |
| `VPS_HOST` | VPS public IP address or SSH hostname |
| `VPS_USER` | Regular deployment username |
| `VPS_SSH_KEY` | Private key dedicated to deployment access |
| `VPS_KNOWN_HOSTS` | Verified SSH host-key entry for the VPS |
| `VPS_PORT` | SSH port, if the workflow makes it configurable |

The matching deployment public key belongs in the VPS user's authorized keys. If the repository is private, the VPS also needs read access to GitHub; this is separate from GitHub Actions' access to the VPS.

Keep application secrets in the server's protected `.env`. Verify the VPS host key through a trusted channel before storing it. Ensure Node.js, npm, and PM2 are available in the non-interactive SSH session used by the workflow.

Configure the workflow to run on an approved branch such as `main`, with a manual trigger if desired. Serialize production deployments so two updates cannot run at the same time.

The basic deployment sequence is:

1. Back up the SQLite database and uploaded media.
2. Stop only the `govcon-digest` PM2 process.
3. Pull the intended Git commit into the production checkout.
4. Install dependencies, apply migrations, and build.
5. Restart only `govcon-digest`.
6. Check the local application and public HTTPS URL.

After taking a backup, the equivalent manual update commands are:

```bash
set -e
cd /var/www/govcon-digest

pm2 stop govcon-digest
git pull --ff-only origin main
npm ci --include=dev
NODE_ENV=production npm run migrate
npm run build
NODE_ENV=production pm2 restart govcon-digest --update-env
pm2 save

curl --fail --silent --show-error http://127.0.0.1:3100/ -o /dev/null
curl --fail --silent --show-error https://govcondigest.com/ -o /dev/null
```

This basic process has a maintenance window while installing and building. If a step fails, inspect the failure before continuing. A database migration may require restoring a matching database backup as part of rollback; reverting Git alone does not reverse it.

Separate release directories and a controlled application switch can be added later to reduce deployment downtime.

## References

- [Hostinger: point a domain to a VPS](https://www.hostinger.com/support/1583227-how-to-point-a-domain-to-your-vps-at-hostinger/)
- [Next.js 15: self-hosting](https://nextjs.org/docs/15/app/guides/self-hosting)
- [PM2: startup and reboot persistence](https://pm2.keymetrics.io/docs/usage/startup/)
- [Nginx: proxy module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Apache: proxy module](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html)
- [Certbot: Nginx installation instructions](https://certbot.eff.org/instructions?ws=nginx&os=pip)
- [GitHub Actions: repository secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
- [Ubuntu releases](https://releases.ubuntu.com/)
