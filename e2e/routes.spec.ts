import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROUTES, VIEWPORTS, expectNoHorizontalOverflow, settle, watchErrors } from "./helpers";

for (const vp of VIEWPORTS) {
  test.describe(`routes @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });
    for (const route of ROUTES) {
      test(`${route}: renders, one h1, no console errors, no overflow`, async ({ page }) => {
        const errors = watchErrors(page);
        await page.goto(route);
        await settle(page);
        await expect(page.locator("h1").first()).toBeVisible();
        expect(await page.locator("h1").count()).toBe(1);
        await expectNoHorizontalOverflow(page);
        expect(errors).toEqual([]);
      });
    }
  });
}

test("every route has its own static title, description and canonical in the built HTML (no JavaScript needed)", () => {
  const seen = new Map<string, string>();
  const routes = [...ROUTES.filter((r) => !r.includes("definitely") && r !== "/checkout/cancel"), "/checkout/success", "/onboard"];
  for (const route of routes) {
    const file = join(process.cwd(), "dist", route === "/" ? "" : route, "index.html");
    expect(existsSync(file), `${file} exists`).toBe(true);
    const html = readFileSync(file, "utf8");
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    const canon = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
    expect(title.length, `${route} title`).toBeGreaterThan(10);
    expect(desc.length, `${route} description`).toBeGreaterThan(40);
    expect(canon, `${route} canonical`).toEqual(["https://onesimplesite.co.uk" + (route === "/" ? "/" : route)]);
    expect(seen.has(title), `${route} title duplicates ${seen.get(title)}`).toBe(false);
    seen.set(title, route);
    if (route === "/onboard" || route.startsWith("/checkout")) expect(html).toContain("noindex");
  }
});

test("rendered head has exactly one canonical and one description after hydration", async ({ page }) => {
  for (const route of ["/", "/packages", "/work/arf-mods"]) {
    await page.goto(route);
    await settle(page);
    expect(await page.locator('link[rel="canonical"]').count(), route).toBe(1);
    expect(await page.locator('meta[name="description"]').count(), route).toBe(1);
    expect(await page.locator('meta[property="og:url"]').count(), route).toBe(1);
  }
});

test("structured data has no ratings and parses", async ({ page }) => {
  for (const route of ["/", "/packages", "/faq", "/work/arf-mods"]) {
    await page.goto(route);
    await settle(page);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length, route).toBeGreaterThan(0);
    for (const b of blocks) {
      expect(() => JSON.parse(b), route).not.toThrow();
      expect(b).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
    }
  }
});

test("sitemap and robots", async ({ request }) => {
  const sm = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/", "/work", "/packages", "/start", "/work/fixnow-mechanics"]) expect(sm).toContain(`<loc>https://onesimplesite.co.uk${p === "/" ? "/" : p}</loc>`);
  expect(sm).not.toContain("/onboard");
  expect(sm).not.toContain("/checkout");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://onesimplesite.co.uk/sitemap.xml");
  expect((await request.get("/og-image.png")).ok()).toBe(true);
  expect((await request.get("/favicon.svg")).ok()).toBe(true);
});

test("no broken internal links across the site", async ({ page }) => {
  test.setTimeout(240_000);
  const hrefs = new Set<string>();
  for (const route of ROUTES.filter((r) => !r.includes("definitely"))) {
    await page.goto(route);
    await settle(page);
    for (const h of await page.locator("a[href]").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""))) {
      if (h.startsWith("/") && !h.startsWith("//")) hrefs.add(h.split("#")[0].split("?")[0] || "/");
    }
  }
  const bad: string[] = [];
  for (const h of hrefs) {
    await page.goto(h);
    await settle(page);
    const is404 = await page.getByRole("heading", { name: /find that page/i }).count();
    if (is404) bad.push(h);
  }
  expect(bad).toEqual([]);
  expect(hrefs.size).toBeGreaterThan(10);
});

test("unsupported claims are gone", async ({ page }) => {
  const banned = [/satisfaction guarantee/i, /within 24 hours/i, /500\+/, /99\.9%/, /4\.9/, /most popular/i, /first month free/i, /keep it (live|fresh)/i, /£9\/month/i, /5-10 (business )?days/i];
  for (const route of ["/", "/packages", "/faq", "/how-it-works", "/start", "/contact", "/about", "/terms"]) {
    await page.goto(route);
    await settle(page);
    const text = await page.locator("body").innerText();
    for (const re of banned) expect(text, `${route} matches ${re}`).not.toMatch(re);
  }
});
