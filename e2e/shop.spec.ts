/* eslint-disable @typescript-eslint/no-explicit-any */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { CARD_LINE, OPEN_STATUS, REVIEW_LINK, SIGN_LINE, expectNoHorizontalOverflow, seedCart, settle, shopStatus, watchErrors } from "./helpers";

test.use({ viewport: { width: 390, height: 844 } });

async function addReviewCard(page: Page, variantLabel?: RegExp) {
  await page.goto("/shop/review-card");
  if (variantLabel) await page.getByRole("radio", { name: variantLabel }).click();
  await page.getByLabel(/Business name to print/).fill("Smith Plumbing");
  await page.getByLabel(/Your Google review link/).fill(REVIEW_LINK);
  await page.getByRole("button", { name: "Add to basket" }).click();
}

test.describe("catalogue and filters", () => {
  test("lists every product with a from-price, and filters and sorts", async ({ page }) => {
    await shopStatus(page, { open: false, skus: {} });
    await page.goto("/shop");
    await expect(page.locator("main ul > li").first()).toBeVisible();
    expect(await page.locator("main ul > li").count()).toBe(7);
    await page.getByRole("radio", { name: "Signs & stands" }).click();
    await expect(page).toHaveURL(/category=signs/);
    expect(await page.locator("main ul > li").count()).toBe(1);
    await expect(page.getByRole("status").filter({ hasText: "1 product in Signs & stands" })).toBeVisible();
    await page.getByRole("radio", { name: "All" }).click();
    await page.getByLabel("Sort").selectOption("price-asc");
    const prices = await page.locator("main ul > li p[id$='-price'] span.nums").allInnerTexts();
    const nums = prices.map((p) => Number(p.replace("£", "")));
    expect(nums).toEqual([...nums].sort((a, b) => a - b));
    expect(nums[0]).toBe(9.99);
  });

  test("direct links to a category and an unknown product behave", async ({ page }) => {
    await page.goto("/shop?category=digital");
    await expect(page.locator("main ul > li").first()).toBeVisible();
    expect(await page.locator("main ul > li").count()).toBe(1);
    await page.goto("/shop?category=bogus");
    await expect(page.locator("main ul > li").first()).toBeVisible();
    expect(await page.locator("main ul > li").count()).toBe(7);
    await page.goto("/shop/not-a-product");
    await expect(page.getByRole("heading", { name: /find that page/i })).toBeVisible();
  });
});

