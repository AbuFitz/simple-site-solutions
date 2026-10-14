import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";
import { clientIp, escapeHtml, json, oneLine, originAllowed } from "./_lib/http.js";
import { rateLimit } from "./_lib/rateLimit.js";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Your name is required").max(100),
  email: z.string().trim().min(1, "Email is required").email("Enter an email address like name@example.com").max(254),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(2000, "Too long (max 2000 characters)"),
  company_site: z.string().max(0).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  if (!originAllowed(req)) return json(res, 403, { error: "Forbidden" });

  const rl = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return json(res, 429, { error: "Too many attempts. Please wait a few minutes and try again." });
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return json(res, 503, { error: "Sending isn't available right now. Please email us instead." });
  }
  if (typeof req.body?.company_site === "string" && req.body.company_site.length > 0) return json(res, 200, { success: true });

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0] ?? "form")] ??= i.message;
    return json(res, 400, { error: "Some details need fixing.", fields });
  }
  const d = parsed.data;
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "OneSimpleSite <noreply@onesimplesite.co.uk>",
      to: process.env.ADMIN_EMAIL || "hello@onesimplesite.co.uk",
      replyTo: d.email,
      subject: oneLine(`Website message from ${d.name}`),
      html: `<p><strong>${escapeHtml(d.name)}</strong> (${escapeHtml(d.email)})</p><p style="white-space:pre-wrap">${escapeHtml(d.message)}</p>`,
    });
    if (error) {
      console.error("contact send failed:", error.message);
      return json(res, 502, { error: "We couldn't send your message. Please email us directly." });
    }
    return json(res, 200, { success: true });
  } catch (e) {
    console.error("contact failed:", e instanceof Error ? e.message : e);
    return json(res, 502, { error: "We couldn't send your message. Please email us directly." });
  }
}
