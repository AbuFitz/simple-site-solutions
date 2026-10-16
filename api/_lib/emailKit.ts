/**
 * Shared email layout: plain, dark, green accent, same type as the site. No logo, no images.
 * Social URLs mirror SOCIAL in src/data/site.ts (kept here so the API bundle has no UI imports).
 */
const BASE_URL = "https://onesimplesite.co.uk";
const MUTED = "#8A938E";

const TEAM = [
  { name: "Farhan", email: "Farhan@onesimplesite.co.uk" },
  { name: "Matthew", email: "Matthew@onesimplesite.co.uk" },
  { name: "Abukar", email: "Abukar@onesimplesite.co.uk" },
];

const SOCIAL = [
  { label: "Instagram", url: "https://www.instagram.com/onesimplesite/" },
  { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61587530671229" },
  { label: "TikTok", url: "https://www.tiktok.com/@onesimplesite" },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/onesimplesite/" },
];

export const esc = (text: string | undefined | null): string =>
  (text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");

export const shellOpen = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin:0;padding:0;background:#080C0B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#EFEBE3;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080C0B;"><tr><td align="center" style="padding:48px 24px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">`;

export const shellClose = `</table></td></tr></table></body></html>`;

export const title = (text: string, size = 40) =>
  `<tr><td style="font-size:${size}px;line-height:1.05;font-weight:700;letter-spacing:-1.5px;text-transform:uppercase;padding-bottom:24px;">${text}</td></tr>`;

export const lead = (html: string) =>
  `<tr><td style="font-size:17px;line-height:1.6;color:#C9CBC6;padding-bottom:32px;">${html}</td></tr>`;

/** A labelled value. `value` must already be escaped HTML. */
export const row = (label: string, value: string) =>
  `<tr><td style="padding:14px 0;border-top:1px solid #26322D;"><div style="font:12px 'Courier New',monospace;letter-spacing:1px;text-transform:uppercase;color:#4FD9A0;margin-bottom:4px;">${label}</div><div style="font-size:17px;line-height:1.45;color:#EFEBE3;">${value}</div></td></tr>`;

/** Group heading used between blocks of rows. */
export const section = (text: string) =>
  `<tr><td style="padding:36px 0 12px;font:13px 'Courier New',monospace;letter-spacing:2px;text-transform:uppercase;color:#EFEBE3;">${text}</td></tr>`;

export const link = (href: string, text: string) =>
  `<a href="${esc(href)}" style="color:#4FD9A0;">${esc(text)}</a>`;

export const button = (href: string, text: string) =>
  `<tr><td style="padding:32px 0 8px;"><a href="${href}" style="display:inline-block;background:#4FD9A0;color:#080C0B;font-size:16px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:999px;">${text}</a></td></tr>`;

export const foot = (reason: string) => {
  const socials = SOCIAL.map((s) => `<a href="${s.url}" style="color:${MUTED};">${s.label}</a>`).join(" &nbsp;·&nbsp; ");
  const direct = TEAM.map((t) => `<a href="mailto:${t.email}" style="color:${MUTED};">${t.name}: ${t.email}</a>`).join("<br>");
  return `<tr><td style="padding-top:32px;border-top:1px solid #26322D;font-size:13px;line-height:1.9;color:${MUTED};">
${reason}<br><br>
${direct}<br><br>
${socials}<br>
<a href="${BASE_URL}/privacy" style="color:${MUTED};">Privacy</a> &nbsp; <a href="${BASE_URL}/terms" style="color:${MUTED};">Terms</a> &nbsp; <a href="mailto:hello@onesimplesite.co.uk" style="color:${MUTED};">hello@onesimplesite.co.uk</a>
</td></tr>`;
};
