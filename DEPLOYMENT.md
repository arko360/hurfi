# Hurfi deployment guide

Automated deploys run on every push to `main` via GitHub Actions → SSH → Hostinger (`hurfi.com`).

## Detected environment

| Item | Value |
|------|-------|
| Hosting | Hostinger shared (CloudLinux) |
| SSH | `u765323536@141.136.43.105` port `65002` |
| Domain | `hurfi.com` |
| Web root (deploy directory) | `/home/u765323536/domains/hurfi.com/public_html` |
| Git mirror | `/home/u765323536/domains/hurfi.com/repo` |
| Releases / rollback | `/home/u765323536/domains/hurfi.com/releases` |
| Current local repo | Placeholder (`README` + `.gitignore` only) — **no app framework yet** |
| Server stack | PHP 8.3 + Composer; Git available; Node binaries under `/opt/alt/alt-nodejs*` (not on default PATH) |

**Strategy:** detect framework on GitHub Actions → build there → rsync artifacts into `public_html`. This avoids fragile on-server Node builds on shared hosting.

Supported auto-detect: Next.js, Vite, Astro, CRA, Angular, Nuxt, generic Node, Laravel, static HTML.

---

## 1. GitHub Secrets (required)

Repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Exact value |
|-------------|-------------|
| `SSH_HOST` | `141.136.43.105` |
| `SSH_PORT` | `65002` |
| `SSH_USER` | `u765323536` |
| `DEPLOY_PATH` | `/home/u765323536/domains/hurfi.com/public_html` |
| `REPO_PATH` | `/home/u765323536/domains/hurfi.com/repo` |
| `SSH_PRIVATE_KEY` | Full contents of the deploy private key (see below) |
| `SSH_KNOWN_HOSTS` | Full contents of known_hosts (see below) |

### `SSH_PRIVATE_KEY`

Use the deploy key already generated locally at `.deploy-keys/github_actions_deploy` (gitignored). Paste the **entire** file, including:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### `SSH_KNOWN_HOSTS`

Paste all lines from `.deploy-keys/known_hosts`, or regenerate:

```bash
ssh-keyscan -p 65002 141.136.43.105
```

Optional helper (PowerShell, from project root):

```powershell
Get-Content .\.deploy-keys\GITHUB_SECRETS.txt
Get-Content .\.deploy-keys\github_actions_deploy
Get-Content .\.deploy-keys\known_hosts
```

---

## 2. One-time SSH setup (already done on this machine)

These commands were run once to prepare the server. Re-run only if you recreate keys or a new machine needs access.

```bash
# 1) Generate a deploy key (if you need a new one)
ssh-keygen -t ed25519 -f ./github_actions_deploy -C "github-actions-deploy-hurfi" -N ""

# 2) Install the public key on Hostinger
ssh -p 65002 u765323536@141.136.43.105
mkdir -p ~/.ssh && chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys   # paste contents of github_actions_deploy.pub
chmod 600 ~/.ssh/authorized_keys
exit

# 3) Prepare directories + git mirror
ssh -p 65002 u765323536@141.136.43.105
mkdir -p ~/domains/hurfi.com/{repo,releases,shared}
git clone https://github.com/arko360/hurfi.git ~/domains/hurfi.com/repo
exit

# 4) Test key login
ssh -i ./github_actions_deploy -p 65002 u765323536@141.136.43.105 'echo OK'
```

**Do not** commit `.deploy-keys/` or paste the private key into the repository.

---

## 3. Security note about the hosting password

A hosting password was shared in chat while setting this up. After confirming key-based SSH works:

1. Change the Hostinger account / SSH password in hPanel.
2. Prefer SSH keys for all future automation (GitHub Secrets already use a key).
3. Never store the password in the repo, workflow YAML, or GitHub Secrets if a key works.

---

## 4. How deployment works

