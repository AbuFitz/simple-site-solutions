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

export const ALLOWED_PRICES = ["£189", "£249", "£489", "£649", "£244.50", "£49", "£39", "£29", "£59", "£19", "£29/month"];

export const KNOWLEDGE: KnowledgeDoc[] = [
  {
    id: "about",
    title: "What OneSimpleSite does",
    text: "OneSimpleSite provides web design and development for businesses across the UK. It builds fixed-price websites for local businesses such as plumbers, electricians, mechanics, cleaners, barbers and salons, tutors, small shops and builders. Work is done online. Each fixed-price site is designed around the business using the customer's details, branding and images.",
    keywords: ["who", "what", "do", "about", "company", "services", "website", "design", "build", "uk", "nationwide"],
    link: { label: "About us", href: "/about" },
  },
  {
    id: "prices",
    title: "Package prices",
    text: "Two fixed-price packages plus tailored quotations. Launch is £189 (previously £249): up to 3 main website pages, 1 revision round, estimated delivery 5 to 7 working days, £189 paid before work begins. Growth is £489 (previously £649): up to 10 main pages, content planning and navigation, one-off advanced on-page SEO, business email setup, basic analytics setup, 3 revision rounds, estimated delivery 10 to 14 working days, £244.50 to begin and £244.50 before launch. Both include design around the business, mobile-friendly layouts, website copywriting, an enquiry form, contact links, essential SEO, speed optimisation and cookie controls. Enterprise is a tailored quotation for online shops, customer accounts, portals, advanced booking, CRM connections, payment integrations and larger websites.",
    keywords: ["price", "prices", "cost", "costs", "how", "much", "pricing", "package", "packages", "cheap", "afford", "budget", "launch", "growth", "enterprise", "£"],
    link: { label: "See packages and prices", href: "/packages" },
  },
  {
    id: "which",
    title: "Which package to choose",
    text: "Launch suits a business that needs a clear website explaining what it does and how to get in touch. Growth suits a business with several services or locations that wants a page for each and a stronger search setup. Enterprise is for online shops, customer portals, integrations and other bespoke projects.",
    keywords: ["which", "choose", "recommend", "best", "right", "suit", "difference", "compare", "between"],
    link: { label: "Compare packages", href: "/packages" },
  },
  {
    id: "delivery",
    title: "How long it takes",
    text: "The estimate is 5 to 7 working days for Launch and 10 to 14 working days for Growth. It is counted from when we have the agreed information, assets, account access and the initial payment. Late content or slow feedback moves the date. Enterprise timings are agreed in the quotation. These are estimates, not guarantees.",
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
    text: "Optional add-ons: Logo Design £49, Google Business Profile Setup £39, Booking System Setup £39, Extra Email Templates (x3) £29, SEO Audit Report £59, Legal Pages Pack £19. There is also an optional monthly rolling plan, Hosting & Care at £29/month, available alongside Launch and Growth: hosting, SSL and one standard-priced domain, weekly backups and security monitoring, up to 3 small content changes a month (up to 30 minutes combined), support for the existing website, and Google Search Console setup. Either side can cancel with 30 days' notice. New pages, redesigns and extra functionality are quoted separately. The customer owns the website after full payment, with source files handed over.",
    keywords: ["addon", "addons", "add-on", "extra", "extras", "logo", "hosting", "host", "domain", "monthly", "maintenance", "updates", "backup", "email", "google", "business", "profile"],
    link: { label: "Add-ons on the packages page", href: "/packages" },
  },
  {
    id: "seo",
    title: "SEO",
    text: "Both fixed packages include essential SEO: clear page titles, search descriptions, heading structure, image descriptions and a sitemap. Growth adds a one-off advanced on-page SEO setup covering service and location keyword research, page-specific content improvements, links between related pages and structured business information. Nobody can honestly guarantee a Google ranking, and OneSimpleSite does not. Rankings also depend on competition, reviews and the Google Business Profile.",
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
    text: "Launch is £189 before work begins. Growth is £244.50 to begin and £244.50 before launch. Enterprise payment is set out in the quotation. How payment is taken is confirmed when the enquiry is accepted. Deposits are non-refundable once work has begun; anyone who needs to cancel should say as soon as possible. After launch, changes beyond the plan are quoted before any work is done.",
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
