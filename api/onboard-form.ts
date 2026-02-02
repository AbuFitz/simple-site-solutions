import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "OneSimpleSite <noreply@onesimplesite.co.uk>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@onesimplesite.co.uk";
const BASE_URL = "https://onesimplesite.co.uk";

interface OnboardFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  industry: string;
  services: string;
  targetArea: string;
  hasExistingWebsite: boolean;
  existingWebsiteUrl?: string;
  hasLogo: boolean;
  confirmedPackage: string;
  addons: string[];
  timeline: string;
  contentReady: string;
  additionalNotes?: string;
}

function getPackageInfo(packageId: string): { name: string; price: string } {
  const packages: Record<string, { name: string; price: string }> = {
    essential: { name: "Essential", price: "£199" },
    business: { name: "Business", price: "£399" },
    growth: { name: "Growth", price: "£649" },
  };
  return packages[packageId] || { name: packageId, price: "" };
}

function getAddonDisplayName(addonId: string): string {
  const addons: Record<string, string> = {
    hosting: "Hosting + Maintenance (£95/year)",
    "google-business": "Google Business Profile Setup (£79)",
  };
  return addons[addonId] || addonId;
}

function formatAddons(addonIds: string[]): string {
  if (addonIds.length === 0) return "None";
  return addonIds.map((id) => getAddonDisplayName(id)).join(", ");
}

function getTimelineLabel(timelineId: string): string {
  const timelines: Record<string, string> = {
    asap: "As soon as possible",
    "1-2weeks": "Within 1-2 weeks",
    flexible: "Flexible / No rush",
  };
  return timelines[timelineId] || timelineId;
}

function getContentReadyLabel(contentId: string): string {
  const options: Record<string, string> = {
    ready: "Everything ready",
    mostly: "Most of it ready",
    "need-help": "Needs some guidance",
    nothing: "Starting from scratch",
  };
  return options[contentId] || contentId;
}

// Client confirmation email
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
              <h1 style="font-size: 24px; font-weight: 700; color: #000000; margin: 0 0 16px 0;">Welcome aboard, ${data.name}!</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                Thanks for choosing us to build your website. We've received your details and we're excited to get started on <strong>${data.businessName}</strong>.
              </p>

              <div style="background-color: #ecfdf5; border: 1px solid #3BA875; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <div style="font-weight: 600; color: #3BA875; font-size: 16px;">
                  ${pkg.name} Package (${pkg.price})
                </div>
              </div>

              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">Here's what happens next:</p>
              <ol style="font-size: 16px; line-height: 1.8; color: #374151; margin: 0 0 24px 0; padding-left: 20px;">
                <li>We'll review your details and reach out within 24 hours</li>
                <li>We'll confirm the project scope and timeline</li>
                <li>You'll receive payment details to get started</li>
                <li>We'll begin building your website</li>
              </ol>

              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Your Details</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Business</div>
                  <div style="font-size: 16px; color: #000000;">${data.businessName}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Industry</div>
                  <div style="font-size: 16px; color: #000000;">${data.industry}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Target Area</div>
                  <div style="font-size: 16px; color: #000000;">${data.targetArea}</div>
                </div>
                ${data.addons.length > 0 ? `
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Add-ons</div>
                  <div style="font-size: 16px; color: #000000;">${formatAddons(data.addons)}</div>
                </div>
                ` : ""}
              </div>

              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                If you have any questions in the meantime, feel free to give us a call on <a href="tel:01442601387" style="color: #3BA875; text-decoration: none;">01442 601387</a>.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 32px 0 0 0;">
                Looking forward to working with you,<br><strong>The OneSimpleSite Team</strong>
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
                <a href="tel:01442601387" style="color: #3BA875; text-decoration: none;">01442 601387</a> · <a href="mailto:hello@onesimplesite.co.uk" style="color: #3BA875; text-decoration: none;">hello@onesimplesite.co.uk</a>
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

// Admin notification email with full details
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
                <strong>${data.name}</strong> from <strong>${data.businessName}</strong> has completed the onboarding form.
              </p>

              <div style="background-color: #ecfdf5; border: 1px solid #3BA875; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <div style="font-weight: 600; color: #3BA875; font-size: 16px;">
                  ${pkg.name} Package (${pkg.price})
                </div>
              </div>

              <!-- Contact Details -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Details</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Name</div>
                  <div style="font-size: 16px; color: #000000;">${data.name}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Email</div>
                  <div style="font-size: 16px;"><a href="mailto:${data.email}" style="color: #3BA875;">${data.email}</a></div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Phone</div>
                  <div style="font-size: 16px;"><a href="tel:${data.phone}" style="color: #3BA875;">${data.phone}</a></div>
                </div>
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Business Name</div>
                  <div style="font-size: 16px; color: #000000;">${data.businessName}</div>
                </div>
              </div>

              <!-- Business Details -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Business Details</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Industry</div>
                  <div style="font-size: 16px; color: #000000;">${data.industry}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Services</div>
                  <div style="font-size: 16px; color: #000000;">${data.services}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Target Area</div>
                  <div style="font-size: 16px; color: #000000;">${data.targetArea}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Has Existing Website</div>
                  <div style="font-size: 16px; color: #000000;">${data.hasExistingWebsite ? "Yes" : "No"}</div>
                </div>
                ${data.hasExistingWebsite && data.existingWebsiteUrl ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Current Website</div>
                  <div style="font-size: 16px;"><a href="${data.existingWebsiteUrl}" style="color: #3BA875;" target="_blank">${data.existingWebsiteUrl}</a></div>
                </div>
                ` : ""}
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Has Logo</div>
                  <div style="font-size: 16px; color: #000000;">${data.hasLogo ? "Yes" : "No"}</div>
                </div>
              </div>

              <!-- Project Details -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Project Details</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Add-ons</div>
                  <div style="font-size: 16px; color: #000000;">${formatAddons(data.addons)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Timeline</div>
                  <div style="font-size: 16px; color: #000000;">${getTimelineLabel(data.timeline)}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Content Readiness</div>
                  <div style="font-size: 16px; color: #000000;">${getContentReadyLabel(data.contentReady)}</div>
                </div>
                ${data.additionalNotes ? `
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Additional Notes</div>
                  <div style="font-size: 16px; color: #000000;">${data.additionalNotes}</div>
                </div>
                ` : ""}
              </div>

              <a href="mailto:${data.email}?subject=Welcome to OneSimpleSite - ${encodeURIComponent(data.businessName)}" style="display: inline-block; background-color: #3BA875; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 9999px; margin: 16px 0;">Reply to ${data.name}</a>

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
                01442 601387 · hello@onesimplesite.co.uk
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

    if (!data.email || !data.name || !data.businessName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pkg = getPackageInfo(data.confirmedPackage);

    // Send client confirmation email
    const clientEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Welcome aboard - ${pkg.name} Package`,
      html: clientEmailHtml(data),
    });

    // Send admin notification email
    const adminEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New Client Onboarded: ${data.businessName} - ${pkg.name} Package`,
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