test.describe("product page: variants, personalisation, add to basket", () => {
  test("variant changes the price; validation is inline, announced and focuses the first problem", async ({ page }) => {
    await page.goto("/shop/review-card");
    await expect(page.getByText("1 x 1 card")).toBeVisible();
    await page.getByRole("radio", { name: /Pack of 10/ }).click();
    await expect(page.getByRole("radio", { name: /Pack of 10/ })).toHaveAttribute("aria-checked", "true");
    await expect(page.locator("form").getByText("£99.00").last()).toBeVisible();
    await page.getByRole("button", { name: "Add to basket" }).click();
    const name = page.getByLabel(/Business name to print/);
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toBeFocused();
    await expect(page.getByRole("alert").filter({ hasText: "Business name to print is required" })).toBeVisible();
    await name.fill("Smith Plumbing");
    const link = page.getByLabel(/Your Google review link/);
    await link.fill("https://example.com/nope");
    await link.blur();
    await expect(page.getByText("That isn't a Google review link")).toBeVisible();
    await expect(page.getByLabel(/Basket, empty/)).toBeVisible();
  });

  test("a valid add updates the basket count, persists across reloads and merges identical lines", async ({ page }) => {
    await addReviewCard(page);
    await expect(page.getByText("Added to your basket")).toBeVisible();
    await expect(page.getByRole("link", { name: "Basket, 1 item" })).toBeVisible();
    await page.getByRole("button", { name: "Add to basket" }).click();
    await expect(page.getByRole("link", { name: "Basket, 2 items" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("link", { name: "Basket, 2 items" })).toBeVisible();
    await page.getByRole("link", { name: "View basket" }).or(page.getByRole("link", { name: /Basket, 2 items/ })).first().click();
    await expect(page).toHaveURL(/\/shop\/cart/);
    await expect(page.getByRole("heading", { name: "NFC + QR Review Card" })).toBeVisible();
    await expect(page.getByText("x 2").or(page.getByText("2", { exact: true })).first()).toBeVisible();
  });

  test("bare domains are normalised and the table sign shows only the fields for its purpose", async ({ page }) => {
    await page.goto("/shop/qr-table-sign");
    await expect(page.getByLabel(/Page the sign opens/)).toHaveCount(0);
    await page.getByLabel(/What should the sign do/).selectOption("menu");
    await expect(page.getByLabel(/Page the sign opens/)).toBeVisible();
    await expect(page.getByLabel(/Wi-Fi network name/)).toHaveCount(0);
    const link = page.getByLabel(/Page the sign opens/);
    await link.fill("www.cafe.co.uk");
    await link.blur();
    await expect(link).toHaveValue("https://www.cafe.co.uk");
    await page.getByLabel(/What should the sign do/).selectOption("wifi");
    await expect(page.getByLabel(/Wi-Fi network name/)).toBeVisible();
    await expect(page.getByLabel(/Page the sign opens/)).toHaveCount(0);
    await page.getByLabel(/Business name to print/).fill("Cafe");
    await page.getByLabel(/Wi-Fi network name/).fill("Cafe-Guest");
    await page.getByLabel(/Wi-Fi security type/).selectOption("WPA");
    await page.getByRole("button", { name: "Add to basket" }).click();
    await expect(page.getByText("Enter the Wi-Fi password")).toBeVisible();
    await page.getByLabel(/Wi-Fi password/).fill("hunter22");
    await page.getByRole("button", { name: "Add to basket" }).click();
    await expect(page.getByText("Added to your basket")).toBeVisible();
    await page.goto("/shop/cart");
    await expect(page.getByText("••••••••")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("hunter22");
  });

  test("keyboard only: tab through the form, type, and submit with Enter", async ({ page }) => {
    await page.goto("/shop/digital-qr-pack");
    await page.getByLabel(/Link for QR code 1/).focus();
    await page.keyboard.type("www.smithplumbing.co.uk");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Added to your basket")).toBeVisible();
    await expect(page.getByRole("link", { name: "Basket, 1 item" })).toBeVisible();
  });

  test("quantity stepper respects limits", async ({ page }) => {
    await page.goto("/shop/digital-qr-pack");
    await expect(page.getByRole("button", { name: "Increase quantity" })).toBeDisabled();
    await page.goto("/shop/review-stand");
    for (let i = 0; i < 10; i++) if (await page.getByRole("button", { name: "Increase quantity" }).isEnabled()) await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(page.locator("#qty")).toHaveValue("6");
  });

  test("availability messaging is honest in every state", async ({ page }) => {
    await shopStatus(page, { open: false, skus: { "review-card:x1": "unavailable" } });
    await page.goto("/shop/review-card");
    await expect(page.getByRole("heading", { name: "Ordering isn't open yet" })).toBeVisible();
    await expect(page.getByText("Ordering isn't open yet. You can add this to your basket and pay when it opens.")).toBeVisible();
    await page.unroute("**/api/shop-status");
    await shopStatus(page, { open: true, skus: { "review-card:x1": "sold-out", "review-card:x5": "available" } });
    await page.goto("/shop/review-card");
    await expect(page.getByText("This option is sold out.")).toBeVisible();
    await page.unroute("**/api/shop-status");
    await shopStatus(page, OPEN_STATUS);
    await page.goto("/shop/review-card");
    await expect(page.getByRole("heading", { name: "Ordering isn't open yet" })).toHaveCount(0);
  });
});

test.describe("basket", () => {
  test("empty state, then lines, quantity, remove and totals with delivery rules", async ({ page }) => {
    await page.goto("/shop/cart");
    await expect(page.getByRole("heading", { name: "Your basket is empty" })).toBeVisible();
    await seedCart(page, [CARD_LINE]);
    await page.goto("/shop/cart");
    await expect(page.getByText("£14.99").first()).toBeVisible();
    await expect(page.getByText("£3.95").first()).toBeVisible();
    await expect(page.getByText("£18.94")).toBeVisible();
    await expect(page.getByText(/Add £35\.01 more/)).toBeVisible();
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(page.getByText("£59.96").first()).toBeVisible();
    await expect(page.getByText("Free").first()).toBeVisible();
    await page.getByRole("button", { name: "Decrease quantity" }).click();
    await expect(page.getByText("£44.97").first()).toBeVisible();
    await page.getByRole("button", { name: /Remove NFC \+ QR Review Card/ }).click();
    await expect(page.getByRole("heading", { name: "Your basket is empty" })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("oss_cart_v1"))).toBeNull();
  });

  test("a tampered or stale basket in storage is cleaned, never trusted", async ({ page }) => {
    await seedCart(page, [{ ...CARD_LINE, price: 1, qty: 99999, unitPence: 1 }, { id: "x", slug: "gold-bar", variantId: "x1", qty: 1, personalisation: {} }, { ...CARD_LINE, id: "y", personalisation: { businessName: "A", reviewLink: "https://evil.example" } }]);
    await page.goto("/shop/cart");
    await expect(page.getByText("£149.90").or(page.getByText("£59.90"))).toHaveCount(0);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("oss_cart_v1") ?? "[]"));
    expect(stored.length).toBeLessThanOrEqual(1);
    for (const l of stored) {
      expect(l.qty).toBeLessThanOrEqual(10);
      expect("price" in l || "unitPence" in l).toBe(false);
    }
  });

  test("cross-sell appears in the basket", async ({ page }) => {
    await seedCart(page, [CARD_LINE]);
    await page.goto("/shop/cart");
    await expect(page.getByRole("heading", { name: "People also add" })).toBeVisible();
  });
});

