import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow, settle, watchErrors } from "./helpers";

const CATEGORIES = ["plumbing", "electrical", "mechanic", "cleaning", "barber", "tutoring", "shop", "builder", "other"];
const FRAME = '[role="region"][aria-label^="Scrollable"]';

async function mockGeo(page: Page, mode: "ok" | "fail" = "ok") {
  const cors = { "access-control-allow-origin": "*" };
  await page.route("https://nominatim.openstreetmap.org/**", (r) => (mode === "ok" ? r.fulfill({ json: [{ lat: "51.6565", lon: "-0.3903", display_name: "Watford, Hertfordshire, England, United Kingdom" }], headers: cors }) : r.fulfill({ status: 500, body: "x", headers: cors })));
  await page.route("https://api.postcodes.io/postcodes/**", (r) =>
    mode === "ok" && r.request().url().includes("WD17%201AA")
      ? r.fulfill({ json: { status: 200, result: { latitude: 51.656881, longitude: -0.398652, admin_district: "Watford", region: "East of England" } }, headers: cors })
      : r.fulfill({ status: 404, json: { status: 404 }, headers: cors })
  );
  await page.route("https://www.openstreetmap.org/**", (r) => r.fulfill({ contentType: "text/html", body: "<html><body style='margin:0;background:#cde'>map</body></html>" }));
}

async function scrollFrame(page: Page) {
  await page.evaluate(async () => {
    const el = document.querySelector('[role="region"][aria-label^="Scrollable"]') as HTMLElement;
    for (let y = 0; y <= el.scrollHeight; y += 300) {
      el.scrollTop = y;
      await new Promise((r) => setTimeout(r, 50));
    }
  });
  await page.waitForTimeout(400);
}

const next = (page: Page) => page.getByRole("button", { name: /^(Continue|Skip)$/ }).click();

async function walk(page: Page, opts: { name?: string; trade?: RegExp; town?: string; postcode?: string; pin?: boolean; phone?: string; email?: string; action?: RegExp } = {}) {
  await page.getByLabel("Business name").fill(opts.name ?? "Smith & Sons");
  await next(page);
  await page.getByRole("radio", { name: opts.trade ?? /Plumbers/ }).click();
  await next(page);
  await page.getByLabel("Town or area").fill(opts.town ?? "Watford");
  if (opts.postcode) await page.getByLabel(/Postcode/).fill(opts.postcode);
  if (opts.pin) await page.getByRole("checkbox", { name: /Put a pin/ }).check();
  await next(page);
  await next(page); // services (skip)
  if (opts.action) await page.getByRole("radio", { name: opts.action }).click();
  if (opts.phone !== "") await page.getByLabel(/^Phone/).fill(opts.phone ?? "07123 456789");
  if (opts.email) await page.getByLabel(/^Email/).fill(opts.email);
  await next(page);
}

