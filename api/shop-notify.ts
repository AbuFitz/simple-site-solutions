import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";
import { products } from "../src/data/shop.js";
import { clientIp, escapeHtml, json, oneLine, originAllowed } from "./_lib/http.js";
import { rateLimit } from "./_lib/rateLimit.js";

const body = z.object({
  email: z.string().trim().min(1).email().max(254),
  consent: z.literal(true),
  slugs: z.array(z.string().max(60)).max(10).default([]),
  company_site: z.string().max(0).optional(),
});

/** "Tell me when ordering opens": emails the owner. We send the visitor one message when the shop opens, nothing else. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  if (!originAllowed(req)) return json(res, 403, { error: "Forbidden" });
  if (!rateLimit(`notify:${clientIp(req)}`, 5, 10 * 60_000).ok) return json(res, 429, { error: "Too many attempts. Please wait a few minutes." });
  if (typeof req.body?.company_site === "string" && req.body.company_site.length > 0) return json(res, 200, { success: true });
  if (!process.env.RESEND_API_KEY) return json(res, 503, { error: "We can't take sign-ups right now. Please email us instead." });

  const parsed = body.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: "Enter your email address and tick the box to agree." });
  const names = parsed.data.slugs.map((s) => products.find((p) => p.slug === s)?.name).filter(Boolean) as string[];
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "OneSimpleSite <noreply@onesimplesite.co.uk>",
      to: process.env.ADMIN_EMAIL || "hello@onesimplesite.co.uk",
      replyTo: parsed.data.email,
      subject: oneLine("Shop: notify me when ordering opens"),
      html: `<p>${escapeHtml(parsed.data.email)} asked to be told once when ordering opens (consent given on the site).</p><p>Interested in: ${escapeHtml(names.join(", ") || "the shop in general")}</p>`,
    });
    if (error) throw new Error("send failed");
    return json(res, 200, { success: true });
  } catch (e) {
    console.error("shop-notify failed", e instanceof Error ? e.message : e);
    return json(res, 502, { error: "We couldn't save that. Please try again or email us." });
  }
}
