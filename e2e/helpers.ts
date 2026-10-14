import { expect, type Page } from "@playwright/test";

export const ROUTES = [
  "/",
  "/work",
  "/shop",
  "/shop/review-card",
  "/shop/qr-table-sign",
  "/shop/digital-qr-pack",
  "/shop/help",
  "/shop/cart",
  "/shop/checkout",
  "/shop/order/cancel",
  "/shop/order/success",
  "/shop/order-status",
  "/shop/not-a-product",
  "/work/fixnow-mechanics",
  "/packages",
  "/how-it-works",
  "/preview",
  "/faq",
  "/start",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
  "/cookies",
  "/accessibility",
  "/checkout/cancel",
  "/definitely-not-a-page",
];

export const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 640 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "wide-2200", width: 2200, height: 1200 },
];

/** Collects console errors and failed same-origin requests for a page. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    // The 404 page and mocked-API tests intentionally produce these.
    if (/Failed to load resource/.test(t)) return;
    errors.push(t);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}

export async function settle(page: Page) {
  await page.waitForLoadState("networkidle").catch(() => undefined);
  await page.waitForTimeout(400);
}

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return { scroll: el.scrollWidth, client: el.clientWidth };
  });
  expect(overflow.scroll, `horizontal overflow ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.client + 1);
}

export const briefMock = (page: Page, status = 200, body: unknown = { success: true }) =>
  page.route("**/api/submit-form", (route) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }));

export const REVIEW_LINK = "https://g.page/r/Cabc123/review";

/** Mock the shop-status endpoint. */
export const shopStatus = (page: Page, body: unknown, status = 200) =>
  page.route("**/api/shop-status", (r) => r.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }));

export const OPEN_STATUS = { open: true, skus: { "review-card:x1": "available", "review-card:x5": "available", "review-card:x10": "available", "digital-qr-pack:pack": "available", "qr-table-sign:a6": "available" } };

export const seedCart = async (page: Page, lines: unknown[]) => {
  await page.addInitScript((l) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("oss_cart_v1", JSON.stringify(l));
      sessionStorage.setItem("seeded", "1");
    }
  }, lines);
};

export const CARD_LINE = { id: "l1", slug: "review-card", variantId: "x1", qty: 1, personalisation: { businessName: "Smith Plumbing", reviewLink: REVIEW_LINK } };
export const SIGN_LINE = { id: "l2", slug: "qr-table-sign", variantId: "a6", qty: 1, personalisation: { purpose: "wifi", businessName: "Smith Plumbing", ssid: "Guest", security: "WPA", password: "hunter22" } };
