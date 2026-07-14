# Hurfi

Static website — HTML, CSS, JavaScript.

```text
hurfi/
├── index.html
├── css/style.css
├── js/main.js
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

## Go live

```powershell
git add .
git commit -m "Update site"
git push origin main
```

## Sync deploy secrets (one-time / whenever SSH fails)

```powershell
gh auth login
powershell -File .\scripts\sync-github-secrets.ps1
```

Actions log-এ `Prepare SSH key` step-এ fingerprint দেখবে:

`SHA256:qPPsmNfETzCQmqajLA3MhAb1VQQr7avnpE3xSc9/SB4`
