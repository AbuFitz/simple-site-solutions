/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockReq, mockRes, setEnv } from "./helpers";
import { products, skuKey } from "../../src/data/shop";

const createSession = vi.fn();
const retrieveSession = vi.fn();
const retrievePrice = vi.fn();
const constructEvent = vi.fn();
vi.mock("../../api/_lib/stripe.js", () => ({
  getStripe: () => ({
    checkout: { sessions: { create: createSession, retrieve: retrieveSession } },
    prices: { retrieve: retrievePrice },
    webhooks: { constructEvent },
  }),
}));
const sendMock = vi.fn();
vi.mock("resend", () => ({ Resend: class { emails = { send: sendMock }; } }));

// In-memory Upstash REST stand-in
const store = new Map<string, string>();
const fetchMock = vi.fn(async (_url: string, init: any) => {
  const cmd = JSON.parse(init.body) as (string | number)[];
  const [op, key, val, ...rest] = cmd as string[];
  let result: unknown = null;
  if (op === "SET") {
    if (rest.includes("NX") && store.has(key)) result = null;
    else {
      store.set(key, val);
      result = "OK";
    }
  } else if (op === "GET") result = store.get(key) ?? null;
  else if (op === "DEL") result = store.delete(key) ? 1 : 0;
  return { ok: true, json: async () => ({ result }) } as any;
});
vi.stubGlobal("fetch", fetchMock);

const PRICE_ENV = Object.fromEntries(
  products.flatMap((p) =>
    p.variants.flatMap((v) => {
      const k = skuKey(p.slug, v.id);
      return [
        [`SHOP_PRICE_${k}`, `price_${k.replace(/_/g, "").toLowerCase()}`],
        [`SHOP_READY_${k}`, "true"],
      ];
    })
  )
);

const OPEN_ENV: Record<string, string> = {
  SHOP_ENABLED: "true",
  PRICING_APPROVED: "true",
  SHOP_FULFILMENT_CONFIRMED: "true",
  STRIPE_SECRET_KEY: "sk_test_123",
  STRIPE_WEBHOOK_SECRET: "whsec_123",
  SITE_URL: "https://onesimplesite.co.uk",
  UPSTASH_REDIS_REST_URL: "https://redis.example",
  UPSTASH_REDIS_REST_TOKEN: "tok",
  RESEND_API_KEY: "re_123",
  ...PRICE_ENV,
};

const load = async (f: string) => (await import(f)).default;
const REVIEW = { slug: "review-card", variantId: "x5", qty: 2, personalisation: { businessName: "Smith Plumbing", reviewLink: "https://g.page/r/Cabc123/review" } };
const body = (items: any[], extra: any = {}) => ({ email: "sam@example.co.uk", acceptTerms: true, items, ...extra });

async function checkout(b: unknown, headers: Record<string, string> = {}) {
  const h = await load("../../api/shop-checkout.ts");
  const res = mockRes();
  await h(mockReq({ body: b, headers }), res);
  return res;
}

beforeEach(async () => {
  store.clear();
  createSession.mockReset();
  retrieveSession.mockReset();
  retrievePrice.mockReset();
  constructEvent.mockReset();
  sendMock.mockReset();
  sendMock.mockResolvedValue({ error: null });
  setEnv(OPEN_ENV);
  (await import("../../api/_lib/rateLimit.js"))._resetRateLimit();
  retrievePrice.mockImplementation(async (id: string) => {
    const hit = products.flatMap((p) => p.variants.map((v) => ({ p, v }))).find(({ p, v }) => `price_${skuKey(p.slug, v.id).replace(/_/g, "").toLowerCase()}` === id)!;
    return { active: true, currency: "gbp", unit_amount: hit.v.pricePence, type: "one_time", recurring: null };
  });
  createSession.mockResolvedValue({ id: "cs_test_abcdefghij1", url: "https://checkout.stripe.com/c/pay/cs_test_abcdefghij1" });
});