for (const width of [390, 1440]) {
  test.describe(`guided preview @ ${width}`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 1000 } });

    test("walks through every step and ends on the preview", async ({ page }) => {
      const errors = watchErrors(page);
      await mockGeo(page);
      await page.goto("/preview");
      await settle(page);
      await expect(page.getByRole("heading", { name: "What's your business called?" })).toBeVisible();
      await expect(page.getByRole("progressbar", { name: "Preview setup progress" })).toBeVisible();
      await expect(page.getByText("Step 1 of 6: Business name")).toBeVisible();
      await walk(page, { postcode: "WD17 1AA" });
      await expect(page.getByRole("heading", { name: "Ready to build your preview" })).toBeFocused();
      const review = page.getByRole("form", { name: "Ready to build your preview" });
      await expect(review.getByText("Smith & Sons", { exact: true })).toBeVisible();
      await expect(review.getByText("Watford, WD17 1AA")).toBeVisible();
      await page.getByRole("button", { name: "Show my preview" }).click();
      await expect(page.getByRole("heading", { level: 1, name: /Smith & Sons's website preview/ })).toBeFocused();
      await expect(page.locator(FRAME)).toBeVisible();
      await expectNoHorizontalOverflow(page);
      expect(errors).toEqual([]);
    });

    test("nothing is mandatory: every step can be skipped and the preview still builds", async ({ page }) => {
      await mockGeo(page);
      await page.goto("/preview");
      await settle(page);
      for (let i = 0; i < 5; i++) {
        await expect(page.getByRole("button", { name: "Skip", exact: true })).toBeVisible();
        await next(page);
      }
      await expect(page.getByRole("heading", { name: "Ready to build your preview" })).toBeVisible();
      await page.getByRole("button", { name: "Show my preview" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Your website preview");
      await expect(page.locator(FRAME)).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });

    test("Skip to my preview works from the very first screen", async ({ page }) => {
      await mockGeo(page);
      await page.goto("/preview");
      await settle(page);
      await page.getByRole("button", { name: "Skip to my preview" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toContainText("website preview");
      await expect(page.locator(FRAME)).toBeVisible();
    });

    test("unusable entries get a gentle note and never block", async ({ page }) => {
      await mockGeo(page);
      await page.goto("/preview?n=Smith+%26+Sons&c=plumbing");
      await settle(page);
      await expect(page.getByRole("heading", { name: "Where do you work?" })).toBeVisible();
      await page.getByLabel(/Postcode/).fill("nonsense");
      await expect(page.getByRole("status").filter({ hasText: "postcode doesn't look right" })).toBeVisible();
      await next(page);
      await next(page);
      await expect(page.getByRole("heading", { name: /get in touch/i })).toBeVisible();
      await page.getByLabel(/^Phone/).fill("12");
      await expect(page.getByRole("status").filter({ hasText: "UK phone number" })).toBeVisible();
      await next(page);
      await page.getByRole("button", { name: "Show my preview" }).click();
      await expect(page.locator(FRAME)).toBeVisible();
    });

    test("a quote-request business can use an email instead of a phone", async ({ page }) => {
      await mockGeo(page);
      await page.goto("/preview");
      await walk(page, { action: /Quote requests/, phone: "", email: "sam@example.co.uk" });
      await page.getByRole("button", { name: "Show my preview" }).click();
      await expect(page.locator(FRAME)).toBeVisible();
    });

    test("Back and Change keep what was entered; Edit details returns from the preview", async ({ page }) => {
      await mockGeo(page);
      await page.goto("/preview");
      await walk(page);
      await page.getByRole("button", { name: /Change business/ }).click();
      await expect(page.getByLabel("Business name")).toHaveValue("Smith & Sons");
      await page.getByRole("button", { name: "Back" }).count();
      await page.getByLabel("Business name").fill("Jones Heating");
      for (let i = 0; i < 5; i++) await next(page);
      await page.getByRole("button", { name: "Show my preview" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Jones Heating");
      await page.getByRole("button", { name: "Edit details" }).click();
      await expect(page.getByRole("heading", { name: "Ready to build your preview" })).toBeVisible();
      await expect(page.getByRole("form", { name: "Ready to build your preview" }).getByText("Jones Heating", { exact: true })).toBeVisible();
    });

    test("a complete shared link opens the preview directly, with device tabs and another style", async ({ page }) => {
      await mockGeo(page);
      await page.goto("/preview?n=Smith+%26+Sons&c=barber&t=Watford&p=07123456789&a=book");
      await settle(page);
      await expect(page.locator(FRAME)).toBeVisible();
      await page.getByRole("tab", { name: "Phone" }).click();
      await expect(page.getByRole("tab", { name: "Phone" })).toHaveAttribute("aria-selected", "true");
      await page.getByRole("button", { name: "Try another style" }).click();
      await expect(page.locator(FRAME)).toBeVisible();
      await expect(page.getByRole("link", { name: /Start this project/ })).toHaveAttribute("href", /\/start\?package=/);
    });

    test("axe: each step of the guide", async ({ page }) => {
      await mockGeo(page);
      await page.goto("/preview");
      await settle(page);
      const check = async () => {
        await page.waitForTimeout(450); // let the step's fade-in finish before measuring contrast
        const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        expect(r.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
      };
      await check();
      await page.getByLabel("Business name").fill("Smith & Sons");
      await next(page);
      await check();
      await page.getByRole("radio", { name: /Plumbers/ }).click();
      await next(page);
      await page.getByLabel("Town or area").fill("Watford");
      await page.getByLabel(/Postcode/).fill("WD17 1AA");
      await page.waitForTimeout(1500);
      await check();
      await next(page);
      await check();
      await next(page);
      await page.getByLabel(/^Phone/).fill("07123 456789");
      await check();
      await next(page);
      await check();
    });
  });
}

test.describe("maps", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("postcode with a pin gives a pinned, close map; without the pin it shows the area only", async ({ page }) => {
    await mockGeo(page);
    await page.goto("/preview?n=Smith&c=plumbing&t=Watford&z=WD17+1AA&k=1&p=07123456789");
    await settle(page);
    await scrollFrame(page);
    const map = page.locator(`${FRAME} iframe[title="Map of WD17 1AA"]`);
    await expect(map).toHaveAttribute("src", /marker=51\.65688%2C-0\.39865/);
    await page.goto("/preview?n=Smith&c=plumbing&t=Watford&z=WD17+1AA&p=07123456789");
    await settle(page);
    await scrollFrame(page);
    const area = page.locator(`${FRAME} iframe[title="Map of Watford"]`);
    await expect(area).toHaveAttribute("src", /openstreetmap\.org\/export\/embed\.html\?bbox=/);
    expect(await area.getAttribute("src")).not.toContain("marker=");
  });

  test("a town alone gives an area map from a real lookup; other towns are listed", async ({ page }) => {
    await mockGeo(page);
    await page.goto("/preview?n=Smith&c=builder&t=Watford&ar=Bushey%7CRickmansworth&p=07123456789");
    await settle(page);
    await scrollFrame(page);
    await expect(page.locator(`${FRAME} iframe[title="Map of Watford"]`)).toBeVisible();
    await expect(page.locator(FRAME).getByText("Watford · Bushey · Rickmansworth")).toBeVisible();
  });

  test("the wizard shows the real map as soon as a place is typed, and says when it can't find it", async ({ page }) => {
    await mockGeo(page);
    await page.goto("/preview?n=Smith&c=plumbing");
    await page.getByLabel("Town or area").fill("Watford");
    await expect(page.getByRole("form", { name: "Where do you work?" }).locator('iframe[title="Map of Watford"]')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/Found Watford/)).toBeVisible();
    await page.getByLabel(/Postcode/).fill("WD17 1AA");
    await expect(page.getByText(/Found WD17 1AA, Watford, East of England/)).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole("button", { name: "Use Watford as my town" })).toHaveCount(0);
    await page.getByLabel("Town or area").fill("");
    await expect(page.getByRole("button", { name: "Use Watford as my town" })).toBeVisible({ timeout: 8000 });
    await page.getByRole("button", { name: "Use Watford as my town" }).click();
    await expect(page.getByLabel("Town or area")).toHaveValue("Watford");
    await page.getByLabel(/Postcode/).fill("ZZ99 9ZZ");
    await expect(page.getByText(/couldn't find that on the map|Found/).first()).toBeVisible({ timeout: 8000 });
  });

  test("failures are reported plainly and no map is invented", async ({ page }) => {
    await mockGeo(page, "fail");
    await page.goto("/preview?n=Smith&c=plumbing&t=Watford&p=07123456789");
    await settle(page);
    await scrollFrame(page);
    await expect(page.locator(FRAME).getByText("The map couldn't be loaded.")).toBeVisible();
    await expect(page.locator(`${FRAME} iframe`)).toHaveCount(0);
  });

  test("the pin choice is only offered for a valid postcode and defaults off for a plumber", async ({ page }) => {
    await mockGeo(page);
    await page.goto("/preview?n=Smith&c=plumbing");
    await expect(page.getByRole("checkbox", { name: /Put a pin/ })).toHaveCount(0);
    await page.getByLabel(/Postcode/).fill("WD17 1AA");
    await expect(page.getByRole("checkbox", { name: /Put a pin/ })).not.toBeChecked();
  });
});

for (const width of [390, 1440]) {
  test.describe(`templates @ ${width}`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 1000 } });

    for (const id of CATEGORIES) {
      test(`${id}: renders its own template with a real map and no errors`, async ({ page }) => {
        const errors = watchErrors(page);
        await mockGeo(page);
        await page.goto(`/preview?c=${id}&n=Smith+%26+Sons&t=Watford&z=WD17+1AA&p=07123456789&a=${id === "shop" ? "visit" : id === "barber" ? "book" : "call"}`);
        await settle(page);
        const frame = page.locator(FRAME);
        await expect(frame).toBeVisible();
        await expect(frame.getByText("Smith & Sons").first()).toBeVisible();
        await scrollFrame(page);
        await expect(frame.locator('iframe[title^="Map of"]')).toHaveAttribute("src", /^https:\/\/www\.openstreetmap\.org\/export\/embed\.html\?bbox=/);
        await expectNoHorizontalOverflow(page);
        expect(errors).toEqual([]);
      });

      test(`${id}: without a town it says so instead of showing a made-up map`, async ({ page }) => {
        await mockGeo(page);
        await page.goto(`/preview?c=${id}&n=Smith+%26+Sons&p=07123456789&a=call&t=Luton`);
        // remove the town through the wizard: open the edit flow and clear it
        await page.getByRole("button", { name: "Edit details" }).click();
        await page.getByRole("button", { name: /Change location/ }).click();
        await page.getByLabel("Town or area").fill("");
        await page.getByRole("button", { name: "Skip to my preview" }).click();
        await page.locator(FRAME).waitFor();
        await settle(page);
        await scrollFrame(page);
        await expect(page.locator(FRAME).getByText("Add your town and your area map appears here.")).toBeVisible();
      });
    }

    test("the Add-your-town message shows in the preview frame while the guide is open", async ({ page }) => {
      await mockGeo(page);
      await page.goto("/preview?c=plumbing&n=Smith");
      if (width < 1024) return;
      await page.locator(FRAME).waitFor();
      await settle(page);
      await scrollFrame(page);
      await expect(page.locator(FRAME).getByText("Add your town and your area map appears here.")).toBeVisible();
    });
  });
}

test.describe("template sanity", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("each trade has a visibly different template", async ({ page }) => {
    await mockGeo(page);
    const fonts = new Set<string>();
    for (const id of CATEGORIES) {
      await page.goto(`/preview?c=${id}&n=Smith+Co&t=Watford&p=07123456789&a=call`);
      await settle(page);
      fonts.add(await page.evaluate(() => getComputedStyle(document.querySelector('[role="region"][aria-label^="Scrollable"] h2') as HTMLElement).fontFamily.split(",")[0]));
    }
    expect(fonts.size).toBeGreaterThanOrEqual(8);
  });

  test("no claims are invented in any template (reviews, ratings, accreditations, prices, hours, statistics)", async ({ page }) => {
    await mockGeo(page);
    const banned = [/\b\d(\.\d)? ?\/ ?5\b/, /★|⭐/, /\bgas safe|niceic|trustmark|which\? trusted|checkatrade/i, /£\s?\d/, /\b\d+\+? (years|customers|clients|jobs|projects)\b/i, /\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*[-–]\s*(mon|tue|wed|thu|fri|sat|sun)/i, /\bopen (daily|24)/i, /\bfully (insured|qualified|licensed)\b/i, /\baward/i];
    for (const id of CATEGORIES) {
      await page.goto(`/preview?c=${id}&n=Smith+Co&t=Watford&p=07123456789&a=call`);
      await settle(page);
      const text = await page.locator(FRAME).innerText();
      for (const re of banned) expect(text, `${id} matches ${re}`).not.toMatch(re);
    }
  });

  test("there are no photographs or drawn art in the templates", async ({ page }) => {
    await mockGeo(page);
    for (const id of CATEGORIES) {
      await page.goto(`/preview?c=${id}&n=Smith+Co&t=Watford&p=07123456789&a=call`);
      await settle(page);
      await scrollFrame(page);
      expect(await page.locator(`${FRAME} img`).count(), id).toBe(0);
      expect(await page.locator(`${FRAME} svg[role="img"]`).count(), id).toBe(0);
    }
  });

  test("the development harness is not shipped", async ({ page }) => {
    await page.goto("/__tpl");
    await expect(page.getByRole("heading", { name: /find that page/i })).toBeVisible();
  });
});

test.describe("template accessibility", () => {
  for (const width of [390, 1440]) {
    for (const id of CATEGORIES) {
      test(`${id} @ ${width}: axe`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion: "reduce" });
        const page = await ctx.newPage();
        await mockGeo(page);
        await page.goto(`/preview?c=${id}&n=Smith+Co&t=Watford&z=WD17+1AA&p=07123456789&a=call`);
        await settle(page);
        await scrollFrame(page);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        expect(results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
        await ctx.close();
      });
    }
  }
});
