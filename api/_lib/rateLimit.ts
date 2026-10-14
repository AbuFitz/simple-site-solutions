/**
 * Best-effort sliding-window limiter held in memory. On serverless each warm instance keeps its own
 * counters, so this slows casual abuse but is NOT a hard guarantee. For a real limit, add a Vercel
 * Firewall rate-limit rule on /api/* (see docs/deployment.md).
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number, now = Date.now()): { ok: boolean; retryAfter: number } {
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return { ok: true, retryAfter: 0 };
}

export const _resetRateLimit = () => buckets.clear();
