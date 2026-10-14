import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { briefMock, expectNoHorizontalOverflow, settle, watchErrors } from "./helpers";

test.describe("navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("mobile menu opens, lists links, closes with Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const btn = page.getByRole("button", { name: "Open menu" });
    await btn.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-menu").getByRole("link", { name: "Pricing" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("menu link navigates and the menu closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/\/packages$/);
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });

  test("skip link is the first tab stop and moves focus to main", async ({ page }) => {
    await page.goto("/packages");
    await settle(page);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});

test.describe("3D Our Work fallbacks", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("with ?3d=0 no canvas is created and the poster and controls work", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/?3d=0");
    await settle(page);
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(await page.locator("#work canvas").count()).toBe(0);
    const next = page.getByRole("button", { name: "Next project" });
    await next.click();
    await expect(page.getByRole("tab", { selected: true })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("reduced motion: page renders and the section stays usable", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const errors = watchErrors(page);
    await page.goto("/");
    await settle(page);
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: "Next project" }).click();
    await expect(page.locator("#work")).toBeVisible();
    expect(errors).toEqual([]);
    await ctx.close();
  });

  test("with WebGL unavailable the poster remains and nothing throws", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await ctx.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
        if (/webgl/i.test(type)) return null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (orig as any).call(this, type, ...rest);
      } as typeof orig;
    });
    const page = await ctx.newPage();
    const errors = watchErrors(page);
    await page.goto("/");
    await settle(page);
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await expect(page.locator("#work")).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous project" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Next project" })).toBeVisible();
    await expect(page.locator("#work").getByText("Visit site")).toHaveCount(0);
    expect(errors.filter((e) => !/WebGL|webgl|context/i.test(e))).toEqual([]);
    await ctx.close();
  });

  test("project pages exist as plain, linkable alternatives to the 3D rack", async ({ page }) => {
    await page.goto("/work");
    const cards = page.locator("main ul > li");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(8);
    await page.getByRole("link", { name: /FixNow Mechanics/ }).first().click();
    await expect(page.getByRole("heading", { level: 1, name: "FixNow Mechanics" })).toBeVisible();
    await expect(page.getByText("We don't publish traffic")).toBeVisible();
  });
});

