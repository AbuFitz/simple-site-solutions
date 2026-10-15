/**
 * Portfolio data. Every claim here was checked against the project's own repository or its live site.
 * No outcomes, testimonials or metrics are claimed.
 * Every project is presented as client work.
 */

type WorkAsset = { d: string; m: string; t: string };

const assets = import.meta.glob("/src/assets/work/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const asset = (slug: string): WorkAsset => ({
  d: assets[`/src/assets/work/${slug}-d.webp`],
  m: assets[`/src/assets/work/${slug}-m.webp`],
  t: assets[`/src/assets/work/${slug}-t.webp`],
});

export type WorkStatus = "Live" | "Preview build";
export type WorkLabel = "Client work";

export interface WorkProject {
  slug: string;
  name: string;
  sector: string;
  kind: "Service site" | "Ecommerce" | "Web app" | "Lead generation";
  place: string;
  status: WorkStatus;
  /** Owner-confirmed relationship. Left undefined until verified. */
  label?: WorkLabel;
  /** Set when two projects belong to the same business, so each page can say so. */
  family?: string;
  /** The two short lines shown on the index rows. */
  line: [string, string];
  /** Public URL when one is live and verified. */
  url?: string;
  domain: string;
  summary: string;
  built: string[];
  stack: string[];
  /** Brand tint used for UI accents on this project's card, never for 3D materials. */
  tint: string;
  img: WorkAsset;
}

