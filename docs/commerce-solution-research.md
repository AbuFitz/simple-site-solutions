# OneSimpleCommerce solution page: evidence and design brief

Accessed 23 November 2026. This note records the decisions behind `/solutions/commerce`; it is not public copy.

## Decision questions

1. How should the main OneSimpleSite website introduce Commerce without duplicating the standalone product site?
2. Which product claims and prices are supported by the platform repository today?
3. Which ecommerce-category conventions help a small UK merchant understand the offer quickly?
4. What should the page avoid until Stripe, VAT and production infrastructure decisions are complete?

## Sources

- OneSimpleCommerce ADR 0008 and `packages/contracts/src/plans.ts`, repository evidence: one plan, £479 one-time build and £39/month; the application fee and VAT treatment remain open.
- OneSimpleCommerce marketing application and portal, repository evidence: bespoke storefront, merchant dashboard, orders, stock, customers, payments and custom workflow examples.
- [Shopify UK pricing](https://www.shopify.com/uk/pricing), accessed 23 November 2026: primary product source for the category's plan, payment-rate, hosting, inventory and dashboard expectations.
- [Square Online UK plans](https://squareup.com/gb/en/online-store/plans), accessed 23 November 2026: primary product source for the category's low-cost entry, payment-rate, fulfilment and POS expectations.
- [Wix ecommerce builder](https://www.wix.com/ecommerce/online-store), accessed 23 November 2026: primary product source for DIY-builder positioning and custom-domain/store-builder expectations.
- [BigCommerce product overview](https://www.bigcommerce.co.uk/en-GB/product/), accessed 23 November 2026: primary product source for the platform and operational-control positioning used at the larger end of the category.

## Fact ledger

| Item | Status | Evidence | Page consequence |
|---|---|---|---|
| Product name: OneSimpleCommerce | VERIFIED | Commerce repository and deployed site | Use as the named solution. |
| £479 build and £39/month | VERIFIED as the accepted product decision | ADR 0008 and contracts package | May appear; the page does not make a VAT claim. |
| Bespoke storefront plus merchant dashboard | VERIFIED in code | Commerce site, portal and gateway packages | Lead with the two-sided product. |
| Orders, products, stock, customers, discounts and payouts | VERIFIED in current application surface | Portal and marketing code | Use as concrete operating language. |
| Stripe-based merchant payments | VERIFIED as the architecture; production credentials are BLOCKED | Gateway and deployment docs | Say “set up around Stripe”; do not say live or name rates. |
| Hosting, security and updates included | VERIFIED as the accepted offer copy | Commerce site and ADR | Include in the monthly-platform explanation. |
| Application fee of 0.5% | BLOCKED | ADR says it is not commercially confirmed | Omit from the main-site page. |
| VAT treatment | BLOCKED | ADR and main-site fact ledger | Do not say “VAT included” or “no VAT added”. |
| Production customer stores, revenue or conversion outcomes | BLOCKED | No launch evidence | No testimonials, client logos or result metrics. |
| Exact delivery time | BLOCKED | No accepted Commerce delivery range | Do not promise a launch date. |

## Audience and market pattern

The large platforms sell breadth, low entry cost and self-service control. Their pages repeatedly surface store creation, checkout, inventory, payments, hosting and multichannel features. That establishes a useful category convention: a buyer expects to understand both the customer-facing store and the back office.

The opening for OneSimpleCommerce is not “more features”. It is the operating model: a distinctive store is designed and built for the merchant, while the dependable platform remains looked after. The page therefore compares responsibility, not feature-count theatre.

## Internal design read

- **Promise and audience:** a finished online store for an independent UK business that makes or sells products and does not want to become its own ecommerce team.
- **Need / fear / proof:** the buyer needs distinctiveness and operational calm; fears a generic theme, a tangle of apps, or an expensive hand-off; needs to see storefront and dashboard evidence together.
- **Archetype:** SaaS/product marketing inside the wider OneSimpleSite multi-page system. Primary conversion: an Enterprise project brief prefilled for an online shop.
- **Creative thesis:** “the two-sided shop”. Customer storefront and merchant operations overlap in one working canvas; the recurring order slip connects brand expression to day-to-day fulfilment.
- **Design DNA:** the existing OneSimpleSite ink, bone, Funnel Display, Hanken Grotesk, Fraunces and mono system; Commerce adds one acid-lime signal used only for live operational state.
- **Signature move:** the storefront, live-orders panel and paid-order notice occupy one composed product scene. On mobile they stack; with reduced motion the notice stays still.
- **Risk:** production Stripe, R2, Resend and custom-domain work remains separate. The page must not imply those external systems are already live.
- **Completion criteria:** route is prerendered and in the sitemap; navigation and footer reach it; no unsupported fee/VAT/results claims; build, lint, typecheck, unit and route tests pass; screenshots are reviewed at 390px and 1440px.
