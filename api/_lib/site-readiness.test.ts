import { describe, expect, it } from 'vitest';
import { siteReadiness } from './site-readiness.js';

const full = {
  SITE_URL: 'https://onesimplesite.co.uk',
  RESEND_API_KEY: 're_qwertyuiopasdfghjklzxcvbnm',
  ADMIN_EMAIL: 'hello@onesimplesite.co.uk',
  GEMINI_API_KEY: 'configured',
  CHECKOUT_ENABLED: 'true',
  PRICING_APPROVED: 'true',
  STRIPE_SECRET_KEY: 'sk_test_qwertyuiopasdfghjklzxcvbnm',
  STRIPE_WEBHOOK_SECRET: 'whsec_qwertyuiopasdfghjklzxcvbnm',
  UPSTASH_REDIS_REST_URL: 'https://redis.example',
  UPSTASH_REDIS_REST_TOKEN: 'configured',
  STRIPE_PRICE_LAUNCH: 'price_launch123',
  PACKAGE_READY_LAUNCH: 'true',
} as NodeJS.ProcessEnv;

describe('siteReadiness', () => {
  it('fails closed and exposes booleans only when configuration is absent', () => {
    const result = siteReadiness({} as NodeJS.ProcessEnv);
    expect(result).toEqual({
      ready: false,
      coreReady: false,
      checks: { canonicalUrl: false, emailDelivery: false, adminRecipient: true, checkout: false, assistedChat: false },
    });
  });

  it('requires every external launch service for full readiness', () => {
    expect(siteReadiness(full)).toEqual({
      ready: true,
      coreReady: true,
      checks: { canonicalUrl: true, emailDelivery: true, adminRecipient: true, checkout: true, assistedChat: true },
    });
    expect(siteReadiness({ ...full, RESEND_API_KEY: 're_placeholder_key_for_testing' }).ready).toBe(false);
  });
});
