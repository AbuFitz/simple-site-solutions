import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

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

// Client confirmation email - simple and reassuring
function clientEmailHtml(data: OnboardFormData): string {
  const pkg = getPackageInfo(data.confirmedPackage);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; border-bottom: 2px solid #e5e5e5;">
              <a href="${BASE_URL}" style="font-size: 24px; font-weight: 700; color: #000000; text-decoration: none;">
                one<span style="color: #3BA875;">simple</span>site
              </a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="font-size: 24px; font-weight: 700; color: #000000; margin: 0 0 16px 0;">All done, ${escapeHtml(data.contactName)}!</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                Thanks for completing the onboarding form for <strong>${escapeHtml(data.businessName)}</strong>. We've got everything we need to get started on your new website.
              </p>

              <div style="background-color: #ecfdf5; border: 1px solid #3BA875; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <div style="font-weight: 600; color: #3BA875; font-size: 16px; margin-bottom: 8px;">
                  ${pkg.name} Package (${pkg.price})
                </div>
                ${data.selectedAddons && data.selectedAddons.length > 0 ? `
                <div style="font-size: 14px; color: #374151; margin-bottom: 4px;">
                  <strong>Add-ons:</strong> ${getAddonNames(data.selectedAddons)}
                </div>
                ` : ""}
                ${data.hostingPlan && data.hostingPlan !== "self-host" ? `
                <div style="font-size: 14px; color: #374151;">
                  <strong>Hosting:</strong> ${getHostingPlanInfo(data.hostingPlan)}
                </div>
                ` : ""}
              </div>

              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">Here's what happens next:</p>
              <ol style="font-size: 16px; line-height: 1.8; color: #374151; margin: 0 0 24px 0; padding-left: 20px;">
                <li>We'll review your details over the next 24 hours</li>
                <li>We'll reach out to confirm everything and collect payment</li>
                <li>Once payment is received, we'll start building your website</li>
                <li>You'll receive your website for review within a few days</li>
              </ol>

              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">What You Submitted</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Business</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.businessName)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Service Areas</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.serviceAreas)}</div>
                </div>
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Primary Location (SEO)</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.primaryLocation) || "Not specified"}</div>
                </div>
              </div>

              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                If you need to add anything or have questions, email us at <a href="mailto:support@onesimplesite.co.uk" style="color: #3BA875; text-decoration: none;">support@onesimplesite.co.uk</a>.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 32px 0 0 0;">
                Speak soon,<br><strong>The OneSimpleSite Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px 40px; border-top: 1px solid #e5e5e5;">
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0;">This email was sent because you completed our client onboarding form.</p>
              <p style="margin: 0 0 16px 0;">
                <a href="${BASE_URL}/faq" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">FAQ</a>
                <a href="${BASE_URL}/terms" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">Terms of Service</a>
                <a href="${BASE_URL}/privacy" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">Privacy Policy</a>
                <a href="${BASE_URL}/cookies" style="font-size: 14px; color: #3BA875; text-decoration: none;">Cookie Policy</a>
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0;">
                <a href="mailto:support@onesimplesite.co.uk" style="color: #3BA875; text-decoration: none;">support@onesimplesite.co.uk</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">© ${new Date().getFullYear()} OneSimpleSite. Made for local UK businesses.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Admin notification email with ALL details
