export interface PackageTier {
  id: "starter" | "sorted" | "works";
  name: string;
  price: string;
  tagline: string;
  ideal: string;
  /** Our suggested starting point for most growing businesses. This is a recommendation, not a sales statistic. */
  recommended?: boolean;
  /** Maximum pages included. Drives the page-stack height in the 3D pricing scene. */
  pages: number;
  features: string[];
  delivery: string;
  payment: string;
}

export const packages: PackageTier[] = [
  {
    id: "starter",
    name: "The Starter",
    price: "199",
    tagline: "Get online properly",
    ideal: "New businesses & sole traders",
    pages: 3,
    features: [
      "Up to 3 pages",
      "Professional copywriting",
      "Mobile-first design",
      "Contact form + WhatsApp",
      "Google Maps",
      "Basic SEO",
      "SSL + Speed optimised",
      "1 revision round",
    ],
    delivery: "5–7 days",
    payment: "Upfront",
  },
  {
    id: "sorted",
    name: "The Sorted",
    price: "399",
    tagline: "Look established, win trust",
    ideal: "Growing businesses",
    recommended: true,
    pages: 6,
    features: [
      "Up to 6 pages",
      "Everything in Starter, plus:",
      "Conversion-focused layout",
      "Reviews & trust signals",
      "Booking system included",
      "Full on-page SEO",
      "Free domain (1st year)",
      "Business email setup",
      "2 revision rounds",
    ],
    delivery: "7–10 days",
    payment: "50% upfront",
  },
  {
    id: "works",
    name: "The Works",
    price: "649",
    tagline: "Compete seriously, scale",
    ideal: "Established businesses",
    pages: 10,
    features: [
      "Up to 10 pages",
      "Everything in Sorted, plus:",
      "SEO-led architecture",
      "Location pages for local SEO",
      "Blog setup + 1 post",
      "Google Analytics setup",
      "Advanced booking",
      "Full legal pages",
      "3 revision rounds",
    ],
    delivery: "10–14 days",
    payment: "50% upfront",
  },
];

export interface Addon {
  id: string;
  name: string;
  price: string;
}

export const addons: Addon[] = [
  { id: "logo", name: "Logo Design", price: "49" },
  { id: "google-business", name: "Google Business Profile Setup", price: "39" },
  { id: "booking", name: "Booking System Setup", price: "39" },
  { id: "email-templates", name: "Extra Email Templates (×3)", price: "29" },
  { id: "seo-audit", name: "SEO Audit Report", price: "59" },
  { id: "legal-pages", name: "Legal Pages Pack", price: "19" },
];

export const packageIds = packages.map((p) => p.id) as PackageTier["id"][];
export const getPackage = (id: string) => packages.find((p) => p.id === id);
export const getAddon = (id: string) => addons.find((a) => a.id === id);

export const hosting = {
  name: "Keep It Running",
  price: "19",
  features: [
    "Website hosting & domain",
    "SSL certificate",
    "Weekly backups",
    "Security monitoring",
    "Up to 5 content updates/month",
    "Priority support",
  ],
};
