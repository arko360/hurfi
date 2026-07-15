import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public/assets/portfolio/websites");

const sites = [
  { file: "ghorsajan.png", url: "https://ghorsajan.com/" },
  { file: "real-sign-bd.png", url: "https://realsignbd.com/" },
  { file: "gully-apparel.png", url: "https://gullyapparel.store/" },
  { file: "gozero-print.png", url: "https://gozeroprint.com/" },
  { file: "zaiax.png", url: "https://zaiax.com/" },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });

  for (const site of sites) {
    const page = await context.newPage();
    console.log(`Capturing ${site.url}...`);
    try {
      await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.waitForTimeout(3500);
      // Hide sticky chat widgets that often overlay screenshots
      await page.addStyleTag({
        content: `
          [class*="chat"], [id*="chat"], [class*="WhatsApp"], iframe[src*="chat"],
          .crisp-client, #fb-root, .fb_dialog, .widget-visible { display: none !important; }
        `,
      });
      const out = path.join(outDir, site.file);
      await page.screenshot({ path: out, fullPage: true, type: "png" });
      console.log(`Saved ${out}`);
    } catch (err) {
      console.error(`Failed ${site.url}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

capture();