1. Push to `main` (or run **Actions → Deploy to Hostinger → Run workflow**).
2. `scripts/detect-and-build.sh` detects the framework and builds into `deploy_artifact/`.
3. If the repo is still empty/placeholder, the job **succeeds but skips publish** (live `default.php` site is left alone).
4. Otherwise CI rsyncs artifacts over SSH and runs `scripts/remote-deploy.sh` on the server.
5. The remote script:
   - Snapshots current `public_html` into `releases/`
   - Updates the git mirror
   - Publishes new files into `public_html`
   - Prunes old releases (keeps 5)

### Framework → publish behavior

| Detection | Build | Published to `public_html` |
|-----------|-------|----------------------------|
| Vite / Astro | `npm run build` | `dist/` |
| CRA | `npm run build` | `build/` |
| Next.js | `npm run build` | `out/` (static export) or standalone Node output |
| Static HTML | none | `index.html` / `public/` |
| Laravel | `composer install` (CI) | contents of `public/` |
| Generic Node | build if present | `dist`/`build`/`public` or app files |

For **Next.js on this Hostinger shared plan**, prefer static export (`output: 'export'`) unless you create a Node.js app in hPanel.

---

## 5. Manual deploy

```bash
# On your PC (Git Bash / WSL / Linux)
git pull origin main
bash scripts/detect-and-build.sh

# Sync + remote publish (adjust key path)
rsync -az -e "ssh -i .deploy-keys/github_actions_deploy -p 65002" \
  deploy_artifact/ u765323536@141.136.43.105:/home/u765323536/domains/hurfi.com/shared/staging_manual/

ssh -i .deploy-keys/github_actions_deploy -p 65002 u765323536@141.136.43.105 \
  'DEPLOY_PATH=/home/u765323536/domains/hurfi.com/public_html \
   REPO_PATH=/home/u765323536/domains/hurfi.com/repo \
   bash /home/u765323536/domains/hurfi.com/repo/scripts/remote-deploy.sh \
   /home/u765323536/domains/hurfi.com/shared/staging_manual static manual'
```

Or from the server git mirror (static/PHP-only cases):

```bash
ssh -p 65002 u765323536@141.136.43.105
cd ~/domains/hurfi.com/repo
git pull origin main
# then copy built files into public_html as needed
```

---

## 6. Rollback

Releases are stored under:

`/home/u765323536/domains/hurfi.com/releases/<timestamp>_<sha>/`

```bash
ssh -p 65002 u765323536@141.136.43.105
ls -lt ~/domains/hurfi.com/releases | head
# Restore the previous snapshot:
rsync -a --delete ~/domains/hurfi.com/releases/<chosen_release>/ ~/domains/hurfi.com/public_html/
```

Git-based content rollback (source only):

```bash
cd ~/domains/hurfi.com/repo
git log --oneline -n 10
git checkout <good-sha>
# then rebuild/copy as for a manual deploy
```

---

## 7. Troubleshooting

| Symptom | What to check |
|---------|----------------|
| Workflow fails on “Missing GitHub Secret” | Add all secrets from section 1 |
| `Permission denied (publickey)` | Public key in `~/.ssh/authorized_keys`; secret private key complete; port `65002` |
| `Host key verification failed` | Refresh `SSH_KNOWN_HOSTS` with `ssh-keyscan -p 65002 141.136.43.105` |
| Build fails / empty artifact | Confirm `package.json` scripts; for Next use `output: 'export'` on shared hosting |
| Site still shows Hostinger default page | Ensure build produces `index.html`/`index.php` (workflow removes `default.php` when present) |
| Node app not running | Shared hosting: create/restart **Node.js App** in hPanel pointing at the app |
| Action skipped publish | Repo still has no real website source — add the app and push |

Useful logs:

- GitHub → **Actions** → latest **Deploy to Hostinger** run
- Server: `~/.logs/` (Hostinger) and the Actions job log for rsync/SSH output

---

## 8. Manual steps that cannot be fully automated

1. Add the GitHub Actions secrets in the GitHub UI (or CLI with a PAT).
2. Change/rotate the Hostinger password after key setup.
3. If you need always-on Node (not static): create the Node.js application in Hostinger hPanel.
4. Point DNS for `hurfi.com` in hPanel if not already done.
5. Add real website source code to this repository (currently placeholder only).

Once secrets are set and you push an actual site to `main`, deploys are automatic.
