# Hurfi

Pure static **HTML / CSS / JavaScript** website for [hurfi.com](https://hurfi.com).

**No Node.js. No npm. No Python. No localhost. No build step. No React.**

Every page already includes its full header, footer, and content in the HTML file.

## Preview

1. Open `T:\hurfi` in File Explorer.
2. Double-click `index.html`.
3. Navigate with on-page links (all point to other `.html` files).

## Edit

| What | Where |
|------|--------|
| Pages (header, footer, content) | `*.html` |
| Styles | `css/site.css` |
| Interactions only | `js/site.js` |
| Images | `assets/`, `portfolio-preview/` |

## Upload to cPanel

Upload into `public_html` (keep folders):

- all `*.html` files
- `css/`
- `js/`
- `assets/`
- `portfolio-preview/`
- `.htaccess`
- `robots.txt`
- `sitemap.xml`

**Do not upload:**

- `node_modules/`
- `.git/`
- `.github/`
- `.deploy-keys/`
- `scripts/`
- `DEPLOYMENT.md` (optional docs only)
- any `_*.ps1` / temp tooling files

## Production checklist

- Pretty URLs work via `.htaccess` (`/portfolio` → `portfolio.html`)
- `404.html` is noindex
- Security headers ship from `.htaccess`
- Contact form opens a prefilled `mailto:hello@hurfi.com` (no server backend)
