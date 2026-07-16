# Hurfi

Static **HTML / CSS / JavaScript** website for [hurfi.com](https://hurfi.com).

**No Node.js. No npm. No React. No build step.**

Header, footer, navigation, and page content all live in the HTML files. JavaScript only adds interactions (menu, scroll effects, form handoff).

## Local preview

Open `index.html` in your browser.

## Edit

| What | Where |
|------|--------|
| Pages (including header & footer) | `*.html` |
| Styles | `css/site.css` |
| Interactions only | `js/site.js` |
| Images | `assets/`, `portfolio-preview/` |

## Deploy (Hostinger)

Upload site files to `public_html`, **or** push to `main` (GitHub Actions deploys the static files — still no Node build).

See `DEPLOYMENT.md` for SSH secrets.
