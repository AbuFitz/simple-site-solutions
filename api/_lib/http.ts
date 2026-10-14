import type { VercelRequest, VercelResponse } from "@vercel/node";

export function json(res: VercelResponse, status: number, body: unknown) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(status).json(body);
}

export function clientIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim();
  return first || (req.headers["x-real-ip"] as string) || req.socket?.remoteAddress || "unknown";
}

/** The one origin we redirect to and accept browser posts from. Never derived from request headers. */
export function siteUrl(env: NodeJS.ProcessEnv = process.env): string | null {
  const raw = (env.SITE_URL || "").trim().replace(/\/+$/, "");
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
    if (u.protocol !== "https:" && !(local && u.protocol === "http:")) return null;
    return u.origin;
  } catch {
    return null;
  }
}

/**
 * Browser POSTs must come from our own site (or localhost in development / a preview host listed in
 * ALLOWED_ORIGINS). This is defence in depth; it is not authentication.
 */
export function originAllowed(req: VercelRequest, env: NodeJS.ProcessEnv = process.env): boolean {
  const origin = req.headers.origin as string | undefined;
  if (!origin) return false;
  const allowed = new Set<string>();
  const site = siteUrl(env);
  if (site) allowed.add(site);
  (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean)
    .forEach((s) => allowed.add(s));
  try {
    const u = new URL(origin);
    if ((u.hostname === "localhost" || u.hostname === "127.0.0.1") && env.NODE_ENV !== "production") return true;
    // Same-origin: the page that posted is served from the host receiving the request (works on preview deployments).
    if (u.host === (req.headers.host as string | undefined) && u.protocol === "https:") return true;
    return allowed.has(u.origin);
  } catch {
    return false;
  }
}

export function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (c: Buffer) => {
      size += c.length;
      if (size > 1_000_000) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Strip CR/LF so user text can never inject mail headers or break a subject line. */
export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
