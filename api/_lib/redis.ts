/** Minimal Upstash Redis REST client (one command per request). Throws if the store isn't configured. */
export async function redis(cmd: (string | number)[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Fulfilment store not configured");
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error(`Fulfilment store error ${r.status}`);
  const body = (await r.json()) as { result?: unknown; error?: string };
  if (body.error) throw new Error("Fulfilment store error");
  return body.result;
}
