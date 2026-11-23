import { checkoutConfig } from './checkout-config.js';
import { configuredProviders, type ProviderEnv } from './chat/providers.js';
import { siteUrl } from './http.js';

export interface SiteReadinessChecks {
  canonicalUrl: boolean;
  emailDelivery: boolean;
  adminRecipient: boolean;
  checkout: boolean;
  assistedChat: boolean;
}

const notPlaceholder = (value: string) => !/(?:placeholder|change[-_ ]?me|replace|example|dummy|fake|todo)/i.test(value);

/** A secret-free view of whether the public site's external services are configured. */
export function siteReadiness(env: NodeJS.ProcessEnv = process.env) {
  const resend = env.RESEND_API_KEY || '';
  const admin = env.ADMIN_EMAIL || 'hello@onesimplesite.co.uk';
  const checks: SiteReadinessChecks = {
    canonicalUrl: siteUrl(env) === 'https://onesimplesite.co.uk',
    emailDelivery: /^re_[A-Za-z0-9_-]{20,}$/.test(resend) && notPlaceholder(resend),
    adminRecipient: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin),
    checkout: checkoutConfig(env).enabled,
    assistedChat: configuredProviders(env as ProviderEnv).length > 0,
  };
  const coreReady = checks.canonicalUrl && checks.emailDelivery && checks.adminRecipient;
  return { ready: coreReady && checks.checkout && checks.assistedChat, coreReady, checks };
}
