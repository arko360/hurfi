# Hurfi

Vite + React site for [hurfi.com](https://hurfi.com).

## Develop

```powershell
npm install
npm run dev
```

## Build & deploy

```powershell
npm run build
git add .
git commit -m "Update site"
git push origin main
```

Pushing to `main` runs GitHub Actions → Hostinger.

## Sync deploy secrets

```powershell
powershell -File .\scripts\sync-github-secrets.ps1
```
