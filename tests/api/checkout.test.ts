/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CHECKOUT_ENV, mockReq, mockRes, setEnv } from "./helpers";

const createSession = vi.fn();
const retrieveSession = vi.fn();
const constructEvent = vi.fn();
vi.mock("../../api/_lib/stripe.js", () => ({
  getStripe: () => ({
    checkout: { sessions: { create: createSession, retrieve: retrieveSession } },
    webhooks: { constructEvent },
  }),
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);
const sendMock = vi.fn();
vi.mock("resend", () => ({ Resend: class { emails = { send: sendMock }; } }));

async function load<T = any>(file: string): Promise<T> {
  return (await import(file)).default;
}

describe("checkout config fails closed", () => {
  it.each([
    ["CHECKOUT_ENABLED", "false"],
    ["PRICING_APPROVED", ""],
    ["STRIPE_SECRET_KEY", ""],
    ["STRIPE_WEBHOOK_SECRET", ""],
    ["UPSTASH_REDIS_REST_URL", ""],
    ["SITE_URL", ""],
    ["PACKAGE_READY_LAUNCH", "false"],
  ])("is off when %s is %j", async (k, v) => {
    setEnv({ ...CHECKOUT_ENV, [k]: v });
    const { checkoutConfig } = await import("../../api/_lib/checkout-config.js");
    expect(checkoutConfig().enabled).toBe(false);
    expect(checkoutConfig().packages).toEqual([]);
  });

  it("blocks a live key without explicit opt-in", async () => {
    setEnv({ ...CHECKOUT_ENV, STRIPE_SECRET_KEY: "sk_live_123" });
    const { checkoutConfig } = await import("../../api/_lib/checkout-config.js");
    expect(checkoutConfig().enabled).toBe(false);
  });

  it("enables only packages that are ready", async () => {
    setEnv(CHECKOUT_ENV);
    const { checkoutConfig, expectedPence } = await import("../../api/_lib/checkout-config.js");
    expect(checkoutConfig().packages).toEqual(["launch"]);
    expect([expectedPence("launch"), expectedPence("growth")]).toEqual([18900, 24450]);
    expect(() => expectedPence("enterprise")).toThrow();
  });

  it("is off with no environment at all", async () => {
    setEnv({});
    const { checkoutConfig } = await import("../../api/_lib/checkout-config.js");
    expect(checkoutConfig().enabled).toBe(false);
  });
});

describe("POST /api/create-checkout-session", () => {
  beforeEach(() => {
    createSession.mockReset();
    setEnv(CHECKOUT_ENV);
  });

  it("returns 503 and never calls Stripe when disabled", async () => {
    setEnv({});
    const h = await load("../../api/create-checkout-session.ts");
    const res = mockRes();
    await h(mockReq({ body: { package: "launch" } }), res);
    expect(res.statusCode).toBe(503);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("rejects foreign origins and wrong methods", async () => {
    const h = await load("../../api/create-checkout-session.ts");
    let res = mockRes();
    await h(mockReq({ body: { package: "launch" }, headers: { origin: "https://evil.example" } }), res);
    expect(res.statusCode).toBe(403);
    res = mockRes();
    await h(mockReq({ method: "GET" }), res);
    expect(res.statusCode).toBe(405);
  });

  it("rejects unknown and not-ready packages", async () => {
    const h = await load("../../api/create-checkout-session.ts");
    for (const pkg of ["free", "growth", "enterprise", "../x"]) {
      const res = mockRes();
      await h(mockReq({ body: { package: pkg } }), res);
      expect(res.statusCode).toBe(400);
    }
    expect(createSession).not.toHaveBeenCalled();
  });

  it("uses the server price id and fixed redirect URLs, ignoring client prices", async () => {
    createSession.mockResolvedValue({ url: "https://checkout.stripe.com/c/pay/cs_test_abc" });
    const h = await load("../../api/create-checkout-session.ts");
    const res = mockRes();
    await h(mockReq({ body: { package: "launch", price: 1, amount: 1, success_url: "https://evil.example" } }), res);
    expect(res.statusCode).toBe(200);
    const arg = createSession.mock.calls[0][0];
    expect(arg.line_items).toEqual([{ price: "price_launch1", quantity: 1 }]);
    expect(arg.success_url.startsWith("https://onesimplesite.co.uk/checkout/success?session_id=")).toBe(true);
    expect(arg.cancel_url).toBe("https://onesimplesite.co.uk/checkout/cancel");
    expect(arg.mode).toBe("payment");
    expect(JSON.stringify(arg)).not.toContain("evil.example");
  });

  it("does not leak Stripe errors", async () => {
    createSession.mockRejectedValue(new Error("secret internal detail"));
    const h = await load("../../api/create-checkout-session.ts");
    const res = mockRes();
    await h(mockReq({ body: { package: "launch" } }), res);
    expect(res.statusCode).toBe(502);
    expect(JSON.stringify(res.body)).not.toContain("secret");
  });
});

describe("GET /api/checkout-session", () => {
  const paid = { id: "cs_test_abcdefghij", mode: "payment", status: "complete", payment_status: "paid", currency: "gbp", amount_total: 18900, metadata: { package: "launch" } };
  beforeEach(() => {
    retrieveSession.mockReset();
    setEnv(CHECKOUT_ENV);
  });

  it("verifies a paid session server-side", async () => {
    retrieveSession.mockResolvedValue(paid);
    const h = await load("../../api/checkout-session.ts");
    const res = mockRes();
    await h(mockReq({ method: "GET", query: { session_id: paid.id } }), res);
    expect(res.body).toEqual({ status: "paid", package: "launch", amountTotal: 18900 });
  });

  it("does not report paid when the amount differs from the catalogue", async () => {
    retrieveSession.mockResolvedValue({ ...paid, amount_total: 100 });
    const h = await load("../../api/checkout-session.ts");
    const res = mockRes();
    await h(mockReq({ method: "GET", query: { session_id: paid.id } }), res);
    expect(res.body.status).toBe("invalid");
  });

  it("reports unpaid and rejects malformed ids", async () => {
    retrieveSession.mockResolvedValue({ ...paid, payment_status: "unpaid" });
    const h = await load("../../api/checkout-session.ts");
    let res = mockRes();
    await h(mockReq({ method: "GET", query: { session_id: paid.id } }), res);
    expect(res.body.status).toBe("unpaid");
    res = mockRes();
    await h(mockReq({ method: "GET", query: { session_id: "nope" } }), res);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/stripe-webhook", () => {
  const session = { id: "cs_test_abcdefghij", mode: "payment", status: "complete", payment_status: "paid", currency: "gbp", amount_total: 18900, metadata: { package: "launch" }, customer_details: { email: "c@example.com" } };
  const rawReq = (headers: Record<string, string> = { "stripe-signature": "t=1,v1=x" }) => {
    const r: any = mockReq({ headers });
    r.on = (ev: string, cb: any) => {
      if (ev === "data") setTimeout(() => cb(Buffer.from("{}")), 0);
      if (ev === "end") setTimeout(cb, 1);
      return r;
    };
    return r;
  };
  beforeEach(() => {
    constructEvent.mockReset();
    fetchMock.mockReset();
    sendMock.mockReset();
    setEnv({ ...CHECKOUT_ENV, RESEND_API_KEY: "re_123" });
  });

  it("rejects a missing or invalid signature", async () => {
    const h = await load("../../api/stripe-webhook.ts");
    let res = mockRes();
    await h(rawReq({}), res);
    expect(res.statusCode).toBe(400);
    constructEvent.mockImplementation(() => {
      throw new Error("bad sig");
    });
    res = mockRes();
    await h(rawReq(), res);
    expect(res.statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fulfils once and treats a replay as a duplicate", async () => {
    constructEvent.mockReturnValue({ type: "checkout.session.completed", data: { object: session } });
    sendMock.mockResolvedValue({ error: null });
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ result: "OK" }) });
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ result: null }) });
    const h = await load("../../api/stripe-webhook.ts");
    let res = mockRes();
    await h(rawReq(), res);
    expect(res.body).toEqual({ received: true, result: "fulfilled" });
    res = mockRes();
    await h(rawReq(), res);
    expect(res.body).toEqual({ received: true, result: "duplicate" });
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("releases the claim and returns 500 when fulfilment fails so Stripe retries", async () => {
    constructEvent.mockReturnValue({ type: "checkout.session.completed", data: { object: session } });
    sendMock.mockResolvedValue({ error: { message: "x" } });
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ result: "OK" }) });
    const h = await load("../../api/stripe-webhook.ts");
    const res = mockRes();
    await h(rawReq(), res);
    expect(res.statusCode).toBe(500);
    expect(fetchMock.mock.calls.map((c) => JSON.parse(c[1].body)[0])).toEqual(["SET", "DEL"]);
  });

  it("does not fulfil unpaid sessions or unrelated events", async () => {
    const h = await load("../../api/stripe-webhook.ts");
    constructEvent.mockReturnValue({ type: "checkout.session.completed", data: { object: { ...session, payment_status: "unpaid" } } });
    let res = mockRes();
    await h(rawReq(), res);
    expect(res.body.fulfilled).toBe(false);
    constructEvent.mockReturnValue({ type: "customer.created", data: { object: {} } });
    res = mockRes();
    await h(rawReq(), res);
    expect(res.body.ignored).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("GET /api/checkout-status", () => {
  it("is false by default and true only when fully configured", async () => {
    setEnv({});
    let h = await load("../../api/checkout-status.ts");
    let res = mockRes();
    h(mockReq({ method: "GET" }), res);
    expect(res.body).toEqual({ enabled: false, packages: [] });
    setEnv(CHECKOUT_ENV);
    h = await load("../../api/checkout-status.ts");
    res = mockRes();
    h(mockReq({ method: "GET" }), res);
    expect(res.body).toEqual({ enabled: true, packages: ["launch"] });
  });
});
