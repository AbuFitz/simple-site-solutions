/**
 * Single source for business facts that appear in more than one place.
 * Anything marked PROVISIONAL is owner-supplied in this repository but not independently
 * confirmed; see docs/fact-ledger.md before changing or relying on it.
 */
export const SITE = {
  name: "OneSimpleSite",
  url: "https://onesimplesite.co.uk",
  /** PROVISIONAL: the address used by the existing forms and footer. Confirm the mailbox is monitored. */
  email: "hello@onesimplesite.co.uk",
  country: "United Kingdom",
} as const;

/**
 * Delivery is only ever described per package, counted from when we have the customer's content.
 * PROVISIONAL: owner-set ranges, pending the pricing review (docs/pricing-review.md).
 */
export const DELIVERY_OVERALL = "5–14 days";
export const DELIVERY_NOTE = "Estimated from when we have your content. Late content moves the date.";

/** We do not promise a reply time. Revisit once the owner confirms one they can always keep. */
export const REPLY_COPY = "We'll reply to you by email.";

/** Paying online is switched on server-side only; the UI reads this from /api/checkout-status. */
export const PAGES_FOR_SITEMAP = [
  "/",
  "/work",
  "/packages",
  "/how-it-works",
  "/preview",
  "/faq",
  "/start",
  "/contact",
  "/about",
  "/about/farhan-m",
  "/about/matthew-r",
  "/about/abukar-s",
  "/privacy",
  "/terms",
  "/cookies",
  "/accessibility",
] as const;

/**
 * Facebook is confirmed (owner-supplied profile link). Instagram, TikTok and LinkedIn assume the @onesimplesite handle and
 * are PROVISIONAL: confirm each URL (LinkedIn may use a different company slug). These also feed the Organization sameAs.
 */
export const SOCIAL = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/onesimplesite/" },
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/profile.php?id=61587530671229" },
  { id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@onesimplesite" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/onesimplesite/" },
] as const;
