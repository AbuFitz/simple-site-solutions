/**
 * The price list. One source for the packages page, the project brief, checkout and the assistant.
 * Wording comes from the owner's approved pricing copy (October 2026). Do not add inclusions here
 * that the owner has not approved.
 */
export interface PackageTier {
  id: "launch" | "growth" | "enterprise";
  name: string;
  /** Pounds as a string, or null when the package is quoted individually. */
  price: string | null;
  /** The previous price, shown struck through next to the current one. */
  was?: string;
  /** Shown instead of a price when there is no fixed price. */
  priceLabel?: string;
  /** What the customer saves against the previous price, e.g. "Save £60". Worked out from `was`. */
  saving?: string;
  /** Plain, benefit-led description for the packages page. */
  summary: string;
  tagline: string;
  /** "Best suited to" line. */
  ideal: string;
  /** Our suggested starting point for most growing businesses. A recommendation, not a sales statistic. */
  recommended?: boolean;
  /** Maximum main pages. Null when scoped individually. */
  pages: number | null;
  /** What this package adds on top of the shared inclusions. */
  features: { title: string; text?: string }[];
  /** Short form, e.g. "5 to 7 working days". Null when agreed in the quotation. */
  delivery: string | null;
  revisions: string | null;
  /** Payment terms in words, shown to the customer. */
  paymentText: string;
  /** How the price is taken, used to work out the amount due to begin. */
  payment: "full" | "half" | "quote";
  /** Extra note shown under the list. */
  note?: string;
}

/** Included with both fixed packages. */
export const sharedFeatures: { title: string; text: string }[] = [
  { title: "Design around your business", text: "Agreed colours, typography and layout, using your supplied branding and images." },
  { title: "Mobile-friendly layouts", text: "Your website checked on mobile, tablet and desktop." },
  { title: "Website copywriting", text: "We turn your business information and rough notes into clear wording for the agreed pages." },
  { title: "An enquiry form", text: "One standard contact form, connected and tested with your chosen email inbox." },
  { title: "Contact links", text: "Phone, email and WhatsApp links where required, plus location or service-area information." },
  { title: "Essential SEO", text: "Clear page titles, search descriptions, heading structure, image descriptions and a sitemap." },
  { title: "Speed optimisation", text: "Appropriately sized images and an efficient page build." },
  { title: "Appropriate cookie controls", text: "Configured around the services actually used on your website." },
];

export const packages: PackageTier[] = [
  {
    id: "launch",
    name: "Launch",
    price: "189",
    was: "249",
    saving: "Save £60",
    summary: "A straightforward website that explains your business and makes it easy for customers to get in touch.",
    tagline: "A clear introduction to your business, services and contact details.",
    ideal: "A straightforward website that explains your business and helps customers contact you.",
    pages: 3,
    features: [
      { title: "Up to 3 main website pages", text: "For example: Home, Services and Contact." },
    ],
    delivery: "5 to 7 working days",
    revisions: "1 revision round before launch",
    paymentText: "£189 before work begins",
    payment: "full",
  },
  {
    id: "growth",
    name: "Growth",
    price: "489",
    was: "649",
    saving: "Save £160",
    summary: "A fuller website with a page for each service, more content and a stronger search setup, so customers can find the right service and the next step.",
    tagline: "More room to explain what you offer, with a more detailed structure and additional setup.",
    ideal: "A fuller website with individual service pages, more content and a stronger search setup.",
    recommended: true,
    pages: 10,
    features: [
      { title: "Up to 10 main website pages", text: "These can cover individual services, your business, frequently asked questions, contact details and relevant locations." },
      { title: "Content planning and navigation", text: "We organise the agreed pages so visitors can find the right service and next step." },
      { title: "Advanced on-page SEO", text: "A one-off setup covering service and location keyword research, page-specific content improvements, links between related pages and structured business information for search engines." },
      { title: "Business email setup", text: "Connect one customer-owned business email account to your domain. Mailbox subscription charges are separate." },
      { title: "Basic analytics setup", text: "Connect your analytics account so you can view visits and popular pages, with appropriate privacy controls." },
    ],
    delivery: "10 to 14 working days",
    revisions: "3 revision rounds before launch",
    paymentText: "£244.50 to begin and £244.50 before launch",
    payment: "half",
    note: "Any location pages count towards the 10-page allowance.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    priceLabel: "Tailored quotation",
    summary: "Online shops, customer portals, integrations and anything that needs its own plan. We agree the scope, price and timeline with you before any work starts.",
    tagline: "For requirements that need a separate plan, price and delivery schedule.",
    ideal: "Online shops, customer portals, integrations and projects requiring a bespoke scope.",
    pages: null,
    features: [
      { title: "Scoped to your project", text: "Examples include online shops, customer accounts, portals, advanced booking, CRM connections, payment integrations and larger websites." },
      { title: "Agreed before work starts", text: "We agree the functionality, deliverables, ongoing costs and support arrangements first." },
    ],
    delivery: null,
    revisions: null,
    paymentText: "Agreed in the quotation",
    payment: "quote",
  },
];

