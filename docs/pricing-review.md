# Pricing and offer: current position

Updated 17 October 2026. The earlier review agenda (Starter £199 / Sorted £399 / Works £649, Keep It Running £19/month) is superseded and has been removed so it cannot be mistaken for the live offer.

## What is live

| Item | Detail |
|---|---|
| Launch | £189 (previously £249). Up to 3 main pages, 1 revision round, 5 to 7 working days. £189 before work begins. |
| Growth | £489 (previously £649). Up to 10 main pages, content planning and navigation, one-off advanced on-page SEO, business email setup, basic analytics setup, 3 revision rounds, 10 to 14 working days. £244.50 to begin, £244.50 before launch. |
| Enterprise | Tailored quotation. Shops, customer accounts, portals, advanced booking, CRM and payment integrations, larger sites. Not payable online. |
| Hosting & Care | £29/month, month to month, 30 days' notice. Hosting, SSL, one standard-priced domain, weekly backups, security monitoring, up to 3 small content changes (30 minutes combined), support, Google Search Console setup. |
| Add-ons | Logo £49, Google Business Profile £39, Booking System £39, Extra Email Templates ×3 £29, SEO Audit £59, Legal Pages Pack £19. |

Source of truth: `src/data/packages.ts`. The Packages page, project brief, Start form, preview recommendation, assistant, emails and the server's expected Stripe amounts all read it. Other places hold the figures as text and must be edited by hand when prices change: `index.html` (structured data), `public/llms.txt`, `src/data/faqs.ts`, `src/data/meta.json`, `src/data/locations.json`, `src/data/guides.json`, `src/pages/Terms.tsx`, `src/pages/Index.tsx`, `src/components/oss/DaysCounter.tsx`, `src/components/layout/Navbar.tsx` and `api/_lib/chat/knowledge.ts`.

## Still to confirm with the owner

1. VAT: are prices inclusive or exclusive? Terms currently say "inclusive of VAT where applicable".
2. What each add-on delivers, so the one-sentence explainers on the project brief are accurate.
3. Whether a customer may self-host, and what happens to files and domain on cancelling Hosting & Care.
4. Deposit and refund wording (Terms say deposits are non-refundable once work has begun).
5. How long the "previously £249 / £649" prices should stay on show.

## Preview recommendation rules

`recommendPackage()` in `src/lib/preview/generate.ts` suggests Growth for more than one town or four or more services, otherwise Launch. These thresholds are assumptions, covered by tests.