export const projects: WorkProject[] = [
  {
    slug: "fixnow-mechanics",
    name: "FixNow Mechanics",
    sector: "Mobile mechanic",
    kind: "Service site",
    place: "Hemel Hempstead & Hertfordshire",
    status: "Live",
    label: "Client work",
    line: ["Mobile mechanic", "Hemel Hempstead & Herts"],
    family: "Part of FixNow: the mechanics service and the shop are one business with one team of engineers and a single shared backend, presented as two sites. This is the mechanics site; the shop is its own site.",
    url: "https://fixnowmechanics.co.uk",
    domain: "fixnowmechanics.co.uk",
    summary: "A mobile mechanic that comes to the customer, so the site is built around getting a quote fast and proving the area is covered.",
    built: [
      "Multi-step quote request with address validation",
      "A page for every area covered",
      "WhatsApp contact route on every page",
      "Mobile-first layout for people searching from the roadside",
    ],
    stack: ["React", "TypeScript", "Vite", "Tailwind"],
    tint: "#f5b800",
    img: asset("fixnow-mechanics"),
  },
  {
    slug: "fixnow-shop",
    name: "FixNow Shop",
    sector: "Car tech & accessories",
    kind: "Ecommerce",
    place: "UK delivery, fitting in Hertfordshire",
    status: "Live",
    label: "Client work",
    line: ["Car tech and accessories", "Online shop"],
    family: "Part of FixNow: the mechanics service and the shop are one business with one team of engineers and a single shared backend, presented as two sites. This is the shop; the mechanics site is its own site.",
    url: "https://shop.fixnowmechanics.co.uk",
    domain: "shop.fixnowmechanics.co.uk",
    summary: "A storefront for dash cams and car tech with two ways to buy: product only, or supplied and professionally fitted.",
    built: [
      "Catalogue, product pages and Shopify checkout handoff",
      "Supply-only or supply-and-fit journeys per product",
      "Buying guides and a dash cam finder",
      "Cart that survives a reload",
    ],
    stack: ["Next.js", "TypeScript", "Shopify"],
    tint: "#f5b800",
    img: asset("fixnow-shop"),
  },
  {
    slug: "readysold",
    name: "ReadySold",
    sector: "Car selling service",
    kind: "Lead generation",
    place: "London & surrounding areas",
    status: "Live",
    label: "Client work",
    line: ["Car selling service", "London and surrounding areas"],
    url: "https://readysold.vercel.app",
    domain: "readysold.vercel.app",
    summary: "A done-for-you car selling service. The page leads with a three-field valuation request and then explains the process.",
    built: [
      "Valuation request with registration, mileage and postcode",
      "Live pricing calculator",
      "Process and comparison sections",
      "Email notifications for every enquiry",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Resend"],
    tint: "#1d4ed8",
    img: asset("readysold"),
  },
  {
    slug: "stonebridge",
    name: "Stonebridge Construction",
    sector: "Construction",
    kind: "Service site",
    place: "Hertfordshire",
    status: "Live",
    label: "Client work",
    line: ["Extensions and renovations", "Hertfordshire"],
    url: "https://stonebridge-construction.co.uk",
    domain: "stonebridge-construction.co.uk",
    summary: "A quiet, editorial site for extensions, loft conversions and renovations where the build photography does the selling.",
    built: [
      "Dedicated pages for extensions, lofts and renovations",
      "Enquiry form delivered by email",
      "Editorial type and photography-led layout",
      "Cookie preferences and legal pages",
    ],
    stack: ["React", "TypeScript", "Vite", "Resend"],
    tint: "#a67c2e",
    img: asset("stonebridge"),
  },
  {
    slug: "true-to-detail",
    name: "True To Detail",
    sector: "Mobile car valeting",
    kind: "Service site",
    place: "Hemel Hempstead & Hertfordshire",
    status: "Live",
    label: "Client work",
    line: ["Mobile car valeting", "Hemel Hempstead & Herts"],
    url: "https://www.truetodetail.co.uk",
    domain: "truetodetail.co.uk",
    summary: "A bold, high-contrast valeting site with clear packages, area pages and a route into booking and the customer account.",
    built: [
      "Service pages for wash, interior, exterior and full detail",
      "Area pages for local search",
      "Quote and booking routes",
      "Link into a separate customer and job system",
    ],
    stack: ["Next.js", "TypeScript", "Supabase"],
    tint: "#ff4a1c",
    img: asset("true-to-detail"),
  },
  {
    slug: "brightlearn-tutoring",
    name: "BrightLearn Tutoring",
    sector: "Online maths tuition",
    kind: "Service site",
    place: "Online, KS2 to GCSE",
    status: "Live",
    label: "Client work",
    line: ["Online maths tuition", "KS2 to GCSE"],
    url: "https://www.brightlearntutoring.co.uk",
    domain: "brightlearntutoring.co.uk",
    summary: "A calm, friendly site for parents: what is taught, how lessons work, what it costs, and how to enquire.",
    built: [
      "Programme and pricing pages",
      "Guides, topic pages and a blog",
      "Short teaching clips from TikTok and YouTube",
      "Safeguarding and legal pages",
    ],
    stack: ["React", "TypeScript", "Vite", "Tailwind"],
    tint: "#2563eb",
    img: asset("brightlearn-tutoring"),
  },
  {
    slug: "quantum-biotesting",
    name: "Quantum BioTesting",
    sector: "Private blood testing",
    kind: "Service site",
    place: "UK & Ireland",
    status: "Preview build",
    label: "Client work",
    line: ["Private blood testing", "UK and Ireland"],
    domain: "In build",
    summary: "A clinical-but-human site for private blood tests: what is tested, where to go, and how a visit works.",
    built: [
      "Men's and women's health check pages",
      "Directory of clinic locations",
      "Enquiry form with server-side delivery",
      "Accessibility checks run across every page",
    ],
    stack: ["Astro", "TypeScript", "Resend"],
    tint: "#1d3a8a",
    img: asset("quantum-biotesting"),
  },
  {
    slug: "arf-mods",
    name: "ARF Mods",
    sector: "Automotive ecommerce",
    kind: "Ecommerce",
    place: "UK",
    status: "Live",
    label: "Client work",
    line: ["BMW parts and coding", "Online shop"],
    url: "https://arfmods.vercel.app",
    domain: "arfmods.vercel.app",
    summary: "A parts and coding shop for BMW owners, organised by category and by model.",
    built: [
      "Featured products and shop by category",
      "Shop by BMW series",
      "BMW coding service page",
      "Wishlist and basket",
    ],
    stack: ["React", "TypeScript", "Vite"],
    tint: "#ff4a1c",
    img: asset("arf-mods"),
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
