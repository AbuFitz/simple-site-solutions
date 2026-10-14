# Website preview templates

`/preview` (and the preview inside the project form) renders a sample website for the customer's trade. There is one template per trade, each with its own layout, typography and photography, so the sample looks like a finished site for that kind of business rather than a recoloured skeleton.

| Trade | Template | Look | Typeface (open licence, loaded only for that template) |
|---|---|---|---|
| Plumbers & heating | `Plumbing.tsx` | Classic trust layout: phone bar, photo hero with offer panel, photo service cards, area and request-a-visit form | Manrope |
| Electricians | `Electrical.tsx` | Dark, full-bleed photo hero, plain service list, photo mosaic, quote form | Space Grotesk |
| Garages & mobile mechanics | `Mechanic.tsx` | Black and colour, condensed capitals, price-list style services, "we come to you / bring it in" split | Barlow Condensed |
| Cleaners | `Cleaning.tsx` | Light and friendly, large soft-cornered photos, "what a clean includes" checklist | Nunito |
| Barbers & salons | `Barber.tsx` | Dark editorial, centred serif identity, full-bleed photo, services menu, photo strip, find-us map | Playfair Display |
| Tutors | `Tutoring.tsx` | Warm and readable for parents, subjects, how lessons work, introduction to the tutor | Lexend |
| Local shops | `Shop.tsx` | Retail header with search and basket, banner, departments with photos, visit-us map | DM Sans |
| Builders | `Builder.tsx` | Project-led: large serif headline, big photo gallery, service list, how a project runs | DM Serif Display + DM Sans |
| Anything else | `Other.tsx` | Clean general-purpose layout | Plus Jakarta Sans |

Shared blocks (header, photo service cards, steps, enquiry form, footer, area map) live in `src/components/preview/templates/kit.tsx`. Each template is a lazy chunk, so only the chosen design's code and fonts load. The fonts are `@fontsource` packages (SIL Open Font Licence). They style the sample site only, inside the device frame; OneSimpleSite's own pages keep Inter.

## Honesty rules

The templates never state facts about the customer's business: no reviews, ratings, accreditations, prices, opening hours or statistics (an e2e test scans every template for these). Anything unknown is either left out or shown as plain muted text, and the preview page lists what is still to add. Sample wording lives in `src/lib/preview/categories.ts`.

## Photos

Photographs are real, openly licensed images from Wikimedia Commons (CC0, public domain or CC BY), processed to WebP in `src/assets/preview/` and described in `src/lib/preview/photos.json` and `docs/preview-images.md`, which record author, licence and source for every image. The preview page has a "Photo and map credits" disclosure. To swap a photo, replace the `-lg.webp` and `-md.webp` files and update that trade's entry in `photos.json`. If a trade has no photos the template falls back to its vector motif.

## Maps

Where a template shows an area or "find us" map it is a real OpenStreetMap view of the town the customer typed, never a drawn map. The browser looks the town up once (OpenStreetMap Nominatim, cached for the session) and embeds `openstreetmap.org`. With no town, or if the lookup fails, the template says so plainly. This is disclosed in the cookie and privacy pages and the preview credits. The area view has no pin, because we don't know the business address.

## Development

`npm run dev` registers `/__tpl?c=<trade>&v=<palette 0-2>&compact=1&n=<name>&t=<town>`, which renders one template at its design width (1200px, or 390px compact) for visual review. It is excluded from production builds.
