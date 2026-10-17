import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { briefMock, expectNoHorizontalOverflow, settle, watchErrors } from "./helpers";

test.describe("navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("menu opens full screen, lists links, closes with Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const btn = page.getByRole("button", { name: "Menu" });
    await btn.click();
    await expect(page.getByRole("button", { name: "Close", exact: true })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#site-menu").getByRole("link", { name: /Pricing/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-menu")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
  });

  test("menu link navigates and the menu closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.locator("#site-menu").getByRole("link", { name: /Pricing/ }).click();
    await expect(page).toHaveURL(/\/packages$/);
    await expect(page.locator("#site-menu")).toHaveCount(0);
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

test.describe("Work pages", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("home page hero is typographic and the work stack links to the work, reduced motion too", async ({ browser }) => {
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion });
      const page = await ctx.newPage();
      const errors = watchErrors(page);
      await page.goto("/");
      await settle(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/Websites\s*that make\s*sense\./);
      await expect(page.getByRole("link", { name: "View all work" }).first()).toHaveAttribute("href", "/work");
      expect(await page.locator("main .hm-hero img").count()).toBe(0);
      expect(errors).toEqual([]);
      await ctx.close();
    }
  });

  test("no page shows an out-of-date price", async ({ page }) => {
    for (const path of ["/", "/packages", "/faq", "/terms", "/how-it-works", "/web-design/watford"]) {
      await page.goto(path);
      await settle(page);
      const text = (await page.locator("body").innerText()) + (await page.locator("body").innerHTML());
      expect(text, path).not.toMatch(/£199|£399|The Starter|The Sorted|The Works|Keep It Running|£19\/month/);
    }
    await page.goto("/");
    await expect(page.locator(".hm-facts")).toContainText("£189");
  });

  test("every project is presented as client work", async ({ page }) => {
    await page.goto("/work");
    await expect(page.locator(".idx .irow .oss-tag")).toHaveCount(6);
    await expect(page.locator(".feat .oss-tag")).toHaveText(["Client work", "Client work"]);
    await expect(page.getByText(/sister/i)).toHaveCount(0);
  });

  test("project pages exist as plain, linkable pages", async ({ page }) => {
    await page.goto("/work");
    await expect(page.locator(".idx .irow").first()).toBeVisible();
    expect(await page.locator(".idx .irow").count()).toBe(6);
    await page.getByRole("link", { name: /FixNow Mechanics/ }).first().click();
    await expect(page.getByRole("heading", { level: 1, name: "FixNow Mechanics" })).toBeVisible();
    await expect(page.getByText("We don't publish traffic")).toBeVisible();
  });
});

