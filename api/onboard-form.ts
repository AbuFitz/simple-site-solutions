import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";
import { clientIp, json, oneLine, originAllowed } from "./_lib/http.js";
import { rateLimit } from "./_lib/rateLimit.js";
import { button, foot as footBlock, lead, row, section, shellClose, shellOpen, title } from "./_lib/emailKit.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "OneSimpleSite <noreply@onesimplesite.co.uk>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@onesimplesite.co.uk";
const BASE_URL = "https://onesimplesite.co.uk";

interface OnboardFormData {
  // Step 1: Your Details
  contactName: string;
  email: string;
  phone: string;
  businessName: string;
  tradingName: string;
  businessType: string;

  // Step 2: Location & Contact
  businessAddress: string;
  isLocationBased: string;
  serviceAreas: string;
  showAddressPublicly: boolean;
  publicPhone: string;
  publicEmail: string;
  whatsappNumber: string;
  preferredContact: string;
  // Social media
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  otherSocialUrl: string;

  // Step 3: About Your Business
  whatYouDo: string;
  idealCustomers: string;
  whyChooseYou: string;
  tonePreference: string;

  // Step 4: Services
  services: string;
  showPricing: string;
  pricingInfo: string;

  // Step 5: Branding & Images
  hasLogo: string;
  wantsLogoDesign: string;
  logoStyle: string;
  logoInspiration: string;
  logoColours: string;
  brandColors: string;
  stylePreference: string;
  hasPhotos: string;
  useStockImages: boolean;

  // Step 6: Trust & Proof
  hasGoogleBusiness: string;
  wantsGoogleBusinessSetup: string;
  googleBusinessLink: string;
  testimonials: string;
  certifications: string;

  // Step 7: Website Preferences
  mainCTA: string[];
  primaryLocation: string;
  keyServices: string;
  extraPages: string;
  needsBookingSystem: string;
  bookingDetails: string;

  // Step 8: Final Details
  mustInclude: string;
  mustNotInclude: string;
  additionalNotes: string;
  confirmedPackage: string;
  selectedAddons: string[];
  hasDomain: string;
  domainName: string;
  wantsDomain: string;
  hasEmail: string;
  wantsEmail: string;
  hostingPlan: string;
}

function getPackageInfo(packageId: string): { name: string; price: string } {
  const packages: Record<string, { name: string; price: string }> = {
    starter: { name: "The Starter", price: "£199" },
    sorted: { name: "The Sorted", price: "£399" },
    works: { name: "The Works", price: "£649" },
  };
  return packages[packageId] || { name: packageId, price: "" };
}

function getAddonNames(addonIds: string[]): string {
  const addonMap: Record<string, string> = {
    logo: "Logo Design (£49)",
    "google-business": "Google Business Profile Setup (£39)",
    booking: "Booking System Setup (£39)",
    "email-templates": "Extra Email Templates ×3 (£29)",
    "seo-audit": "SEO Audit Report (£59)",
    "legal-pages": "Legal Pages Pack (£19)",
  };
  if (addonIds.length === 0) return "None";
  return addonIds.map((id) => addonMap[id] || id).join(", ");
}

function getHostingPlanInfo(planId: string): string {
  const plans: Record<string, string> = {
    "keep-it-running": "Keep It Running (£19/month)",
    "self-host": "Self-hosting",
  };
  return plans[planId] || planId || "Not specified";
}

function getLogoStyleLabel(styleId: string): string {
  const styles: Record<string, string> = {
    modern: "Modern & Minimal",
    classic: "Classic & Traditional",
    bold: "Bold & Eye-catching",
    playful: "Playful & Friendly",
    "no-preference": "No Preference",
  };
  return styles[styleId] || styleId || "Not specified";
}

function getToneLabel(toneId: string): string {
  const tones: Record<string, string> = {
    professional: "Professional",
    friendly: "Friendly & Approachable",
    premium: "Premium & High-End",
    straightforward: "Straightforward & Direct",
  };
  return tones[toneId] || toneId || "Not specified";
}

