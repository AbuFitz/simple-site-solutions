/**
 * The shop catalogue: the single source for products, variants, prices, personalisation rules,
 * shipping and VAT assumptions. The browser reads it to display and to estimate totals; the serverless
 * API imports the same file to price every order, so a tampered cart can never change what is charged.
 *
 * No browser-only imports and no path aliases here: api/*.ts imports this file directly.
 *
 * STATUS: every amount below is a recommendation tagged `PRICING_STATUS = "owner-approval-required"`.
 * Nothing can be bought until the owner approves the prices and configures real Stripe Price IDs
 * (see docs/shop-launch.md). Do not invent Stripe IDs, stock or supplier capacity.
 */

export const PRICING_STATUS = "owner-approval-required" as const;

export type ShopCategory = "reviews" | "cards" | "signs" | "stickers" | "digital";
export type Fulfilment = "physical" | "digital";
export type VisualKey = "review-card" | "review-stand" | "review-kit" | "nfc-card" | "table-sign" | "stickers" | "digital-pack";
export type FieldRule = "googleReviewUrl" | "httpsUrl" | "wifiSecurity";

export interface PersonaliseField {
  id: string;
  label: string;
  hint?: string;
  placeholder?: string;
  kind: "text" | "url" | "select" | "password";
  required: boolean;
  max: number;
  rule?: FieldRule;
  options?: { value: string; label: string }[];
  /** Sensitive values are shown only to the owner for fulfilment and are never put in Stripe metadata. */
  sensitive?: boolean;
  /** Only ask for (and validate) this field when another field has one of these values. */
  showIf?: { field: string; in?: string[]; notIn?: string[] };
}

export interface Variant {
  id: string;
  label: string;
  detail?: string;
  /** Price in pence, GBP. */
  pricePence: number;
}

export interface Product {
  slug: string;
  name: string;
  category: ShopCategory;
  fulfilment: Fulfilment;
  tagline: string;
  summary: string;
  /** Plain-English description of how the product is used. */
  howItWorks: string[];
  includes: string[];
  notIncluded: string[];
  variants: Variant[];
  fields: PersonaliseField[];
  maxQty: number;
  visual: VisualKey;
  related: string[];
}

export const CATEGORIES: { id: ShopCategory; label: string; blurb: string }[] = [
  { id: "reviews", label: "Get reviews", blurb: "Make leaving a Google review a one-tap job." },
  { id: "cards", label: "Business cards", blurb: "Share your details with a tap or a scan." },
  { id: "signs", label: "Signs & stands", blurb: "Counter signs that send people to the right page." },
  { id: "stickers", label: "Stickers", blurb: "Window and vehicle QR stickers." },
  { id: "digital", label: "Digital", blurb: "Print-ready files, delivered by email." },
];

const nameField: PersonaliseField = {
  id: "businessName",
  label: "Business name to print",
  placeholder: "e.g. Smith's Plumbing",
  kind: "text",
  required: true,
  max: 40,
};

const reviewLinkField: PersonaliseField = {
  id: "reviewLink",
  label: "Your Google review link",
  hint: "Copy it from your Google Business Profile (Ask for reviews > Share review form). It starts with https://g.page/r/ or https://search.google.com/local/writereview.",
  placeholder: "https://g.page/r/...",
  kind: "url",
  required: true,
  max: 300,
  rule: "googleReviewUrl",
};

const linkField = (id: string, label: string, required = true, hint?: string): PersonaliseField => ({
  id,
  label,
  hint,
  placeholder: "https://",
  kind: "url",
  required,
  max: 300,
  rule: "httpsUrl",
});