describe("shop readiness fails closed", () => {
  it.each([
    ["SHOP_ENABLED", "false"],
    ["PRICING_APPROVED", ""],
    ["STRIPE_SECRET_KEY", ""],
    ["STRIPE_WEBHOOK_SECRET", ""],
    ["SITE_URL", ""],
    ["UPSTASH_REDIS_REST_URL", ""],
    ["RESEND_API_KEY", ""],
  ])("closed when %s is %j", async (k, v) => {
    setEnv({ ...OPEN_ENV, [k]: v });
    const { shopConfig } = await import("../../api/_lib/shop-config.js");
    const cfg = shopConfig();
    expect(cfg.open).toBe(false);
    expect(Object.values(cfg.skus).some((s) => s.available)).toBe(false);
  });

  it("live key needs explicit opt-in", async () => {
    setEnv({ ...OPEN_ENV, STRIPE_SECRET_KEY: "sk_live_123" });
    const { shopConfig } = await import("../../api/_lib/shop-config.js");
    expect(shopConfig().open).toBe(false);
  });

  it("physical products also need fulfilment confirmed; digital does not", async () => {
    setEnv({ ...OPEN_ENV, SHOP_FULFILMENT_CONFIRMED: "" });
    const { shopConfig } = await import("../../api/_lib/shop-config.js");
    const cfg = shopConfig();
    expect(cfg.skus["review-card:x1"].available).toBe(false);
    expect(cfg.skus["digital-qr-pack:pack"].available).toBe(true);
  });

  it("each sku needs a real price id and its readiness flag; stock 0 is sold out", async () => {
    setEnv({ ...OPEN_ENV, SHOP_PRICE_REVIEW_CARD_X1: "not-a-price", SHOP_READY_REVIEW_CARD_X5: "false", SHOP_STOCK_REVIEW_CARD_X10: "0", SHOP_STOCK_REVIEW_STAND_X1: "3" });
    const { shopConfig, publicStatus } = await import("../../api/_lib/shop-config.js");
    const s = publicStatus(shopConfig());
    expect(s.skus["review-card:x1"]).toBe("unavailable");
    expect(s.skus["review-card:x5"]).toBe("unavailable");
    expect(s.skus["review-card:x10"]).toBe("sold-out");
    expect(s.skus["review-stand:x1"]).toBe("available");
  });

  it("with an empty environment nothing is available", async () => {
    setEnv({});
    const { shopConfig } = await import("../../api/_lib/shop-config.js");
    expect(Object.values(shopConfig().skus).every((x) => !x.available)).toBe(true);
  });
});

describe("GET /api/shop-status", () => {
  it("exposes availability only: no price ids, stock counts or reasons", async () => {
    setEnv({ ...OPEN_ENV, SHOP_STOCK_REVIEW_CARD_X1: "7" });
    const h = await load("../../api/shop-status.ts");
    const res = mockRes();
    h(mockReq({ method: "GET" }), res);
    const text = JSON.stringify(res.body);
    expect(res.body.open).toBe(true);
    expect(text).not.toMatch(/price_|sk_test|whsec|"stock"|reasons/);
    expect(text).not.toContain("7");
  });
  it("is closed by default", async () => {
    setEnv({});
    const h = await load("../../api/shop-status.ts");
    const res = mockRes();
    h(mockReq({ method: "GET" }), res);
    expect(res.body.open).toBe(false);
    expect(Object.values(res.body.skus).every((v) => v === "unavailable")).toBe(true);
  });
});

