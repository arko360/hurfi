/**
 * Build-time / CLI portfolio preview capture (Playwright).
 *
 * NEVER runs in the browser. NEVER runs when a visitor loads the site.
 *
 * Commands:
 *   npm run update-previews              # force Ultra HD recapture of all sites
 *   node scripts/capture-portfolio-previews.mjs --missing-only
 *     (used by predev / prebuild — only fills gaps, never hits live sites if OK)
 *
 * Outputs:
 *   public/portfolio-preview/{name}.webp       Ultra HD full-page archive
 *   public/portfolio-preview/cards/{name}.webp Lightweight UI crop for portfolio grids
 */
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public/portfolio-preview");
const cardsDir = path.join(outDir, "cards");

const sites = [
  { file: "ghorsajan.webp", url: "https://ghorsajan.com/" },
  { file: "realsignbd.webp", url: "https://realsignbd.com/" },
  { file: "gullyapparel.webp", url: "https://gullyapparel.store/" },
  { file: "gozeroprint.webp", url: "https://gozeroprint.com/" },
  { file: "zaiax.webp", url: "https://zaiax.com/" },
];

const missingOnly = process.argv.includes("--missing-only");
const force = process.argv.includes("--force") || process.argv.includes("--update") || !missingOnly;

const VIEWPORT = { width: 1920, height: 1080 };
const DEVICE_SCALE = 2;
/** Full WebP quality (Crystal clear Ultra HD) */
const FULL_QUALITY = 95;
/** Card WebP for instant portfolio UI (still sharp, much smaller) */
const CARD_WIDTH = 960;
const CARD_QUALITY = 82;

const HIDE_CSS = `
  [class*="chat"], [id*="chat"], [class*="WhatsApp"], iframe[src*="chat"],
  .crisp-client, #fb-root, .fb_dialog, .widget-visible,
  [class*="loader"], [class*="spinner"], [class*="skeleton"],
  .nprogress-busy, #nprogress,
  [aria-busy="true"] { display: none !important; opacity: 0 !important; visibility: hidden !important; }
`;

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait until the homepage is fully settled:
 * fonts, images, network idle, lazy content, no skeletons, layout stable.
 * Then wait an extra 3 seconds before capture.
 */
async function settlePage(page) {
  await page.waitForLoadState("load", { timeout: 120000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 90000 }).catch(() => {});

  await page.addStyleTag({ content: HIDE_CSS });

  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Lazy-load everything by scrolling the full page
    let lastHeight = 0;
    for (let pass = 0; pass < 4; pass += 1) {
      const height = Math.max(
        document.body?.scrollHeight || 0,
        document.documentElement?.scrollHeight || 0
      );
      for (let y = 0; y < height; y += 700) {
        window.scrollTo(0, y);
        await delay(280);
      }
      window.scrollTo(0, height);
      await delay(500);
      if (height === lastHeight) break;
      lastHeight = height;
    }
    window.scrollTo(0, 0);
    await delay(700);

    // Wait for every image (including those that became visible after scroll)
    const imgs = [...document.images];
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise((res) => {
            if (img.complete && img.naturalWidth > 0) return res(null);
            const done = () => res(null);
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            setTimeout(done, 6000);
          })
      )
    );

    // Wait for CSS animations / paint to settle — layout stable check
    let stable = 0;
    let prev = document.documentElement.scrollHeight;
    while (stable < 3) {
      await delay(400);
      const next = document.documentElement.scrollHeight;
      if (next === prev) stable += 1;
      else {
        stable = 0;
        prev = next;
      }
    }
  });

  await page.waitForLoadState("networkidle", { timeout: 45000 }).catch(() => {});

  // Mandatory: wait another 3 seconds after everything is fully rendered
  await page.waitForTimeout(3000);
}

