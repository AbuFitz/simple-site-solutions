# Deploying OneSimpleSite as a separate Vercel project

Do not reuse or modify the existing simple-site-solutions Vercel project. Create a new one.

## 1. Create the project

1. Vercel dashboard > Add New > Project > import `AbuFitz/simple-site-solutions`, **production branch `Main`**.
2. Framework preset: Vite (also set in `vercel.json`). Build command `npm run build`, output `dist`. Node 20 or newer.
3. `npm run build` runs `vite build` then `scripts/prerender.mjs`, which writes a per-route HTML head and `dist/sitemap.xml`. Do not change the build command.
4. Add the environment variables below, then deploy.
5. Add the domain only when the owner approves going live. The canonical URLs, sitemap and Open Graph tags assume `https://onesimplesite.co.uk`.

> Commit-author note: commits made by the automation use the author `Claude <noreply@anthropic.com>`. Vercel's Hobby plan can show "Git information retrieval failed" for such authors. If a deploy is blocked, either deploy from the CLI (`vercel --prod`), or push a commit authored by a team member.

## 2. Environment variables

See `.env.example` (all values empty in git).

| Variable | Needed for | Behaviour when missing |
|---|---|---|
| `RESEND_API_KEY` | Brief, contact and onboarding forms | Forms return 503 and the page shows an honest "couldn't send, email us" message. Nothing is reported as sent. |
| `ADMIN_EMAIL` | Recipient | Defaults to `hello@onesimplesite.co.uk` |
| `SITE_URL` | Redirect target and origin check | Same-host posts are still accepted; checkout is disabled |
| `ALLOWED_ORIGINS` | Extra allowed origins | Optional |
| Stripe variables | Online payment | **Checkout is off.** `/api/checkout-status` reports `enabled:false`, the pay button never renders, and the other Stripe endpoints return 503 |

Resend: verify the `onesimplesite.co.uk` sending domain so `noreply@onesimplesite.co.uk` can send.

## 3. Platform protection (recommended)

The in-code rate limiter is per serverless instance and best-effort. In Vercel > Firewall add a rate-limit rule for `/api/*` (for example 10 requests per minute per IP) and enable Attack Challenge Mode if abused.

## 4. Stripe, test mode first

Stripe stays off until all of these are true. Nothing here has been done for you.

1. Owner approves prices, VAT treatment and terms, including the cancellation/refund wording (`docs/fact-ledger.md`).
2. In a Stripe **sandbox**, create one Price per package for the amount to be charged now (see `.env.example`).
3. Create a webhook endpoint `https://<deployment>/api/stripe-webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`; copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
4. Create an Upstash Redis database; set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
5. Set `SITE_URL`, `STRIPE_SECRET_KEY` (`sk_test_...`), `STRIPE_PRICE_*`, `PACKAGE_READY_*`, `PRICING_APPROVED=true`, `CHECKOUT_ENABLED=true`. Redeploy.
6. Test with Stripe's test cards (for example 4242 4242 4242 4242). Check: the pay button appears after submitting a brief, Checkout shows the right amount, `/checkout/success` reports paid, the owner email arrives once, and replaying the event from the Stripe dashboard does not send a second email.
7. Only then switch to live keys, with `STRIPE_ALLOW_LIVE=true`.

How it fails closed: checkout is enabled only if `CHECKOUT_ENABLED`, `PRICING_APPROVED`, a valid key, a webhook secret, `SITE_URL`, the fulfilment store and at least one package with both a Price ID and `PACKAGE_READY_*=true` are present; a live key also needs `STRIPE_ALLOW_LIVE`. A session counts as paid only if Stripe reports it paid, in GBP, for exactly the catalogue amount.

## 5. Before launch

- Resolve the BLOCKED items in `docs/fact-ledger.md`.
- Replace the draft legal pages after review and add the company details.
- Run `npm run build && npx playwright test` (set `PW_CHROMIUM` if needed) and `npm test`.
