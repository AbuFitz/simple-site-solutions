import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { briefSchema } from "../src/lib/brief-schema.js";
import { clientIp, json, oneLine, originAllowed } from "./_lib/http.js";
import { rateLimit } from "./_lib/rateLimit.js";


// Email configuration
const FROM_EMAIL = "OneSimpleSite <noreply@onesimplesite.co.uk>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@onesimplesite.co.uk";
const BASE_URL = process.env.SITE_URL || "https://onesimplesite.co.uk";

interface FormData {
  businessName: string;
  name: string;
  email: string;
  phone?: string;
  businessDescription: string;
  websiteUrl?: string;
  details?: string;
  selectedPackage: string;
  selectedAddons: string[];
}

// Get package display info
function getPackageInfo(packageId: string): { name: string; price: string } {
  const packages: Record<string, { name: string; price: string }> = {
    starter: { name: "The Starter", price: "£199" },
    sorted: { name: "The Sorted", price: "£399" },
    works: { name: "The Works", price: "£649" },
    unsure: { name: "Not sure yet", price: "" },
  };
  return packages[packageId] || { name: packageId, price: "" };
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
  return addonIds.map((id) => getAddonDisplayName(id)).join(", ");
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Emails: plain, dark, green accent, same type as the site. No logo, no images.
const SHELL_OPEN = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin:0;padding:0;background:#080C0B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#EFEBE3;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080C0B;"><tr><td align="center" style="padding:48px 24px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">`;
const SHELL_CLOSE = `</table></td></tr></table></body></html>`;
const row = (label: string, value: string) =>
  `<tr><td style="padding:14px 0;border-top:1px solid #26322D;"><div style="font:12px 'Courier New',monospace;letter-spacing:1px;text-transform:uppercase;color:#4FD9A0;margin-bottom:4px;">${label}</div><div style="font-size:17px;line-height:1.45;color:#EFEBE3;">${value}</div></td></tr>`;
const foot = `<tr><td style="padding-top:32px;border-top:1px solid #26322D;font-size:13px;line-height:1.6;color:#8A938E;">
Sent because of an enquiry on onesimplesite.co.uk.<br>
<a href="${BASE_URL}/privacy" style="color:#8A938E;">Privacy</a> &nbsp; <a href="${BASE_URL}/terms" style="color:#8A938E;">Terms</a> &nbsp; <a href="mailto:hello@onesimplesite.co.uk" style="color:#8A938E;">hello@onesimplesite.co.uk</a>
</td></tr>`;

// Customer confirmation email HTML
function customerEmailHtml(data: FormData): string {
  const pkg = getPackageInfo(data.selectedPackage);
  return `${SHELL_OPEN}
<tr><td style="font-size:40px;line-height:1.05;font-weight:700;letter-spacing:-1.5px;text-transform:uppercase;padding-bottom:24px;">Got it, ${escapeHtml(data.name)}.</td></tr>
<tr><td style="font-size:17px;line-height:1.6;color:#C9CBC6;padding-bottom:32px;">We have your enquiry${pkg.name !== "Not sure yet" ? ` for ${pkg.name}` : ""}. We will email you to confirm scope and next steps.</td></tr>
${row("Package", `${pkg.name}${pkg.price ? ` (${pkg.price})` : ""}`)}
${row("Business", escapeHtml(data.businessName))}
${row("What you do", escapeHtml(data.businessDescription))}
${data.selectedAddons.length > 0 ? row("Add-ons", formatAddons(data.selectedAddons)) : ""}
<tr><td style="padding:32px 0;font-size:17px;line-height:1.6;color:#C9CBC6;">Questions? Reply to this email.<br><span style="color:#EFEBE3;">The OneSimpleSite team</span></td></tr>
${foot}
${SHELL_CLOSE}`;
}

// Admin notification email HTML
function adminEmailHtml(data: FormData): string {
  const pkg = getPackageInfo(data.selectedPackage);
  const site = data.websiteUrl ? escapeHtml(data.websiteUrl) : "";
  return `${SHELL_OPEN}
<tr><td style="font-size:36px;line-height:1.05;font-weight:700;letter-spacing:-1.5px;text-transform:uppercase;padding-bottom:28px;">New enquiry</td></tr>
${row("From", `${escapeHtml(data.name)}, ${escapeHtml(data.businessName)}`)}
${row("Package", `${pkg.name}${pkg.price ? ` (${pkg.price})` : ""}`)}
${row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:#4FD9A0;">${escapeHtml(data.email)}</a>`)}
${data.phone ? row("Phone", `<a href="tel:${escapeHtml(data.phone)}" style="color:#4FD9A0;">${escapeHtml(data.phone)}</a>`) : ""}
${row("What they do", escapeHtml(data.businessDescription))}
${site ? row("Current site", site) : ""}
${data.selectedAddons.length > 0 ? row("Add-ons", formatAddons(data.selectedAddons)) : ""}
${data.details ? row("Details", escapeHtml(data.details)) : ""}
<tr><td style="padding:32px 0;"><a href="mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(`Re: Your OneSimpleSite enquiry - ${data.businessName}`)}" style="display:inline-block;background:#4FD9A0;color:#080C0B;font-size:16px;font-weight:700;text-decoration:none;padding:14px 26px;border-radius:999px;">Reply to ${escapeHtml(data.name)}</a></td></tr>
${foot}
${SHELL_CLOSE}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  if (!originAllowed(req)) return json(res, 403, { error: "Forbidden" });

  const rl = rateLimit(`brief:${clientIp(req)}`, 5, 10 * 60_000);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return json(res, 429, { error: "Too many attempts. Please wait a few minutes and try again." });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return json(res, 503, { error: "Sending isn't available right now. Please email us instead." });
  }

  // Honeypot: pretend success so bots learn nothing, but send nothing.
  if (typeof req.body?.company_site === "string" && req.body.company_site.length > 0) {
    return json(res, 200, { success: true });
  }

  const parsed = briefSchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fields[key] ??= issue.message;
    }
    return json(res, 400, { error: "Some details need fixing.", fields });
  }

  const data: FormData = {
    ...parsed.data,
    phone: parsed.data.phone || undefined,
    websiteUrl: parsed.data.websiteUrl || undefined,
    details: parsed.data.details || undefined,
  };
  const pkg = getPackageInfo(data.selectedPackage);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // The owner's notification is the lead, so it goes first and must succeed.
    const admin = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: oneLine(`New Enquiry: ${data.businessName}${pkg.name !== "Not sure yet" ? ` - ${pkg.name}` : " (needs help choosing)"}`),
      html: adminEmailHtml(data),
    });
    if (admin.error) {
      console.error("Failed to send admin notification:", admin.error.message);
      return json(res, 502, { error: "We couldn't send your brief. Your answers are saved here, so you can try again or email us." });
    }

    // The customer's copy is a courtesy: if it fails, the enquiry still reached us.
    const customer = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: oneLine(`Thanks for your enquiry${pkg.name !== "Not sure yet" ? ` - ${pkg.name}` : ""}`),
      html: customerEmailHtml(data),
    });
    if (customer.error) console.error("Failed to send customer copy:", customer.error.message);

    return json(res, 200, { success: true, copySent: !customer.error });
  } catch (error) {
    console.error("submit-form failed:", error instanceof Error ? error.message : error);
    return json(res, 502, { error: "We couldn't send your brief. Your answers are saved here, so you can try again or email us." });
  }
}