test.describe("package selection and brief form", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("package choice from /packages is carried into /start", async ({ page }) => {
    await page.goto("/packages");
    const cta = page.getByRole("link", { name: /Get started with The Sorted/ });
    await cta.click();
    await expect(page).toHaveURL(/\/start\?package=sorted/);
    await expect(page.getByRole("radio", { name: /The Sorted/ })).toHaveAttribute("aria-checked", "true");
  });

  async function fillBrief(page: import("@playwright/test").Page) {
    await page.goto("/start?package=starter");
    await page.getByRole("button", { name: /Continue/ }).click();
    await page.getByRole("button", { name: /Skip & Continue|Continue/ }).click();
    await page.getByLabel(/Business name/).fill("Smith Plumbing");
    await page.getByLabel(/Your name/).fill("Sam Smith");
    await page.getByLabel(/Email address/).fill("sam@example.co.uk");
    await page.getByLabel(/What does your business do/).fill("Plumber in Watford");
  }

  test("inline validation is announced and tied to fields", async ({ page }) => {
    await page.goto("/start?package=starter");
    await page.getByRole("button", { name: /Continue/ }).click();
    await page.getByRole("button", { name: /Skip & Continue|Continue/ }).click();
    await page.getByRole("button", { name: /Send my brief/ }).click();
    const email = page.getByLabel(/Email address/);
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("alert").filter({ hasText: "Email is required" }).or(page.getByRole("alert").filter({ hasText: /valid|like name@/ }))).toBeVisible();
    await email.fill("nope");
    await email.blur();
    await expect(page.getByText("Enter an email address like name@example.com")).toBeVisible();
  });

  test("draft survives a reload, and success clears it", async ({ page }) => {
    await briefMock(page);
    await fillBrief(page);
    await page.reload();
    await expect(page.getByText("We kept your earlier answers")).toBeVisible();
    await expect(page.getByLabel(/Business name/)).toHaveValue("Smith Plumbing");
    await expect(page.getByLabel(/Email address/)).toHaveValue("sam@example.co.uk");
    await page.getByRole("button", { name: /Send my brief/ }).click();
    await expect(page.getByRole("heading", { name: /Brief received/ })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("oss_brief_draft_v1"))).toBeNull();
    await expect(page.locator("body")).not.toContainText(/24 hours/);
  });

  test("a failed send is shown, never faked, and keeps the answers", async ({ page }) => {
    await briefMock(page, 502, { error: "We couldn't send your brief. Your answers are saved here, so you can try again or email us." });
    await fillBrief(page);
    await page.getByRole("button", { name: /Send my brief/ }).click();
    await expect(page.getByRole("alert").filter({ hasText: /couldn't send your brief/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Brief received/ })).toHaveCount(0);
    await expect(page.getByLabel(/Business name/)).toHaveValue("Smith Plumbing");
  });

  test("server field errors and rate limiting are surfaced", async ({ page }) => {
    await briefMock(page, 400, { error: "Some details need fixing.", fields: { email: "Enter an email address like name@example.com" } });
    await fillBrief(page);
    await page.getByRole("button", { name: /Send my brief/ }).click();
    await expect(page.getByText("Some details need fixing. Check the highlighted fields.")).toBeVisible();
    await page.unroute("**/api/submit-form");
    await briefMock(page, 429, { error: "Too many" });
    await page.getByRole("button", { name: /Send my brief/ }).click();
    await expect(page.getByText(/Too many attempts/)).toBeVisible();
  });

  test("the honeypot is not reachable by keyboard or assistive tech", async ({ page }) => {
    await fillBrief(page);
    const hp = page.locator('input[name="company_site"]');
    await expect(hp).toHaveAttribute("tabindex", "-1");
    expect(await hp.evaluate((el) => !!el.closest("[aria-hidden='true']"))).toBe(true);
  });

  test("the request carries the package and add-ons and only fields the server expects", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/submit-form", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    });
    await fillBrief(page);
    await page.getByRole("button", { name: /Send my brief/ }).click();
    await expect(page.getByRole("heading", { name: /Brief received/ })).toBeVisible();
    expect(body.selectedPackage).toBe("starter");
    expect(body.businessName).toBe("Smith Plumbing");
    expect(body.company_site).toBe("");
    expect("price" in body).toBe(false);
  });
});

test.describe("contact", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("validates, sends and shows failure honestly", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Your name is required")).toBeVisible();
    await page.getByLabel(/Your name/).fill("Sam");
    await page.getByLabel(/Email address/).fill("sam@example.co.uk");
    await page.getByLabel(/Message/).fill("A question about the Sorted package");
    await page.route("**/api/contact", (r) => r.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ error: "We couldn't send your message. Please email us directly." }) }));
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /couldn't send your message/ })).toBeVisible();
    await page.unroute("**/api/contact");
    await page.route("**/api/contact", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) }));
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Message sent")).toBeVisible();
  });
});

