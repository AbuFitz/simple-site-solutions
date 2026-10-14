# Pricing and offer review

A working agenda for deciding prices, inclusions and promises, and for removing the places where the site contradicts itself.
Sources are the live code in this repo. Nothing here has been changed on the site.

## 1. Contradictions to fix (the site disagrees with itself)

| What | Where | Says | Packages page says |
|---|---|---|---|
| Hosting plans | FAQ ("What about hosting?", "What if I need changes?"), Terms (hosting section) | Two plans: Keep It Live £9/month and Keep It Fresh £19/month | One plan: Keep It Running £19/month, up to 5 content updates a month |
| Delivery time | Home, FAQ, Terms, sticky mobile bar, JSON-LD | "5-10 days" for everything | Starter 5–7, Sorted 7–10, Works 10–14 days |
| "Satisfaction Guarantee" | Home hero strip | A guarantee | Terms say deposits are non-refundable once work starts. No guarantee is defined anywhere |
| Support email | `index.html` structured data | hello@onesimplesite.co.uk | Packages structured data uses support@onesimplesite.co.uk |
| Review rating | `index.html` structured data | aggregateRating 4.9 from 100 reviews | No reviews are shown anywhere. This is invented markup and a search-penalty risk |
| Response promise | Project form confirmation (`/start`) | "We'll be in touch within 24 hours" | Not stated anywhere else. Confirm you can always keep it |

## 2. Unlinked pages that still contain old or invented offers

These are not in the navigation but are still routed or present, so they can be found:

- `/about`: invented team, "500+ websites", "since 2019", "98% satisfaction".
- `/services`: "Up to 5 pages", "1 year hosting included", "99.9% uptime guarantee", "daily backups", prices that do not match.
- `/contact`: budget options of £495 / £795 / £1,295, and a form that shows "Thank you" without sending anything.
- `src/pages/Pricing.tsx` and `src/pages/CaseStudies.tsx`: not routed, old prices (£495/£795) and invented case studies.

Decision needed: delete, correct, or redirect each one.

## 3. Pricing decisions to make together

1. **Are £199 / £399 / £649 right?** Check them against real build hours per package, hosting and domain costs, and the cost of revisions.
2. **Free domain for a year (Sorted)**: what does the domain cost you, and who owns it afterwards?
3. **"First month free" on hosting**: confirm it, and how it interacts with the 50% deposit.
4. **Delivery promises**: one honest range per package, and what happens if content arrives late.
5. **Revision rounds** (1 / 2 / 3): are they enough, and what does an extra round cost?
6. **Deposit and refunds**: Starter is paid in full upfront and deposits are non-refundable. Is that what you want to say out loud?
7. **Hosting**: one plan (£19) or two (£9 and £19)? A cheaper entry plan may convert better.
8. **Add-ons**: do the prices (£19 to £59) cover your time? Anything missing, such as copywriting, photography or extra pages?
9. **VAT and invoicing**: are prices inclusive or exclusive of VAT? The site does not say.
10. **Is there a fourth tier or a monthly option** for people who want no upfront cost?

## 4. The preview generator's recommendation rules (assumptions to approve)

The preview page suggests a package from what the owner enters. These thresholds are my reading of the inclusions, not business rules you have confirmed:

- More than one town → The Works (location pages for local search).
- More than six services (or six for builders) → The Works.
- Wants customers to book → The Sorted (booking is included there).
- Four or more services → The Sorted.
- Otherwise → The Starter.

They live in `recommendPackage()` in `src/lib/preview/generate.ts` and are covered by tests.

## 5. Keep in sync

Package data now exists in two places: `src/pages/Packages.tsx` (the page) and `src/data/packages.ts` (used by the preview recommendation). Change both, or ask for the page to be switched to read from the data file.