export interface Addon {
  id: string;
  name: string;
  price: string;
  /** One or two plain sentences, shown when the add-on is selected and on hover or tap of the info control. */
  explain: string;
}

export const addons: Addon[] = [
  { id: "logo", name: "Logo Design", price: "49", explain: "A simple logo for your business, used across your website. Already have one? Skip this." },
  { id: "google-business", name: "Google Business Profile Setup", price: "39", explain: "We set up or tidy your Google Business Profile so you show up properly on Google Search and Maps." },
  { id: "booking", name: "Booking System Setup", price: "39", explain: "A booking option on your website, so customers can ask for a time that suits them." },
  { id: "email-templates", name: "Extra Email Templates (×3)", price: "29", explain: "Three reusable email layouts for replies you send often, like quotes and confirmations." },
  { id: "seo-audit", name: "SEO Audit Report", price: "59", explain: "A written review of how your current website is set up for search, with a short list of what to fix first." },
  { id: "legal-pages", name: "Legal Pages Pack", price: "19", explain: "We add your privacy, terms and cookie pages to the site. You supply and approve the wording. They sit outside your page allowance." },
];

/** Packages that carry a fixed price (and so can be paid for online). */
export const pricedPackages = packages.filter((p) => p.price !== null);
export const packageIds = packages.map((p) => p.id) as PackageTier["id"][];
export const getPackage = (id: string) => packages.find((p) => p.id === id);
export const getAddon = (id: string) => addons.find((a) => a.id === id);

/** Pence due to begin: the full price, or half of it. Null for a quoted package. */
export function dueToBeginPence(p: PackageTier): number | null {
  if (p.price === null || p.payment === "quote") return null;
  const full = Math.round(Number(p.price) * 100);
  return p.payment === "half" ? Math.round(full / 2) : full;
}

/** Monthly rolling plan, available alongside Launch and Growth. */
export const hosting = {
  id: "hosting-care",
  name: "Hosting & Care",
  price: "29",
  intro: "Available alongside Launch and Growth.",
  features: [
    "Website hosting, SSL and one standard-priced domain",
    "Weekly website backups and security monitoring",
    "Up to 3 small content changes each month, covering supplied text, images and contact details",
    "Up to 30 minutes combined for those monthly content changes",
    "Support for the existing website",
    "Google Search Console setup, ownership verification and sitemap submission, with indexing requests for key pages where appropriate",
  ],
  terms: [
    "New pages, redesigns and additional functionality are quoted separately.",
    "Either side can cancel with 30 days' notice.",
    "Enterprise hosting and support are scoped with the quotation.",
  ],
};

export const monthlyPlanIds = ["hosting-care", "none"] as const;

/** How the package scope works. */
export const scopeNotes = [
  "A revision round is one combined list of changes to the agreed design and content. New functionality or a substantial change of direction is quoted separately.",
  "Delivery estimates begin once we have the agreed information, assets, account access and initial payment.",
  "Main page allowances exclude separately purchased policy-page implementation. Customers supply and approve their policy wording.",
  "The website belongs to the customer after full payment, with source-file handover included. Hosting and third-party subscriptions are separate from the one-off build price.",
];
