// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockReq, mockRes, setEnv } from "./helpers";

const sendMock = vi.fn();
vi.mock("resend", () => ({ Resend: class { emails = { send: sendMock }; } }));

const brief = {
  businessName: "Smith Plumbing",
  name: "Sam Smith",
  email: "sam@example.co.uk",
  phone: "",
  businessDescription: "Plumber in Watford",
  websiteUrl: "",
  details: "",
  selectedPackage: "growth",
  selectedAddons: [],
};

async function submit(body: unknown, opts: { origin?: string; ip?: string } = {}) {
  const h = (await import("../../api/submit-form.ts")).default;
  const res = mockRes();
  await h(mockReq({ body, headers: { origin: opts.origin ?? "https://onesimplesite.co.uk", "x-forwarded-for": opts.ip ?? "9.9.9.9" } }), res);
  return res;
}

describe("POST /api/submit-form", () => {
  beforeEach(async () => {
    sendMock.mockReset();
    setEnv({ RESEND_API_KEY: "re_123", SITE_URL: "https://onesimplesite.co.uk" });
    (await import("../../api/_lib/rateLimit.js"))._resetRateLimit();
  });

  it("sends the owner's copy first, then the customer's", async () => {
    sendMock.mockResolvedValue({ error: null });
    const res = await submit(brief);
    expect(res.statusCode).toBe(200);
    expect(sendMock.mock.calls[0][0].to).toBe("hello@onesimplesite.co.uk");
    expect(sendMock.mock.calls[1][0].to).toBe("sam@example.co.uk");
    expect(JSON.stringify(sendMock.mock.calls)).not.toMatch(/24 hours/);
  });

  it("returns field errors for invalid input and sends nothing", async () => {
    const res = await submit({ ...brief, email: "bad", businessName: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body.fields.email).toBeTruthy();
    expect(res.body.fields.businessName).toBeTruthy();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("fails loudly (never fake success) when sending fails, without leaking details", async () => {
    sendMock.mockResolvedValue({ error: { message: "resend internal key abc" } });
    const res = await submit(brief);
    expect(res.statusCode).toBe(502);
    expect(JSON.stringify(res.body)).not.toContain("resend internal");
  });

  it("still succeeds if only the customer's copy fails", async () => {
    sendMock.mockResolvedValueOnce({ error: null }).mockResolvedValueOnce({ error: { message: "x" } });
    const res = await submit(brief);
    expect(res.statusCode).toBe(200);
    expect(res.body.copySent).toBe(false);
  });

  it("returns 503 when the email service isn't configured", async () => {
    setEnv({ SITE_URL: "https://onesimplesite.co.uk" });
    const res = await submit(brief);
    expect(res.statusCode).toBe(503);
  });

  it("silently drops honeypot submissions", async () => {
    const res = await submit({ ...brief, company_site: "http://spam" });
    expect(res.statusCode).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("blocks foreign origins and rate-limits repeat callers", async () => {
    sendMock.mockResolvedValue({ error: null });
    expect((await submit(brief, { origin: "https://evil.example" })).statusCode).toBe(403);
    for (let i = 0; i < 5; i++) expect((await submit(brief, { ip: "5.5.5.5" })).statusCode).toBe(200);
    const blocked = await submit(brief, { ip: "5.5.5.5" });
    expect(blocked.statusCode).toBe(429);
    expect(blocked.headers["Retry-After"]).toBeTruthy();
  });

  it("strips newlines from the subject line", async () => {
    sendMock.mockResolvedValue({ error: null });
    await submit({ ...brief, businessName: "Evil\r\nBcc: x@y.z" });
    expect(sendMock.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
  });
});

describe("POST /api/contact", () => {
  beforeEach(async () => {
    sendMock.mockReset();
    setEnv({ RESEND_API_KEY: "re_123", SITE_URL: "https://onesimplesite.co.uk" });
    (await import("../../api/_lib/rateLimit.js"))._resetRateLimit();
  });
  it("validates, sends to the owner with reply-to, and escapes HTML", async () => {
    sendMock.mockResolvedValue({ error: null });
    const h = (await import("../../api/contact.ts")).default;
    const res = mockRes();
    await h(mockReq({ body: { name: "Sam", email: "sam@example.co.uk", message: "<script>alert(1)</script> hello there" } }), res);
    expect(res.statusCode).toBe(200);
    expect(sendMock.mock.calls[0][0].replyTo).toBe("sam@example.co.uk");
    expect(sendMock.mock.calls[0][0].html).not.toContain("<script>");
    const bad = mockRes();
    await h(mockReq({ body: { name: "S", email: "x", message: "hi" } }), bad);
    expect(bad.statusCode).toBe(400);
  });
});
