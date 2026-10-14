import type { ChatMessage } from "./guard.js";

export interface ProviderResult { ok: true; text: string; provider: string }
export interface ProviderFailure { ok: false; provider: string; status?: number; reason: string }

export interface ProviderEnv { GEMINI_API_KEY?: string; GEMINI_MODEL?: string; XAI_API_KEY?: string; XAI_MODEL?: string; CHAT_PROVIDER_ORDER?: string }

const TIMEOUT_MS = 12_000;
const MAX_OUT = 300;

async function withTimeout(fetcher: typeof fetch, url: string, init: RequestInit): Promise<Response> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    return await fetcher(url, { ...init, signal: ctl.signal });
  } finally {
    clearTimeout(t);
  }
}

/** Google Gemini via the Generative Language API (a free tier exists through Google AI Studio keys). */
export async function callGemini(env: ProviderEnv, system: string, history: ChatMessage[], fetcher: typeof fetch = fetch): Promise<ProviderResult | ProviderFailure> {
  const key = env.GEMINI_API_KEY;
  if (!key) return { ok: false, provider: "gemini", reason: "not configured" };
  const model = env.GEMINI_MODEL || "gemini-2.0-flash";
  try {
    const r = await withTimeout(fetcher, `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        generationConfig: { temperature: 0.4, maxOutputTokens: MAX_OUT },
      }),
    });
    if (!r.ok) return { ok: false, provider: "gemini", status: r.status, reason: `http ${r.status}` };
    const j = (await r.json()) as { candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[] };
    const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
    return text ? { ok: true, text, provider: "gemini" } : { ok: false, provider: "gemini", reason: "empty" };
  } catch (e) {
    return { ok: false, provider: "gemini", reason: e instanceof Error && e.name === "AbortError" ? "timeout" : "network" };
  }
}

/** xAI Grok via its OpenAI-compatible chat completions endpoint. */
export async function callGrok(env: ProviderEnv, system: string, history: ChatMessage[], fetcher: typeof fetch = fetch): Promise<ProviderResult | ProviderFailure> {
  const key = env.XAI_API_KEY;
  if (!key) return { ok: false, provider: "grok", reason: "not configured" };
  const model = env.XAI_MODEL || "grok-3-mini";
  try {
    const r = await withTimeout(fetcher, "https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, temperature: 0.4, max_tokens: MAX_OUT, messages: [{ role: "system", content: system }, ...history] }),
    });
    if (!r.ok) return { ok: false, provider: "grok", status: r.status, reason: `http ${r.status}` };
    const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const text = j.choices?.[0]?.message?.content?.trim();
    return text ? { ok: true, text, provider: "grok" } : { ok: false, provider: "grok", reason: "empty" };
  } catch (e) {
    return { ok: false, provider: "grok", reason: e instanceof Error && e.name === "AbortError" ? "timeout" : "network" };
  }
}

export const configuredProviders = (env: ProviderEnv) => {
  const order = (env.CHAT_PROVIDER_ORDER || "gemini,grok").split(",").map((s) => s.trim().toLowerCase()).filter((s) => s === "gemini" || s === "grok");
  const have = { gemini: Boolean(env.GEMINI_API_KEY), grok: Boolean(env.XAI_API_KEY) } as const;
  return order.filter((p) => have[p as "gemini" | "grok"]) as ("gemini" | "grok")[];
};

/** Try each configured provider in order until one answers. Keys never leave the server. */
export async function generate(env: ProviderEnv, system: string, history: ChatMessage[], fetcher: typeof fetch = fetch): Promise<ProviderResult | { ok: false; failures: ProviderFailure[] }> {
  const failures: ProviderFailure[] = [];
  for (const p of configuredProviders(env)) {
    const r = p === "gemini" ? await callGemini(env, system, history, fetcher) : await callGrok(env, system, history, fetcher);
    if (r.ok) return r;
    failures.push(r);
  }
  return { ok: false, failures };
}
