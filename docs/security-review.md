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