describe("POST /api/shop-checkout", () => {
  it("503 and no Stripe call when the shop is closed", async () => {
    setEnv({});
    const res = await checkout(body([REVIEW]));
    expect(res.statusCode).toBe(503);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("blocks foreign origins and requires terms and email", async () => {
    expect((await checkout(body([REVIEW]), { origin: "https://evil.example" })).statusCode).toBe(403);
    expect((await checkout(body([REVIEW], { acceptTerms: false }))).statusCode).toBe(400);
    expect((await checkout(body([REVIEW], { email: "nope" }))).statusCode).toBe(400);
    expect((await checkout({ ...body([REVIEW]), items: [] })).statusCode).toBe(400);
  });

  it("creates a hosted session priced only from the server catalogue", async () => {
    const res = await checkout(
      body([{ ...REVIEW, price: 1, unitPence: 1, amount: 1, priceId: "price_evil" }], { total: 1, success_url: "https://evil.example" })
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.url).toMatch(/^https:\/\/checkout\.stripe\.com\//);
    const [arg, opts] = createSession.mock.calls[0];
    expect(arg.line_items).toEqual([{ price: PRICE_ENV.SHOP_PRICE_REVIEW_CARD_X5, quantity: 2 }]);
    expect(arg.mode).toBe("payment");
    expect(arg.success_url).toBe("https://onesimplesite.co.uk/shop/order/success?session_id={CHECKOUT_SESSION_ID}");
    expect(arg.cancel_url).toBe("https://onesimplesite.co.uk/shop/order/cancel");
    expect(arg.shipping_address_collection).toEqual({ allowed_countries: ["GB"] });
    // 2 x £59.00 is above the free-delivery threshold
    expect(arg.shipping_options[0].shipping_rate_data.fixed_amount).toEqual({ amount: 0, currency: "gbp" });
    expect(arg.metadata.kind).toBe("shop");
    expect(arg.metadata.order_ref).toMatch(/^OSS-/);
    expect(JSON.stringify(arg)).not.toMatch(/evil|Smith|g\.page/);
    expect(opts.idempotencyKey).toBe(`shop-${arg.metadata.order_ref}`);
    const saved = JSON.parse(store.get(`oss:order:${arg.metadata.order_ref}`)!);
    expect(saved.status).toBe("pending");
    expect(saved.totalPence).toBe(2 * 5900);
    expect(saved.lines[0].unitPence).toBe(5900);
    expect(saved.lines[0].personalisation.businessName).toBe("Smith Plumbing");
  });

  it("charges the flat delivery fee below the threshold and none for digital-only orders", async () => {
    await checkout(body([{ slug: "review-card", variantId: "x1", qty: 1, personalisation: REVIEW.personalisation }]));
    expect(createSession.mock.calls[0][0].shipping_options[0].shipping_rate_data.fixed_amount.amount).toBe(395);
    createSession.mockClear();
    const res = await checkout(body([{ slug: "digital-qr-pack", variantId: "pack", qty: 1, personalisation: { url1: "https://example.co.uk" } }]));
    expect(res.statusCode).toBe(200);
    const arg = createSession.mock.calls[0][0];
    expect(arg.shipping_address_collection).toBeUndefined();
    expect(arg.shipping_options).toBeUndefined();
  });

  it("rejects invalid personalisation with per-field errors", async () => {
    const res = await checkout(body([{ ...REVIEW, personalisation: { businessName: "", reviewLink: "https://example.com" } }]));
    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe("personalisation");
    expect(Object.keys(res.body.fieldErrors["0"]).sort()).toEqual(["businessName", "reviewLink"]);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("rejects unknown products, variants and excessive quantity", async () => {
    for (const bad of [{ ...REVIEW, slug: "gold-bar" }, { ...REVIEW, variantId: "x999" }, { ...REVIEW, qty: 11 }]) {
      expect((await checkout(body([bad]))).statusCode).toBe(400);
    }
    expect(createSession).not.toHaveBeenCalled();
  });

  it("409 for unavailable, sold-out and over-stock items", async () => {
    setEnv({ ...OPEN_ENV, SHOP_READY_REVIEW_CARD_X5: "false" });
    let res = await checkout(body([REVIEW]));
    expect(res.statusCode).toBe(409);
    expect(res.body.skus).toEqual(["review-card:x5"]);
    setEnv({ ...OPEN_ENV, SHOP_STOCK_REVIEW_CARD_X5: "1" });
    res = await checkout(body([REVIEW]));
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe("insufficient-stock");
    expect(createSession).not.toHaveBeenCalled();
  });

  it("fails closed when the Stripe Price doesn't match the catalogue (wrong amount, currency or inactive)", async () => {
    for (const bad of [{ unit_amount: 100 }, { currency: "usd" }, { active: false }, { recurring: { interval: "month" } }]) {
      retrievePrice.mockResolvedValue({ active: true, currency: "gbp", unit_amount: 5900, type: "one_time", recurring: null, ...bad });
      (await import("../../api/shop-checkout.js"))._clearPriceCache?.();
      const res = await checkout(body([REVIEW]));
      expect(res.statusCode).toBe(503);
    }
    expect(createSession).not.toHaveBeenCalled();
  });

  it("returns a generic error and leaks nothing when Stripe fails", async () => {
    createSession.mockRejectedValue(new Error("secret stripe internals"));
    const res = await checkout(body([REVIEW]));
    expect(res.statusCode).toBe(502);
    expect(JSON.stringify(res.body)).not.toContain("secret");
  });

  it("rate limits", async () => {
    for (let i = 0; i < 8; i++) await checkout(body([REVIEW]));
    expect((await checkout(body([REVIEW]))).statusCode).toBe(429);
  });
});

describe("GET /api/shop-order", () => {
  const order = { ref: "OSS-ABCDEFGH", status: "pending", createdAt: "2026-10-14T00:00:00Z", email: "Sam@Example.co.uk", hasPhysical: true, subtotalPence: 5900, shippingPence: 0, totalPence: 5900, lines: [{ lineId: "1", slug: "review-card", variantId: "x5", qty: 1, unitPence: 5900, personalisation: { businessName: "Secret Name", reviewLink: "https://g.page/r/Cabc/review" } }] };
  const session = (over: any = {}) => ({ id: "cs_test_abcdefghij1", mode: "payment", status: "complete", payment_status: "paid", currency: "gbp", amount_total: 5900, metadata: { kind: "shop", order_ref: "OSS-ABCDEFGH" }, ...over });
  const get = async (query: any) => {
    const h = await load("../../api/shop-order.ts");
    const res = mockRes();
    await h(mockReq({ method: "GET", query }), res);
    return res;
  };
  beforeEach(() => store.set("oss:order:OSS-ABCDEFGH", JSON.stringify(order)));

  it("verifies a paid session against the stored total and hides personalisation", async () => {
    retrieveSession.mockResolvedValue(session());
    const res = await get({ session_id: "cs_test_abcdefghij1" });
    expect(res.body.verdict).toBe("paid");
    expect(res.body.order.lines).toEqual([{ name: "NFC + QR Review Card", variant: "Pack of 5", qty: 1 }]);
    expect(JSON.stringify(res.body)).not.toMatch(/Secret|g\.page|email/i);
  });

  it("does not report paid for a wrong amount, currency, ref or unpaid session", async () => {
    for (const [over, verdict] of [[{ amount_total: 100 }, "invalid"], [{ currency: "usd" }, "invalid"], [{ metadata: { kind: "shop", order_ref: "OSS-ZZZZZZZZ" } }, "invalid"], [{ payment_status: "unpaid" }, "unpaid"], [{ status: "expired", payment_status: "unpaid" }, "expired"]] as const) {
      retrieveSession.mockResolvedValue(session(over));
      expect((await get({ session_id: "cs_test_abcdefghij1" })).body.verdict).toBe(verdict);
    }
  });

  it("status lookup needs the reference and the matching email, and answers identically otherwise", async () => {
    const ok = await get({ ref: "oss-abcdefgh", email: " sam@example.co.uk " });
    expect(ok.statusCode).toBe(200);
    expect(ok.body.order.status).toBe("pending");
    const wrongEmail = await get({ ref: "OSS-ABCDEFGH", email: "other@example.co.uk" });
    const unknown = await get({ ref: "OSS-ZZZZZZZZ", email: "sam@example.co.uk" });
    expect(wrongEmail.statusCode).toBe(404);
    expect(unknown.statusCode).toBe(404);
    expect(wrongEmail.body).toEqual(unknown.body);
    expect((await get({ ref: "nope", email: "x@y.co" })).statusCode).toBe(404);
  });

  it("rejects malformed session ids", async () => {
    expect((await get({ session_id: "bad" })).statusCode).toBe(400);
  });
});

describe("shop webhook", () => {
  const baseOrder = (lines: any[], over: any = {}) => ({
    ref: "OSS-ABCDEFGH",
    status: "pending",
    createdAt: "2026-10-14T00:00:00Z",
    email: "sam@example.co.uk",
    lines,
    subtotalPence: 999,
    shippingPence: 0,
    totalPence: 999,
    hasPhysical: false,
    ...over,
  });
  const digitalLine = { lineId: "1", slug: "digital-qr-pack", variantId: "pack", qty: 1, unitPence: 999, personalisation: { url1: "https://example.co.uk", url2: "https://g.page/r/Cabc/review" } };
  const wifiLine = { lineId: "2", slug: "qr-table-sign", variantId: "a6", qty: 1, unitPence: 1599, personalisation: { purpose: "wifi", businessName: "Cafe", ssid: "Guest", security: "WPA", password: "hunter22" } };
  const paidSession = (over: any = {}) => ({
    id: "cs_test_abcdefghij1",
    mode: "payment",
    status: "complete",
    payment_status: "paid",
    currency: "gbp",
    amount_total: 999,
    metadata: { kind: "shop", order_ref: "OSS-ABCDEFGH" },
    customer_details: { email: "sam@example.co.uk" },
    ...over,
  });
  const rawReq = () => {
    const r: any = mockReq({ headers: { "stripe-signature": "t=1,v1=x" } });
    r.on = (ev: string, cb: any) => {
      if (ev === "data") setTimeout(() => cb(Buffer.from("{}")), 0);
      if (ev === "end") setTimeout(cb, 1);
      return r;
    };
    return r;
  };
  const deliver = async (event: any) => {
    constructEvent.mockReturnValue(event);
    const h = await load("../../api/stripe-webhook.ts");
    const res = mockRes();
    await h(rawReq(), res);
    return res;
  };
  const ev = (s: any) => ({ type: "checkout.session.completed", data: { object: s } });

  it("processes a paid order even when the shop switch is off (customer already paid)", async () => {
    setEnv({ ...OPEN_ENV, SHOP_ENABLED: "false" });
    store.set("oss:order:OSS-ABCDEFGH", JSON.stringify(baseOrder([digitalLine])));
    const res = await deliver(ev(paidSession()));
    expect(res.body.result).toBe("fulfilled");
  });

  it("rejects an invalid signature before doing anything", async () => {
    constructEvent.mockImplementation(() => {
      throw new Error("bad");
    });
    const h = await load("../../api/stripe-webhook.ts");
    const res = mockRes();
    await h(rawReq(), res);
    expect(res.statusCode).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("digital pack: owner sheet with QR SVGs, customer gets SVG + PNG, then marks paid; replay is a no-op", async () => {
    store.set("oss:order:OSS-ABCDEFGH", JSON.stringify(baseOrder([digitalLine])));
    const first = await deliver(ev(paidSession()));
    expect(first.body.result).toBe("fulfilled");
    const owner = sendMock.mock.calls[0][0];
    const customer = sendMock.mock.calls[1][0];
    expect(owner.to).toBe("hello@onesimplesite.co.uk");
    expect(owner.subject).toContain("OSS-ABCDEFGH");
    expect(owner.attachments.map((a: any) => a.filename).every((n: string) => n.endsWith(".svg"))).toBe(true);
    expect(owner.attachments[0].content.toString()).toContain("<svg");
    expect(customer.to).toBe("sam@example.co.uk");
    const names = customer.attachments.map((a: any) => a.filename);
    expect(names.filter((n: string) => n.endsWith(".svg")).length).toBe(2);
    expect(names.filter((n: string) => n.endsWith(".png")).length).toBe(2);
    expect(customer.attachments.find((a: any) => a.filename.endsWith(".png")).content.subarray(1, 4).toString()).toBe("PNG");
    expect(JSON.parse(store.get("oss:order:OSS-ABCDEFGH")!).status).toBe("paid");
    sendMock.mockClear();
    const replay = await deliver(ev(paidSession()));
    expect(replay.body.result).toBe("duplicate");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("physical order: owner sheet has address and escaped personalisation; wifi password is scrubbed afterwards and never sent to the customer", async () => {
    store.set("oss:order:OSS-ABCDEFGH", JSON.stringify(baseOrder([{ ...wifiLine, personalisation: { ...wifiLine.personalisation, ssid: "<b>Guest</b>" } }], { subtotalPence: 1599, shippingPence: 395, totalPence: 1994, hasPhysical: true })));
    const res = await deliver(
      ev(paidSession({ amount_total: 1994, collected_information: { shipping_details: { name: "Sam Smith", address: { line1: "1 High St", city: "Watford", postal_code: "WD1 1AA", country: "GB" } } } }))
    );
    expect(res.body.result).toBe("fulfilled");
    const owner = sendMock.mock.calls[0][0];
    expect(owner.html).toContain("1 High St");
    expect(owner.html).toContain("hunter22");
    expect(owner.html).not.toContain("<b>Guest</b>");
    expect(owner.html).toContain("&lt;b&gt;Guest&lt;/b&gt;");
    const customer = sendMock.mock.calls[1][0];
    expect(customer.html).not.toContain("hunter22");
    expect(customer.html).toContain("confirm the dispatch date");
    const saved = JSON.parse(store.get("oss:order:OSS-ABCDEFGH")!);
    expect(saved.lines[0].personalisation.password).toBe("[removed after fulfilment]");
    expect(saved.shipping.name).toBe("Sam Smith");
  });

  it("amount mismatch or missing order never fulfils: owner is alerted, customer is not emailed", async () => {
    store.set("oss:order:OSS-ABCDEFGH", JSON.stringify(baseOrder([digitalLine])));
    let res = await deliver(ev(paidSession({ amount_total: 1 })));
    expect(res.body.result).toBe("needs-manual");
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock.mock.calls[0][0].subject).toContain("ACTION NEEDED");
    store.clear();
    sendMock.mockClear();
    res = await deliver(ev(paidSession({ id: "cs_test_other0000001" })));
    expect(res.body.result).toBe("needs-manual");
    expect(sendMock.mock.calls.every((c) => c[0].to === "hello@onesimplesite.co.uk")).toBe(true);
  });

  it("releases the claim and returns 500 when the owner hand-off fails, so the retry can succeed", async () => {
    store.set("oss:order:OSS-ABCDEFGH", JSON.stringify(baseOrder([digitalLine])));
    sendMock.mockResolvedValueOnce({ error: { message: "x" } });
    const res = await deliver(ev(paidSession()));
    expect(res.statusCode).toBe(500);
    expect(store.has("oss:fulfilled:cs_test_abcdefghij1")).toBe(false);
    const retry = await deliver(ev(paidSession()));
    expect(retry.body.result).toBe("fulfilled");
  });

  it("a customer-email failure doesn't undo fulfilment", async () => {
    store.set("oss:order:OSS-ABCDEFGH", JSON.stringify(baseOrder([digitalLine])));
    sendMock.mockResolvedValueOnce({ error: null }).mockRejectedValueOnce(new Error("smtp"));
    const res = await deliver(ev(paidSession()));
    expect(res.body.result).toBe("fulfilled");
    expect(JSON.parse(store.get("oss:order:OSS-ABCDEFGH")!).status).toBe("paid");
  });

  it("ignores unpaid shop sessions", async () => {
    store.set("oss:order:OSS-ABCDEFGH", JSON.stringify(baseOrder([digitalLine])));
    const res = await deliver(ev(paidSession({ payment_status: "unpaid" })));
    expect(res.body.fulfilled).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/shop-notify", () => {
  const notify = async (b: any) => {
    const h = await load("../../api/shop-notify.ts");
    const res = mockRes();
    await h(mockReq({ body: b }), res);
    return res;
  };
  it("needs consent and a valid email; sends to the owner; drops honeypot", async () => {
    expect((await notify({ email: "a@b.co", consent: false })).statusCode).toBe(400);
    expect((await notify({ email: "bad", consent: true })).statusCode).toBe(400);
    const ok = await notify({ email: "a@b.co", consent: true, slugs: ["review-card", "nope"] });
    expect(ok.statusCode).toBe(200);
    expect(sendMock.mock.calls[0][0].html).toContain("NFC + QR Review Card");
    sendMock.mockClear();
    expect((await notify({ email: "a@b.co", consent: true, company_site: "x" })).statusCode).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
