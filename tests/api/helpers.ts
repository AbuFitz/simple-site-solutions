/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export function mockRes() {
  const res: any = { statusCode: 200, headers: {} as Record<string, string>, body: undefined as any };
  res.setHeader = (k: string, v: string) => ((res.headers[k] = v), res);
  res.status = (c: number) => ((res.statusCode = c), res);
  res.json = (b: unknown) => ((res.body = b), res);
  return res as VercelResponse & { statusCode: number; headers: Record<string, string>; body: any };
}

export function mockReq(init: Partial<{ method: string; body: unknown; headers: Record<string, string>; query: Record<string, string> }> = {}) {
  return {
    method: init.method ?? "POST",
    body: init.body,
    query: init.query ?? {},
    headers: { origin: "https://onesimplesite.co.uk", host: "onesimplesite.co.uk", "x-forwarded-for": "1.2.3.4", ...(init.headers ?? {}) },
    socket: { remoteAddress: "1.2.3.4" },
  } as unknown as VercelRequest;
}

export const CHECKOUT_ENV = {
  CHECKOUT_ENABLED: "true",
  PRICING_APPROVED: "true",
  STRIPE_SECRET_KEY: "sk_test_123",
  STRIPE_WEBHOOK_SECRET: "whsec_123",
  SITE_URL: "https://onesimplesite.co.uk",
  UPSTASH_REDIS_REST_URL: "https://redis.example",
  UPSTASH_REDIS_REST_TOKEN: "tok",
  STRIPE_PRICE_LAUNCH: "price_launch1",
  PACKAGE_READY_LAUNCH: "true",
  STRIPE_PRICE_GROWTH: "price_growth1",
  PACKAGE_READY_GROWTH: "false",
};

export function setEnv(env: Record<string, string>) {
  for (const k of Object.keys(process.env)) {
    if (/^(CHECKOUT_|PRICING_|STRIPE_|PACKAGE_READY_|SITE_URL|UPSTASH_|RESEND_|ADMIN_EMAIL|ALLOWED_ORIGINS)/.test(k)) delete process.env[k];
  }
  Object.assign(process.env, env);
  vi.resetModules();
}
