# Fact ledger

Status of every business fact the site relies on. Accessed 2026-10-14. Research sources and URLs: `docs/research-notes.md`.

- **VERIFIED**: supported by this repository's own live code/data or a primary source, and safe to ship.
- **INFERRED**: a reversible design or copy decision.
- **PROVISIONAL**: owner-supplied in the code but not independently confirmed; ships, but must be confirmed before launch.
- **BLOCKED**: unknown; the site does not state it, and the related feature stays off.

## Offer and prices

| Fact | Status | Source / note |
|---|---|---|
| Packages The Starter £199 (3 pages), The Sorted £399 (6), The Works £649 (10) and their inclusions | PROVISIONAL | Owner-authored in `src/data/packages.ts` (commit history: "Major pricing and packages overhaul"). Pricing review (`docs/pricing-review.md`) is still open. |
| Estimated delivery 5–7 / 7–10 / 10–14 days, counted from receipt of content | PROVISIONAL | Same file. Shown as an estimate, never a guarantee. The old blanket "5–10 days" was removed. |
| Add-ons (£19–£59) | PROVISIONAL | Same file. |
| One optional hosting plan "Keep It Running", £19/month | PROVISIONAL | Commit 09474f6 "Consolidate hosting to single £19/month plan". The old £9 "Keep It Live" / "Keep It Fresh" copy in the FAQ and Terms was removed. |
| Payment: Starter upfront, Sorted/Works 50% upfront | PROVISIONAL | Packages data and FAQ. Drives the expected Stripe amounts (£199.00 / £199.50 / £324.50). |
| "First month free" hosting | BLOCKED | Appeared once, unconfirmed. Removed. |
| Prices include or exclude VAT | BLOCKED | Not stated anywhere. Needed before taking payment. |
| What the customer owns (domain, files, design) and how files are handed over on leaving | BLOCKED | Not stated anywhere. Research shows buyers look for it. The FAQ says it is "to be confirmed in writing". |
| Satisfaction guarantee | BLOCKED | Never defined; removed. Terms say deposits are non-refundable once work starts. |
| Reply-time promise (was "within 24 hours") | BLOCKED | Unconfirmed; removed everywhere (site, emails, forms). Copy now says "we'll reply by email". |
| Refunds: deposit non-refundable once work starts | PROVISIONAL | `Terms.tsx`, `FAQ.tsx`. Needs legal review against the Consumer Contracts Regulations (see research notes §4). |

## Business identity and contact

| Fact | Status | Note |
|---|---|---|
| Support/contact address hello@onesimplesite.co.uk | PROVISIONAL | Used by forms and footer. The old support@ address was merged into it. Confirm the mailbox is monitored and that Resend's sender `noreply@onesimplesite.co.uk` is verified. |
| Legal entity, registered number, registered office, VAT number | BLOCKED | Not in the repo. If the business is a limited company these must appear on the site (GOV.UK, research notes §1). |
| Team, founding year, number of sites built, client count | BLOCKED | The old "500+ sites since 2019" and invented team were removed. About page makes no such claims. |
| Reviews, ratings, testimonials | BLOCKED | None exist. The invented `aggregateRating` (4.9 / 100) and the four invented case studies were removed. |

## Work / portfolio

