import type { VercelRequest, VercelResponse } from '@vercel/node';
import { json } from './_lib/http.js';
import { siteReadiness } from './_lib/site-readiness.js';

/** Public, cache-disabled readiness evidence. It intentionally returns booleans and no configuration values. */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  const result = siteReadiness();
  return json(res, result.ready ? 200 : 503, result);
}
