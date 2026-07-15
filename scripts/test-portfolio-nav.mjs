import { chromium } from "playwright";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const portfolio = ["/portfolio/website", "/portfolio/seo", "/portfolio/branding"];
const labels = ["Website Development", "SEO", "Branding & Growth"];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];

page.on("pageerror", (e) => errors.push("PAGE: " + e.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push("CONSOLE: " + msg.text());
});
page.on("requestfailed", (req) => {
  const f = req.failure();
  if (f && f.errorText !== "net::ERR_ABORTED") {
    errors.push("NET: " + req.url() + " " + f.errorText);
  }
});

async function assertNotBlank(label) {
  try {
    await page.waitForFunction(
      () => {
        const root = document.getElementById("root");
        const text = (root?.innerText || "").trim();
        return Boolean(root && root.childElementCount > 0 && text.length >= 20);
      },
      { timeout: 20000 }
    );
  } catch {
    const snap = await page.evaluate(() => ({
      url: location.href,
      hasRoot: Boolean(document.getElementById("root")),
      text: (document.getElementById("root")?.innerText || "").slice(0, 120),
    }));
    errors.push("BLANK: " + label + " " + JSON.stringify(snap));
  }
}

async function dropdownOpen() {
  await page.locator(".nav-dropdown").hover({ force: true });
  await page.waitForTimeout(100);
  await page.locator(".nav-dropdown-menu a").first().waitFor({ state: "visible", timeout: 5000 });
}

async function isMenuVisiblyOpen() {
  return page.evaluate(() => {
    const menu = document.querySelector(".nav-dropdown-menu");
    if (!menu) return false;
    const style = getComputedStyle(menu);
    return style.visibility !== "hidden" && Number(style.opacity) > 0.2;
  });
}

async function clickNav(label) {
  await dropdownOpen();
  await page.locator(".nav-dropdown-menu a", { hasText: label }).first().click();
  await page.waitForLoadState("domcontentloaded");
  // Move pointer away so :hover cannot keep the menu open
  await page.mouse.move(8, 700);
  await page.waitForTimeout(220);
  await assertNotBlank("after click " + label);
  if (await isMenuVisiblyOpen()) errors.push("DROPDOWN_STUCK after click " + label);
}

console.log("--- Production Portfolio validation @", base);

for (const p of ["/", "/portfolio", ...portfolio, "/services", "/about", "/pricing", "/contact"]) {
  await page.goto(base + p, { waitUntil: "networkidle", timeout: 60000 });
  await assertNotBlank("goto " + p);
  await page.reload({ waitUntil: "networkidle" });
  await assertNotBlank("refresh " + p);
}
console.log("OK direct URL + refresh");

await page.goto(base + "/", { waitUntil: "networkidle" });
for (const label of labels) {
  for (let i = 0; i < 20; i++) await clickNav(label);
  console.log("OK 20x", label);
}

for (let i = 0; i < 30; i++) await clickNav(labels[i % 3]);
console.log("OK rapid switch 30x");

await page.goto(base + "/portfolio/website", { waitUntil: "networkidle" });
await page.goto(base + "/portfolio/seo", { waitUntil: "networkidle" });
await page.goto(base + "/portfolio/branding", { waitUntil: "networkidle" });
await page.goBack();
await assertNotBlank("back1");
await page.goBack();
await assertNotBlank("back2");
await page.goForward();
await assertNotBlank("forward1");
console.log("OK history");

await page.goto(base + "/", { waitUntil: "networkidle" });
for (let i = 0; i < 50; i++) {
  await dropdownOpen();
  if (!(await isMenuVisiblyOpen())) errors.push("DROPDOWN_DID_NOT_OPEN #" + i);
  await page.mouse.move(20, 700);
  await page.waitForTimeout(280);
  if (await isMenuVisiblyOpen()) errors.push("DROPDOWN_DID_NOT_CLOSE_MOUSELEAVE #" + i);
}
console.log("OK dropdown 50x mouseleave");

await dropdownOpen();
await page.mouse.move(20, 700);
await page.waitForTimeout(100);
await page.locator("body").click({ position: { x: 20, y: 420 } });
await page.waitForTimeout(220);
if (await isMenuVisiblyOpen()) errors.push("DROPDOWN_DID_NOT_CLOSE_OUTSIDE");
console.log("OK outside click");

const page2 = await context.newPage();
page2.on("pageerror", (e) => errors.push("PAGE2: " + e.message));
for (const p of portfolio) {
  await page2.goto(base + p, { waitUntil: "networkidle" });
  const blank = await page2.evaluate(
    () => (document.getElementById("root")?.innerText || "").trim().length < 20
  );
  if (blank) errors.push("BLANK newtab " + p);
}
await page2.close();
console.log("OK new tabs");

for (const z of [0.8, 0.9, 1, 1.1, 1.25]) {
  await page.goto(base + "/portfolio/website", { waitUntil: "domcontentloaded" });
  await page.evaluate((zoom) => {
    document.documentElement.style.zoom = String(zoom);
  }, z);
  await page.waitForTimeout(100);
  await assertNotBlank("zoom " + z);
  await page.evaluate(() => {
    document.documentElement.style.zoom = "";
  });
}
console.log("OK zoom levels");

await page.goto(base + "/", { waitUntil: "networkidle" });
await dropdownOpen();
const seoOk = await page.locator(".nav-dropdown-menu a strong", { hasText: /^SEO$/ }).count();
const long = await page.locator(".nav-dropdown-menu a strong", { hasText: "Search Engine Optimization" }).count();
if (!seoOk) errors.push("SEO label missing");
if (long) errors.push("Old SEO label still present");

await browser.close();

if (errors.length) {
  console.error("FAILED\n" + [...new Set(errors)].join("\n"));
  process.exit(1);
}
console.log("PASS: all production Portfolio tests succeeded");