test.describe("checkout gating and result pages", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  async function submitStarter(page: import("@playwright/test").Page) {
    await briefMock(page);
    await page.goto("/start?package=starter");
    await page.getByRole("button", { name: /Continue/ }).click();
    await page.getByRole("button", { name: /Skip & Continue|Continue/ }).click();
    await page.getByLabel(/Business name/).fill("Smith Plumbing");
    await page.getByLabel(/Your name/).fill("Sam Smith");
    await page.getByLabel(/Email address/).fill("sam@example.co.uk");
    await page.getByLabel(/What does your business do/).fill("Plumber in Watford");
    await page.getByRole("button", { name: /Send my brief/ }).click();
    await expect(page.getByRole("heading", { name: /Brief received/ })).toBeVisible();
  }

  test("no pay button when the server says checkout is off (the default)", async ({ page }) => {
    await page.route("**/api/checkout-status", (r) => r.fulfill({ json: { enabled: false, packages: [] } }));
    await submitStarter(page);
    await expect(page.getByRole("button", { name: /Pay £/ })).toHaveCount(0);
  });

  test("no pay button when the API is unreachable", async ({ page }) => {
    await page.route("**/api/checkout-status", (r) => r.abort());
    await submitStarter(page);
    await expect(page.getByRole("button", { name: /Pay £/ })).toHaveCount(0);
  });

  test("pay button appears only for enabled packages and only follows a Stripe URL", async ({ page }) => {
    await page.route("**/api/checkout-status", (r) => r.fulfill({ json: { enabled: true, packages: ["starter"] } }));
    let sent: Record<string, unknown> = {};
    await page.route("**/api/create-checkout-session", async (r) => {
      sent = r.request().postDataJSON();
      await r.fulfill({ json: { url: "https://evil.example/phish" } });
    });
    await submitStarter(page);
    const pay = page.getByRole("button", { name: "Pay £199.00 now" });
    await expect(pay).toBeVisible();
    await pay.click();
    await expect(page.getByRole("alert").filter({ hasText: /couldn't start payment/ })).toBeVisible();
    expect(page).toHaveURL(/\/start/);
    expect(sent.package).toBe("starter");
    expect("price" in sent || "amount" in sent).toBe(false);
  });

  test("success page shows paid only when the server verifies it", async ({ page }) => {
    await page.route("**/api/checkout-session**", (r) => r.fulfill({ json: { status: "paid", package: "starter", amountTotal: 19900 } }));
    await page.goto("/checkout/success?session_id=cs_test_abcdefghijklmn");
    await expect(page.getByRole("heading", { name: /Payment received/ })).toBeVisible();
    await expect(page.getByText(/£199\.00/)).toBeVisible();
  });

  test("success page never claims payment for unpaid, errors or missing/invalid ids", async ({ page }) => {
    await page.route("**/api/checkout-session**", (r) => r.fulfill({ json: { status: "unpaid" } }));
    await page.goto("/checkout/success?session_id=cs_test_abcdefghijklmn");
    await expect(page.getByRole("heading", { name: /Payment not completed/ })).toBeVisible();
    await page.unroute("**/api/checkout-session**");
    await page.route("**/api/checkout-session**", (r) => r.fulfill({ status: 502, json: { error: "x" } }));
    await page.goto("/checkout/success?session_id=cs_test_abcdefghijklmn");
    await expect(page.getByRole("heading", { name: /couldn't confirm/ })).toBeVisible();
    await page.goto("/checkout/success");
    await expect(page.getByRole("heading", { name: /couldn't confirm/ })).toBeVisible();
    await page.goto("/checkout/success?session_id=<script>");
    await expect(page.getByRole("heading", { name: /couldn't confirm/ })).toBeVisible();
  });

  test("cancel page is clear and noindex", async ({ page }) => {
    await page.goto("/checkout/cancel");
    await expect(page.getByRole("heading", { name: "Payment cancelled" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("accessibility (axe, WCAG 2.x A/AA)", () => {
  const pages = ["/", "/work", "/work/arf-mods", "/packages", "/how-it-works", "/preview", "/faq", "/start", "/start?package=sorted", "/contact", "/about", "/privacy", "/terms", "/cookies", "/accessibility", "/checkout/cancel", "/nope"];
  for (const width of [390, 1440]) {
    for (const route of pages) {
      test(`${route} @ ${width}`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion: "reduce" });
        const page = await ctx.newPage();
        await page.goto(route + (route.includes("?") ? "&3d=0" : "?3d=0"));
        await settle(page);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
        expect(summary).toEqual([]);
        await expectNoHorizontalOverflow(page);
        await ctx.close();
      });
    }
  }
});

test("work pages never link out to the example sites", async ({ page }) => {
  for (const path of ["/", "/work", "/work/fixnow-mechanics"]) {
    await page.goto(path);
    await settle(page);
    const hrefs = await page.locator('a[href^="http"]').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
    const own = ["fixnowmechanics.co.uk", "readysold.vercel.app", "stonebridge-construction.co.uk", "truetodetail.co.uk", "brightlearntutoring.co.uk", "arfmods.vercel.app"];
    for (const h of hrefs) expect(own.some((d) => h.includes(d)), `${path} links to ${h}`).toBe(false);
    await expect(page.getByText(/^Visit (site|\w+\.)/)).toHaveCount(0);
  }
});