| Fact | Status | Source |
|---|---|---|
| 8 projects (FixNow Mechanics, FixNow Shop, ReadySold, Stonebridge, True To Detail, BrightLearn, Quantum BioTesting, ARF Mods): what was built, stack, status, URL | VERIFIED (by the previous session against each project's repository and live site) | `src/data/work.ts` header. Screenshots in `src/assets/work/` are captures of those sites. |
| Whether each is a third-party client, our own, or a sister project | BLOCKED | Deliberately not stated; the word "client" is not used. |
| Outcomes (traffic, enquiries, revenue) | BLOCKED | None claimed. Detail pages say so explicitly. |
| FixNow Track | removed | Owner request. |
| Quantum BioTesting is a preview build with no public URL | VERIFIED | Shown as "Preview build". |

## Technical and compliance

| Fact | Status | Note |
|---|---|---|
| Site sets no analytics/marketing cookies; uses localStorage `oss_cookie_consent`, `oss_brief_draft_v1` (7 days), sessionStorage `oss_preview_input` | VERIFIED | Listed in the cookie policy. Cookie banner is informational because nothing non-essential is set. Re-assess before adding any analytics (ICO guidance, research notes §4). |
| Privacy policy, Terms, Cookie policy text | PROVISIONAL | Marked "working draft awaiting review" on each page via `LegalNotice`. Needs owner and legal review. |
| Accessibility statement | PROVISIONAL | Draft. Automated axe checks pass (see README); no manual screen-reader audit has been done. |
| Core Web Vitals thresholds, WCAG 2.2 AA | VERIFIED | web.dev and W3C (research notes §5). |
| Stripe flow design (hosted Checkout, signed webhook, idempotent fulfilment) | VERIFIED | Stripe docs (research notes §4). |

## Preview generator

Recommendation thresholds (`recommendPackage()`) are INFERRED business rules awaiting owner approval (`docs/pricing-review.md` §4).

## Shop (added 2026-10-14; research in `docs/shop-research.md`, decisions in `docs/shop-catalogue.md`)

| Fact | Status | Note |
|---|---|---|
| Catalogue of 7 products / 14 variants and their prices | PROVISIONAL (owner approval required) | `src/data/shop.ts`. Prices are research-based recommendations. The sticker pack prices are placeholders (no comparator found). |
| UK delivery £3.95, free from £50 of posted items, UK mainland only | PROVISIONAL | Royal Mail Tracked 48 small parcel £3.65 is from a search summary only. |
| Dispatch time | BLOCKED | No number is published. Copy says a dispatch date is emailed after ordering and the statutory 30 days applies. |
| A production route for posted items (supplier, capacity, samples, NFC chip type and programming) | BLOCKED | Nothing is assumed. Ordering of posted items stays closed until `SHOP_FULFILMENT_CONFIRMED=true`. |
| VAT registration and whether prices include VAT | BLOCKED | Site says VAT treatment is to be confirmed and shows no VAT line. Needs an accountant. |
| Stripe Price IDs and webhook secret | BLOCKED | None exist in the repo; none invented. |
| Stock levels | BLOCKED | Optional manual `SHOP_STOCK_*`; none claimed. |
| Warranty, durability, waterproofing, sustainability, reviews, certifications | BLOCKED | None claimed; tests fail the build if such words appear in the shop. |
| Returns: personalised goods exempt from 14-day cancellation (consumers); statutory rights for faults | PROVISIONAL | Consumer Contracts Regulations 2013 reg. 28(1)(b); Consumer Rights Act 2015. Draft wording needs legal review. Business buyers are outside the consumer rules. |
| Google review links: `g.page/r/...` or `search.google.com/local/writereview?placeid=...` | PROVISIONAL | The first format is documented by secondary sources and the second is reported to be unreliable, so the product page tells customers to copy the link from Business Profile. We never claim to improve rankings or ratings, and we never gate or incentivise reviews (Google policy). |
| NFC tag behaviour (no battery; most recent phones read it; iPhone XS/XR and later read in the background; some phones lack NFC) | VERIFIED (modest claims only) | NXP and Apple sources in the research notes. The site always pairs NFC with a QR code. |
| Wi-Fi QR string format and escaping | PROVISIONAL | Secondary sources; covered by unit tests. Password is printed in the QR, so guest networks are advised. |
| Personalisation data retention (orders 90 days, Wi-Fi password removed after hand-off) | INFERRED | Our design choice. UK GDPR retention periods need owner review. |
| "Notify me when ordering opens" | INFERRED | One email, unticked consent box. PECR wording needs review. |
| Product images | VERIFIED | Original SVG illustrations created in this repository. Labelled as illustrations, not photographs. No supplier imagery is used. |
