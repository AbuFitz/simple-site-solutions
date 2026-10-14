/**
 * What Sid is allowed to know. Everything here mirrors what the public site already says (packages page, FAQ, process).
 * tests/api/chat-knowledge.test.ts checks the prices against src/data/packages.ts so the two cannot drift.
 * Never add reviews, clients, results, response times or guarantees here.
 */
export interface KnowledgeDoc {
  id: string;
  title: string;
  text: string;
  /** Extra words people use for this topic. */
  keywords: string[];
  /** A page worth sending the visitor to after this answer. */
  link?: { label: string; href: string };
}

export const ALLOWED_PRICES = ["£199", "£399", "£649", "£49", "£39", "£29", "£59", "£19", "£19/month"];

export const KNOWLEDGE: KnowledgeDoc[] = [
  {
    id: "about",
    title: "What OneSimpleSite does",
    text: "OneSimpleSite provides web design and development for businesses across the UK. It builds fixed-price websites for local businesses such as plumbers, electricians, mechanics, cleaners, barbers and salons, tutors, small shops and builders. Work is done online. Each site starts from a layout planned for that kind of business and is filled with the customer's details.",
    keywords: ["who", "what", "do", "about", "company", "services", "website", "design", "build", "uk", "nationwide"],
    link: { label: "About us", href: "/about" },
  },
  {
    id: "prices",
    title: "Package prices",
    text: "Three fixed-price packages. The Starter is £199: up to 3 pages, professional copywriting, mobile-first design, contact form and WhatsApp, Google Maps, basic SEO, SSL, speed optimised, 1 revision round. The Sorted is £399: up to 6 pages, conversion-focused layout, reviews and trust signals, booking system included, full on-page SEO, free domain for the first year, business email setup, 2 revision rounds. The Works is £649: up to 10 pages, SEO-led architecture, location pages for local SEO, blog setup with 1 post, Google Analytics setup, advanced booking, full legal pages, 3 revision rounds.",
    keywords: ["price", "prices", "cost", "costs", "how", "much", "pricing", "package", "packages", "cheap", "afford", "budget", "starter", "sorted", "works", "£"],
    link: { label: "See packages and prices", href: "/packages" },
  },
  {
    id: "which",
    title: "Which package to choose",
    text: "The Starter suits new businesses and sole traders who need to get online properly. The Sorted suits growing businesses that want to look established, with trust signals and booking. The Works suits established businesses investing in competing locally, with an SEO-led structure, location pages and analytics.",
    keywords: ["which", "choose", "recommend", "best", "right", "suit", "difference", "compare", "between"],
    link: { label: "Compare packages", href: "/packages" },
  },
  {
    id: "delivery",
    title: "How long it takes",
    text: "The estimate is 5 to 7 days for The Starter, 7 to 10 days for The Sorted and 10 to 14 days for The Works. It is counted from when we have the customer's content and the go-ahead. Late content or slow feedback moves the date. These are estimates, not guarantees.",
    keywords: ["long", "time", "days", "weeks", "quick", "fast", "deadline", "delivery", "turnaround", "when", "ready", "launch", "urgent"],
    link: { label: "How it works", href: "/how-it-works" },
  },
  {
    id: "process",
    title: "How it works",
    text: "Fill in the project brief with what the business does, where it works and what customers should do. We reply by email to confirm scope, then design and build the pages around the trade and the area. The customer reviews the site, requests the changes the package includes, and it goes live. We do not promise a reply time.",
    keywords: ["process", "steps", "start", "begin", "work", "works", "brief", "form", "happens", "next", "order", "get", "started"],
    link: { label: "Start your project", href: "/start" },
  },
  {
    id: "addons",
    title: "Add-ons and monthly plan",
    text: "Optional add-ons: Logo Design £49, Google Business Profile Setup £39, Booking System Setup £39, Extra Email Templates (x3) £29, SEO Audit Report £59, Legal Pages Pack £19. There is also an optional Keep It Running plan at £19/month covering hosting and domain, SSL, weekly backups, security monitoring and up to 5 content updates a month. Whether a customer can host the site themselves and how files are handed over is still to be confirmed in writing, so they should ask us before ordering.",
    keywords: ["addon", "addons", "add-on", "extra", "extras", "logo", "hosting", "host", "domain", "monthly", "maintenance", "updates", "backup", "email", "google", "business", "profile"],
    link: { label: "Add-ons on the packages page", href: "/packages" },
  },
  {
    id: "seo",
    title: "SEO",
    text: "Every package is built with local SEO foundations: clear page titles and headings, a real map, fast mobile pages, structured data that is true and consistent business details. The Sorted adds full on-page SEO and The Works adds an SEO-led structure and location pages. Nobody can honestly guarantee a Google ranking, and OneSimpleSite does not. Rankings also depend on competition, reviews and the Google Business Profile.",
    keywords: ["seo", "google", "rank", "ranking", "search", "found", "visible", "keywords", "local", "first", "page", "traffic"],
    link: { label: "Web design across the UK", href: "/web-design" },
  },
  {
    id: "design",
    title: "Design choices",
    text: "Customers do not pick a design from scratch. Sites are built from layouts planned for each kind of business, so it is faster and costs less than a fully custom design, with less room for bespoke changes. Anyone who wants full creative control is probably not the right fit. There is a free website preview that shows a sample for a trade and town.",
    keywords: ["design", "custom", "template", "look", "style", "colour", "colours", "logo", "preview", "sample", "example", "bespoke", "choose"],
    link: { label: "Try the free preview", href: "/preview" },
  },
  {
    id: "need",
    title: "What we need from the customer",
    text: "The business name and details, the services, contact information and any images or logos to use. A simple form guides the customer through it. They do not need to have everything ready.",
    keywords: ["need", "require", "provide", "send", "images", "photos", "text", "content", "information", "details", "prepare"],
    link: { label: "Start your project", href: "/start" },
  },
  {
    id: "payment",
    title: "Payment, changes and refunds",
    text: "The Starter is paid upfront in full. The Sorted and The Works are 50% upfront to begin and 50% before launch. How payment is taken is confirmed when the enquiry is accepted. Deposits are non-refundable once work has begun; anyone who needs to cancel should say as soon as possible. After launch, changes beyond the plan are quoted before any work is done.",
    keywords: ["pay", "payment", "deposit", "upfront", "refund", "cancel", "invoice", "card", "vat", "terms", "changes", "revisions", "edit"],
    link: { label: "Terms", href: "/terms" },
  },
  {
    id: "areas",
    title: "Areas covered",
    text: "OneSimpleSite works online with businesses across the UK. There are local pages for Hemel Hempstead, St Albans, Watford, London, Luton, Dunstable, Harpenden, Hatfield, Welwyn Garden City, Stevenage, Aylesbury and Milton Keynes, but a business anywhere in the UK can order and prices are the same everywhere. There is no published office address.",
    keywords: ["area", "areas", "cover", "location", "near", "local", "hertfordshire", "bedfordshire", "buckinghamshire", "london", "watford", "luton", "town", "city", "where", "based", "office", "visit"],
    link: { label: "See local areas", href: "/web-design" },
  },
  {
    id: "compare",
    title: "Compared with website builders",
    text: "Builders such as GoDaddy, One.com, Wix, Squarespace and WordPress give you tools and you do the work; OneSimpleSite does the work and the customer reviews it. A builder suits people with spare time who enjoy it. A fixed-price package suits people who would rather spend that time on their business. OneSimpleSite is independent and not affiliated with any of those companies, and does not make claims about their prices or quality.",
    keywords: ["godaddy", "one.com", "wix", "squarespace", "wordpress", "builder", "diy", "shopify", "versus", "vs", "compare", "better", "alternative", "myself"],
    link: { label: "Read the guides", href: "/guides" },
  },
  {
    id: "contact",
    title: "Talking to a person",
    text: "Questions before ordering can be sent through the contact form or by email to hello@onesimplesite.co.uk. To start a project use the project brief. Replies come by email and no reply time is promised. Social accounts are @onesimplesite on Instagram, Facebook, TikTok and LinkedIn.",
    keywords: ["contact", "speak", "talk", "person", "human", "call", "phone", "email", "message", "ring", "someone", "team", "help", "support", "instagram", "facebook", "tiktok", "linkedin"],
    link: { label: "Contact us", href: "/contact" },
  },
];