function getStyleLabel(styleId: string): string {
  const styles: Record<string, string> = {
    modern: "Modern & Clean",
    minimal: "Minimal",
    bold: "Bold & Eye-catching",
    classic: "Classic & Traditional",
    "no-preference": "No Preference",
  };
  return styles[styleId] || styleId || "Not specified";
}

function getCTALabels(ctaIds: string[]): string {
  const ctaMap: Record<string, string> = {
    call: "Call Now",
    quote: "Request a Quote",
    book: "Book an Appointment",
    whatsapp: "Message on WhatsApp",
    "contact-form": "Contact Form",
  };
  if (ctaIds.length === 0) return "Not specified";
  return ctaIds.map((id) => ctaMap[id] || id).join(", ");
}

function getPreferredContactLabel(contactId: string): string {
  const options: Record<string, string> = {
    phone: "Phone Call",
    email: "Email",
    whatsapp: "WhatsApp",
    form: "Contact Form",
  };
  return options[contactId] || contactId || "Not specified";
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

// Emails use the shared dark kit (api/_lib/emailKit.ts): simple, no logo, same look as the site.
const ack = (v: string | undefined | null, fallback = "Not specified") => (v && v.trim() ? escapeHtml(v) : fallback);
const yes = (v: boolean | undefined, no: string) => (v ? "Yes" : no);
const rowIf = (label: string, value: string | undefined | null) => (value && String(value).trim() ? row(label, value as string) : "");

function clientEmailHtml(data: OnboardFormData): string {
  const pkg = getPackageInfo(data.confirmedPackage);
  const extras = [
    data.selectedAddons && data.selectedAddons.length > 0 ? row("Add-ons", getAddonNames(data.selectedAddons)) : "",
    data.hostingPlan && data.hostingPlan !== "self-host" ? row("Hosting", getHostingPlanInfo(data.hostingPlan)) : "",
  ].join("");

  return `${shellOpen}
${title(`All done, ${escapeHtml(data.contactName)}.`)}
${lead(`Thanks for completing the form for <span style="color:#EFEBE3;">${escapeHtml(data.businessName)}</span>. We have what we need to start.`)}
${row("Package", `${pkg.name} (${pkg.price})`)}
${extras}
${row("Service areas", ack(data.serviceAreas))}
${row("Primary location", ack(data.primaryLocation))}
${section("What happens next")}
${row("01", "We review your details and email you with next steps.")}
${row("02", "We confirm everything with you and collect payment.")}
${row("03", "Once payment is received, we start building.")}
${row("04", "You get your website to review within a few days.")}
<tr><td style="padding:32px 0;font-size:17px;line-height:1.6;color:#C9CBC6;">Need to add something? Reply to this email.<br><span style="color:#EFEBE3;">The OneSimpleSite team</span></td></tr>
${footBlock("Sent because you completed our client onboarding form.")}
${shellClose}`;
}

function adminEmailHtml(data: OnboardFormData): string {
  const pkg = getPackageInfo(data.confirmedPackage);
  const timestamp = new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/London" });
  const mail = (e: string) => `<a href="mailto:${escapeHtml(e)}" style="color:#4FD9A0;">${escapeHtml(e)}</a>`;
  const tel = (t: string) => `<a href="tel:${escapeHtml(t)}" style="color:#4FD9A0;">${escapeHtml(t)}</a>`;
  const href = (u: string) => `<a href="${escapeHtml(u)}" style="color:#4FD9A0;">${escapeHtml(u)}</a>`;
  const socials = [
    ["Facebook", data.facebookUrl], ["Instagram", data.instagramUrl], ["TikTok", data.tiktokUrl], ["LinkedIn", data.linkedinUrl],
    ["YouTube", data.youtubeUrl], ["X", data.twitterUrl], ["Other", data.otherSocialUrl],
  ].filter(([, u]) => u).map(([n, u]) => `${n}: ${href(u as string)}`).join("<br>");

  const logo = data.hasLogo === "No, I need one" ? [
    row("Wants logo design", ack(data.wantsLogoDesign)),
    data.wantsLogoDesign === "Yes" ? row("Logo style", getLogoStyleLabel(data.logoStyle)) : "",
    data.wantsLogoDesign === "Yes" ? rowIf("Logo inspiration", data.logoInspiration && escapeHtml(data.logoInspiration)) : "",
    data.wantsLogoDesign === "Yes" ? rowIf("Logo colours", data.logoColours && escapeHtml(data.logoColours)) : "",
  ].join("") : "";

  const domain = data.hasDomain === "Yes" ? `Has domain: ${ack(data.domainName, "Not provided")}`
    : data.hasDomain === "No" ? `Needs domain: ${data.wantsDomain === "Yes" ? "Yes, help me get one" : "Will sort themselves"}` : "Not specified";
  const proEmail = data.hasEmail === "Yes" ? "Already has professional email"
    : data.hasEmail === "No" ? `Needs email: ${data.wantsEmail === "Yes" ? "Yes, set one up" : "No thanks"}` : "Not specified";

  return `${shellOpen}
${title("New client", 36)}
${lead(`<span style="color:#EFEBE3;">${escapeHtml(data.contactName)}</span> from <span style="color:#EFEBE3;">${escapeHtml(data.businessName)}</span> has completed onboarding.`)}
${row("Package", `${pkg.name} (${pkg.price})`)}

${section("1 · Contact")}
${row("Name", escapeHtml(data.contactName))}
${row("Email", mail(data.email))}
${row("Phone", tel(data.phone))}
${row("Business", escapeHtml(data.businessName))}
${rowIf("Trading name", data.tradingName && escapeHtml(data.tradingName))}
${row("Business type", ack(data.businessType))}

${section("2 · Location and public contact")}
${rowIf("Address", data.businessAddress && escapeHtml(data.businessAddress))}
${row("Location based / mobile", ack(data.isLocationBased))}
${row("Service areas", ack(data.serviceAreas))}
${row("Show full address", yes(data.showAddressPublicly, "No, just show area"))}
${row("Public phone", ack(data.publicPhone))}
${row("Public email", ack(data.publicEmail))}
${rowIf("WhatsApp", data.whatsappNumber && escapeHtml(data.whatsappNumber))}
${row("Preferred contact", getPreferredContactLabel(data.preferredContact))}
${rowIf("Social", socials)}

${section("3 · About the business")}
${row("What they do", ack(data.whatYouDo))}
${row("Ideal customers", ack(data.idealCustomers))}
${rowIf("Why choose them", data.whyChooseYou && escapeHtml(data.whyChooseYou))}
${row("Tone", getToneLabel(data.tonePreference))}

${section("4 · Services")}
${row("Services offered", ack(data.services))}
${row("Show pricing", ack(data.showPricing))}
${rowIf("Pricing information", data.pricingInfo && escapeHtml(data.pricingInfo))}

${section("5 · Branding and images")}
${row("Has logo", ack(data.hasLogo))}
${logo}
${rowIf("Brand colours", data.brandColors && escapeHtml(data.brandColors))}
${row("Style", getStyleLabel(data.stylePreference))}
${row("Has photos", ack(data.hasPhotos))}
${row("Stock images allowed", yes(data.useStockImages, "No, only their photos"))}

${section("6 · Trust and proof")}
${row("Google Business Profile", ack(data.hasGoogleBusiness))}
${data.hasGoogleBusiness === "Yes" && data.googleBusinessLink ? row("Profile link", href(data.googleBusinessLink)) : ""}
${(data.hasGoogleBusiness === "No" || data.hasGoogleBusiness === "Not sure") && data.wantsGoogleBusinessSetup ? row("Wants profile setup", `${escapeHtml(data.wantsGoogleBusinessSetup)}${data.wantsGoogleBusinessSetup === "Yes" ? " (£39 add-on)" : ""}`) : ""}
${rowIf("Testimonials", data.testimonials && escapeHtml(data.testimonials))}
${rowIf("Certifications", data.certifications && escapeHtml(data.certifications))}

${section("7 · Website preferences")}
${row("Main calls to action", getCTALabels(data.mainCTA))}
${row("Primary location (SEO)", ack(data.primaryLocation))}
${rowIf("Key services to rank for", data.keyServices && escapeHtml(data.keyServices))}
${rowIf("Extra pages", data.extraPages && escapeHtml(data.extraPages))}
${row("Booking system", `${ack(data.needsBookingSystem)}${data.needsBookingSystem === "Yes" ? " (£39 add-on)" : ""}`)}
${data.needsBookingSystem === "Yes" ? rowIf("Booking details", data.bookingDetails && escapeHtml(data.bookingDetails)) : ""}

${section("8 · Final details")}
${row("Add-ons", getAddonNames(data.selectedAddons || []))}
${row("Domain", domain)}
${row("Professional email", proEmail)}
${row("Hosting plan", getHostingPlanInfo(data.hostingPlan))}
${rowIf("Must include", data.mustInclude && escapeHtml(data.mustInclude))}
${rowIf("Must not include", data.mustNotInclude && escapeHtml(data.mustNotInclude))}
${rowIf("Notes", data.additionalNotes && escapeHtml(data.additionalNotes))}

${button(`mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(`Your website project - ${data.businessName}`)}`, `Reply to ${escapeHtml(data.contactName)}`)}
<tr><td style="padding:16px 0 32px;font-size:13px;color:#8A938E;">Received ${timestamp}</td></tr>
${footBlock("Owner copy of a client onboarding form.")}
${shellClose}`;
}


