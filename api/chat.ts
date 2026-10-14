import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { clientIp, json, originAllowed } from "./_lib/http.js";
import { rateLimit } from "./_lib/rateLimit.js";
import { KNOWLEDGE } from "./_lib/chat/knowledge.js";
import { classify, retrieve } from "./_lib/chat/retrieve.js";
import { MAX_MESSAGE_CHARS, MAX_TURNS, SYSTEM_PROMPT, checkReply, cleanInput, looksLikeInjection, type ChatMessage } from "./_lib/chat/guard.js";
import { configuredProviders, generate, type ProviderEnv } from "./_lib/chat/providers.js";

export const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(40),
});

export interface ChatAction { label: string; href: string }

const price = () => KNOWLEDGE.find((d) => d.id === "prices")!;
const A = (label: string, href: string): ChatAction => ({ label, href });

/** Answers we give straight from our own data, so the numbers are exact and no model quota is used. */
export function directAnswer(question: string): { reply: string; actions: ChatAction[] } | null {
  switch (classify(question)) {
    case "chitchat":
      return { reply: "Hi, I'm Sid, OneSimpleSite's assistant. I can help with packages, prices, how long things take and whether we cover your area. What would you like to know?", actions: [] };
    case "price":
      return { reply: "Our packages are fixed-price: The Starter is £199 (up to 3 pages), The Sorted is £399 (up to 6 pages, booking and full on-page SEO) and The Works is £649 (up to 10 pages, location pages and analytics). Everything each one includes is listed on the packages page.", actions: [A("See packages and prices", "/packages"), A("Try the free preview", "/preview")] };
    case "time":
      return { reply: "We estimate 5 to 7 days for The Starter, 7 to 10 for The Sorted and 10 to 14 for The Works. That counts from when we have your content and the go-ahead, so late content moves the date. They're estimates, not promises.", actions: [A("How it works", "/how-it-works"), A("Start your project", "/start")] };
    case "human":
      return { reply: "Of course. The quickest way to reach the team is the contact form, or you can email hello@onesimplesite.co.uk. Replies come by email, and I can't promise a time.", actions: [A("Contact us", "/contact")] };
    case "start":
      return { reply: "Brilliant. The project brief takes a few minutes: pick a package, tell us about your business and we reply by email to confirm. If you'd like to see a sample first, the free preview builds one for your trade and town.", actions: [A("Start your project", "/start"), A("Try the free preview", "/preview")] };
    default:
      return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  if (!originAllowed(req)) return json(res, 403, { error: "Forbidden" });

  const ip = clientIp(req);
  const rl = rateLimit(`chat:${ip}`, 20, 10 * 60_000);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return json(res, 429, { error: "You've sent a lot of messages. Please wait a few minutes, or use the contact form.", offline: false });
  }

  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: "That message couldn't be read." });

  const history: ChatMessage[] = parsed.data.messages.slice(-MAX_TURNS).map((m) => ({ role: m.role, content: cleanInput(m.content) })).filter((m) => m.content);
  // The conversation must end with a user message, and start with one (Gemini requires it).
  while (history.length && history[0].role !== "user") history.shift();
  const last = history[history.length - 1];
  if (!last || last.role !== "user") return json(res, 400, { error: "That message couldn't be read." });
  if (parsed.data.messages[parsed.data.messages.length - 1].content.length > MAX_MESSAGE_CHARS * 4) return json(res, 400, { error: `Please keep messages under ${MAX_MESSAGE_CHARS} characters.` });

  const direct = directAnswer(last.content);
  if (direct) return json(res, 200, { reply: direct.reply, actions: direct.actions, source: "site" });

  if (configuredProviders(process.env as ProviderEnv).length === 0) {
    return json(res, 503, { error: "The chat assistant is offline right now. You can reach the team through the contact form.", offline: true });
  }

  const top = retrieve(last.content, 3);
  const context = (top.length ? top.map((s) => s.doc) : KNOWLEDGE.filter((d) => d.id === "about" || d.id === "prices")).map((d) => `## ${d.title}\n${d.text}`).join("\n\n");
  const result = await generate(process.env as ProviderEnv, SYSTEM_PROMPT(context, looksLikeInjection(last.content)), history);
  if (!result.ok) {
    // Log the reasons only (never the message), so a bad key or quota problem shows up in Vercel logs.
    console.error("chat providers failed:", result.failures.map((f) => `${f.provider}:${f.reason}`).join(", "));
    return json(res, 503, { error: "I couldn't answer just now. Please try again in a moment, or use the contact form.", offline: false });
  }

  const { reply, replaced } = checkReply(result.text);
  const links = (top[0]?.doc.link ? [top[0].doc.link] : []).map((l) => A(l.label, l.href));
  return json(res, 200, { reply, actions: replaced ? [A("Contact us", "/contact"), A("See packages", "/packages")] : links, source: "ai" });
}
