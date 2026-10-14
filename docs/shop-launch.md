# Opening the shop: what has to be true

The shop is fully built and tested, but **closed by default**. Opening it is configuration only. Do these in order.

## Gates (all server-side; the browser can't change them)

1. **Owner approves** the prices in `docs/shop-catalogue.md` / `src/data/shop.ts`, the VAT treatment and the returns wording (`docs/fact-ledger.md`). Then set `PRICING_APPROVED=true`.
2. **Stripe sandbox first.** For every variant you want to sell, create a **one-time GBP Price** in Stripe whose unit amount equals the catalogue price in pence. Copy each id to `SHOP_PRICE_<KEY>` (list in `docs/shop-catalogue.md`). The API refuses to create a session if the configured Price is inactive, recurring, not GBP, or a different amount.
3. **Webhook:** endpoint `https://<deployment>/api/stripe-webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`; set `STRIPE_WEBHOOK_SECRET`.
4. **Order store:** an Upstash Redis database (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`). Orders (including personalisation) are held here for 90 days; Wi-Fi passwords are scrubbed once the order has been handed off.
5. **Email:** `RESEND_API_KEY` with `onesimplesite.co.uk` verified. Fulfilment emails go to `ADMIN_EMAIL` (default `hello@onesimplesite.co.uk`).
6. **Production route for posted items:** confirm a supplier or in-house process, order samples, check the NFC chips read on iPhone and Android, and confirm real costs and dispatch time. Only then set `SHOP_FULFILMENT_CONFIRMED=true`. The digital pack doesn't need this.
7. Set `SITE_URL`, `STRIPE_SECRET_KEY` (`sk_test_...`), `SHOP_ENABLED=true`, and for each variant `SHOP_READY_<KEY>=true` (optionally `SHOP_STOCK_<KEY>`). Redeploy.
8. **Test mode run-through:** add a review card, check out with Stripe test card 4242 4242 4242 4242 and a UK address; confirm the owner email arrives once with the address, the personalisation and an attached QR SVG; confirm the customer email; replay the event in the Stripe dashboard and confirm no second email; check `/shop/order-status`; check a Wi-Fi order's password is gone from the stored record afterwards; buy the digital pack and scan the QR files you receive.
9. **Live:** switch to live keys with `STRIPE_ALLOW_LIVE=true` and live Price IDs only after steps 1 to 8 pass.

## What the site does until then

- `/api/shop-status` reports every variant as unavailable. Product pages and the basket still work, with a plain "Ordering isn't open yet" message and a notify-me form (explicit consent, one email).
- The checkout button is disabled and `/api/shop-checkout` returns 503. Nothing is sent to Stripe.
- If the status endpoint can't be reached, the UI treats ordering as closed.

## Fulfilment hand-off (what you receive per paid order)

One email to the owner with: order reference, totals, customer email, delivery address, every line with its personalisation exactly as entered (HTML-escaped), and a print-ready static QR code (SVG) for every line that needs one: the review link, the page link, the Wi-Fi string (`WIFI:T:...;S:...;P:...;;` with correct escaping) or each digital-pack link. The customer gets a confirmation (no Wi-Fi password) and, for the digital pack, their QR files (SVG + 1200 px PNG).

## Known limits (honest)

- Dispatch status updates ("shipped") are not automated; order status shows pending, paid or expired. Tell customers by email.
- No stock decrement: `SHOP_STOCK_*` is a manual number you maintain.
- No refunds UI: refund in the Stripe dashboard.
- NFC chips are programmed with the same link as the QR code; the site doesn't make chips. That is a production step with your supplier.