const emailOk = z.string().trim().email().max(254);

/** Every value in the intake is free text; cap its size and shape so one request can't be abusive. */
function sanitiseIntake(body: unknown): OnboardFormData | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const out: Record<string, unknown> = {};
  let total = 0;
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (k.length > 60) return null;
    if (typeof v === "string") {
      if (v.length > 5000) return null;
      total += v.length;
      out[k] = v;
    } else if (Array.isArray(v) && v.length <= 50 && v.every((x) => typeof x === "string" && x.length <= 200)) {
      out[k] = v;
    } else if (typeof v === "boolean" || typeof v === "number" || v == null) {
      out[k] = v;
    } else {
      return null;
    }
  }
  if (total > 40_000) return null;
  return out as unknown as OnboardFormData;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  if (!originAllowed(req)) return json(res, 403, { error: "Forbidden" });

  const rl = rateLimit(`onboard:${clientIp(req)}`, 5, 10 * 60_000);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return json(res, 429, { error: "Too many attempts. Please wait a few minutes and try again." });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return json(res, 503, { error: "Sending isn't available right now. Please email us instead." });
  }

  const data = sanitiseIntake(req.body);
  if (!data || !emailOk.safeParse(data.email).success || !data.contactName?.trim() || !data.businessName?.trim()) {
    return json(res, 400, { error: "Please check your name, business name and email." });
  }

  try {
    const pkg = getPackageInfo(data.confirmedPackage);

    // The owner's copy is the record, so it goes first and must succeed.
    const admin = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: oneLine(`New Client: ${data.businessName} - ${pkg.name} (${pkg.price})`),
      html: adminEmailHtml(data),
    });
    if (admin.error) {
      console.error("Failed to send admin notification:", admin.error.message);
      return json(res, 502, { error: "We couldn't send your details. Please try again or email us." });
    }

    const client = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: oneLine(`All done - ${pkg.name} Package`),
      html: clientEmailHtml(data),
    });
    if (client.error) console.error("Failed to send client copy:", client.error.message);

    return json(res, 200, { success: true, copySent: !client.error });
  } catch (error) {
    console.error("onboard-form failed:", error instanceof Error ? error.message : error);
    return json(res, 502, { error: "We couldn't send your details. Please try again or email us." });
  }
}
