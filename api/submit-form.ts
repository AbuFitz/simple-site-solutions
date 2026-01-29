import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = "OneSimpleSite <noreply@onesimplesite.co.uk>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@onesimplesite.co.uk";
const BASE_URL = "https://onesimplesite.co.uk";

interface FormData {
  businessName: string;
  name: string;
  email: string;
  phone?: string;
  details?: string;
  selectedPackage: string;
  selectedIndustry: string;
  hasExistingWebsite: boolean;
  existingWebsiteUrl?: string;
  selectedAddons: string[];
}

// Get package display info
function getPackageInfo(packageId: string): { name: string; price: string } {
  const packages: Record<string, { name: string; price: string }> = {
    essential: { name: "Essential", price: "£199" },
    business: { name: "Business", price: "£399" },
    growth: { name: "Growth", price: "£649" },
  };
  return packages[packageId] || { name: packageId, price: "" };
}

// Get add-on display names
function getAddonDisplayName(addonId: string): string {
  const addons: Record<string, string> = {
    hosting: "Hosting + Maintenance (£95/year)",
    "google-business": "Google Business Profile Setup (£79)",
  };
  return addons[addonId] || addonId;
}

// Format selected addons for display
function formatAddons(addonIds: string[]): string {
  return addonIds.map(id => getAddonDisplayName(id)).join(", ");
}

// Customer confirmation email HTML
function customerEmailHtml(data: FormData): string {
  const pkg = getPackageInfo(data.selectedPackage);

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
              <h1 style="font-size: 24px; font-weight: 700; color: #000000; margin: 0 0 16px 0;">Thanks for getting in touch, ${data.name}!</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                We've received your enquiry for the <strong>${pkg.name}</strong> package and we're excited to help get your business online.
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">Here's what happens next:</p>
              <ol style="font-size: 16px; line-height: 1.8; color: #374151; margin: 0 0 24px 0; padding-left: 20px;">
                <li>We'll review your details within 24 hours</li>
                <li>You'll receive a follow-up email with any questions</li>
                <li>Once we have everything, we'll get started on your site</li>
              </ol>
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Your Enquiry Summary</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Package</div>
                  <div style="font-size: 16px; color: #000000;">${pkg.name} (${pkg.price})</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Business</div>
                  <div style="font-size: 16px; color: #000000;">${data.businessName}</div>
                </div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Industry</div>
                  <div style="font-size: 16px; color: #000000;">${data.selectedIndustry}</div>
                </div>
                ${data.selectedAddons.length > 0 ? `
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Add-ons</div>
                  <div style="font-size: 16px; color: #000000;">${formatAddons(data.selectedAddons)}</div>
                </div>
                ` : ""}
              </div>
              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">In the meantime, feel free to check out our FAQ if you have any questions.</p>
              <a href="${BASE_URL}/faq" style="display: inline-block; background-color: #3BA875; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 9999px; margin: 16px 0;">View FAQ</a>
              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 32px 0 0 0;">
                Cheers,<br><strong>The OneSimpleSite Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px 40px; border-top: 1px solid #e5e5e5;">
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0;">This email was sent because you submitted an enquiry on onesimplesite.co.uk</p>
              <p style="margin: 0 0 16px 0;">
                <a href="${BASE_URL}/faq" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">FAQ</a>
                <a href="${BASE_URL}/terms" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">Terms of Service</a>
                <a href="${BASE_URL}/privacy" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">Privacy Policy</a>
                <a href="${BASE_URL}/cookies" style="font-size: 14px; color: #3BA875; text-decoration: none;">Cookie Policy</a>
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

// Admin notification email HTML
function adminEmailHtml(data: FormData): string {
  const pkg = getPackageInfo(data.selectedPackage);
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
              <h1 style="font-size: 24px; font-weight: 700; color: #000000; margin: 0 0 16px 0;">New Enquiry Received</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                You've received a new enquiry from <strong>${data.name}</strong> at <strong>${data.businessName}</strong>.
              </p>
              <div style="background-color: #ecfdf5; border: 1px solid #3BA875; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <div style="font-weight: 600; color: #3BA875; font-size: 14px;">${pkg.name} Package (${pkg.price})</div>
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
                ${data.phone ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Phone</div>
                  <div style="font-size: 16px;"><a href="tel:${data.phone}" style="color: #3BA875;">${data.phone}</a></div>
                </div>
                ` : ""}
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Business Name</div>
                  <div style="font-size: 16px; color: #000000;">${data.businessName}</div>
                </div>
              </div>

              <!-- Project Details -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Project Details</div>
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Industry</div>
                  <div style="font-size: 16px; color: #000000;">${data.selectedIndustry}</div>
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
                ${data.selectedAddons.length > 0 ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Selected Add-ons</div>
                  <div style="font-size: 16px; color: #000000;">${formatAddons(data.selectedAddons)}</div>
                </div>
                ` : ""}
                ${data.details ? `
                <div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Additional Details</div>
                  <div style="font-size: 16px; color: #000000;">${data.details}</div>
                </div>
                ` : ""}
              </div>

              <a href="mailto:${data.email}?subject=Re: Your OneSimpleSite Enquiry - ${encodeURIComponent(data.businessName)}" style="display: inline-block; background-color: #3BA875; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 9999px; margin: 16px 0;">Reply to ${data.name}</a>

              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">Received: ${timestamp}</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px 40px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0;">
                <a href="${BASE_URL}/faq" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">FAQ</a>
                <a href="${BASE_URL}/terms" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">Terms of Service</a>
                <a href="${BASE_URL}/privacy" style="font-size: 14px; color: #3BA875; text-decoration: none; margin-right: 24px;">Privacy Policy</a>
                <a href="${BASE_URL}/cookies" style="font-size: 14px; color: #3BA875; text-decoration: none;">Cookie Policy</a>
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
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check for API key
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    const data: FormData = req.body;

    // Basic validation
    if (!data.email || !data.name || !data.businessName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pkg = getPackageInfo(data.selectedPackage);

    // Send customer confirmation email
    const customerEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Thanks for your enquiry - ${pkg.name} Package`,
      html: customerEmailHtml(data),
    });

    // Send admin notification email
    const adminEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New Enquiry: ${data.businessName} - ${pkg.name} Package`,
      html: adminEmailHtml(data),
    });

    return res.status(200).json({
      success: true,
      message: "Emails sent successfully",
      customerEmailId: customerEmail.data?.id,
      adminEmailId: adminEmail.data?.id,
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    return res.status(500).json({
      error: "Failed to send emails",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
