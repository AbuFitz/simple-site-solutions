import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expectNoHorizontalOverflow, settle, watchErrors } from "./helpers";

const data = JSON.parse(readFileSync(join(process.cwd(), "src/data/locations.json"), "utf8")) as { locations: { slug: string; name: string; title: string; h1: string; local: string; neighbours: string[] }[] };
const locs = data.locations;

test("every local page is in the built HTML with its own title, canonical, structured data and the page text (no JavaScript needed)", () => {
  const titles = new Set<string>();
  for (const l of locs) {
    const file = join(process.cwd(), "dist", "web-design", l.slug, "index.html");
    expect(existsSync(file), l.slug).toBe(true);
    const html = readFileSync(file, "utf8");
    expect(html).toContain(`<title>${l.title.replace(/&/g, "&amp;")}</title>`);
    expect(html).toContain(`rel="canonical" href="https://onesimplesite.co.uk/web-design/${l.slug}"`);
    expect(html).toContain("<h1>" + l.h1.replace(/&/g, "&amp;") + "</h1>");
    expect(html).toContain(l.local.slice(0, 60));
    const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const types = ld.map((b) => b["@type"]);
    for (const t of ["BreadcrumbList", "Service", "FAQPage"]) expect(types, l.slug).toContain(t);
    expect(JSON.stringify(ld)).not.toMatch(/aggregateRating|reviewRating/);
    titles.add(l.title);
  }
  expect(titles.size).toBe(locs.length);
  const sitemap = readFileSync(join(process.cwd(), "dist", "sitemap.xml"), "utf8");
  expect(sitemap).toContain("/web-design</loc>");
  for (const l of locs) expect(sitemap).toContain(`/web-design/${l.slug}</loc>`);
});

for (const width of [390, 1440]) {
  test.describe(`local pages @ ${width}`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 1000 } });

    test("hub lists every place and links to each page", async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto("/web-design");
      await settle(page);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("across the UK");
      await expect(page.getByText("OneSimpleSite provides web design and development for businesses across the UK.").first()).toBeVisible();
      for (const l of locs) await expect(page.getByRole("main").getByRole("link", { name: `Web design ${l.name}` })).toBeVisible();
      await expectNoHorizontalOverflow(page);
      expect(errors).toEqual([]);
    });

    test("a local page reads properly: h1, FAQ opens, links, calls to action, no errors", async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto("/web-design/watford");
      await settle(page);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Web design in Watford");
      await expect(page.getByText("across the UK").first()).toBeVisible();
      await expect(page.getByRole("heading", { name: "Packages for Watford businesses" })).toBeVisible();
      const q = page.getByText("I work across Watford and Bushey. Should that be one page or two?");
      await q.click();
      await expect(page.getByText("One site, with clear wording about both areas")).toBeVisible();
      await expect(page.getByRole("link", { name: /See a Watford website preview/ })).toHaveAttribute("href", /\/preview\?t=Watford/);
      await expect(page.getByRole("main").getByRole("link", { name: "Hemel Hempstead" })).toHaveAttribute("href", "/web-design/hemel-hempstead");
      await expectNoHorizontalOverflow(page);
      expect(errors).toEqual([]);
    });

    test("every nearby-place link on every page resolves to a real page", async ({ page }) => {
      for (const l of locs) {
        for (const n of l.neighbours) {
          expect(locs.some((x) => x.slug === n), `${l.slug} -> ${n}`).toBe(true);
        }
      }
      await page.goto("/web-design/london");
      await settle(page);
      const hrefs = await page.locator('main a[href^="/web-design/"]').evaluateAll((els) => els.map((e) => e.getAttribute("href")!));
      expect(hrefs.length).toBeGreaterThan(1);
      for (const h of hrefs) expect(locs.some((x) => `/web-design/${x.slug}` === h), h).toBe(true);
    });

    test("an unknown place shows the not-found page", async ({ page }) => {
      await page.goto("/web-design/atlantis");
      await settle(page);
      await expect(page.getByRole("heading", { name: /find that page/i })).toBeVisible();
    });

    test("axe: hub and a local page", async ({ page }) => {
      for (const path of ["/web-design", "/web-design/st-albans"]) {
        await page.goto(path);
        await settle(page);
        await page.waitForTimeout(500);
        const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        expect(r.violations.map((v) => `${v.id}: ${v.nodes[0]?.target.join(" ")}`), path).toEqual([]);
      }
    });
  });
}

test("the footer links to the hub and every place from any page", async ({ page }) => {
  await page.goto("/about");
  await settle(page);
  const foot = page.getByRole("contentinfo");
  await expect(foot.getByRole("link", { name: "Web design near you" })).toHaveAttribute("href", "/web-design");
  for (const l of locs) await expect(foot.getByRole("link", { name: l.name, exact: true })).toHaveAttribute("href", `/web-design/${l.slug}`);
});
