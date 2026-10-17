// Email templates for OneSimpleSite
// Used with Resend email service

import { getPackage } from "@/data/packages";

const baseUrl = "https://onesimplesite.co.uk";

// Shared styles
const styles = {
  container: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 0;
    background-color: #ffffff;
  `,
  header: `
    background-color: #ffffff;
    padding: 32px 40px;
    border-bottom: 2px solid #e5e5e5;
  `,
  logo: `
    font-size: 24px;
    font-weight: 700;
    color: #000000;
    text-decoration: none;
  `,
  logoAccent: `
    color: #3BA875;
  `,
  body: `
    padding: 40px;
    background-color: #ffffff;
  `,
  heading: `
    font-size: 24px;
    font-weight: 700;
    color: #000000;
    margin: 0 0 16px 0;
  `,
  text: `
    font-size: 16px;
    line-height: 1.6;
    color: #374151;
    margin: 0 0 16px 0;
  `,
  infoBox: `
    background-color: #f9fafb;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 24px;
    margin: 24px 0;
  `,
  infoRow: `
    margin-bottom: 12px;
  `,
  infoLabel: `
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  `,
  infoValue: `
    font-size: 16px;
    color: #000000;
  `,
  button: `
    display: inline-block;
    background-color: #3BA875;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 9999px;
    margin: 16px 0;
  `,
  footer: `
    background-color: #f9fafb;
    padding: 32px 40px;
    border-top: 1px solid #e5e5e5;
  `,
  footerText: `
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 16px 0;
  `,
  footerLinks: `
    margin: 0;
    padding: 0;
  `,
  footerLink: `
    font-size: 14px;
    color: #3BA875;
    text-decoration: none;
    margin-right: 24px;
  `,
  divider: `
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 24px 0;
  `,
};

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
  const p = getPackage(packageId);
  if (p) return { name: p.name, price: p.price ? `£${p.price}` : "Tailored quotation" };
  return { name: packageId, price: "" };
}

// Get add-on display names
function getAddonDisplayName(addonId: string): string {
  const addons: Record<string, string> = {
    logo: "Logo Design (£49)",
    "google-business": "Google Business Profile Setup (£39)",
    booking: "Booking System Setup (£39)",
    "email-templates": "Extra Email Templates ×3 (£29)",
    "seo-audit": "SEO Audit Report (£59)",
    "legal-pages": "Legal Pages Pack (£19)",
  };
  return addons[addonId] || addonId;
}

// Format selected addons for display
function formatAddons(addonIds: string[]): string {
  return addonIds.map(id => getAddonDisplayName(id)).join(", ");
}

// Customer confirmation email template
export function customerConfirmationEmail(data: FormData): string {
  const pkg = getPackageInfo(data.selectedPackage);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for your enquiry - OneSimpleSite</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="${styles.container}">
          <!-- Header -->
          <tr>
            <td style="${styles.header}">
              <a href="${baseUrl}" style="${styles.logo}">
                one<span style="${styles.logoAccent}">simple</span>site
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="${styles.body}">
              <h1 style="${styles.heading}">Thanks for getting in touch, ${data.name}!</h1>

              <p style="${styles.text}">
                We've received your enquiry for the <strong>${pkg.name}</strong> package and we're excited to help get your business online.
              </p>

              <p style="${styles.text}">
                Here's what happens next:
              </p>

              <ol style="font-size: 16px; line-height: 1.8; color: #374151; margin: 0 0 24px 0; padding-left: 20px;">
                <li>We'll review your details and email you to confirm scope and next steps</li>
                <li>You'll receive a follow-up email with any questions</li>
                <li>Once we have everything, we'll get started on your site</li>
              </ol>

              <div style="${styles.infoBox}">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Your Enquiry Summary</div>

                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Package</div>
                  <div style="${styles.infoValue}">${pkg.name} (${pkg.price})</div>
                </div>

                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Business</div>
                  <div style="${styles.infoValue}">${data.businessName}</div>
                </div>

                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Industry</div>
                  <div style="${styles.infoValue}">${data.selectedIndustry}</div>
                </div>

                ${data.selectedAddons.length > 0 ? `
                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Add-ons</div>
                  <div style="${styles.infoValue}">${formatAddons(data.selectedAddons)}</div>
                </div>
                ` : ""}
              </div>

              <p style="${styles.text}">
                In the meantime, feel free to check out our FAQ if you have any questions, or email us at <a href="mailto:hello@onesimplesite.co.uk" style="color: #3BA875; text-decoration: none;">hello@onesimplesite.co.uk</a>.
              </p>

              <a href="${baseUrl}/faq" style="${styles.button}">
                View FAQ
              </a>

              <p style="${styles.text}; margin-top: 32px;">
                Cheers,<br>
                <strong>The OneSimpleSite Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="${styles.footer}">
              <p style="${styles.footerText}">
                This email was sent because you submitted an enquiry on onesimplesite.co.uk
              </p>
              <p style="${styles.footerLinks}">
                <a href="${baseUrl}/faq" style="${styles.footerLink}">FAQ</a>
                <a href="${baseUrl}/terms" style="${styles.footerLink}">Terms of Service</a>
                <a href="${baseUrl}/privacy" style="${styles.footerLink}">Privacy Policy</a>
                <a href="${baseUrl}/cookies" style="${styles.footerLink}">Cookie Policy</a>
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 16px 0 0 0;">
                <a href="mailto:hello@onesimplesite.co.uk" style="color: #3BA875; text-decoration: none;">hello@onesimplesite.co.uk</a>
              </p>
              <hr style="${styles.divider}">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                © ${new Date().getFullYear()} OneSimpleSite. Made for local UK businesses.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Admin notification email template
export function adminNotificationEmail(data: FormData): string {
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
  <title>New Enquiry - ${data.businessName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="${styles.container}">
          <!-- Header -->
          <tr>
            <td style="${styles.header}">
              <a href="${baseUrl}" style="${styles.logo}">
                one<span style="${styles.logoAccent}">simple</span>site
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="${styles.body}">
              <h1 style="${styles.heading}">New Enquiry Received</h1>

              <p style="${styles.text}">
                You've received a new enquiry from <strong>${data.name}</strong> at <strong>${data.businessName}</strong>.
              </p>

              <div style="background-color: #ecfdf5; border: 1px solid #3BA875; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <div style="font-weight: 600; color: #3BA875; font-size: 14px;">
                  ${pkg.name} Package (${pkg.price})
                </div>
              </div>

              <div style="${styles.infoBox}">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Details</div>

                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Name</div>
                  <div style="${styles.infoValue}">${data.name}</div>
                </div>

                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Email</div>
                  <div style="${styles.infoValue}">
                    <a href="mailto:${data.email}" style="color: #3BA875;">${data.email}</a>
                  </div>
                </div>

                ${data.phone ? `
                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Phone</div>
                  <div style="${styles.infoValue}">
                    <a href="tel:${data.phone}" style="color: #3BA875;">${data.phone}</a>
                  </div>
                </div>
                ` : ""}

                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Business Name</div>
                  <div style="${styles.infoValue}">${data.businessName}</div>
                </div>
              </div>

              <div style="${styles.infoBox}">
                <div style="font-weight: 600; font-size: 14px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Project Details</div>

                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Industry</div>
                  <div style="${styles.infoValue}">${data.selectedIndustry}</div>
                </div>

                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Has Existing Website</div>
                  <div style="${styles.infoValue}">${data.hasExistingWebsite ? "Yes" : "No"}</div>
                </div>

                ${data.hasExistingWebsite && data.existingWebsiteUrl ? `
                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Current Website</div>
                  <div style="${styles.infoValue}">
                    <a href="${data.existingWebsiteUrl}" style="color: #3BA875;" target="_blank">${data.existingWebsiteUrl}</a>
                  </div>
                </div>
                ` : ""}

                ${data.selectedAddons.length > 0 ? `
                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Selected Add-ons</div>
                  <div style="${styles.infoValue}">${formatAddons(data.selectedAddons)}</div>
                </div>
                ` : ""}

                ${data.details ? `
                <div style="${styles.infoRow}">
                  <div style="${styles.infoLabel}">Additional Details</div>
                  <div style="${styles.infoValue}">${data.details}</div>
                </div>
                ` : ""}
              </div>

              <a href="mailto:${data.email}?subject=Re: Your OneSimpleSite Enquiry - ${data.businessName}" style="${styles.button}">
                Reply to ${data.name}
              </a>

              <hr style="${styles.divider}">

              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                Received: ${timestamp}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="${styles.footer}">
              <p style="${styles.footerLinks}">
                <a href="${baseUrl}/faq" style="${styles.footerLink}">FAQ</a>
                <a href="${baseUrl}/terms" style="${styles.footerLink}">Terms of Service</a>
                <a href="${baseUrl}/privacy" style="${styles.footerLink}">Privacy Policy</a>
                <a href="${baseUrl}/cookies" style="${styles.footerLink}">Cookie Policy</a>
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 16px 0 0 0;">
                hello@onesimplesite.co.uk
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export type { FormData };
