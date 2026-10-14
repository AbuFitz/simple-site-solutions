# Website preview: guided flow and templates

## The guided flow (`/preview`)

Visitors move through six short steps, one question per screen, built for a phone first: name, type of business, where they work, what they offer, how customers reach them, then a review. **Nothing is mandatory.** Every step can be skipped ("Skip" replaces "Continue" when a step is empty), "Skip to my preview" is available throughout, and anything left blank is shown as sample wording. A partly filled link (such as the one from the home page) resumes at the first unanswered step. On desktop a live preview builds alongside the questions. Afterwards the preview page offers Desktop and Phone views, "Try another style", "Edit details" (back to the review step), "Copy link", the suggested package and what is still to add.

Rules and messages live in `src/lib/preview/wizard.ts` (unit-tested); the screens are `src/components/preview/Wizard.tsx`; the page that switches between the guide and the result is `src/pages/Preview.tsx`.

Unusable entries (a malformed postcode, phone number or email) show a gentle note and are left out of the preview; they never block. If the trade is skipped the general-purpose template is used. Everything stays in the browser; the preview URL carries the answers so it can be shared.

## Maps

Every template that shows an area or "find us" block shows a real OpenStreetMap view, never a drawn map.

- A postcode is looked up with postcodes.io (Ordnance Survey / ONS open data); a town with OpenStreetMap Nominatim. Each value is looked up once and cached for the session.
- While the visitor types, the guide shows the same real map and says what was found ("Found WD17 1AA, Watford, East of England"), suggests the town from a postcode, and says plainly when nothing was found.
- A pin is only drawn if the visitor chooses "Put a pin on my premises", and only for a valid postcode. It is off by default (many trades work from home); without it the map shows the area, with no marker. Other towns they cover are listed as text.
- The map is a still view until tapped ("Tap to explore the map"), so scrolling the page never gets stuck on it. OpenStreetMap's attribution stays visible.
- With no location, or if a lookup fails, the template says so. These services receive the visitor's IP address and the town or postcode typed; this is disclosed in the cookie and privacy pages and under the preview.

## Templates

One per trade, each with its own layout and open-licence typeface (`@fontsource`, SIL Open Font Licence), loaded lazily so only the chosen design's code and fonts download. The fonts style the sample site only, inside the device frame; OneSimpleSite's own pages keep Inter. There are no photographs and no drawn art: the designs rely on typography, colour fields, layout and the real map.

| Trade | Template | Look |
|---|---|---|
| Plumbers & heating | `Plumbing.tsx` | Classic trusted-local-trade layout: phone bar, request-a-visit form in the hero, services, areas and map (Manrope) |
| Electricians | `Electrical.tsx` | Dark, big typographic hero, plain services list, quote form beside the map (Space Grotesk) |
| Garages & mobile mechanics | `Mechanic.tsx` | Black and colour, condensed capitals, price-list style services, "we come to you / bring it in" (Barlow Condensed) |
| Cleaners | `Cleaning.tsx` | Light and friendly, soft corners, "what a clean includes" checklist in the hero (Nunito) |
| Barbers & salons | `Barber.tsx` | Dark editorial, centred serif identity, services menu, find-us map (Playfair Display) |
| Tutors | `Tutoring.tsx` | Warm and readable for parents, first-session form, subjects, how lessons work (Lexend) |
| Local shops | `Shop.tsx` | Retail header with search and basket, banner, departments, visit-us map (DM Sans) |
| Builders | `Builder.tsx` | Large serif headline, what they build as big typographic rows, how a project runs, quote form (DM Serif Display + DM Sans) |
| Anything else | `Other.tsx` | Clean general-purpose layout (Plus Jakarta Sans) |

Shared blocks (header, service cards and rows, steps, enquiry form, areas list, footer, map) are in `src/components/preview/templates/kit.tsx`. Sample wording is in `src/lib/preview/categories.ts`.

## Honesty rules

The templates never state facts about the customer's business: no reviews, ratings, accreditations, prices, opening hours or statistics, and they contain no images. An e2e test scans every template for these. Unknown details are left out or shown as plain muted text, and the preview page lists what is still to add.

## Development

`npm run dev` registers `/__tpl?c=<trade>&v=<palette 0-2>&compact=1&n=<name>&t=<town>&z=<postcode>&k=1`, which renders one template at its design width (1200px, or 390px compact) for visual review. It is not included in production builds. (Map iframes load lazily, so scroll to them before taking a screenshot.)
