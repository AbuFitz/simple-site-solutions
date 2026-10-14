# Keyword plan

Search volumes and difficulty are **not** included: I had no keyword tool in this environment, and guessed numbers would be worse than none. Treat the lists as hypotheses and validate them in Google Search Console (free, once the site has impressions), Google Keyword Planner (free with an Ads account) and by reading the first page of results for each term.

## How terms map to pages

| Intent | Example searches | Page that targets it |
| --- | --- | --- |
| National, commercial | web design for small business uk; affordable website design uk; fixed price website design; website for local business | `/`, `/packages` |
| Trade-specific | plumber website design; electrician website; website for barbers; cleaning company website; tutor website; mechanic website design; builder website design | `/preview`, trade tiles on `/`, add a page per trade when there is something real to say |
| Local, commercial | web design watford; web designer st albans; website design hemel hempstead; web design milton keynes; (all twelve places) | `/web-design/<place>` |
| Comparison, research | godaddy website builder vs web designer; one.com website builder alternative; wix vs web designer; squarespace vs web designer; wordpress or web designer | `/guides/<platform>` |
| Price | how much does a website cost uk; cheap website design uk; website cost for small business | `/packages`, `/faq` |
| Informational | do I need a website for my business; how to get found on google local; google business profile for trades | future guides (below) |
| Brand | onesimplesite; one simple site | home; keep the name consistent everywhere (see naming note in the repo history) |

## Next guides to write (in order of likely value)

1. "How much does a small business website cost in the UK?" (honest ranges, what is and is not included)
2. "Do I need a website if I have a Facebook page?"
3. "Google Business Profile for tradespeople: a plain setup guide"
4. "What to put on a plumber's website" and the same for each trade, one at a time, only with real content
5. "Domain names: what to register and how to keep it in your own name"
6. "Website builder renewal prices: what to check before you sign"

Each needs its own written copy, a clear answer in the first paragraph, FAQ markup that matches visible text, and links to the packages page and the nearest place pages.

## On-page rules used on every page

- One H1 that says what the page is about, in natural words; title under about 60 characters, description under about 160, both unique.
- The answer first, then detail. Short paragraphs, plain language, a real FAQ where people ask real questions.
- Internal links: footer (all places and guides), home sections, place pages to neighbours, guides to related guides and to packages.
- Structured data only for facts that are true and visible on the page (BreadcrumbList, Service, FAQPage, Article, Organization). No ratings or reviews.
- Prices, delivery times and claims come from one source and are tested; see `docs/fact-ledger.md`.

## Measuring it

1. Add the site to Search Console and submit `sitemap.xml`. Check Pages, Performance (queries and pages) and Core Web Vitals monthly.
2. Record rankings for the 20 terms above once a month in a spreadsheet; judge by trend, not by one day.
3. Add privacy-friendly analytics only if you are comfortable updating the cookie and privacy text.
4. Count real enquiries (the forms) and ask each new customer how they found you.
5. Review every quarter: drop terms that never show impressions, write guides for the queries that do.

## Honest expectations

A new domain with little authority takes months to rank, even with good pages. Local pages and guides help, but links from real places do more: your Google Business Profile, your social profiles, directories you genuinely belong to, local press, and customers who link to the sites you build for them (with their permission).