function adminEmailHtml(data: OnboardFormData): string {
  const pkg = getPackageInfo(data.confirmedPackage);
  const timestamp = new Date().toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; border-bottom: 2px solid #e5e5e5;">
              <a href="${BASE_URL}" style="font-size: 24px; font-weight: 700; color: #000000; text-decoration: none;">
                one<span style="color: #3BA875;">simple</span>site
              </a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="font-size: 24px; font-weight: 700; color: #000000; margin: 0 0 16px 0;">New Client Onboarded</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                <strong>${escapeHtml(data.contactName)}</strong> from <strong>${escapeHtml(data.businessName)}</strong> has completed the onboarding form.
              </p>

              <div style="background-color: #ecfdf5; border: 1px solid #3BA875; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <div style="font-weight: 600; color: #3BA875; font-size: 16px;">
                  ${pkg.name} Package (${pkg.price})
                </div>
              </div>

              <!-- SECTION 1: Contact Details -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">1. Contact Details</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Contact Name</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.contactName)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Email</div>
                  <div style="font-size: 16px;"><a href="mailto:${escapeHtml(data.email)}" style="color: #3BA875;">${escapeHtml(data.email)}</a></div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Phone</div>
                  <div style="font-size: 16px;"><a href="tel:${escapeHtml(data.phone)}" style="color: #3BA875;">${escapeHtml(data.phone)}</a></div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Business Name</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.businessName)}</div>
                </div>
                ${data.tradingName ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Trading Name</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.tradingName)}</div>
                </div>
                ` : ""}
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Business Type</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.businessType) || "Not specified"}</div>
                </div>
              </div>

              <!-- SECTION 2: Location & Public Contact -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">2. Location & Public Contact</div>
                ${data.businessAddress ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Business Address</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.businessAddress)}</div>
                </div>
                ` : ""}
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Location Based / Mobile</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.isLocationBased) || "Not specified"}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Service Areas</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.serviceAreas)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Show Full Address on Website</div>
                  <div style="font-size: 16px; color: #000000;">${data.showAddressPublicly ? "Yes" : "No, just show area"}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Public Phone</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.publicPhone)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Public Email</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.publicEmail)}</div>
                </div>
                ${data.whatsappNumber ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">WhatsApp Number</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.whatsappNumber)}</div>
                </div>
                ` : ""}
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Preferred Contact Method</div>
                  <div style="font-size: 16px; color: #000000;">${getPreferredContactLabel(data.preferredContact)}</div>
                </div>
                ${data.facebookUrl || data.instagramUrl || data.tiktokUrl || data.linkedinUrl || data.youtubeUrl || data.twitterUrl || data.otherSocialUrl ? `
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Social Media</div>
                  <div style="font-size: 14px; color: #000000;">
                    ${data.facebookUrl ? `Facebook: <a href="${escapeHtml(data.facebookUrl)}" style="color: #3BA875;">${escapeHtml(data.facebookUrl)}</a><br>` : ""}
                    ${data.instagramUrl ? `Instagram: <a href="${escapeHtml(data.instagramUrl)}" style="color: #3BA875;">${escapeHtml(data.instagramUrl)}</a><br>` : ""}
                    ${data.tiktokUrl ? `TikTok: <a href="${escapeHtml(data.tiktokUrl)}" style="color: #3BA875;">${escapeHtml(data.tiktokUrl)}</a><br>` : ""}
                    ${data.linkedinUrl ? `LinkedIn: <a href="${escapeHtml(data.linkedinUrl)}" style="color: #3BA875;">${escapeHtml(data.linkedinUrl)}</a><br>` : ""}
                    ${data.youtubeUrl ? `YouTube: <a href="${escapeHtml(data.youtubeUrl)}" style="color: #3BA875;">${escapeHtml(data.youtubeUrl)}</a><br>` : ""}
                    ${data.twitterUrl ? `X (Twitter): <a href="${escapeHtml(data.twitterUrl)}" style="color: #3BA875;">${escapeHtml(data.twitterUrl)}</a><br>` : ""}
                    ${data.otherSocialUrl ? `Other: <a href="${escapeHtml(data.otherSocialUrl)}" style="color: #3BA875;">${escapeHtml(data.otherSocialUrl)}</a>` : ""}
                  </div>
                </div>
                ` : ""}
              </div>

              <!-- SECTION 3: About the Business -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">3. About the Business</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">What They Do</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.whatYouDo)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Ideal Customers</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.idealCustomers)}</div>
                </div>
                ${data.whyChooseYou ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Why Choose Them (USP)</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.whyChooseYou)}</div>
                </div>
                ` : ""}
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Tone Preference</div>
                  <div style="font-size: 16px; color: #000000;">${getToneLabel(data.tonePreference)}</div>
                </div>
              </div>

              <!-- SECTION 4: Services -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">4. Services</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Services Offered</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.services)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Show Pricing on Website</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.showPricing) || "Not specified"}</div>
                </div>
                ${data.pricingInfo ? `
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Pricing Information</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.pricingInfo)}</div>
                </div>
                ` : ""}
              </div>

              <!-- SECTION 5: Branding & Images -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">5. Branding & Images</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Has Logo</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.hasLogo) || "Not specified"}</div>
                </div>
                ${data.hasLogo === "No, I need one" ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Wants Logo Design</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.wantsLogoDesign) || "Not specified"}</div>
                </div>
                ${data.wantsLogoDesign === "Yes" ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Logo Style</div>
                  <div style="font-size: 16px; color: #000000;">${getLogoStyleLabel(data.logoStyle)}</div>
                </div>
                ${data.logoInspiration ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Logo Inspiration</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.logoInspiration)}</div>
                </div>
                ` : ""}
                ${data.logoColours ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Logo Colours</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.logoColours)}</div>
                </div>
                ` : ""}
                ` : ""}
                ` : ""}
                ${data.brandColors ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Brand Colours</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.brandColors)}</div>
                </div>
                ` : ""}
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Style Preference</div>
                  <div style="font-size: 16px; color: #000000;">${getStyleLabel(data.stylePreference)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Has Photos</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.hasPhotos) || "Not specified"}</div>
                </div>
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Can Use Stock Images</div>
                  <div style="font-size: 16px; color: #000000;">${data.useStockImages ? "Yes" : "No, only their photos"}</div>
                </div>
              </div>

              <!-- SECTION 6: Trust & Proof -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">6. Trust & Proof</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Has Google Business Profile</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.hasGoogleBusiness) || "Not specified"}</div>
                </div>
                ${data.hasGoogleBusiness === "Yes" && data.googleBusinessLink ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Google Business Link</div>
                  <div style="font-size: 16px;"><a href="${escapeHtml(data.googleBusinessLink)}" style="color: #3BA875;" target="_blank">${escapeHtml(data.googleBusinessLink)}</a></div>
                </div>
                ` : ""}
                ${(data.hasGoogleBusiness === "No" || data.hasGoogleBusiness === "Not sure") && data.wantsGoogleBusinessSetup ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Wants Google Business Setup</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.wantsGoogleBusinessSetup)}${data.wantsGoogleBusinessSetup === "Yes" ? " (£39 add-on)" : ""}</div>
                </div>
                ` : ""}
                ${data.testimonials ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Testimonials</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.testimonials)}</div>
                </div>
                ` : ""}
                ${data.certifications ? `
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Certifications & Accreditations</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.certifications)}</div>
                </div>
                ` : ""}
                ${!data.testimonials && !data.certifications && !data.googleBusinessLink ? `
                <div style="font-size: 14px; color: #6b7280;">No trust elements provided</div>
                ` : ""}
              </div>

              <!-- SECTION 7: Website Preferences -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">7. Website Preferences</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Main CTAs</div>
                  <div style="font-size: 16px; color: #000000;">${getCTALabels(data.mainCTA)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Primary Location (SEO)</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.primaryLocation) || "Not specified"}</div>
                </div>
                ${data.keyServices ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Key Services to Rank For</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.keyServices)}</div>
                </div>
                ` : ""}
                ${data.extraPages ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Extra Pages Requested</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.extraPages)}</div>
                </div>
                ` : ""}
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Needs Booking System</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.needsBookingSystem) || "Not specified"}${data.needsBookingSystem === "Yes" ? " (£39 add-on)" : ""}</div>
                </div>
                ${data.needsBookingSystem === "Yes" && data.bookingDetails ? `
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Booking Details</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.bookingDetails)}</div>
                </div>
                ` : ""}
              </div>

              <!-- SECTION 8: Final Details -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">8. Final Details</div>

                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Selected Add-ons</div>
                  <div style="font-size: 16px; color: #000000;">${getAddonNames(data.selectedAddons || [])}</div>
                </div>

                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Domain</div>
                  <div style="font-size: 16px; color: #000000;">
                    ${data.hasDomain === "Yes" ? `Has domain: ${escapeHtml(data.domainName) || "Not provided"}` : ""}
                    ${data.hasDomain === "No" ? `Needs domain: ${data.wantsDomain === "Yes" ? "Yes, help me get one" : "Will sort themselves"}` : ""}
                    ${!data.hasDomain ? "Not specified" : ""}
                  </div>
                </div>

                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Professional Email</div>
                  <div style="font-size: 16px; color: #000000;">
                    ${data.hasEmail === "Yes" ? "Already has professional email" : ""}
                    ${data.hasEmail === "No" ? `Needs email: ${data.wantsEmail === "Yes" ? "Yes, set one up" : "No thanks"}` : ""}
                    ${!data.hasEmail ? "Not specified" : ""}
                  </div>
                </div>

                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Hosting Plan</div>
                  <div style="font-size: 16px; color: #000000;">${getHostingPlanInfo(data.hostingPlan)}</div>
                </div>

                ${data.mustInclude ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">MUST Include</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.mustInclude)}</div>
                </div>
                ` : ""}
                ${data.mustNotInclude ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Must NOT Include</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.mustNotInclude)}</div>
                </div>
                ` : ""}
                ${data.additionalNotes ? `
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Additional Notes</div>
                  <div style="font-size: 16px; color: #000000;">${escapeHtml(data.additionalNotes)}</div>
                </div>
                ` : ""}
              </div>

              <a href="mailto:${escapeHtml(data.email)}?subject=Your Website Project - ${encodeURIComponent(data.businessName)}" style="display: inline-block; background-color: #3BA875; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 9999px; margin: 16px 0;">Reply to ${escapeHtml(data.contactName)}</a>

              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">Received: ${timestamp}</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px 40px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 16px 0;">
                <a href="${BASE_URL}/faq" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">FAQ</a>
                <a href="${BASE_URL}/terms" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">Terms of Service</a>
                <a href="${BASE_URL}/privacy" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">Privacy Policy</a>
                <a href="${BASE_URL}/cookies" style="font-size: 14px; color: #3BA875; text-decoration: none;">Cookie Policy</a>
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                hello@onesimplesite.co.uk
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    const data: OnboardFormData = req.body;

    // Validate required fields
    if (!data.email || !data.contactName || !data.businessName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pkg = getPackageInfo(data.confirmedPackage);

    // Send client confirmation email
    const clientEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `All done - ${pkg.name} Package`,
      html: clientEmailHtml(data),
    });

    // Send admin notification email with full details
    const adminEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New Client: ${data.businessName} - ${pkg.name} (${pkg.price})`,
      html: adminEmailHtml(data),
    });

    return res.status(200).json({
      success: true,
      message: "Onboarding complete",
      clientEmailId: clientEmail.data?.id,
      adminEmailId: adminEmail.data?.id,
    });
  } catch (error) {
    console.error("Error processing onboard form:", error);
    return res.status(500).json({
      error: "Failed to process onboarding",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
