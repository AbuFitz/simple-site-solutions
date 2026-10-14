import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow, settle, watchErrors } from "./helpers";

const CATEGORIES = ["plumbing", "electrical", "mechanic", "cleaning", "barber", "tutoring", "shop", "builder", "other"];

async function mockMaps(page: Page, mode: "ok" | "fail" = "ok") {
  await page.route("https://nominatim.openstreetmap.org/**", (r) =>
    mode === "ok" ? r.fulfill({ json: [{ lat: "51.6565", lon: "-0.3903" }], headers: { "access-control-allow-origin": "*" } }) : r.fulfill({ status: 500, body: "x", headers: { "access-control-allow-origin": "*" } })
  );
  await page.route("https://www.openstreetmap.org/**", (r) => r.fulfill({ contentType: "text/html", body: "<html><body style='margin:0;background:#cde'>map</body></html>" }));
}

/** Scroll the preview frame to the bottom in steps so lazy images load. */
async function scrollFrame(page: Page) {
  await page.evaluate(async () => {
    const el = document.querySelector('[role="region"][aria-label^="Scrollable"]') as HTMLElement;
    for (let y = 0; y <= el.scrollHeight; y += 300) {
      el.scrollTop = y;
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(500);
}

for (const width of [390, 1440]) {
  test.describe(`preview templates @ ${width}`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 1000 } });

    for (const id of CATEGORIES) {
      test(`${id}: renders its own template with photos, a real map and no errors`, async ({ page }) => {
        const errors = watchErrors(page);
        await mockMaps(page);
        await page.goto(`/preview?c=${id}&n=Smith+%26+Sons&t=Watford&p=07700900123`);
        await settle(page);
        const frame = page.locator('[role="region"][aria-label^="Scrollable"]');
        await expect(frame).toBeVisible();
        await expect(frame.locator("h2").first()).toBeVisible();
        await expect(frame.getByText("Smith & Sons").first()).toBeVisible();
        await scrollFrame(page);
        await expect(frame.locator('iframe[title="Map of Watford"]')).toHaveAttribute("src", /^https:\/\/www\.openstreetmap\.org\/export\/embed\.html\?bbox=/);
        const broken = await frame.locator("img").evaluateAll((imgs) => imgs.filter((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth === 0).map((i) => (i as HTMLImageElement).src));
        expect(broken).toEqual([]);
        await expectNoHorizontalOverflow(page);
        expect(errors).toEqual([]);
      });

      test(`${id}: without a town it says so instead of showing a made-up map`, async ({ page }) => {
        await mockMaps(page);
        await page.goto(`/preview?c=${id}&n=Smith+%26+Sons`);
        await settle(page);
        await scrollFrame(page);
        const frame = page.locator('[role="region"][aria-label^="Scrollable"]');
        await expect(frame.getByText("Add your town and your area map appears here.")).toBeVisible();
        await expect(frame.locator("iframe")).toHaveCount(0);
      });
    }

    test("a failed map lookup is reported plainly", async ({ page }) => {
      await mockMaps(page, "fail");
      await page.goto("/preview?c=plumbing&n=Smith&t=Watford");
      await settle(page);
      await scrollFrame(page);
      await expect(page.locator('[role="region"][aria-label^="Scrollable"]').getByText("The map couldn't be loaded.")).toBeVisible();
    });
  });
}

test.describe("template sanity", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("each trade has a visibly different template", async ({ page }) => {
    await mockMaps(page);
    const fonts = new Set<string>();
    const tops = new Set<string>();
    for (const id of CATEGORIES) {
      await page.goto(`/preview?c=${id}&n=Smith+Co&t=Watford`);
      await settle(page);
      const info = await page.evaluate(() => {
        const h = document.querySelector('[role="region"][aria-label^="Scrollable"] h2') as HTMLElement;
        return { font: getComputedStyle(h).fontFamily.split(",")[0], root: Array.from(document.querySelectorAll('[role="region"][aria-label^="Scrollable"] section')).length };
      });
      fonts.add(info.font);
      tops.add(`${id}:${info.root}`);
    }
    expect(fonts.size).toBeGreaterThanOrEqual(8);
  });

  test("no claims are invented in any template (reviews, ratings, accreditations, prices, hours, statistics)", async ({ page }) => {
    await mockMaps(page);
    const banned = [/\b\d(\.\d)? ?\/ ?5\b/, /★|⭐/, /\bgas safe|niceic|trustmark|which\? trusted|checkatrade/i, /£\s?\d/, /\b\d+\+? (years|customers|clients|jobs|projects)\b/i, /\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*[-–]\s*(mon|tue|wed|thu|fri|sat|sun)/i, /\bopen (daily|24)/i, /\bfully (insured|qualified|licensed)\b/i, /\baward/i];
    for (const id of CATEGORIES) {
      await page.goto(`/preview?c=${id}&n=Smith+Co&t=Watford&p=07700900123`);
      await settle(page);
      const text = await page.locator('[role="region"][aria-label^="Scrollable"]').innerText();
      for (const re of banned) expect(text, `${id} matches ${re}`).not.toMatch(re);
    }
  });

  test("the development harness is not shipped", async ({ page }) => {
    await page.goto("/__tpl");
    await expect(page.getByRole("heading", { name: /find that page/i })).toBeVisible();
  });

  test("photo credits are listed and open", async ({ page }) => {
    await page.goto("/preview?c=plumbing&n=Smith");
    await settle(page);
    await page.getByText("Photo and map credits").click();
    await expect(page.getByText(/Wikimedia Commons/).first()).toBeVisible();
    await expect(page.getByText(/OpenStreetMap contributors/)).toBeVisible();
  });
});

test.describe("preview templates accessibility", () => {
  for (const width of [390, 1440]) {
    for (const id of CATEGORIES) {
      test(`${id} @ ${width}: axe`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion: "reduce" });
        const page = await ctx.newPage();
        await mockMaps(page);
        await page.goto(`/preview?c=${id}&n=Smith+Co&t=Watford&p=07700900123`);
        await settle(page);
        await scrollFrame(page);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        expect(results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
        await ctx.close();
      });
    }
  }
});