export const products: Product[] = [
  {
    slug: "review-card",
    name: "NFC + QR Review Card",
    category: "reviews",
    fulfilment: "physical",
    tagline: "Tap or scan to leave a Google review.",
    summary: "A card with your business name, a QR code and a tap-to-open NFC chip, both pointing at your Google review form. Hand them out or leave them at the till.",
    howItWorks: [
      "A customer holds their phone near the card, or scans the QR code with their camera.",
      "Their phone opens your Google review form. They write the review themselves.",
      "The NFC chip needs no battery. The QR code is the fallback for phones that don't read tags.",
    ],
    includes: ["Printed card with your business name and QR code", "NFC chip programmed with your review link", "Your link checked to be a Google review link before we make it"],
    notIncluded: ["We don't write, ask for or filter reviews for you", "We don't create or verify your Google Business Profile", "No incentives or review gating: Google's rules forbid both"],
    variants: [
      { id: "x1", label: "1 card", pricePence: 1499 },
      { id: "x5", label: "Pack of 5", detail: "£11.80 each", pricePence: 5900 },
      { id: "x10", label: "Pack of 10", detail: "£9.90 each", pricePence: 9900 },
    ],
    fields: [nameField, reviewLinkField],
    maxQty: 10,
    visual: "review-card",
    related: ["review-stand", "review-kit"],
  },
  {
    slug: "review-stand",
    name: "Countertop Review Stand",
    category: "reviews",
    fulfilment: "physical",
    tagline: "A stand at the till that asks for the review.",
    summary: "A small free-standing sign with a QR code and an NFC chip that open your Google review form. Sits by the card reader, reception or the counter.",
    howItWorks: [
      "Customers tap their phone on the stand, or scan the QR code.",
      "Your Google review form opens on their phone.",
      "The stand stays on your counter, so you don't have to remember to hand anything out.",
    ],
    includes: ["Free-standing printed stand with your business name and QR code", "NFC chip programmed with your review link", "Your link checked to be a Google review link before we make it"],
    notIncluded: ["We don't write, ask for or filter reviews for you", "Not designed for outdoor use"],
    variants: [
      { id: "x1", label: "1 stand", pricePence: 2499 },
      { id: "x3", label: "Set of 3", detail: "£21.66 each", pricePence: 6499 },
    ],
    fields: [nameField, reviewLinkField],
    maxQty: 6,
    visual: "review-stand",
    related: ["review-card", "qr-table-sign"],
  },
  {
    slug: "review-kit",
    name: "Review Kit",
    category: "reviews",
    fulfilment: "physical",
    tagline: "A counter stand plus cards to hand out.",
    summary: "One countertop stand and a set of review cards, all pointing at the same Google review form. One order, one set of details.",
    howItWorks: [
      "Leave the stand by the till or reception so people can tap or scan as they pay.",
      "Hand a card to customers who say they were happy, so they can review later on their own phone.",
      "Everything opens the same Google review form. Customers write the review themselves.",
    ],
    includes: ["1 free-standing stand and the cards below, all with your business name and QR code", "NFC chips programmed with your review link", "Your link checked to be a Google review link before we make it"],
    notIncluded: ["We don't write, ask for or filter reviews for you", "No incentives or review gating: Google's rules forbid both"],
    variants: [
      { id: "s1c1", label: "1 stand + 1 card", detail: "Saves £5.98 against buying separately", pricePence: 3400 },
      { id: "s1c5", label: "1 stand + 5 cards", detail: "Saves £4.99 against buying separately", pricePence: 7900 },
    ],
    fields: [nameField, reviewLinkField],
    maxQty: 4,
    visual: "review-kit",
    related: ["qr-table-sign", "digital-qr-pack"],
  },
  {
    slug: "smart-business-card",
    name: "Smart NFC + QR Business Card",
    category: "cards",
    fulfilment: "physical",
    tagline: "A business card that opens your page when tapped.",
    summary: "A printed card with your name, role and QR code, plus an NFC chip that opens a link you choose: your website, a contact page or a booking page.",
    howItWorks: [
      "Someone taps their phone on the card, or scans the QR code.",
      "Their phone opens the link you chose.",
      "The link is fixed when the card is made. To point it somewhere new later, order a new card or use a link you control (for example a page on your website that you can change).",
    ],
    includes: ["Printed card with your name, role and QR code", "NFC chip programmed with your link"],
    notIncluded: ["We don't host a profile page. The card opens the link you give us"],
    variants: [
      { id: "x1", label: "1 card", pricePence: 1999 },
      { id: "x3", label: "Pack of 3", detail: "£16.66 each", pricePence: 4999 },
    ],
    fields: [
      { id: "fullName", label: "Name to print", placeholder: "e.g. Sam Smith", kind: "text", required: true, max: 40 },
      { id: "role", label: "Role or trade", placeholder: "e.g. Plumber & heating engineer", kind: "text", required: false, max: 50 },
      linkField("link", "Link the card opens", true, "Your website, contact page or booking page."),
    ],
    maxQty: 6,
    visual: "nfc-card",
    related: ["review-card", "sticker-pack"],
  },
  {
    slug: "qr-table-sign",
    name: "QR Table Sign",
    category: "signs",
    fulfilment: "physical",
    tagline: "One QR code to your Wi-Fi, menu, services or booking page.",
    summary: "A free-standing printed sign with your business name and a QR code. Choose what it does: join your Wi-Fi, open your menu, your services and prices, your booking page or a quote form.",
    howItWorks: [
      "A customer scans the QR code with their phone camera.",
      "Their phone joins your Wi-Fi, or opens the page you picked.",
      "If the code opens a page on your own website, you can change what's on that page later without reprinting the sign. A Wi-Fi code has your network name and password in it, so reprint it if you change the password.",
    ],
    includes: ["Printed stand with your business name, a heading for the chosen purpose and a QR code"],
    notIncluded: [
      "QR only: no NFC tap on this sign, because QR works on every phone",
      "We don't host the page. The sign links to a page you give us (or one on your OneSimpleSite website)",
      "For Wi-Fi, use a guest network: the password is printed in the code, so anyone who sees the sign can read it",
    ],
    variants: [
      { id: "a6", label: "A6 stand (105 x 148 mm)", pricePence: 1599 },
      { id: "a5", label: "A5 stand (148 x 210 mm)", pricePence: 2199 },
    ],
    fields: [
      {
        id: "purpose",
        label: "What should the sign do?",
        kind: "select",
        required: true,
        max: 10,
        options: [
          { value: "menu", label: "Open our menu" },
          { value: "services", label: "Open our services and prices" },
          { value: "booking", label: "Open our booking page" },
          { value: "quote", label: "Open a quote form" },
          { value: "wifi", label: "Join our Wi-Fi" },
        ],
      },
      nameField,
      { ...linkField("link", "Page the sign opens"), showIf: { field: "purpose", notIn: ["wifi"] } },
      { id: "ssid", label: "Wi-Fi network name", placeholder: "e.g. SmithPlumbing-Guest", kind: "text", required: true, max: 32, showIf: { field: "purpose", in: ["wifi"] } },
      {
        id: "security",
        label: "Wi-Fi security type",
        kind: "select",
        required: true,
        max: 10,
        showIf: { field: "purpose", in: ["wifi"] },
        options: [
          { value: "WPA", label: "WPA / WPA2 / WPA3 (most networks)" },
          { value: "WEP", label: "WEP (old)" },
          { value: "nopass", label: "No password" },
        ],
      },
      {
        id: "password",
        label: "Wi-Fi password",
        hint: "Leave empty for no password. It is printed in the QR code and only used to make your sign; we remove it from our records once your order is handed off.",
        kind: "password",
        required: false,
        max: 63,
        sensitive: true,
        showIf: { field: "purpose", in: ["wifi"] },
      },
    ],
    maxQty: 6,
    visual: "table-sign",
    related: ["review-stand", "sticker-pack"],
  },
  {
    slug: "sticker-pack",
    name: "Window & Van QR Sticker Pack",
    category: "stickers",
    fulfilment: "physical",
    tagline: "Your QR code on glass and bodywork.",
    summary: "Printed vinyl stickers with your business name and a QR code to the page you choose. For shop windows, vans and equipment.",
    howItWorks: [
      "Stick it where people will see it.",
      "Anyone can scan the code with their camera to open your page.",
      "Keep the code large enough and clear of glare. A phone should read it from about ten times the code's width away.",
    ],
    includes: ["Printed vinyl stickers with your business name and QR code"],
    notIncluded: ["Not a full vehicle wrap or lettering", "No installation"],
    variants: [
      { id: "window4", label: "Window pack: 4 x 100 mm", pricePence: 1499 },
      { id: "van2", label: "Van pack: 2 x 200 mm", pricePence: 2499 },
    ],
    fields: [nameField, linkField("link", "Page the sticker opens")],
    maxQty: 5,
    visual: "stickers",
    related: ["smart-business-card", "review-card"],
  },
  {
    slug: "digital-qr-pack",
    name: "Digital QR Starter Pack",
    category: "digital",
    fulfilment: "digital",
    tagline: "Print-ready QR codes by email.",
    summary: "Up to three QR codes for links you choose (for example your website, review form and booking page) as print-ready SVG and PNG files, with a one-page guide to sizing and placing them.",
    howItWorks: [
      "You give us up to three links.",
      "We email you a QR code for each as an SVG (scales to any size) and a high-resolution PNG.",
      "The codes are static: they always open the link you gave us, and keep working without us. To point one somewhere new, make a new code.",
    ],
    includes: ["QR code files (SVG and PNG) for up to three links", "One-page sizing and placement guide"],
    notIncluded: ["No printing", "No tracking or scan statistics", "No design of signs or posters"],
    variants: [{ id: "pack", label: "Up to 3 QR codes", pricePence: 999 }],
    fields: [
      linkField("url1", "Link for QR code 1", true),
      linkField("url2", "Link for QR code 2", false),
      linkField("url3", "Link for QR code 3", false),
    ],
    maxQty: 1,
    visual: "digital-pack",
    related: ["review-card", "qr-table-sign"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getVariant = (p: Product, variantId: string) => p.variants.find((v) => v.id === variantId);
export const fromPricePence = (p: Product) => Math.min(...p.variants.map((v) => v.pricePence));

/** Environment-variable stem for a variant: review-card + x5 -> REVIEW_CARD_X5 (SHOP_PRICE_*, SHOP_READY_*, SHOP_STOCK_*). */
export const skuKey = (slug: string, variantId: string) => `${slug}_${variantId}`.toUpperCase().replace(/[^A-Z0-9]+/g, "_");

/** Shipping and VAT assumptions. PROVISIONAL: owner to confirm before ordering opens. */
export const SHIPPING = {
  /** UK mainland only for launch. */
  countries: ["GB"] as const,
  label: "UK standard delivery",
  flatPence: 395,
  /** Free delivery when the physical items total at least this. */
  freeOverPence: 5000,
  /** Digital-only orders have no delivery charge or address. */
  digitalPence: 0,
};

export const VAT_NOTE =
  "Prices are in pounds sterling and are the amount you pay. VAT treatment is still to be confirmed by the owner, so no separate VAT line is shown yet.";

export const pounds = (pence: number) => `£${(pence / 100).toFixed(2)}`;

export interface PricedLineInput {
  slug: string;
  variantId: string;
  qty: number;
}

export interface Totals {
  subtotalPence: number;
  shippingPence: number;
  totalPence: number;
  hasPhysical: boolean;
  /** Unknown products or variants in the input. */
  invalid: PricedLineInput[];
}

/** Price a list of lines from the catalogue. Never reads a price from the caller. */
export function priceLines(lines: PricedLineInput[]): Totals {
  let subtotal = 0;
  let physicalSubtotal = 0;
  let hasPhysical = false;
  const invalid: PricedLineInput[] = [];
  for (const l of lines) {
    const p = getProduct(l.slug);
    const v = p && getVariant(p, l.variantId);
    if (!p || !v || !Number.isInteger(l.qty) || l.qty < 1 || l.qty > p.maxQty) {
      invalid.push(l);
      continue;
    }
    const amount = v.pricePence * l.qty;
    subtotal += amount;
    if (p.fulfilment === "physical") {
      hasPhysical = true;
      physicalSubtotal += amount;
    }
  }
  const shipping = hasPhysical ? (physicalSubtotal >= SHIPPING.freeOverPence ? 0 : SHIPPING.flatPence) : SHIPPING.digitalPence;
  return { subtotalPence: subtotal, shippingPence: shipping, totalPence: subtotal + shipping, hasPhysical, invalid };
}

/** Which products to suggest for each business type from the preview generator (src/lib/preview/categories.ts). */
export const SUGGESTED_BY_BUSINESS: Record<string, string[]> = {
  plumbing: ["sticker-pack", "review-card", "smart-business-card"],
  electrical: ["sticker-pack", "review-card", "smart-business-card"],
  mechanic: ["sticker-pack", "review-card", "qr-table-sign"],
  cleaning: ["review-card", "sticker-pack", "smart-business-card"],
  barber: ["review-kit", "qr-table-sign", "smart-business-card"],
  tutoring: ["smart-business-card", "review-card", "digital-qr-pack"],
  shop: ["review-kit", "qr-table-sign", "sticker-pack"],
  builder: ["sticker-pack", "smart-business-card", "review-card"],
  other: ["review-card", "digital-qr-pack", "smart-business-card"],
};