test.describe("package selection and brief form", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("package choice from /packages is carried into /start", async ({ page }) => {
    await page.goto("/packages");
    const cta = page.getByRole("link", { name: /Get started with Growth/ });
    await cta.click();
    await expect(page).toHaveURL(/\/start\?package=growth/);
    await expect(page.getByRole("radio", { name: /Growth/ })).toHaveAttribute("aria-checked", "true");
  });

  /** Details -> monthly plan -> send. */
  async function sendBrief(page: import("@playwright/test").Page, plan = /No monthly plan for now/) {
    await page.getByRole("button", { name: /^Continue/ }).click();
    await page.getByRole("radio", { name: plan }).click();
    await page.getByRole("button", { name: /Send my brief/ }).click();
  }

  async function fillBrief(page: import("@playwright/test").Page) {
    await page.goto("/start?package=launch");
    await page.getByRole("button", { name: /Continue/ }).click();
    await page.getByRole("button", { name: /Skip and continue|Continue/ }).click();
    await page.getByLabel(/Business name/).fill("Smith Plumbing");
    await page.getByLabel(/Your name/).fill("Sam Smith");
    await page.getByLabel(/Email address/).fill("sam@example.co.uk");
    await page.getByLabel(/What does your business do/).fill("Plumber in Watford");
  }

  test("each package has a What is included dropdown that never changes the selection", async ({ page }) => {
    await page.goto("/start");
    const toggle = page.getByRole("button", { name: "What is included" }).first();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("An enquiry form", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("radio", { name: /Launch/ })).toHaveAttribute("aria-checked", "false");
    await expect(page.getByRole("radio", { name: /Enterprise/ })).toContainText("Tailored quotation");
    await expect(page.getByRole("radio", { name: /Growth/ })).toContainText("£489");
  });

  test("add-ons explain themselves, and the monthly plan is the last step", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/submit-form", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    });
    await page.goto("/start?package=growth");
    await page.getByRole("button", { name: /^Continue/ }).click();
    const logo = page.getByRole("button", { name: /Logo Design/ }).first();
    await page.getByRole("button", { name: "About Logo Design" }).click();
    await expect(page.getByText(/simple logo for your business/)).toBeVisible();
    await logo.click();
    await expect(logo).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /^Continue/ }).click();
    await page.getByLabel(/Business name/).fill("Smith Plumbing");
    await page.getByLabel(/Your name/).fill("Sam Smith");
    await page.getByLabel(/Email address/).fill("sam@example.co.uk");
    await page.getByLabel(/What does your business do/).fill("Plumber in Watford");
    await page.getByRole("button", { name: /^Continue/ }).click();
    await expect(page.getByRole("heading", { name: /Monthly/ })).toBeVisible();
    const send = page.getByRole("button", { name: /Send my brief/ });
    await expect(send).toBeDisabled();
    await page.getByRole("radio", { name: /^Hosting & Care/ }).click();
    await expect(page.getByText("£538")).toBeVisible();
    await send.click();
    await expect(page.getByRole("heading", { name: /Brief received/ })).toBeVisible();
    expect(body.monthlyPlan).toBe("hosting-care");
    expect(body.selectedPackage).toBe("growth");
    expect(body.selectedAddons).toEqual(["logo"]);
  });

  test("Enterprise skips add-ons and the monthly plan", async ({ page }) => {
    await page.goto("/start?package=enterprise");
    await page.getByRole("button", { name: /^Continue/ }).click();
    await expect(page.getByLabel(/Business name/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Send my brief/ })).toBeVisible();
  });

  test("inline validation is announced and tied to fields", async ({ page }) => {
    await page.goto("/start?package=launch");
    await page.getByRole("button", { name: /Continue/ }).click();
    await page.getByRole("button", { name: /Skip and continue|Continue/ }).click();
    await page.getByRole("button", { name: /^Continue/ }).click();
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
    await sendBrief(page);
    await expect(page.getByRole("heading", { name: /Brief received/ })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("oss_brief_draft_v1"))).toBeNull();
    await expect(page.locator("body")).not.toContainText(/24 hours/);
  });

  test("a failed send is shown, never faked, and keeps the answers", async ({ page }) => {
    await briefMock(page, 502, { error: "We couldn't send your brief. Your answers are saved here, so you can try again or email us." });
    await fillBrief(page);
    await sendBrief(page);
    await expect(page.getByRole("alert").filter({ hasText: /couldn't send your brief/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Brief received/ })).toHaveCount(0);
    await page.getByRole("button", { name: /Back/ }).click();
    await expect(page.getByLabel(/Business name/)).toHaveValue("Smith Plumbing");
  });

  test("server field errors and rate limiting are surfaced", async ({ page }) => {
    await briefMock(page, 400, { error: "Some details need fixing.", fields: { email: "Enter an email address like name@example.com" } });
    await fillBrief(page);
    await sendBrief(page);
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
    await sendBrief(page);
    await expect(page.getByRole("heading", { name: /Brief received/ })).toBeVisible();
    expect(body.monthlyPlan).toBe("none");
    expect(body.selectedPackage).toBe("launch");
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
    await page.getByLabel(/Message/).fill("A question about the Growth package");
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

  async function submitLaunch(page: import("@playwright/test").Page) {
    await briefMock(page);
    await page.goto("/start?package=launch");
    await page.getByRole("button", { name: /Continue/ }).click();
    await page.getByRole("button", { name: /Skip and continue|Continue/ }).click();
    await page.getByLabel(/Business name/).fill("Smith Plumbing");
    await page.getByLabel(/Your name/).fill("Sam Smith");
    await page.getByLabel(/Email address/).fill("sam@example.co.uk");
    await page.getByLabel(/What does your business do/).fill("Plumber in Watford");
    await page.getByRole("button", { name: /^Continue/ }).click();
    await page.getByRole("radio", { name: /No monthly plan for now/ }).click();
    await page.getByRole("button", { name: /Send my brief/ }).click();
    await expect(page.getByRole("heading", { name: /Brief received/ })).toBeVisible();
  }

  test("no pay button when the server says checkout is off (the default)", async ({ page }) => {
    await page.route("**/api/checkout-status", (r) => r.fulfill({ json: { enabled: false, packages: [] } }));
    await submitLaunch(page);
    await expect(page.getByRole("button", { name: /Pay £/ })).toHaveCount(0);
  });

  test("no pay button when the API is unreachable", async ({ page }) => {
    await page.route("**/api/checkout-status", (r) => r.abort());
    await submitLaunch(page);
    await expect(page.getByRole("button", { name: /Pay £/ })).toHaveCount(0);
  });

  test("pay button appears only for enabled packages and only follows a Stripe URL", async ({ page }) => {
    await page.route("**/api/checkout-status", (r) => r.fulfill({ json: { enabled: true, packages: ["launch"] } }));
    let sent: Record<string, unknown> = {};
    await page.route("**/api/create-checkout-session", async (r) => {
      sent = r.request().postDataJSON();
      await r.fulfill({ json: { url: "https://evil.example/phish" } });
    });
    await submitLaunch(page);
    const pay = page.getByRole("button", { name: "Pay £189.00 now" });
    await expect(pay).toBeVisible();
    await pay.click();
    await expect(page.getByRole("alert").filter({ hasText: /couldn't start payment/ })).toBeVisible();
    expect(page).toHaveURL(/\/start/);
    expect(sent.package).toBe("launch");
    expect("price" in sent || "amount" in sent).toBe(false);
  });

  test("success page shows paid only when the server verifies it", async ({ page }) => {
    await page.route("**/api/checkout-session**", (r) => r.fulfill({ json: { status: "paid", package: "launch", amountTotal: 18900 } }));
    await page.goto("/checkout/success?session_id=cs_test_abcdefghijklmn");
    await expect(page.getByRole("heading", { name: /Payment received/ })).toBeVisible();
    await expect(page.getByText(/£189\.00/)).toBeVisible();
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
  const pages = ["/", "/work", "/work/arf-mods", "/packages", "/how-it-works", "/preview", "/faq", "/start", "/start?package=growth", "/contact", "/about", "/privacy", "/terms", "/cookies", "/accessibility", "/checkout/cancel", "/nope"];
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