test.describe("checkout review and gating", () => {
  test("closed shop: clear unavailable state, disabled pay button, notify form, nothing sent", async ({ page }) => {
    let called = false;
    await page.route("**/api/shop-checkout", (r) => {
      called = true;
      return r.fulfill({ status: 503, json: {} });
    });
    await shopStatus(page, { open: false, skus: {} });
    await seedCart(page, [CARD_LINE]);
    await page.goto("/shop/checkout");
    await expect(page.getByRole("heading", { name: "You can't pay yet" })).toBeVisible();
    const pay = page.getByRole("button", { name: "Ordering isn't open yet" });
    await expect(pay).toBeDisabled();
    await expect(page.getByRole("button", { name: "Notify me" })).toBeVisible();
    expect(called).toBe(false);
  });

  test("API unreachable: payment stays off and the basket is kept", async ({ page }) => {
    await page.route("**/api/shop-status", (r) => r.abort());
    await seedCart(page, [CARD_LINE]);
    await page.goto("/shop/checkout");
    await expect(page.getByRole("heading", { name: "We can't check availability right now" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Pay £/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Ordering isn't open yet" })).toBeDisabled();
  });

  test("an unavailable line blocks payment even when the shop is open", async ({ page }) => {
    await shopStatus(page, { open: true, skus: { "review-card:x1": "sold-out" } });
    await seedCart(page, [CARD_LINE]);
    await page.goto("/shop/checkout");
    await expect(page.getByText("Sold out")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ordering isn't open yet" })).toBeDisabled();
  });

  test("open shop: review shows every detail, validates email and terms, then posts only ids and details", async ({ page }) => {
    await shopStatus(page, OPEN_STATUS);
    let sent: Record<string, any> = {};
    await page.route("**/api/shop-checkout", async (r) => {
      sent = r.request().postDataJSON();
      await r.fulfill({ json: { url: "https://checkout.stripe.com/c/pay/cs_test_abcdefghij1", ref: "OSS-ABCDEFGH" } });
    });
    await page.route("https://checkout.stripe.com/**", (r) => r.fulfill({ contentType: "text/html", body: "<title>Stripe</title><h1>Stripe checkout</h1>" }));
    await seedCart(page, [CARD_LINE, SIGN_LINE]);
    await page.goto("/shop/checkout");
    await expect(page.getByText("Smith Plumbing").first()).toBeVisible();
    await expect(page.getByText("Guest", { exact: true })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("hunter22");
    const pay = page.getByRole("button", { name: /Pay £34\.93 securely/ });
    await expect(pay).toBeEnabled();
    await pay.click();
    await expect(page.getByText("Enter an email address like name@example.com")).toBeVisible();
    await expect(page.getByText("Tick the box to confirm")).toBeVisible();
    await expect(page.getByLabel(/Email address/)).toHaveAttribute("aria-invalid", "true");
    await page.getByLabel(/Email address/).fill("sam@example.co.uk");
    await page.getByRole("checkbox").check();
    await pay.click();
    await expect(page.getByRole("heading", { name: "Stripe checkout" })).toBeVisible();
    expect(sent.email).toBe("sam@example.co.uk");
    expect(sent.acceptTerms).toBe(true);
    expect(sent.items).toHaveLength(2);
    expect(JSON.stringify(sent)).not.toMatch(/price|amount|total|unitPence/i);
    expect(sent.items[0]).toMatchObject({ slug: "review-card", variantId: "x1", qty: 1 });
  });

  for (const [status, body, expected] of [
    [409, { code: "unavailable", error: "x" }, /Ordering isn't open for part of your basket/],
    [409, { code: "insufficient-stock", error: "x" }, /isn't enough stock/],
    [400, { code: "personalisation", error: "x" }, /details need fixing/],
    [429, { error: "x" }, /Too many attempts/],
    [502, { code: "stripe", error: "We couldn't start payment. Your basket is saved; please try again." }, /couldn't start payment/],
  ] as const) {
    test(`server ${status} ${"code" in body ? body.code : "rate"} is explained and nothing is cleared`, async ({ page }) => {
      await shopStatus(page, OPEN_STATUS);
      await page.route("**/api/shop-checkout", (r) => r.fulfill({ status, json: body }));
      await seedCart(page, [CARD_LINE]);
      await page.goto("/shop/checkout");
      await page.getByLabel(/Email address/).fill("sam@example.co.uk");
      await page.getByRole("checkbox").check();
      await page.getByRole("button", { name: /Pay £/ }).click();
      await expect(page.getByRole("alert").filter({ hasText: expected })).toBeVisible();
      expect(await page.evaluate(() => localStorage.getItem("oss_cart_v1"))).not.toBeNull();
    });
  }

  test("a non-Stripe redirect from the server is refused", async ({ page }) => {
    await shopStatus(page, OPEN_STATUS);
    await page.route("**/api/shop-checkout", (r) => r.fulfill({ json: { url: "https://evil.example/pay" } }));
    await seedCart(page, [CARD_LINE]);
    await page.goto("/shop/checkout");
    await page.getByLabel(/Email address/).fill("sam@example.co.uk");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Pay £/ }).click();
    await expect(page.getByRole("alert").filter({ hasText: /couldn't start payment/ })).toBeVisible();
    expect(page.url()).toContain("/shop/checkout");
  });

  test("empty basket on checkout is handled", async ({ page }) => {
    await page.goto("/shop/checkout");
    await expect(page.getByRole("heading", { name: "Nothing to check out" })).toBeVisible();
  });
});

test.describe("order result pages", () => {
  const paid = { verdict: "paid", order: { ref: "OSS-ABCDEFGH", status: "paid", hasPhysical: true, totalPence: 1894, lines: [{ name: "NFC + QR Review Card", variant: "1 card", qty: 1 }] } };

  test("success: verified paid shows the reference and empties the basket; unpaid and errors do not", async ({ page }) => {
    await shopStatus(page, OPEN_STATUS);
    await seedCart(page, [CARD_LINE]);
    await page.route("**/api/shop-order**", (r) => r.fulfill({ json: paid }));
    await page.goto("/shop/order/success?session_id=cs_test_abcdefghij1");
    await expect(page.getByRole("heading", { name: /Order received/ })).toBeVisible();
    await expect(page.getByText("OSS-ABCDEFGH")).toBeVisible();
    await expect(page.getByText("£18.94")).toBeVisible();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("oss_cart_v1"))).toBeNull();

    await page.unroute("**/api/shop-order**");
    await page.route("**/api/shop-order**", (r) => r.fulfill({ json: { verdict: "unpaid" } }));
    await page.evaluate(() => localStorage.setItem("oss_cart_v1", JSON.stringify([{ id: "l1", slug: "review-card", variantId: "x1", qty: 1, personalisation: { businessName: "Smith Plumbing", reviewLink: "https://g.page/r/Cabc123/review" } }])));
    await page.goto("/shop/order/success?session_id=cs_test_abcdefghij1");
    await expect(page.getByRole("heading", { name: "Payment not completed" })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("oss_cart_v1"))).not.toBeNull();

    for (const url of ["/shop/order/success", "/shop/order/success?session_id=<script>"]) {
      await page.goto(url);
      await expect(page.getByRole("heading", { name: /couldn't confirm/ })).toBeVisible();
    }
    await page.unroute("**/api/shop-order**");
    await page.route("**/api/shop-order**", (r) => r.fulfill({ status: 502, json: { error: "x" } }));
    await page.goto("/shop/order/success?session_id=cs_test_abcdefghij1");
    await expect(page.getByRole("heading", { name: /couldn't confirm/ })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("oss_cart_v1"))).not.toBeNull();
  });

  test("cancel keeps the basket", async ({ page }) => {
    await seedCart(page, [CARD_LINE]);
    await page.goto("/shop/order/cancel");
    await expect(page.getByRole("heading", { name: "Payment cancelled" })).toBeVisible();
    await expect(page.getByText("Your basket is still saved.")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("order status lookup: found, wrong details and validation", async ({ page }) => {
    await page.route("**/api/shop-order**", (r) => {
      const u = new URL(r.request().url());
      if (u.searchParams.get("email") === "sam@example.co.uk") return r.fulfill({ json: { order: { ...paid.order, status: "pending" } } });
      return r.fulfill({ status: 404, json: { error: "We couldn't find that order. Check the reference and the email address you used." } });
    });
    await page.goto("/shop/order-status");
    await page.getByRole("button", { name: "Check order" }).click();
    await expect(page.getByRole("alert")).toContainText("Enter your order reference");
    await page.getByLabel(/Order reference/).fill("OSS-ABCDEFGH");
    await page.getByLabel(/Email address/).fill("other@example.co.uk");
    await page.getByRole("button", { name: "Check order" }).click();
    await expect(page.getByRole("alert")).toContainText("couldn't find that order");
    await page.getByLabel(/Email address/).fill("sam@example.co.uk");
    await page.getByRole("button", { name: "Check order" }).click();
    await expect(page.getByRole("heading", { name: "Awaiting payment" })).toBeVisible();
  });
});

test.describe("notify me", () => {
  test("needs consent and a valid email, then confirms", async ({ page }) => {
    await shopStatus(page, { open: false, skus: {} });
    let body: any = {};
    await page.route("**/api/shop-notify", async (r) => {
      body = r.request().postDataJSON();
      await r.fulfill({ json: { success: true } });
    });
    await page.goto("/shop");
    await page.getByRole("button", { name: "Notify me" }).click();
    await expect(page.getByRole("alert")).toContainText("Enter an email address");
    await page.getByLabel(/Email me when ordering opens/).fill("sam@example.co.uk");
    await page.getByRole("button", { name: "Notify me" }).click();
    await expect(page.getByRole("alert")).toContainText("Tick the box");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Notify me" }).click();
    await expect(page.getByText(/We'll email you once when ordering opens/)).toBeVisible();
    expect(body.consent).toBe(true);
    expect(body.company_site).toBe("");
  });
});

test.describe("help, cross-sells and navigation", () => {
  test("help page: delivery, returns, VAT and FAQ accordion work by keyboard", async ({ page }) => {
    await page.goto("/shop/help");
    await expect(page.getByRole("heading", { name: "Returns, refunds and faults" })).toBeVisible();
    await expect(page.getByText(/within 30 days/).first()).toBeVisible();
    const q = page.getByRole("button", { name: "Is VAT included?" });
    await q.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("VAT treatment is still to be confirmed").last()).toBeVisible();
  });

  test("website pages cross-sell to the shop", async ({ page }) => {
    await page.goto("/packages");
    await expect(page.getByRole("heading", { name: "Pair your new website with the shop" })).toBeVisible();
    await page.goto("/preview");
    await expect(page.getByRole("heading", { name: "Take it off the screen" })).toBeVisible();
    await page.goto("/shop/review-card");
    await expect(page.getByRole("heading", { name: "Goes well with" })).toBeVisible();
    await expect(page.getByRole("link", { name: "See website packages" })).toBeVisible();
  });

  test("shop link and basket are reachable from the mobile menu and header on every page", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "Shop" }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole("link", { name: /^Basket/ })).toBeVisible();
  });

  test("desktop nav fits on one line with Shop and basket", async ({ browser }) => {
    for (const width of [1024, 1280, 1440]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await ctx.newPage();
      await page.goto("/shop");
      await settle(page);
      const cta = page.getByRole("link", { name: /Get Started/ }).first();
      const box = await cta.boundingBox();
      expect(box!.height, `CTA wraps at ${width}`).toBeLessThan(50);
      await expectNoHorizontalOverflow(page);
      await ctx.close();
    }
  });

  test("the shop makes no unsupported claims", async ({ page }) => {
    const banned = [/guarantee/i, /lifetime/i, /waterproof/i, /eco[- ]?friendly|sustainab|recycl/i, /best[- ]?sell/i, /boost your (google )?(rating|reviews)/i, /more (5|five)[- ]star/i, /next[- ]day|same[- ]day|24[- ]hour/i, /in stock/i, /award|certified|accredited/i, /free returns/i, /money[- ]back/i, /reviews from customers/i];
    for (const route of ["/shop", "/shop/review-card", "/shop/review-stand", "/shop/review-kit", "/shop/smart-business-card", "/shop/qr-table-sign", "/shop/sticker-pack", "/shop/digital-qr-pack", "/shop/help"]) {
      await page.goto(route);
      await settle(page);
      const text = await page.locator("body").innerText();
      for (const re of banned) expect(text, `${route} matches ${re}`).not.toMatch(re);
    }
  });
});

test.describe("shop accessibility (axe)", () => {
  const pages: [string, boolean][] = [["/shop", false], ["/shop/review-card", false], ["/shop/qr-table-sign", false], ["/shop/digital-qr-pack", false], ["/shop/help", false], ["/shop/cart", true], ["/shop/checkout", true], ["/shop/order/cancel", true], ["/shop/order-status", false], ["/shop/order/success", false]];
  for (const width of [390, 1440]) {
    for (const [route, seeded] of pages) {
      test(`${route}${seeded ? " (with items)" : ""} @ ${width}`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion: "reduce" });
        const page = await ctx.newPage();
        await shopStatus(page, route === "/shop/checkout" ? OPEN_STATUS : { open: false, skus: {} });
        if (seeded) await seedCart(page, [CARD_LINE, SIGN_LINE]);
        await page.goto(route);
        await settle(page);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        expect(results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
        await expectNoHorizontalOverflow(page);
        await ctx.close();
      });
    }
  }

  test("shop flows produce no console errors", async ({ page }) => {
    const errors = watchErrors(page);
    await shopStatus(page, OPEN_STATUS);
    await addReviewCard(page, /Pack of 5/);
    await page.goto("/shop/cart");
    await page.goto("/shop/checkout");
    await settle(page);
    expect(errors).toEqual([]);
  });
});