async function writeWebpsFromJpeg(jpegBuf, site) {
  const meta = await sharp(jpegBuf).metadata();
  let h = meta.height || 0;
  let w = meta.width || 0;

  if (w < 1800 || h < 1200) {
    throw new Error(`Screenshot too small: ${w}x${h}`);
  }

  // WebP limits: ≤16383 per side; also keep pixel area practical for libwebp
  const MAX_SIDE = 14000;
  let source = jpegBuf;
  if (w > MAX_SIDE || h > MAX_SIDE) {
    const scale = Math.min(MAX_SIDE / w, MAX_SIDE / h);
    const tw = Math.max(1, Math.floor(w * scale));
    const th = Math.max(1, Math.floor(h * scale));
    console.log(`  ↕ Scaling ${w}×${h} → ${tw}×${th} (WebP safe max ${MAX_SIDE})`);
    source = await sharp(jpegBuf)
      .resize({ width: tw, height: th, fit: "fill" })
      .jpeg({ quality: 95, mozjpeg: true })
      .toBuffer();
    w = tw;
    h = th;
  }

  const fullWebp = await sharp(source)
    .webp({ quality: FULL_QUALITY, effort: 4, smartSubsample: true })
    .toBuffer();

  const cardWebp = await sharp(source)
    .resize({ width: CARD_WIDTH, withoutEnlargement: true })
    .webp({ quality: CARD_QUALITY, effort: 4, smartSubsample: true })
    .toBuffer();

  await fs.writeFile(path.join(outDir, site.file), fullWebp);
  await fs.writeFile(path.join(cardsDir, site.file), cardWebp);

  console.log(
    `✓ ${site.file} ${w}×${h} full=${(fullWebp.length / 1024 / 1024).toFixed(2)}MB card=${(cardWebp.length / 1024).toFixed(0)}KB`
  );
}

/** Derive card WebP from existing Ultra HD archive — no live visit. */
async function deriveCardFromFull(site) {
  const fullPath = path.join(outDir, site.file);
  const cardPath = path.join(cardsDir, site.file);
  const cardWebp = await sharp(fullPath)
    .resize({ width: CARD_WIDTH, withoutEnlargement: true })
    .webp({ quality: CARD_QUALITY, effort: 6, smartSubsample: true })
    .toBuffer();
  await fs.writeFile(cardPath, cardWebp);
  console.log(`✓ ${site.file} card derived (${(cardWebp.length / 1024).toFixed(0)}KB)`);
}

async function captureOne(context, site, attempt = 1) {
  const page = await context.newPage();
  console.log(`[${attempt}/3] Opening ${site.url} → ${site.file}`);
  try {
    await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 120000 });
    await settlePage(page);

    // JPEG intermediate: tall DSF=2 PNG can OOM / timeout; q95 still Ultra HD
    const jpegBuf = await page.screenshot({
      fullPage: true,
      type: "jpeg",
      quality: 95,
      animations: "disabled",
      timeout: 180000,
    });

    await writeWebpsFromJpeg(jpegBuf, site);
    return true;
  } catch (err) {
    console.error(`✗ ${site.file}:`, err.message);
    if (attempt < 3) {
      await page.close().catch(() => {});
      await new Promise((r) => setTimeout(r, 2500));
      return captureOne(context, site, attempt + 1);
    }
    return false;
  } finally {
    await page.close().catch(() => {});
  }
}

async function planWork() {
  const needCapture = [];
  const needDerive = [];

  for (const site of sites) {
    const fullPath = path.join(outDir, site.file);
    const cardPath = path.join(cardsDir, site.file);
    const hasFull = await exists(fullPath);
    const hasCard = await exists(cardPath);

    if (force) {
      needCapture.push(site);
      continue;
    }

    if (!hasFull) needCapture.push(site);
    else if (!hasCard) needDerive.push(site);
  }

  return { needCapture, needDerive };
}

async function main() {
  if (process.env.SKIP_PORTFOLIO_CAPTURE === "1") {
    console.log("Skipping portfolio capture (SKIP_PORTFOLIO_CAPTURE=1).");
    return;
  }

  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(cardsDir, { recursive: true });

  const { needCapture, needDerive } = await planWork();

  if (needCapture.length === 0 && needDerive.length === 0) {
    console.log("Portfolio previews OK — all local WebPs present. No live capture.");
    return;
  }

  for (const site of needDerive) {
    await deriveCardFromFull(site);
  }

  if (needCapture.length === 0) return;

  console.log(
    `${force ? "Refreshing" : "Capturing missing"} ${needCapture.length} Ultra HD preview(s)…`
  );
  console.log(`Viewport ${VIEWPORT.width}×${VIEWPORT.height} @ ${DEVICE_SCALE}x → WebP q${FULL_QUALITY}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE,
    colorScheme: "light",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });

  let ok = 0;
  for (const site of needCapture) {
    if (await captureOne(context, site)) ok += 1;
  }

  await browser.close();
  console.log(`Done: ${ok}/${needCapture.length} saved permanently under public/portfolio-preview/`);
  if (ok < needCapture.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
