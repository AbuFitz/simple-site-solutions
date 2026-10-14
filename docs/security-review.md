# Security review: form and payment APIs

Reviewed 2026-10-14 against `api/*.ts` and `api/_lib/*`. Tests: `tests/api/*`.

| Area | Finding | Status |
|---|---|---|
| Input validation | `/api/submit-form` validates with the same zod schema as the browser (`src/lib/brief-schema.ts`): types, lengths, allowed package/add-on ids. `/api/contact` and `/api/onboard-form` validate type, size and email. | Fixed |
| Email header/HTML injection | Subjects are stripped of CR/LF; every user value in HTML is escaped; tested. | Fixed |
| Information leakage | Provider error messages were returned to the browser (`details`). Now logged server-side only; generic messages returned. | Fixed |
| False success | The old flow emailed the customer before the owner and could report success inconsistently. The owner's copy now goes first and must succeed; failure is shown to the user. | Fixed |
| Abuse | Honeypot, per-IP sliding-window limit (best-effort per instance), body-size caps. Hard limits need a Vercel Firewall rule (documented). | Mitigated |
| CSRF / cross-site posts | POST endpoints require an `Origin` that matches the site, same host, or an allow-listed origin. No cookies or sessions are used, so there is no ambient authority to abuse. | Fixed |
| Price tampering | Browser sends only a package id. Price, amount and URLs come from server config; Checkout uses a server-held Price ID; paid verification compares `amount_total` and currency with the catalogue. | Fixed |
| Open redirect | `success_url` / `cancel_url` are built from `SITE_URL`, never from request data. The client only follows `https://checkout.stripe.com`. | Fixed |
| Webhook authenticity | Raw body, `stripe-signature` verified by the Stripe library (5-minute tolerance). Unsigned or invalid requests get 400 before any work. | Fixed |
| Replay / duplicates | Atomic `SET NX` claim per session id; claim released on failure so Stripe retries; duplicates return 200 without side effects. | Fixed |
| Secrets | No keys in the client bundle or git; `.env.example` is empty; live keys need an explicit opt-in flag. | OK |
| Fail-closed | Missing key, secret, Price ID, store, approval or readiness flag disables checkout. | Tested |
| Dependencies | `npm audit --omit=dev`: remaining findings are build-time toolchain (Tailwind's chokidar/fast-glob, `@vercel/node` type package, now a devDependency) and `react-router` 6 advisories that concern SSR hydration and backslash `<Link>` targets; this SPA has no SSR and only links to fixed internal paths. Upgrading to React Router 7 is a major change and is not done here. | Accepted, documented |
| Residual | In-memory limiter is not shared across instances; Redis claim TTL is 90 days; email delivery is the only fulfilment step. | Noted |

## Shop APIs (added 2026-10-14)

Reviewed: `api/shop-status`, `shop-checkout`, `shop-order`, `shop-notify`, the shop branch of `stripe-webhook`, and `api/_lib/{shop-config,orders,shop-fulfil,qr,redis}`. Tests: `tests/api/shop.test.ts`, `src/data/shop.test.ts`, `src/lib/{shop-rules,cart}.test.ts`, `e2e/shop.spec.ts`.

| Area | Finding | Status |
|---|---|---|
| Price tampering | The browser sends slug, variant id, quantity and personalisation only. Unit prices, shipping and totals are computed on the server from `src/data/shop.ts`; extra fields such as `price` or `unitPence` are ignored (tested). Stripe is given server-held Price IDs. | Fixed |
| Price/catalogue mismatch | Before creating a session the server retrieves each Stripe Price and requires it to be active, one-time, GBP and exactly the catalogue amount; otherwise ordering fails closed (tested). | Fixed |
| Paid verification | A session is treated as paid only if Stripe reports `paid`, in GBP, with `amount_total` equal to the total stored with the order and the matching order reference. Mismatches never fulfil: the owner is alerted and the customer is not emailed. | Fixed |
| Webhook | Raw body, signature verified; processes a paid session even if the shop switch is off (the customer has already paid); idempotent through an atomic claim, released on failure so Stripe retries. | Fixed |
| Readiness and stock | Closed unless all gates, a real Price ID, a readiness flag and (if set) stock allow it. The public status exposes only available / sold-out / unavailable, never Price IDs, stock counts or reasons (tested). | Fixed |
| Open redirect / SSRF | Redirect URLs come from `SITE_URL`. The client only follows `https://checkout.stripe.com`. Review links must be Google-issued; page links must be https with a real hostname and no credentials; there are no server-side fetches of customer links. | Fixed |
| Injection | Personalisation is stripped of control characters and length-limited; all email HTML is escaped; subjects have newlines removed; QR files are generated from the validated text (tested). | Fixed |
| Sensitive data | Wi-Fi passwords are never put in Stripe metadata, never shown in the basket (masked), never sent to the customer, and are scrubbed from the stored order after owner hand-off (tested). Personalisation lives in the order store, not in Stripe. | Fixed |
| Order lookup | `/api/shop-order` needs the unguessable reference (8 chars from a 31-letter alphabet, about 40 bits) and the matching email; unknown and mismatching answers are identical; only names, variants, quantities and totals are returned; rate limited. | Fixed |
| Abuse | Origin check, per-IP limits (best effort per instance; add a Vercel Firewall rule), honeypot on notify, body and field limits, max 10 lines and quantity caps. | Mitigated |
| Basket in the browser | localStorage is treated as untrusted: it is re-validated against the catalogue on every load, quantities are clamped and unknown fields dropped; the server revalidates everything again. | Fixed |
| Residual | The order store and email are single points of failure; no automated shipping status; refunds are manual in Stripe; the in-memory limiter is not shared across instances. | Noted |
