# Fact ledger

Status of every business fact the site relies on. Accessed 2026-10-14. Research sources and URLs: `docs/research-notes.md`.

- **VERIFIED**: supported by this repository's own live code/data or a primary source, and safe to ship.
- **INFERRED**: a reversible design or copy decision.
- **PROVISIONAL**: owner-supplied in the code but not independently confirmed; ships, but must be confirmed before launch.
- **BLOCKED**: unknown; the site does not state it, and the related feature stays off.

## Offer and prices

| Fact | Status | Source / note |
|---|---|---|
| Packages Launch £189 (was £249, up to 3 pages), Growth £489 (was £649, up to 10 pages), Enterprise by tailored quotation, and their inclusions | PROVISIONAL | Supplied by the owner on 17 October 2026 and entered in `src/data/packages.ts`. Replaces the earlier Starter/Sorted/Works £199/£399/£649 list. Pricing review (`docs/pricing-review.md`) predates this and is out of date. |
| Estimated delivery 5–7 / 7–10 / 10–14 days, counted from receipt of content | PROVISIONAL | Same file. Shown as an estimate, never a guarantee. The old blanket "5–10 days" was removed. |
| Add-ons (£19–£59) and their one-sentence explainers on the project brief | PROVISIONAL | Prices unchanged. The explainers are Claude-written plain-language descriptions; the owner has not confirmed exactly what each add-on delivers (especially Booking System Setup and Legal Pages Pack). |
| One optional monthly rolling plan "Hosting & Care", £29/month, 30 days' notice, alongside Launch and Growth | PROVISIONAL | Supplied by the owner on 17 October 2026. Replaces "Keep It Running" at £19/month. Whether a customer can self-host is not stated; the form offers "No monthly plan for now" only. |
| Payment: Launch £189 before work begins; Growth £244.50 to begin and £244.50 before launch; Enterprise per quotation | PROVISIONAL | Supplied by the owner. Drives the expected Stripe amounts (£189.00 and £244.50). Enterprise cannot be paid online. |
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
| Privacy policy, Terms, Cookie policy text | PROVISIONAL | The "working draft" banner was removed at the owner's request (the site is live). Text matches what the site actually does (forms, chat, maps, local storage). Still BLOCKED and not stated: legal entity details and whether prices include VAT; a solicitor review is still advisable. |
| Accessibility statement | PROVISIONAL | Draft. Automated axe checks pass (see README); no manual screen-reader audit has been done. |
| Core Web Vitals thresholds, WCAG 2.2 AA | VERIFIED | web.dev and W3C (research notes §5). |
| Stripe flow design (hosted Checkout, signed webhook, idempotent fulfilment) | VERIFIED | Stripe docs (research notes §4). |

## Preview generator

Recommendation thresholds (`recommendPackage()`) are INFERRED business rules awaiting owner approval (`docs/pricing-review.md` §4).

## Website preview (updated)

| Fact | Status | Note |
|---|---|---|
| Preview maps are live OpenStreetMap views of the town/postcode entered, looked up with Nominatim and postcodes.io | VERIFIED | Open data services reachable from the browser; no keys. Disclosed in the cookie and privacy pages and under the preview. |
| A pin is shown only when the visitor opts in, and only for a valid postcode | INFERRED | Design choice to avoid publishing a home address by accident. |
| Template wording (headlines, service names, process steps, about text) | PROVISIONAL | Generic sample copy per trade in `src/lib/preview/categories.ts`; the preview says it is sample wording. |
| The previews contain no photographs | INFERRED | Owner decision: no images unless they are genuinely good. Openly licensed trade photos found on Wikimedia Commons were not of a standard worth shipping. |

## Local pages (/web-design)

- Verified in the repository: positioning line, package names and prices (from `src/data/packages.ts`), the fact that work is done online and replies come by email.
- Inferred from public knowledge, to be spot-checked before wide promotion: the local context lines (county, new-town dates for Hemel Hempstead 1947, Stevenage 1946, Milton Keynes 1967, Welwyn Garden City 1920, named landmarks and nearby towns).
- Not claimed anywhere: local office or address, local clients, reviews, rankings, response times.
