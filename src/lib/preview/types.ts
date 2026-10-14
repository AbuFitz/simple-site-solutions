export type CategoryId =
  | "plumbing"
  | "electrical"
  | "mechanic"
  | "cleaning"
  | "barber"
  | "tutoring"
  | "shop"
  | "builder"
  | "other";

export type ActionKind = "call" | "quote" | "book" | "visit";
export type LayoutId = "split" | "bold" | "editorial" | "centered";
export type TypeStyle = "sans" | "serif";

export interface Palette {
  id: string;
  name: string;
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  /** Text colour used on top of the accent. Derived and checked at build time, never hand-trusted. */
  accentInk?: string;
  dark?: boolean;
}

export interface ResolvedPalette extends Palette {
  accentInk: string;
  /** Accent when it is readable as large text on the page background, otherwise the ink colour. */
  accentText: string;
}

export interface ServiceItem {
  title: string;
  blurb: string;
}

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  /** Short noun phrase used in headlines, e.g. "plumbing and heating". */
  trade: string;
  /** Singular description used when prefilling the project form, e.g. "Plumber". */
  describe: string;
  keywords: string[];
  layouts: [LayoutId, LayoutId];
  type: TypeStyle;
  defaultAction: ActionKind;
  palettes: Palette[];
  /** Templates: {name}, {town}, {inTown} (" in Watford" or ""), {trade}. */
  headlines: string[];
  subheads: string[];
  services: ServiceItem[];
  steps: ServiceItem[];
  about: string[];
}

export interface PreviewInput {
  name: string;
  category: CategoryId;
  town: string;
  /** Optional UK postcode. When it resolves to a real place the map can show it. */
  postcode: string;
  /** Put a pin at the postcode. Off by default: many trades work from home and shouldn't publish an address. */
  pin: boolean;
  /** Other towns covered, listed on the page (up to six). */
  areas: string[];
  phone: string;
  email: string;
  action: ActionKind;
  /** Up to six services supplied by the owner. Empty means "use the category's examples". */
  services: string[];
  /** Covers more than one town, which changes the package recommendation. */
  multiArea: boolean;
  /** Which palette within the category (cycled by "try another style"). */
  seed: number;
}

export interface PreviewModel {
  category: CategoryConfig;
  layout: LayoutId;
  type: TypeStyle;
  palette: ResolvedPalette;
  name: string;
  monogram: string;
  town: string;
  headline: string;
  subhead: string;
  cta: { label: string; href: string; kind: ActionKind };
  secondaryCta?: { label: string; href: string };
  nav: string[];
  services: ServiceItem[];
  servicesAreExamples: boolean;
  steps: ServiceItem[];
  aboutHeading: string;
  aboutBody: string;
  contact: { phone?: string; phoneHref?: string; email?: string; town?: string; postcode?: string; pin: boolean };
  areas: string[];
  /** Plain-English list of what in this preview is placeholder, so nothing sample is mistaken for fact. */
  placeholders: string[];
}

export interface PackageRecommendation {
  id: "starter" | "sorted" | "works";
  reasons: string[];
}
